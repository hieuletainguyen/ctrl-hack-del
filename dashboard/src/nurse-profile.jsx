import NavigationLayout from "./lib/navigation";

const NurseProfile = (props) => {
    const { nurseName, skills } = props;
    return (
        <NavigationLayout>
            <h1>{nurseName}</h1>
            <p>{skills}</p>
        </NavigationLayout>
    );
}

export default NurseProfile;
