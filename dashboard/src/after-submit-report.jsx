import NavigationLayout from "./lib/navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { baseURL } from "./lib/config";

const AfterSubmitReport = () => {
    const navigate = useNavigate();
    const { patientName, patientId } = useLocation().state;
    const [category, setCategory] = useState([]);
    const [matchingNurseId, setMatchingNurseId] = useState({});
    const [matchingNurse, setMatchingNurse] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${baseURL}/patients/get-patient/${patientId}`, {
                credentials: "include",
            });
            const data = await response.json();
            setCategory(data.treatment);
            setMatchingNurseId(data.nurse);
            console.log(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/nurses/get-nurse/${matchingNurseId}`);
            setMatchingNurse(response.data);
        };
        fetchData();
    }, [matchingNurseId]);

    return (
        <NavigationLayout>
            <div>
                <h1>Matching Nurse Result</h1>
                <p>Category: {category}</p>
                <button onClick={() => {
                    navigate(`/nurse`, { state: { nurseName: matchingNurse.name, skills: matchingNurse.skills } });
                }}>View Nurse Profile</button>
            </div>
        </NavigationLayout>
    );
}

export default AfterSubmitReport;
