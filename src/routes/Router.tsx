import { RouterProvider, createBrowserRouter } from "react-router"
import { Paths } from "./paths"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import AuthGuard from "../auth/AuthGuard"
import GuestGuard from "../auth/GuestGuard"

//הנתבים של האפליקציה שמגדירים את המסכים השונים וההגנות שלהם
const Router = () => {
    const router = createBrowserRouter([
        {
            path: Paths.home,
            element: <AuthGuard><HomePage /></AuthGuard>
        },
        {
            path: Paths.login,
            element: <GuestGuard><LoginPage /></GuestGuard>
        },
        {
            path: Paths.register,
            element: <GuestGuard><RegisterPage /></GuestGuard>
        },
        {
            path: '*',
            element: <h1>404 - Page not found</h1>
        }
    ])

    return <RouterProvider router={router} />
}

export default Router