import NavigationLayout from "./lib/navigation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "./lib/config";
import { useLocation } from "react-router-dom";

const SubmitReport = () => {
    const { patientId, patientName } = useLocation().state;
    const [report, setReport] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/after-submit-report", {state: {patient: patientId, patientName, report}});
    }
    return (
        <NavigationLayout title={patientName}>
            <div>
                <textarea value={report} onChange={(e) => setReport(e.target.value)}></textarea>
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </NavigationLayout>
    );
};

export default SubmitReport;