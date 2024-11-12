import NavigationLayout from "../lib/navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {AccountContext} from "../lib/account"
import {NurseNavItem} from "../lib/component"

const AfterSubmitReport = () => {
    const {patient, patientName, report} = useLocation().state
    const [skills, setSkills] = useState([])
    const [nurse, setNurse] = useState(null)
    const {authenticatedFetch} = useContext(AccountContext)
    
    useEffect(() => {
        authenticatedFetch("/patients/submit-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({patientId: patient, report})
        })
            .then(res => {
                if (res?.accepted) {
                    setSkills(res.content.skills)
                    setNurse(res.content.nurse)
                }
            })
    }, [])

    return (
        <NavigationLayout>
            <h1>Match result for: {patientName}</h1>
            <section>
                <div>The following skillset is selected based on your report:</div>
                <h2>{skills.join(", ")}.</h2>
            </section>
            <section>
                <div>Best Match</div>
                <NurseNavItem id={nurse} />
            </section>
        </NavigationLayout>
    );
}

export default AfterSubmitReport;
