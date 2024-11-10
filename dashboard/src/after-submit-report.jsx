import { Link } from "react-router-dom";
import NavigationLayout from "./lib/navigation";

const AfterSubmitReport = (props) => {
    const { patientName } = props;
    const [category, setCategory] = useState([]);
    const [matchingNurseId, setMatchingNurseId] = useState({});
    const [matchingNurse, setMatchingNurse] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/patients/get-patient/${patientName}`);
            setCategory(response.data.treatment);
            setMatchingNurseId(response.data.nurse);
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
                    <Link to={`/nurse`} state={{ nurseName: matchingNurse.name, skills: matchingNurse.skills }}>View Nurse Profile</Link>
                }}>Matching Nurse: {matchingNurse.name}</button>
            </div>
        </NavigationLayout>
    );
}

export default AfterSubmitReport;
