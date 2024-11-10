import jwt from "jsonwebtoken";
import { dynamoDB } from "../database/dynamodb.js";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const jwtSecretkey = process.env.JWT_SECRET_KEY;

export const _decode_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecretkey, (err, decoded) => {
            if (err) {
                reject({ message: "Invalid token" });
                return;
            }

            const params = {
                TableName: "Token",
                Key: {
                    token: { S: token }
                }
            };

            dynamoDB.getItem(params, (err, data) => {
                if (err) {
                    reject({ message: err });
                    return;
                }
                
                if (Object.keys(data).length === 0) {
                    reject({ message: "Invalid token" });
                    return;
                }
                
                resolve({ message: "success", userId: decoded.userId });
            });
        });
    });
};

export const _call_openai = async (report, skills) => {
    const extra = ` based on the report, choose 5 skills from ${skills.join(", ")} to treat the patient
    return the skills in the following JSON format:
    {
        "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
    }
    `;
    
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "You are a helpful assistant that helps choose skills for nurse to treat patients"},
            {role: "user", content: " this is the report of the patient: " + report + " \n" + extra}
        ],
        response_format: {
            type: "json_object"
        },
    });
    return response.choices[0].message.content;
}

export const _match_nurse = async (requiredSkills) => {
    const params = {
        TableName: "Nurse"
    };

    try {
        const { Items } = await dynamoDB.scan(params).promise();
        const rankedNurses = Items.map(nurse => {
            const nurseSkills = nurse.skills.SS || [];
            const matchingSkills = nurseSkills.filter(skill => requiredSkills.includes(skill));
            const result = {
                nurseId: nurse.id.N,
                name: nurse.name.S,
                matchPercentage: (matchingSkills.length / requiredSkills.length) * 100,
                matchingSkills: matchingSkills
            };
            return result;
        });

        rankedNurses.sort((a, b) => b.matchPercentage - a.matchPercentage);
        return {
            message: "success",
            matches: rankedNurses[0]
        }

    } catch (error) {
        throw {
            message: "Error finding matching nurses",
            error: error
        };
    }
};