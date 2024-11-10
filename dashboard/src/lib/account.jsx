import {createContext, useEffect, useState} from "react"
import {baseURL} from "./config"
import {useNavigate} from "react-router-dom"

export const AccountContext = createContext({})

export const AccountProvider = (prop) => {
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
            if (res.status >= 400) {
                console.info("Credentials rejected, signing out.")
                if (prop.ensure)
                    signOut()
                return null
            }
            else if (res.status == 200) {
                console.debug("Request completed.")
                return res
            }
            else {
                console.error(`Request failed ${res}`)
                alert(`Request failed. ${res.status}`)
                return null
            }
        })()
    }

    const signOut = () => {
        setAccount(null)
        navigate("/signin")
    }

    const loadAccount = asyncTry(async () => {
        const res = await authenticatedFetch("/get_account")
        if (res)
            setAccount(await res.json())
        return true
    })

    const signIn = (username, password) => asyncTry(async () => {
        const res = await fetch(`${baseURL}/auth`, {
            method: "POST",
            body: JSON.stringify({username, password})
        })
            .catch((error) => {
                console.error(error)
                return null
            })
        if (res?.status == 200)
            return await loadAccount()
        else
            return false
    })()

    useEffect(() => {
        loadAccount()
    }, [])

    return <AccountContext.Provider value={{
        account,
        signIn,
        signOut,
        authenticatedFetch
    }}>{prop.children}</AccountContext.Provider>
}
