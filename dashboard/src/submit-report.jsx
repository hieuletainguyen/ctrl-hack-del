import NavigationLayout from "./lib/navigation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "./lib/config";
import { useLocation } from "react-router-dom";
import "./submit-report.css"; // Import the new CSS file

const SubmitReport = () => {
    const { patientId, patientName } = useLocation().state;
    const [report, setReport] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/after-submit-report", {state: {patient: patientId, patientName, report}});
    }
    return (
        <NavigationLayout title={patientName}>
            <div className="header">
                <h1>Patient Report</h1>
            </div>
            <div className="submit-report-container">
                <textarea 
                className="submit-report-textarea" value={report} onChange={(e) => setReport(e.target.value)} placeholder="Enter the patient's report here..."></textarea>
            </div>
            <button 
            className="submit-button" onClick={handleSubmit}>Submit</button>
        </NavigationLayout>
    );
};

export default SubmitReport;