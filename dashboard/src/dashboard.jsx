import {Link} from "react-router-dom"
import {FaSquarePlus} from "react-icons/fa6"
import NavigationLayout from "./lib/navigation"
import {useContext, useEffect, useState} from "react"
import {AccountContext} from "./lib/account"

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

    console.log(recent)
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

    return (
        <NavigationLayout buttons={<Link to="/team">Manage Team</Link>}>
            <section>
                <div className="flex-row stretch-items">
                    <input className="grow-3" type="text" placeholder="Find patient" onChange={
                        e => setQuery(e.target.value)
                    } />
                    <button className="flex-row compact"><FaSquarePlus /> New Patient</button>
                </div>
                <h2>{query ? `Results for: ${query}` : "Recent Patients"}</h2>
                <ol className="p-0">
                    {patient.map(p => (
                        <li className="navitem" key={p.id}>{p.patientName}</li>
                    ))}
                </ol>
            </section>
        </NavigationLayout>
    )
}
