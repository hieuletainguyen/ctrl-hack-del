import { useState, useEffect } from "react";
import { baseURL } from "../lib/config";
import { useNavigate } from "react-router-dom";
import NavigationLayout from "../lib/navigation"

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

    return (
        <NavigationLayout buttons={[<button onClick={() => navigate("/team")}>Team</button>]}>
            <div style={{
                padding: "20px",
            }}>
                <h1 style={{
                    justifySelf: "center",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "10px",
                    marginBottom: "20px",
                    fontSize: "100px",
                    fontWeight: "bold"
                }}>Skills</h1>
                <div style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifySelf: "center",
                        maxWidth: "400px",
                        marginBottom: "20px"
                    }}>
                    <input 
                        type="text" 
                        placeholder="Skill Name" 
                        value={skillName} 
                        onChange={(e) => setSkillName(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "5px",
                            fontSize: "14px",
                            flex: 1,
                            transition: "all 0.2s ease",
                            border: "1px solid rgb(1, 1, 1)",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
                        }}
                    />
                    <button 
                        onClick={handleAddSkill}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "5px",
                            backgroundColor: "#007bff",
                            color: "white",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgb(1, 1, 1)",
                        }}
                    >
                        Add Skill
                    </button>
                </div>
                <div style={{
                    listStyle: "none",
                    borderRadius: "10px",
                    padding: "10px",
                    background: "rgba(238, 238, 238, 0.1)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                }}>
                    {skill.map((s) => (
                        <div key={s} style={{
                            padding: "8px",
                            margin: "5px 0",
                            borderRadius: "10px",
                            background: "white",
                            transition: "all 0.2s ease",
                            fontSize: "16px",
                            justifySelf: "center",
                            border: "1px solid rgb(1, 1, 1)",
                            width: "95%",
                            
                        }}>
                            {s}
                        </div>
                    ))}
                    </div>
            </div>
        </NavigationLayout>
    );
}

