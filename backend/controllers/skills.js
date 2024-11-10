import dynamoDB from "../config/db.js";

export const addSkill = async (req, res) => {
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
        return res.status(400).json({message: "error"});
    });
}

export const getSkill = async (req, res) => {
    const paramsGetSkill = {
        TableName: "Skill",
        Item: {
            name: {S: skillName}
        }   
    }

    await dynamoDB.scan(paramsGetSkill).promise().then((data) => {
        return res.status(200).json({message: "success", data: data.Items});
    }).catch((err) => {
        return res.status(400).json({message: "error"});
    });
}
