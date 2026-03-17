import { useState } from "react"
import { useAuthContext } from "../auth/useAuthContext"
import { setSession } from "../auth/auth.utils"
import { register } from "../services/auth.service"
import { jwtDecode } from "jwt-decode"
import type { User } from "../types/user.types"
import { useNavigate } from "react-router"
import { Paths } from "../routes/paths"
import { login } from "../services/auth.service"

const RegisterPage = () => {
    const { setUser } = useAuthContext()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
    })
    const [profileImage, setProfileImage] = useState<File | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = new FormData()
            data.append('userName', formData.userName)
            data.append('email', formData.email)
            data.append('password', formData.password)
            if (profileImage) {
                data.append('fileProfile', profileImage)
            }
            //יוצר את המשתמש בdb אבל לא מחזיר טוקן
            await register(data)
            const token = await login(formData.email, formData.password);
            const user = jwtDecode<User>(token)
            setSession(token)//שמירה ב LOCAL STORAGE
            setUser(user)
            navigate(Paths.home)
        } catch (error) {
            console.error(error)
            alert('ההרשמה נכשלה')
        }
    }

    return (
        <div>
            <h1>הרשמה</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="userName"
                    placeholder="שם משתמש"
                    value={formData.userName}
                    onChange={handleChange}
                />
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
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">הירשם</button>
            </form>
            <p>כבר יש לך חשבון? <a href={`/${Paths.login}`}>התחבר</a></p>
        </div>
    )
}

export default RegisterPage