import {StrictMode} from "react"
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {AccountProvider} from "./lib/account"
import Dashboard from "./dashboard"
import SignIn from "./SignIn"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />
    },
    {
        path: "/signup",
        element: <div>Sign up</div>,
    },
    {
        path: "/signin",
        element: <SignIn />
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AccountProvider>
            <RouterProvider router={router} />
        </AccountProvider>
    </StrictMode>,
)
