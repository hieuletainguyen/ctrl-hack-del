import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generate_salt} from "../secret-data.js";
import { dynamoDB } from "../database/dynamodb.js";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

AWS.config.update({ region: process.env.REGION})

const jwtSecretkey = process.env.JWT_SECRET_KEY;

const updateAccountCounter = async (tableName, amount) => {

    const counterParams = {
        TableName: tableName,
        Key: {
            "counter_id": { S: "global_counter" }
        }
    };

    const counterData = await dynamoDB.getItem(counterParams).promise();
    let currentCount = 0; 

    if (counterData.Item && counterData.Item.account) {
        currentCount = parseInt(counterData.Item.account.N) + amount;
    }

    const updateCounterParams = {
        TableName: tableName,
        Item: {
            "counter_id": { S: "global_counter" },
            "account": { N: currentCount.toString() }
        }
    };

    await dynamoDB.putItem(updateCounterParams).promise();
}

const getAccountCounter = async (tableName) => {
    const counterParams = {
        TableName: tableName,
        Key: {
            "counter_id": { S: "global_counter" }
        }
    };

    const counterData = await dynamoDB.getItem(counterParams).promise();
    let currentCount = 0; 

    if (counterData.Item && counterData.Item.account) {
        currentCount = parseInt(counterData.Item.account.N);
    }

    return currentCount;
}

const addAccount = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    } 

    const { username, password } = req.body;
    try {
        const params = {
            TableName: "Account",
            Key: {
                name: {S: username}
            }
        }
        
        dynamoDB.getItem(params, async (err, data) => {
            if (err) {
                console.log("Error", err)
            } 

            if (Object.keys(data).length === 1) {
                return res.status(400).json({message: "Username already exists"})
            }

            const currentCount = await getAccountCounter("Account");
            
            const salt = await generate_salt()
            const hashPassword = await bcrypt.hash(password, salt);

            const addingParams = {
                TableName: "Account",
                Item: {
                    id: { N: currentCount.toString() },
                    name: { S: username },
                    password: {S: hashPassword}
                },
            };

            dynamoDB.putItem(addingParams, (err, data) => {
                if (err) {
                    return res.json({message: "Error during adding"})
                } else {
                    return res.status(200).json({ message: "add succesfully"})
                }
            })
            
        })
        
    } catch(error) {
        res.json({message: "Error during adding"})
    }
}

const authorization = async (req, res) => {
    const { username, password } = req.body;

    const params = {
        TableName: "Account",
        Key: {
            "username": { S: username }
        }, 
        
    };

    dynamoDB.getItem(params, async (err, data) => {
        if (err) {
            return res.json({message: err});
        } 

        if (Object.keys(data).length === 0) {
            return res.status(401).json({message: "Invalid email or password"})
        }
        const hashedPassword = data.Item.password.S;
        const match = bcrypt.compare(password, hashedPassword);

        if (match) {
            const token = jwt.sign({username: username}, jwtSecretkey, {expiresIn: "5h"});
            
            const addingParams = {
                TableName: "Token",
                Item: {
                    token: { S: token },
                    username: {S: username}
                },
            };

            dynamoDB.putItem(addingParams, (err, data) => {
                if (err) {
                    return res.json({message: "Error during adding"})
                } else {
                    return res.status(200).json({message: "success", token: token})
                }
            })
            
        } else {
            return res.status(401).json({message: "Invalid email or password"})
        }

    })
    
}

const logout = (req, res) => {
    const {token} = req.body;

    if (token){
        const params = {
            TableName: "Token",
            Key: {
                token: {S: token}
            }
        };

        dynamoDB.deleteItem(params, (err, data) => {
            if (err) {
                return res.status(400).json({message: err})
            }
            res.clearCookie("TOKENS");
            return res.status(200).json({message: "success"})
        })
    }
}

const decode_token = (req, res) => {
    const {token} = req.body;

    if (token) {
        jwt.verify(token, jwtSecretkey, (err, decoded) => {
            if (err) {
                return res.status(401).json({message: "Invalid token"})
            } 

            const params = {
                TableName: "Token",
                Key: {
                    token: { S: token}
                }, 
                ProjectionExpression: "username"
            }

            dynamoDB.getItem(params, async (err, data) => {
                if (err) {
                    return res.json({message: err});
                } 

                if (Object.keys(data).length === 1) {
                    return res.status(200).json({ message: "success", username: decoded.username })
                } else {
                    return res.status(401).json({ message: "Invalid token"})
                }
            })
        })
    }
}


export {
    addAccount, 
    authorization, 
    logout, 
    decode_token
}

