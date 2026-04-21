import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/useAuthContext";
import { getUserById, updateUser } from "../services/user.service";
import { removeSession,setSession, } from "../auth/auth.utils";
import type { AdminUser } from "../types/user.types";
import { useNavigate } from "react-router-dom"; // הוספנו את ה-Hook לניווט
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
    const { user, setUser } = useAuthContext(); 
    const navigate = useNavigate(); // אתחול הניווט
    const [userData, setUserData] = useState<AdminUser | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.userId) {
                try {
                    const data = await getUserById(Number(user.userId));
                    setUserData(data);
                } catch (error) {
                    console.error("שגיאה בטעינת נתוני משתמש", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (userData) {
            setUserData({ ...userData, [e.target.name]: e.target.value });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
        const data = new FormData();
        data.append('userName', userData.userName);
        data.append('email', userData.email);
        if (newPassword.trim() !== "") data.append('password', newPassword);
        if (profileImage) data.append('fileProfile', profileImage);

        // 1. עדכון בשרת וקבלת התגובה שמכילה את הטוקן החדש
        const result = await updateUser(userData.id, data); 
        const newToken = result.token; // השרת מחזיר { token: "..." }

        // 2. עדכון ה-LocalStorage - זה הצעד הקריטי בשביל F5!
        setSession(newToken);

        // 3. עדכון ה-State של ה-Context (לעדכון מיידי של ה-UI)
        const decodedUser = jwtDecode<any>(newToken);
        setUser(decodedUser);

        alert('הפרופיל עודכן בהצלחה!');
        navigate("/"); // חזרה לדף הבית - עכשיו הכל יהיה מעודכן
        
    } catch (error) {
        console.error(error);
        alert('עדכון הפרופיל נכשל');
    }
};

    if (loading) return <div>טוען נתונים...</div>;

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
            <h1>פרופיל אישי</h1>

            <div style={{ marginBottom: '20px' }}>
                {userData?.arrProfile ? (
                    <img 
                        src={`data:image/jpeg;base64,${userData.arrProfile}`} 
                        alt="Profile" 
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                    />
                ) : (
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ccc', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        אין תמונה
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                    <label>שם משתמש:</label>
                    <input
                        type="text"
                        name="userName"
                        style={{ width: '100%', padding: '8px' }}
                        value={userData?.userName || ''}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ textAlign: 'right' }}>
                    <label>אימייל:</label>
                    <input
                        type="email"
                        name="email"
                        style={{ width: '100%', padding: '8px' }}
                        value={userData?.email || ''}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ textAlign: 'right' }}>
                    <label>סיסמה חדשה (השאר ריק אם אין שינוי):</label>
                    <input
                        type="password"
                        style={{ width: '100%', padding: '8px' }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div style={{ textAlign: 'right' }}>
                    <label>החלף תמונת פרופיל:</label>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ width: '100%' }}
                        onChange={handleImageChange}
                    />
                </div>

                <button type="submit" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    שמור שינויים
                </button>
            </form>

            <hr style={{ margin: '30px 0' }} />

            <button 
                onClick={() => { removeSession(); window.location.reload(); }} 
                style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
                התנתק מהמערכת
            </button>
        </div>
    );
};

export default ProfilePage;