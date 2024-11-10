import {Link} from "react-router-dom"
import {FaHouse, FaCircleArrowLeft, FaCircleUser} from "react-icons/fa6"
import {IconContext} from "react-icons"
import "../index.css"
import {AccountProvider} from "./account"

const Back = ({to}) => (
    <Link className="flex-row compact" to={to ?? "/"}>
        {to ? <FaCircleArrowLeft /> : <FaHouse />}
        {to ? "Back" : "Home"}
    </Link>
)

export default ({children, backURL, buttons}) => {
    return (
        <AccountProvider ensure>
            <IconContext.Provider value={{size: "2em"}}>
                <div className="navigation-container">
                    <div className="navigation-bar">
                        <Back to={backURL} />
                        <span className="spacer"></span>
                        {buttons}
                        <Link to="/account"><FaCircleUser /></Link>
                    </div>
                    {children}
                </div>
            </IconContext.Provider>
        </AccountProvider>
    )
}
