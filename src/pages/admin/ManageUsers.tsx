// components/admin/ManageUsers.tsx
import { useEffect, useState } from "react"
import { getAllUsers, deleteUser } from "../../services/user.service"
import type { AdminUser } from "../../types/user.types"

const ManageUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            setUsers(data)
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('האם את בטוחה שברצונך למחוק משתמש זה?')) return
        await deleteUser(id)
        fetchUsers() // רענון הרשימה
    }

    const toImageSrc = (arrImage: string) => {
        return `data:image/jpeg;base64,${arrImage}`
    }

    if (loading) return <div>טוען משתמשים...</div>

    return (
        <div style={{ padding: '20px' }}>
            <h2>ניהול לקוחות רשומים</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'right' }}>
                        <th>תמונה</th>
                        <th>שם משתמש</th>
                        <th>אימייל</th>
                        <th>סטטוס</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>
                                {user.arrProfile ? (
                                    <img 
                                        src={toImageSrc(user.arrProfile)} 
                                        alt={user.userName} 
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        👤
                                    </div>
                                )}
                            </td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.isAdmin ? 
                                    <span style={{ color: 'gold', fontWeight: 'bold' }}>⭐ מנהל</span> : 
                                    'לקוח'
                                }
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(user.id)}
                                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                >
                                    🗑️ מחק
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManageUsers