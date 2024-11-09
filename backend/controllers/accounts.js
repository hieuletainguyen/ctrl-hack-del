import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dynamoDB } from "../database/dynamodb.js";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

AWS.config.update({ region: "us-east-2"})

const jwtSecretkey = process.env.JWT_SECRET_KEY;

const generate_salt = async () => {
    const saltRounds = process.env.SALT_ROUNDS;
    const new_salt = bcrypt.genSalt(saltRounds);
    return new_salt;
}

const updateAccountCounter = async (tableName, currentCount) => {
    const account = parseInt(currentCount.account.N) + 1;
    const nurse_id = parseInt(currentCount.nurse_id.N);
    const patient_id = parseInt(currentCount.patient_id.N);
    const updateCounterParams = {
        TableName: tableName,
        Item: {
            "counter_id": { S: "global_counter" },
            "account": { N: account.toString() },
            "nurse_id": { N: nurse_id.toString() }, 
            "patient_id": { N: patient_id.toString() }
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

    return counterData.Item;
}

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
                ':usernameValue': { S: username }  // Define the value with the type
            }
        };
        dynamoDB.scan(params, async (err, data) => {
            if (err) {
                console.log("Error for getting item", err)
            } 

            if (data) {
                return res.status(400).json({message: "Username already exists"})
            }

        const currentCount = await getAccountCounter("CounterTable");
        
        const salt = await generate_salt()
        const hashPassword = await bcrypt.hash(password, salt);
        const account_id = parseInt(currentCount.account.N) + 1;
        const addingParams = {
            TableName: "Account",
            Item: {
                id: { S: account_id.toString() },
                username: { S: username },
                password: { S: hashPassword}
            },
        };

        dynamoDB.putItem(addingParams, (err, data) => {
            if (err) {
                return res.json({message: "Error during adding " + err})
            } else {
                return res.status(200).json({ message: "add succesfully"})
            }
        })

        await updateAccountCounter("CounterTable", currentCount);
        
        })
        
    } catch(error) {
        res.json({message: "Error during adding"})
    }
}

const authorization = async (req, res) => {
    const { username, password } = req.body;

    const params = {
        TableName: 'Account',
        FilterExpression: '#username = :usernameValue',
        ExpressionAttributeNames: {
            '#username': 'username'
        },
        ExpressionAttributeValues: {
            ':usernameValue': { S: username }  // Define the value with the type
        }
    };

    dynamoDB.scan(params, async (err, data) => {
        if (err) {
            return res.json({message: err});
        } 

        if (!data) {
            return res.status(401).json({message: "You need to register first"})
        }
        console.log(data)
        const hashedPassword = data.Items[0].password.S;
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
                    res.cookie("TOKENS", token, {httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 5});
                    return res.status(200).json({message: "success"})
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

