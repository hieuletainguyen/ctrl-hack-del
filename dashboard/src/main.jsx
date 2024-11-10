import {StrictMode} from "react"
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Dashboard from "./dashboard"
import SignIn from "./SignIn"
import Team from "./team"
import AfterSubmitReport from "./after-submit-report"
import SubmitReport from "./submit-report"
import PopUp from "./PopUp"
import {AccountProvider} from "./lib/account"

const router = createBrowserRouter([
    {
        path: "/",
        element: <AccountProvider />,
        children: [
            {
                path: "",
                element: <Dashboard />
            },
            {
                path: "signup",
                element: <div>Sign up</div>,
            },
            {
                path: "signin",
                element: <SignIn />
            },
            {
                path: "team/:id?",
                element: <Team />
            },
            {
                path: "after-submit-report",
                element: <AfterSubmitReport />
            },
            {
                path: "submit-report",
                element: <SubmitReport />
            },
            {
                path: "popup",
                element: <PopUp />
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
