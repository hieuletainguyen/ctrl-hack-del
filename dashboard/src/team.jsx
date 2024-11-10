import {useContext, useEffect, useState} from "react"
import NavigationLayout from "./lib/navigation"
import {useParams, useNavigate} from "react-router-dom"
import {AccountContext} from "./lib/account"
import {NurseNavItem} from "./lib/component"


const List = ({nurses}) => {
    return (
        <ol style={{
            background: "rgba(238, 238, 238, 0.1)",
            backdropFilter: "blur(8px)",
            padding: "25px",
            borderRadius: "10px",
            listStyle: "none",
            width: "100%"
        }}>
            {nurses?.map(n => <li style={{
                background: "rgba(238, 238, 238, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                fontSize: "20px"
            }} 
            className="nurse-list-item" 
            key={n.id}><NurseNavItem id={n.id} /></li>)}
        </ol>
    )
}

const Profile = ({nurse, auth}) => {
    const [skills, setSkills] = useState([]);
    const [edit, setEdit] = useState(false);
    const [fullName, setFullName] = useState(nurse.nurseName);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [nurseSkills, setNurseSkills] = useState(nurse.skills);
    const navigate = useNavigate();

    useEffect(() => {
        const url = `/skills/get-skill`;
        auth(url, {
            method: "GET",
        }).then(res => {
            setSkills(res.content);
        });
    }, []);

    const handleUpdateNurse = () => {
        setEdit(false)
        const url = `/nurses/update-nurse/${nurse.id}`;
        auth(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nurseName: fullName, skills: [selectedSkill]})
        }).then(res => {
            if (res?.accepted) setEdit(false);
        });
        setSelectedSkill("");
        setNurseSkills([...nurseSkills, selectedSkill]);
        navigate(`/team`);
    }

    return <>
        <div>
            <div style={{display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem"}}>
                <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={nurse.nurseName}
                />
                <span>You can edit the name of the nurse</span>
            </div>

            <div style={{display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem"}}>
                <select 
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                >
                    <option value="">Select a skill</option>
                    {skills
                        .filter(skill => !nurseSkills?.includes(skill))
                        .map(skill => (
                            <option key={skill} value={skill}>
                                {skill}
                            </option>
                        ))
                    }
                </select>
                <button onClick={handleUpdateNurse}>
                    Add Skill & Edit
                </button>
            </div>

            <div>
                <h3>Current Skills:</h3>
                <ul>
                    {nurseSkills?.map(skill => (
                        <li key={skill}>{skill}</li>
                    ))}
                </ul>
            </div>
        </div>

    </>
}

export default () => {
    const {id} = useParams()
    const {authenticatedFetch} = useContext(AccountContext)
    const [nurses, setNurses] = useState(null)

    useEffect(() => {
        const url = id ? `/nurses/get-nurse/${id}` : "/nurses/get-nurse"
        console.log(url)
        authenticatedFetch(url).then(res => {
            res?.accepted && setNurses(res.content);
            console.log(res.content)
        })
    }, [])

    return (
        <NavigationLayout buttons={[<button>Skills</button>]}>
            {console.log(nurses)}
            {console.log(id)}
            {id ? <Profile nurse={nurses?.find(n => n.id === id)} auth={authenticatedFetch} /> : 
              <div style={{
                backdropFilter: "blur(8px)",
                padding: "25px",
                borderRadius: "10px"
              }}>
                <List nurses={nurses} />
              </div>
            }
        </NavigationLayout>
    )
}
