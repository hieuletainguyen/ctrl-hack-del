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
            <div style={{
                listStyle: "none",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease-in-out",
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                width: "95%",
                padding: "12px",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    background: "#ccc"  
                },
                marginTop: "10px",
                marginBottom: "10px",
                textDecoration: "none",
                color: "black",
            }}>
                <Link style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }} to={`/team/${id}`}>{nurse.nurseName}</Link>
            </div>
        )
    }
}
