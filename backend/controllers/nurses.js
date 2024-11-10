import { v4 as uuidv4 } from "uuid";
import { dynamoDB } from "../database/dynamodb.js";
import { _decode_token } from "../helper/helper.js";

const addNurse = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const { nurseName, skills } = req.body;
    const paramsAddNurse = {
        TableName: "Nurse",
        Item: {
            id: {S: uuidv4()},
            nurseName: {S: nurseName},
            skills: {SS: skills}
        }
    }

    await dynamoDB.putItem(paramsAddNurse).promise().then((data) => {
        return res.status(200).json({
            message: "success",
            data: data
        });
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}

const getNurse = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const paramsGetNurse = {
        TableName: "Nurse"
    }

    await dynamoDB.scan(paramsGetNurse).promise().then((data) => {
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
        return res.status(400).json({message: "error"});
    });
}


const updateNurse = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const { nurseName, skills } = req.body;
    const nurseId = req.params.nurseId;
    // example {
    //     "id": "90e46e0c-9a52-4173-a103-e98111e9ab74",
    //     "nurseName": "Hirano",
    //     "skills": ["Catheter Care"]
    // }
    
    const paramsUpdateNurse = {
        TableName: "Nurse",
        Key: {
            id: {S: nurseId}
        },
        UpdateExpression: "set nurseName = :nurseName ADD skills :skills",
        ExpressionAttributeValues: {
            ":nurseName": {S: nurseName},
            ":skills": {SS: skills}
        }
    }

    await dynamoDB.updateItem(paramsUpdateNurse).promise().then((data) => {
        return res.status(200).json({message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}


const deleteNurse = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const { nurseId } = req.params;
    const paramsDeleteNurse = {
        TableName: "Nurse",
        Key: {id: {S: nurseId}}
    }

    await dynamoDB.deleteItem(paramsDeleteNurse).promise().then((data) => {
        return res.status(200).json({message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}

export {
    addNurse,
    getNurse,
    updateNurse,
    deleteNurse
}