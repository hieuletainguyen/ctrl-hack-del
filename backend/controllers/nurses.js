import { v4 as uuidv4 } from "uuid";
import { dynamoDB } from "../database/dynamodb.js";

const addNurse = async (req, res) => {
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
    const paramsGetNurse = {
        TableName: "Nurse"
    }

    await dynamoDB.scan(paramsGetNurse).promise().then((data) => {
        return res.status(200).json({
            message: "success",
            data: data.Items
        });
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}


const updateNurse = async (req, res) => {
    const { id, nurseName, skills } = req.body;
    const paramsUpdateNurse = {
        TableName: "Nurse",
        Key: {
            id: {S: id}
        },
        UpdateExpression: "set nurseName = :nurseName, skills = :skills",
        ExpressionAttributeValues: {
            ":nurseName": nurseName,
            ":skills": skills
        }
    }

    await dynamoDB.updateItem(paramsUpdateNurse).promise().then((data) => {
        return res.status(200).json({message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}


const deleteNurse = async (req, res) => {
    const { id } = req.params;
    const paramsDeleteNurse = {
        TableName: "Nurse",
        Key: {id: {S: id}}
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