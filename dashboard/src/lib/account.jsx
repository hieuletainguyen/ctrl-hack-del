import {createContext, useEffect, useState} from "react"
import {baseURL} from "./config"

export const AccountContext = createContext({})

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
        }
    }
}

export const authenticatedFetch = (url, options) => {
    return asyncTry(async () => {
        const res = await fetch(
            `${baseURL}${url}`,
            {...options, credentials: "include"}
        )
        if (res.status >= 400) {
            console.info("Credentials rejected, signing out.")
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

export const AccountProvider = (prop) => {
    const [account, setAccount] = useState(null)

    const loadAccount = asyncTry(async () => {
        const res = await authenticatedFetch("/account")
        if (res)
            setAccount(await res.json())
    })

    const signIn = asyncTry(async (username, password) => {
        await fetch(`${baseURL}/signin`, {
            method: "POST",
            body: JSON.stringify({username, password})
        })
        await loadAccount()
    })

    const signOut = () => {
        setAccount(null)
        window.location.href = "/signin"
    }

    useEffect(() => {
        loadAccount()
    }, [])

    return <AccountContext.Provider value={{
        account,
        signIn,
        signOut
    }}>{prop.children}</AccountContext.Provider>
}
