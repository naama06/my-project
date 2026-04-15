import { createContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types/user.types"
import { getSession, setSession } from "./auth.utils"
import { jwtDecode } from "jwt-decode"
//הקשר של האותנטיקציה שמכיל את המידע על המשתמש הנוכחי והאם הוא מחובר או לא
type AuthStateType = {
    user: User | null
    isInitialized: boolean
}
//ההבדל מהמורה: אצל המורה היה קריאה לשרת getUserByToken — אצלנו אנחנו מפענחים את ה-token ישירות עם jwtDecode כי כל המידע כבר בתוכו!
type AuthContextType = AuthStateType & {
    isAuthorized: boolean
    setUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
    children: ReactNode
}

//הפרוביידר של האותנטיקציה שמקיף את כל האפליקציה ומספק את המידע על המשתמש הנוכחי לכל הקומפוננטות
export const AuthProvider = ({ children }: Props) => {
    const [authState, setAuthState] = useState<AuthStateType>({
        user: null,
        isInitialized: false
    })

    const setUser = (user: User) => {
        setAuthState(prev => ({ ...prev, user }))
    }

    useEffect(() => {
        const initialize = () => {
            try {
                const token = getSession()
                if (token) {
                    const user = jwtDecode<User>(token)
                    setSession(token)
                    setUser(user)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setAuthState(prev => ({ ...prev, isInitialized: true }))
            }
        }
        initialize()
    }, [])

//     useEffect(() => {
//     const initialize = () => {
//         try {
//             const token = getSession();
//             if (token) {
//                 const user = jwtDecode<User>(token);
//                 // עדכון כל הסטייט בבת אחת כדי למנוע רינדורים מיותרים
//                 setAuthState({
//                     user: user,
//                     isInitialized: true
//                 });
//                 return; // יוצאים מהפונקציה כי סיימנו
//             }
//         } catch (error) {
//             console.error("Token decoding failed:", error);
//         }
        
//         // אם אין טוקן או הייתה שגיאה
//         setAuthState(prev => ({ ...prev, isInitialized: true }));
//     };
//     initialize();
// }, []);
    return (
        <AuthContext.Provider value={{
            ...authState,
            setUser,
            isAuthorized: !!authState.user
        }}>
            {children}
        </AuthContext.Provider>
    )
}
//ההבדל מהמורה: אצל המורה היה קריאה לשרת getUserByToken — אצלנו אנחנו מפענחים את ה-token ישירות עם jwtDecode כי כל המידע כבר בתוכו!ההבדל מהמורה: אצל המורה היה קריאה לשרת getUserByToken — אצלנו אנחנו מפענחים את ה-token ישירות עם jwtDecode כי כל המידע כבר בתוכו!