import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dynamoDB } from "../database/dynamodb.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import { _decode_token, cleanUpResponseData, generate_salt } from "../helper/helper.js";

dotenv.config();

AWS.config.update({ region: "us-east-2"})

const jwtSecretkey = process.env.JWT_SECRET_KEY;

const addAccount = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    } 

    const { username, password } = req.body;
    try {
        const params = {
            TableName: 'Account',
            FilterExpression: '#username = :usernameValue',
            ExpressionAttributeNames: {
                '#username': 'username'
            },
            ExpressionAttributeValues: {
                ':usernameValue': { S: username }
            }
        };
        dynamoDB.scan(params, async (err, data) => {
            if (err) {
                console.log("Error for getting item", err)
            } 

            if (data.Items.length > 0) {
                return res.status(400).json({message: "Username already exists"})
            }
        
            const salt = await generate_salt()
            const hashPassword = await bcrypt.hash(password, salt);
            const addingParams = {
                TableName: "Account",
                Item: {
                    id: { S: uuidv4() },
                    username: { S: username },
                    password: { S: hashPassword }
                },
            };

            dynamoDB.putItem(addingParams, (err, data) => {
                if (err) {
                    return res.json({message: "Error during adding " + err})
                } else {
                    return res.status(200).json({ message: "add succesfully"})
                    }
                })        
        })
        
    } catch(error) {
        res.json({message: "Error during adding"})
    }
}

const authentication = async (req, res) => {
    const { username, password } = req.body;

    const params = {
        TableName: 'Account',
        FilterExpression: '#username = :usernameValue',
        ExpressionAttributeNames: {
            '#username': 'username'
        },
        ExpressionAttributeValues: {
            ':usernameValue': { S: username }
        }
    };

    dynamoDB.scan(params, async (err, data) => {
        if (err) {
            return res.status(500).json({message: err});
        } 

        if (data.Items.length === 0) {
            return res.status(401).json({message: "You need to register first"})
        }
        const hashedPassword = data.Items[0].password.S;
        const userId = data.Items[0].id.S;
        const match = bcrypt.compare(password, hashedPassword);

        if (match) {
            const token = jwt.sign({userId: userId}, jwtSecretkey, {expiresIn: "5h"});

            res.cookie("TOKENS", token, {httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 5});
            return res.status(200).json({message: "success"})
        } else {
            return res.status(401).json({message: "Invalid username or password"})
        }

    })
    
}

const logout = (req, res) => {
    res.clearCookie("TOKENS");
    return res.status(200).json({message: "success"});
}

const decode_token = async (req, res) => {
    const token = req.cookies?.TOKENS;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    
    const decoded = await _decode_token(token);

    if (decoded.message === "Token expired") {
        res.clearCookie("TOKENS");
        return res.status(401).json({ message: "Token expired" });
    }

    if (decoded.message === "Invalid token") {
        return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "success", userId: decoded.userId });
}
    
    
const getAccount = async (req, res) => {
    const token = req.cookies?.TOKENS;

    if (!token) {
        return res.status(401).json({ message: "No authentication token found" });
    }

    try {
        const tokenData = await _decode_token(token);
        
        const params = {
            TableName: "Account",
            Key: {
                id: { S: tokenData.userId }
            }
        };
        console.log(params);
        dynamoDB.getItem(params, (err, data) => {
            if (err) {
                return res.json({ message: err });
            }
            if (data.Item && data.Item.password) {
                delete data.Item.password;
            }
            if (data.Item) {
                data.Item = cleanUpResponseData(data.Item);
            }
            return res.status(200).json({ message: "success", data: data.Item });
        });
    } catch (error) {
        return res.status(401).json({ message: error.message || "Error processing request" });
    }
}


export {
    addAccount, 
    authentication, 
    logout, 
    decode_token, 
    getAccount
}

