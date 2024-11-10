import {useContext, useEffect, useState} from "react"
import {AccountContext} from "./account"
import {Link} from "react-router-dom"

export const NurseNavItem = ({id}) => {
    const [nurse, setNurse] = useState(null)
    const {authenticatedFetch} = useContext(AccountContext)

    useEffect(() => {
        if (id)
            authenticatedFetch(`/nurses/get-nurse/${id}`)
                .then(res => res?.accepted && setNurse(res.content[0]))
    }, [id])

    if (nurse) {
        return (
            <div className="navitem" style={{borderRadius: "10px"}}>
                <Link to={`/team/${id}`}>{nurse.nurseName}</Link>
            </div>
        )
    }
}
