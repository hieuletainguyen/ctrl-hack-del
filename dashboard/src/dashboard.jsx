import {Link} from "react-router-dom"
import {FaSquarePlus} from "react-icons/fa6"
import NavigationLayout from "./lib/navigation"
import { useState } from "react"

const Patients = ({query}) => {
    const [recent, setRecent] = useState([])
    const [searchResult, setSearchResult] = useState([])
}

export default () => {
    return (
        <NavigationLayout buttons={<Link to="/nurses">Manage Team</Link>}>
            <section className="flex-row stretch-items">
                <input className="grow-3" type="text" placeholder="Find patient" />
                <button className="flex-row compact"><FaSquarePlus /> New Patient</button>
            </section>
        </NavigationLayout>
    )
}
