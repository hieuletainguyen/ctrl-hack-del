import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Index</div>
    },
    {
        path: "/signup",
        element: <div>Sign up</div>,
    },
    {
        path: "/signin",
        element: <div>Sign in</div>
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
