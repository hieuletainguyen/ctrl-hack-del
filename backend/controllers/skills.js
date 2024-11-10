import { dynamoDB } from "../database/dynamodb.js";
import { _decode_token } from "../helper/helper.js";

const addSkill = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const { skillName } = req.body;
    const paramsAddSkill = {
        TableName: "Skill",
        Item: {
            name: {S: skillName}
        }
    }

    await dynamoDB.putItem(paramsAddSkill).promise().then((data) => {
        return res.status(200).json({message: "success", data: data});
    }).catch((err) => {
        return res.status(400).json({message: "error " + err});
    });
}

const getSkill = async (req, res) => {
    const token = req.cookies.TOKENS;
    const tokenData = await _decode_token(token);

    if (tokenData.message !== "success") {
        return res.status(401).json({message: "No authentication token found"});
    }

    const paramsGetSkill = {
        TableName: "Skill"
    }

    await dynamoDB.scan(paramsGetSkill).promise().then((data) => {
        data.Items = data.Items.map((item) => item.name.S);
        return res.status(200).json({message: "success", data: data.Items});
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}

export {
    addSkill,
    getSkill
}
