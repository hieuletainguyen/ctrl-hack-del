import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dynamoDB } from "../database/dynamodb.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import { _decode_token } from "../helper/helper.js";
import { _call_openai, _match_nurse } from "../helper/helper.js";
dotenv.config();

AWS.config.update({ region: "us-east-2"})

const addPatient = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const {name, dob, phone, email} = req.body;

    const paramsAddPatient = {
        TableName: "Patient",
        Item: {
            id: {S: uuidv4()},
            patientName: {S: name},
            dob: {S: dob},
            phone: {S: phone},
            email: {S: email}
        }
    }

    await dynamoDB.putItem(paramsAddPatient).promise().then((data) => {
        return res.status(200).json({message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({message: "error", data: err});
    });
}

const submitReport = async (req, res) => {
    const {report, patientId} = req.body;
    const token = req.cookies.TOKENS;
    const decoded = await _decode_token(token);
    if (decoded.message === "Invalid token") {
        return res.status(401).json({ message: "Invalid token" });
    }

    const paramsGetPatient = {
        TableName: "Patient",
        Key: {
            id: {S: patientId}
        }
    }
    const patientInfo = await dynamoDB.getItem(paramsGetPatient).promise().then((data) => {
        if (data.Item) {
            data.Item = Object.keys(data.Item).reduce((acc, key) => {
                acc[key] = data.Item[key].S || data.Item[key].N || data.Item[key].BOOL;
                return acc;
            }, {});
        }
        return data.Item;
    });


    // get all skills required =============================
    const paramsGetSkills = {
        TableName: "Skill"
    };
    
    const skills = await dynamoDB.scan(paramsGetSkills).promise().then((data) => {
        if (data.Items) {
            const skills = data.Items.map((item) => {
                    return Object.keys(item).reduce((acc, key) => {
                        acc[key] = item[key].S || item[key].N || item[key].BOOL;
                    return acc;
                }, {});
            });
            return skills.map((skill) => skill.name);
        }
    });

    //==========================================================
    let resultTreatment = await _call_openai(report, skills);
    resultTreatment = JSON.parse(resultTreatment);
    const resultNurse = await _match_nurse(resultTreatment.skills);
    const paramsAddPatient = {
        TableName: "Patient",
        Item: {
            id: {S: patientId},
            patientName: {S: patientInfo.patientName},
            dob: {S: patientInfo.dob},
            phone: {S: patientInfo.phone},
            email: {S: patientInfo.email},
            report: {S: report},
            treatment: {SS: resultTreatment.skills},
            nurse: {S: resultNurse.matches.nurseId},
            createdAt: {S: new Date().toISOString()}
        }
    }

    await dynamoDB.putItem(paramsAddPatient).promise().then((data) => {
        return res.status(200).json({
            message: "success",
            data: data
        });
    }).catch((err) => {
        return res.status(400).json({
            message: "error",
            data: err
        });
    });

}

const getPatientByName = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const {patientName} = req.params;

    const paramsGetPatient = {
        TableName: 'Patient',
        FilterExpression: '#patientName = :patientNameValue',
        ExpressionAttributeNames: {
            '#patientName': 'patientName'
        },
        ExpressionAttributeValues: {
            ':patientNameValue': { S: patientName }
        }
    };

    await dynamoDB.scan(paramsGetPatient).promise().then((data) => {
        if (data.Items) {
            data.Items = data.Items.map((item) => {
                return Object.keys(item).reduce((acc, key) => {
                    acc[key] = item[key].S || item[key].N || item[key].BOOL;
                    return acc;
                }, {});
            });
            return res.status(200).json({
                message: "success",
                data: data.Items
            });
        }
    }).catch((err) => {
        return res.status(400).json({
            message: "error",
            data: err
        });
    });
}

const getPatientById = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const {patientId} = req.params;     

    const paramsGetPatient = {
        TableName: 'Patient',
        Key: {
            id: {S: patientId}
        }
    };

    await dynamoDB.getItem(paramsGetPatient).promise().then((data) => { 
        data.Item = Object.keys(data.Item).reduce((acc, key) => {
            acc[key] = data.Item[key].S || data.Item[key].N || data.Item[key].BOOL;
            return acc;
        }, {});
        return res.status(200).json({
            message: "success",
            data: data.Item
        });
    }).catch((err) => {
        return res.status(400).json({
            message: "error",
            data: err
        });
    });
}

const updatePatient = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const {patientId} = req.params;
    const {report, patientName} = req.body;

    const paramsUpdatePatient = {
        TableName: "Patient",
        Key: {
            id: {S: patientId}
        },
        UpdateExpression: "set report = :report, patientName = :patientName",
        ExpressionAttributeValues: {
            ":report": {S: report},
            ":patientName": {S: patientName}
        }
    }
    console.log(paramsUpdatePatient);

    await dynamoDB.updateItem(paramsUpdatePatient).promise().then((data) => {
        return res.status(200).json({
            message: "success",
            data: data
        });
    }).catch((err) => {
        return res.status(400).json({
            message: "error",
            data: err
        });
    });
}

const deletePatient = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const {patientId} = req.params;

    const paramsDeletePatient = {
        TableName: "Patient",
        Key: {
            id: {S: patientId}
        }
    }

    await dynamoDB.deleteItem(paramsDeletePatient).promise().then((data) => {
        return res.status(200).json({
            message: "success",
            data: data
        });
    }).catch((err) => {
        return res.status(400).json({
            message: "error",
            data: err
        });
    });
}

const recentPatient = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData?.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const paramsRecentPatient = {
        TableName: "Patient",
        Limit: 15,
        Select: "ALL_ATTRIBUTES",
        ReturnConsumedCapacity: "TOTAL"
    };   
    await dynamoDB.scan(paramsRecentPatient).promise().then((data) => {
        data.Items = data.Items.map((item) => {
            return Object.keys(item).reduce((acc, key) => {
                acc[key] = item[key].S || item[key].N || item[key].BOOL;
                return acc;
            }, {});
        });
        return res.status(200).json({
            message: "success",
            data: data.Items
        });
    }).catch((err) => {
        return res.status(400).json({
            message: "error",
            data: err
        });
    });
}

export {
    addPatient,
    getPatientByName,
    updatePatient,
    deletePatient,
    recentPatient,
    submitReport,
    getPatientById
}

