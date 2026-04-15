import { useState } from "react"
import { useAuthContext } from "../auth/useAuthContext"
import { setSession } from "../auth/auth.utils"
import { login } from "../services/auth.service"
import { jwtDecode } from "jwt-decode"
import type { User } from "../types/user.types"
import { useNavigate } from "react-router"
import { Paths } from "../routes/paths"

const LoginPage = () => {
    const { setUser } = useAuthContext()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    }) 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    } 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = await login(formData.email, formData.password)
            const user = jwtDecode<User>(token)
            setSession(token)
            setUser(user)
            navigate(Paths.home)
        } catch (error) {
            console.error(error)
            alert('התחברות נכשלה')
        }
    }

    return (
        <div>
            <h1>התחברות</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="סיסמה"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">התחבר</button>
            </form>
            <p>אין לך חשבון? <a href={`${Paths.register}`}>הירשם</a></p>
        </div>
    )
}

export default LoginPage