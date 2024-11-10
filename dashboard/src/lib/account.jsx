import {createContext, useEffect, useState} from "react"
import {baseURL} from "./config"
import {Outlet, useNavigate} from "react-router-dom"

export const AccountContext = createContext({})

export const AccountProvider = () => {
    const [account, setAccount] = useState(null)
    const navigate = useNavigate()

    const asyncTry = (f, e) => {
        return async () => {
            try {
                return await f()
            }
            catch (error) {
                if (e) {
                    e(error)
                }
                else {
                    console.error(error)
                    alert(error)
                }
                return null
            }
        }
    }

    const authenticatedFetch = (url, options) => {
        return asyncTry(async () => {
            const res = await fetch(
                `${baseURL}${url}`,
                {...options, credentials: "include"}
            )
            const body = await res.json() ?? {}
            if (res.status >= 400) {
                console.info("Credentials rejected.")
                return {accepted: false, content: body.message}
            }
            else if (res.status == 200) {
                console.debug("Request completed.")
                return {accepted: true, content: body.data}
            }
            else {
                throw `Request failed, status=${res.status}, body=${body}`
            }
        })()
    }

    const signOut = () => {
        setAccount(null)
        navigate("/signin")
    }

    const useAccount = () => {
        useEffect(asyncTry(async () => {
            const res = await authenticatedFetch("/get_account")
            if (res?.accepted)
                setAccount(res.content)
            else
                signOut()
        }), [])
        return account
    }

    const signIn = (username, password) => asyncTry(async () => {
        const res = await fetch(`${baseURL}/auth`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password})
        })
        return res?.status == 200
    })()

    return <AccountContext.Provider value={{
        useAccount,
        signIn,
        signOut,
        authenticatedFetch
    }}><Outlet /></AccountContext.Provider>
}
