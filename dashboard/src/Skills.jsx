import { useState, useEffect } from "react";
import { baseURL } from "./lib/config";
import { useNavigate } from "react-router-dom";

export default function Skills() {
    const [skill, setSkill] = useState([]);
    const [skillName, setSkillName] = useState("");
    const navigate = useNavigate();
    
    const handleAddSkill = async () => {
        const response = await fetch(`${baseURL}/skills/add-skill`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({skillName}),
        }); 

        if (response.ok) {
            console.log("Skill added successfully");
            setSkillName("");
            navigate(0);
        } else {
            console.error("Failed to add skill");
        }
    };

    const handleGetSkill = async () => {
        const response = await fetch(`${baseURL}/skills/get-skill`, {
            credentials: "include",
        });
        const data = await response.json();
        setSkill(data.data);
    };

    useEffect(() => {
        handleGetSkill();
    }, []);

    return <>
        <h1>Skills</h1>
        <input type="text" placeholder="Skill Name" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
        <button onClick={handleAddSkill}>Add Skill</button>
        <ol>
            {skill.map((s) => (
                <li key={s}>{s}</li>
            ))}
        </ol>
    </>;
}

