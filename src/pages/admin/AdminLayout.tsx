import { Link, Outlet } from "react-router"
import { Paths } from "../../routes/paths"
const AdminLayout = () => {
    return (
        <div>
            <nav>
                <Link to={Paths.admin.artists}>אמנים</Link>
                <Link to={Paths.admin.songs}>שירים</Link>
            </nav>
            <Outlet />
        </div>
    )
}

export default AdminLayout