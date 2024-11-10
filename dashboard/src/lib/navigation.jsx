import {Link} from "react-router-dom"
import {FaHouse, FaCircleArrowLeft, FaCircleUser} from "react-icons/fa6"
import {IconContext} from "react-icons"
import "../index.css"
import {AccountContext} from "./account"
import {useContext} from "react"

export default ({children, backURL, title, buttons}) => {
    const {useAccount} = useContext(AccountContext)
    const account = useAccount()

    return (
        <IconContext.Provider value={{size: "2em"}}>
            <div className="navigation-container">
                <div className="navigation-bar">
                    <Link className="flex-row compact" to={backURL ?? "/"}>
                        {backURL ? <FaCircleArrowLeft /> : <FaHouse />}
                        {backURL ? "Back" : "Home"}
                    </Link>
                    <h2>{title}</h2>
                    <span className="spacer"></span>
                    {buttons}
                    <Link className="flex-row compact" to="/account">
                        <FaCircleUser />
                        {account?.username}
                    </Link>
                </div>
                {children}
            </div>
        </IconContext.Provider>
    )
}
