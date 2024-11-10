import {useContext, useEffect, useState} from "react"
import NavigationLayout from "./lib/navigation"
import {useParams} from "react-router-dom"
import {AccountContext} from "./lib/account"
import {NurseNavItem} from "./lib/component"

const List = ({nurses}) => {
    return (
        <ol>
            {nurses?.map(n => <li key={n.id}><NurseNavItem id={n.id} /></li>)}
        </ol>
    )
}

const Profile = ({nurse}) => {
    return <></>
}

export default () => {
    const {id} = useParams()
    const {authenticatedFetch} = useContext(AccountContext)
    const [nurses, setNurses] = useState(null)

    useEffect(() => {
        const url = id ? `/nurses/get-nurse/${id}` : "/nurses/get-nurse"
        authenticatedFetch(url).then(res =>
            res?.accepted && setNurses(res.content)
        )
    }, [])

    return (
        <NavigationLayout buttons={[<button>Skills</button>]}>
            {id ? <Profile nurse={nurses[0]} /> : <List nurses={nurses} />}
        </NavigationLayout>
    )
}
