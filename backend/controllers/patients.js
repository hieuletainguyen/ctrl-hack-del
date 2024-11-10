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
    const {report, patient_id} = req.body;
    const cookie = req.cookies;

    // const decoded = await _decode_token(cookie.token);
    // if (decoded.message === "Invalid token") {
    //     return res.status(401).json({ message: "Invalid token" });
    // }

    // get all skills required 
    const params = {
        TableName: "Skill"
    };
    
    const skills = await dynamoDB.scan(params).promise().then((data) => {
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

    let resultTreatment = await _call_openai(report, skills);
    resultTreatment = JSON.parse(resultTreatment);
    const resultNurse = await _match_nurse(resultTreatment.skills);

    


}

const getPatient = (req, res) => {

}

const updatePatient = (req, res) => {

}

const deletePatient = (req, res) => {

}

const recentPatient = (req, res) => {

}

export {
    addPatient,
    getPatient,
    updatePatient,
    deletePatient,
    recentPatient
}

