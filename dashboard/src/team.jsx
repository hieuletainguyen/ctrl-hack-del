import {useContext, useEffect, useState} from "react"
import NavigationLayout from "./lib/navigation"
import {useParams} from "react-router-dom"
import {AccountContext} from "./lib/account"
import {NurseNavItem} from "./lib/component"

const List = ({nurses}) => {
    return (
        <ol>
            {nurses?.map(n => <li key={n.id}><NurseNavItem id={n.id} /></li>)}
        </ol>
    )
}

const Profile = ({nurse}) => {
    const [skills, setSkills] = useState([]);
    const [edit, setEdit] = useState(false);
    const [fullName, setFullName] = useState(nurse.fullName);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [nurseSkills, setNurseSkills] = useState(nurse.skills);

    useEffect(() => {
        const url = `/skills/get-skill`;
        authenticatedFetch(url).then(res => setSkills(res.data));
    }, []);

    const handleUpdateNurse = () => {
        setEdit(false)
        const url = `/nurses/update-nurse/${nurse.id}`;
        authenticatedFetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({fullName: fullName, skills: skills})
        }).then(res => {
            if (res?.accepted) setEdit(false);
        });
    }

    return <>
        {
            edit ?
            <div>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <select multiple value={selectedSkills} onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedSkills(selected);
                }}>
                    {skills.filter(s => !nurseSkills.includes(s))
                        .map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => {handleUpdateNurse()}}>Save</button>
            </div> :
            <>
                <h1>{nurse.fullName}</h1>
                <ol>
                    {nurse.skills.map(s => <li key={s}>{s}</li>)}
                </ol>
                <button onClick={() => setEdit(true)}>Edit</button>
            </>
        }

    </>
}

export default () => {
    const {id} = useParams()
    const {authenticatedFetch} = useContext(AccountContext)
    const [nurses, setNurses] = useState(null)

    useEffect(() => {
        const url = id ? `/nurses/get-nurse/${id}` : "/nurses/get-nurse"
        authenticatedFetch(url).then(res =>
            res?.accepted && setNurses(res.content)
        )
    }, [])

    return (
        <NavigationLayout buttons={[<button>Skills</button>]}>
            {id ? <Profile nurse={nurses[0]} /> : <List nurses={nurses} />}
        </NavigationLayout>
    )
}
