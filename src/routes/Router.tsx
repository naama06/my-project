import { Navigate, RouterProvider, createBrowserRouter } from "react-router"
import { Paths } from "./paths"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import AuthGuard from "../auth/AuthGuard"
import GuestGuard from "../auth/GuestGuard"
import AdminGuard from "../auth/AdminGuard"
import AdminLayout from "../pages/admin/AdminLayout"
import ManageArtists from "../pages/admin/ManageArtists"
import ManageSongs from "../pages/admin/ManageSongs"
import ManageUsers from "../pages/admin/ManageUsers"
import ProfilePage from "../pages/ProfilePage"    
//הנתבים של האפליקציה שמגדירים את המסכים השונים וההגנות שלהם
const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Navigate to={Paths.login} />
        },
              
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
            path: Paths.profile,
            element: <AuthGuard><ProfilePage /></AuthGuard>
        },
        {
            path: Paths.admin.root,
            element: <AdminGuard><AdminLayout /></AdminGuard>,
            children: [
                { path: 'artists', element: <ManageArtists /> },
                { path: 'songs', element: <ManageSongs /> },
                { path: 'users', element: <ManageUsers /> },
            ]
        },
        {
            path: '*',
            element: <h1>404 - Page not found</h1>
        }
    ])

    return <RouterProvider router={router} />
}

export default Router