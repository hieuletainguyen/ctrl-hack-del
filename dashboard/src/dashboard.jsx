import {Link} from "react-router-dom"
import {FaSquarePlus} from "react-icons/fa6"
import NavigationLayout from "./lib/navigation"
import {useEffect, useState} from "react"

const useDebouncedState = (defaultValue) => {
    const [state, setState] = useState(defaultValue)
    const [lastState, setLastState] = useState(defaultValue)
    const [debounced, setDebounced] = useState(defaultValue)

    useEffect(() => {
        const update = setInterval(() => {
            if (state == lastState && state != debounced) {
                console.debug(`Debounced state = ${state}`)
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

    useEffect(() => {
        // Fetch recents.
    }, [])
    useEffect(() => {
        if (!query)
            return
        // Fetch search results.
    })

    return (
        <NavigationLayout buttons={<Link to="/team">Manage Team</Link>}>
            <section>
                <div className="flex-row stretch-items">
                    <input className="grow-3" type="text" placeholder="Find patient" onChange={
                        e => setQuery(e.target.value)
                    } />
                    <button className="flex-row compact"><FaSquarePlus /> New Patient</button>
                </div>
                {query ? null : <h2>Recent patients</h2>}
            </section>
        </NavigationLayout>
    )
}
