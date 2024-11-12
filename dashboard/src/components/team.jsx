import {useContext, useEffect, useState} from "react"
import NavigationLayout from "../lib/navigation"
import {useParams, useNavigate} from "react-router-dom"
import {AccountContext} from "../lib/account"
import {NurseNavItem} from "../lib/component"


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
    console.log("nurse")
    console.log(nurse.skills)
    const [skills, setSkills] = useState([]);
    const [edit, setEdit] = useState(false);
    const [fullName, setFullName] = useState(nurse.nurseName);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [nurseSkills, setNurseSkills] = useState(nurse.skills || []);
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
                        .filter(skill => !(nurseSkills || nurse.skills)?.includes(skill))
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
                    {(nurseSkills && nurse.skills)?.length === 0 ? <li>No skills</li> 
                    : (nurseSkills?.length ? nurseSkills : nurse.skills)?.map(skill => (
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
    const navigate = useNavigate()

    useEffect(() => {
        const url = id ? `/nurses/get-nurse/${id}` : "/nurses/get-nurse"
        console.log(url)
        authenticatedFetch(url).then(res => {
            res?.accepted && setNurses(res.content);
        })
    }, [id, authenticatedFetch])

    const getNurseById = async () => {
        const result = await authenticatedFetch(`/nurses/get-nurse/${id}`).then(res => {
            res?.accepted && setNurses(res.content);
            return res.content
        })
        return result[0]
    }

    return (
        <NavigationLayout buttons={[<button onClick={() => navigate("/skills")}>Skills</button>]}>
            {
            (id && nurses?.find(n => n.id === id)) ?  <Profile nurse={nurses?.find(n => n.id === id)} auth={authenticatedFetch} /> : 
            (id && !nurses?.find(n => n.id === id)) ?  <Profile nurse={getNurseById()} auth={authenticatedFetch} /> :
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
