import {Link, useNavigate} from "react-router-dom"
import {FaSquarePlus} from "react-icons/fa6"
import NavigationLayout from "./lib/navigation"
import {useContext, useEffect, useState} from "react"
import {AccountContext} from "./lib/account"
import signinImage from './assets/signin.png'; // Import your background image
import PopUp from "./PopUp"

const useDebouncedState = (defaultValue) => {
    const [state, setState] = useState(defaultValue)
    const [lastState, setLastState] = useState(defaultValue)
    const [debounced, setDebounced] = useState(defaultValue)

    useEffect(() => {
        const update = setInterval(() => {
            if (state == lastState && state != debounced) {
                setDebounced(state)
            }
            setLastState(state)
        }, 300)
        return () => clearInterval(update)
    })

    return [debounced, setState]
}

export default () => {
    const [recent, setRecent] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [query, setQuery] = useDebouncedState(null)
    const {authenticatedFetch} = useContext(AccountContext)
    const patient = query ? searchResult : recent
    const navigate = useNavigate();

    useEffect(() => {
        authenticatedFetch("/patients/recent-patient")
            .then(res => {
                if (res?.accepted)
                    setRecent(res.content)
            })
    }, [])
    useEffect(() => {
        if (query) {
            authenticatedFetch(`/patients/search-patient/${query}`)
                .then(res => res?.accepted && setSearchResult(res.content))
        }
    }, [query])

    const showPopUp = () => {
        document.querySelector("#popup-container").classList.remove("popup-transition-in")
        document.querySelector("#popup-container").classList.add("popup-transition-out")
        setTimeout(() => document.querySelector("#patients").classList.add("hidden"), 500)
        setTimeout(() => document.querySelector("#new-patient").classList.remove("hidden"), 500)
    };

    const closePopUp = () => {
        document.querySelector("#popup-container").classList.remove("popup-transition-out")
        document.querySelector("#popup-container").classList.add("popup-transition-in")
        setTimeout(() => document.querySelector("#patients").classList.remove("hidden"), 500)
        setTimeout(() => document.querySelector("#new-patient").classList.add("hidden"), 500)
    }

    // Set the background for the entire page
    useEffect(() => {
        document.body.style.backgroundImage = `url(${signinImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }, []);

    return (
        <NavigationLayout buttons={<Link to="/team" style={{ color: 'white' }}>Manage Team</Link>}>
            <section id="popup-container">
                <div id="patients">
                    <div className="flex-row stretch-items">
                        <input className="grow-3 rounded" type="text" placeholder="Find patient" onChange={
                            e => setQuery(e.target.value)
                        } />
                        <button className="flex-row compact" onClick={showPopUp}><FaSquarePlus /> New Patient</button>
                    </div>
                    <h2>{query ? `Results for: ${query}` : "Recent Patients"}</h2>
                    <ol className="p-0">
                        {patient.map(p => (
                            <li className="navitem" key={p.id}>
                                <Link to="submit-report" state={{patientId: p.id, patientName: p.patientName}}>
                                    {p.patientName}
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
                <div id="new-patient" className="hidden" style={{height: "510px"}}>
                    <PopUp close={closePopUp} />
                </div>
            </section>
        </NavigationLayout>
    )
}
