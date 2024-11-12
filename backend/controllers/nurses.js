import { v4 as uuidv4 } from "uuid";
import { dynamoDB } from "../database/dynamodb.js";
import { _decode_token, cleanUpResponseData } from "../helper/helper.js";

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
        return res.status(400).json({message: "error", data: err});
    });
}

const getNurse = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    let paramsGetNurse = {
        TableName: "Nurse"
    }
    if (req.params.id)
        paramsGetNurse = {
            ...paramsGetNurse,
            FilterExpression: '#id = :id',
            ExpressionAttributeNames: {
                '#id': 'id'
            },
            ExpressionAttributeValues: {
                ':id': {S: req.params.id}
            }
        }

    await dynamoDB.scan(paramsGetNurse).promise().then((data) => {
        data.Items = data.Items.map((item) => {
            return cleanUpResponseData(item)
        });
        return res.status(200).json({ message: "success", data: data.Items});
    }).catch((err) => {
        return res.status(400).json({ message: "error", data: err});
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
        return res.status(200).json({ message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({ message: "error", data: err});
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
        return res.status(200).json({ message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({ message: "error", data: err});
    });
}

export {
    addNurse,
    getNurse,
    updateNurse,
    deleteNurse
}
