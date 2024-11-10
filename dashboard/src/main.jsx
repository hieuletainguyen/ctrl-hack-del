import {StrictMode} from "react"
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Dashboard from "./dashboard"
import SignIn from "./SignIn"
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
                path: "/nurse",
                element: <NurseProfile />
            },
            {
                path: "/after-submit-report",
                element: <AfterSubmitReport />
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
