import { Link } from "react-router-dom";
import NavigationLayout from "./lib/navigation";

const AfterSubmitReport = (props) => {
    const { patientName } = props;
    const [category, setCategory] = useState([]);
    const [matchingNurseId, setMatchingNurseId] = useState({});
    const [matchingNurse, setMatchingNurse] = useState({
        "name": ""
    });

    useEffect(async () => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/patients/get-patient/${patientName}`);
            setCategory(response.data.treatment);
            setMatchingNurseId(response.data.nurse);
        };
        fetchData();

        if (matchingNurseId != "") {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/nurses/get-nurse/${matchingNurseId}`);
            setMatchingNurse(response.data.nurseName);
        }
    }, [matchingNurseId]);

    return (
        <NavigationLayout>
            <div>
                <h1>Matching Nurse Result</h1>
                <p>Category: {category}</p>
                <button onClick={() => {
                    navigate(`/nurse/${matchingNurse.id}`);
                }}>Matching Nurse: {matchingNurse.name}</button>
            </div>
        </NavigationLayout>
    );
}

export default AfterSubmitReport;
