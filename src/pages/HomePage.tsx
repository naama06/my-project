import { useAuthContext } from "../auth/useAuthContext"
import { removeSession } from "../auth/auth.utils"

const HomePage = () => {
    const { user } = useAuthContext()

    return (
        <div>
            <h1>שלום {user?.userName}!</h1>
            <button onClick={removeSession}>התנתק</button>
        </div>
    )
}

export default HomePage