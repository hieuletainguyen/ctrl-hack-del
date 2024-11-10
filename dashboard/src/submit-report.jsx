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
        const submitReport = async () => {
            console.log(report, patientId, patientName);
            const response = await fetch(`${baseURL}/patients/submit-report`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({report, patientId})
            });
            const data = await response.json();
            if (data.message === "success") {
                navigate("/after-submit-report", { state: { patientName, patientId } });
            } else {
                alert("Failed to submit report");
            }
        }
        submitReport();
    }
    return (
        <NavigationLayout patientName={patientName}>
            <div>
                <textarea value={report} onChange={(e) => setReport(e.target.value)}></textarea>
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </NavigationLayout>
    );
};

export default SubmitReport;
