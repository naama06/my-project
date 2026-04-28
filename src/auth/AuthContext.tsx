import { createContext, useState, useEffect, type ReactNode } from "react"
import type { User, AdminUser } from "../types/user.types" // הוספתי AdminUser
import { getSession, removeSession, setSession } from "./auth.utils"
import { jwtDecode } from "jwt-decode"
import { getUserById } from "../services/user.service"

type AuthStateType = {
    user: User | null
    isInitialized: boolean
}

// 1. עדכון ה-Type של ה-Context - הוספנו את fetchUser
type AuthContextType = AuthStateType & {
    isAuthorized: boolean
    setUser: (user: User) => void
    fetchUser: () => Promise<void> // הגדרת הפונקציה החדשה
}

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
    children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [authState, setAuthState] = useState<AuthStateType>({
        user: null,
        isInitialized: false
    })

    const setUser = (user: User) => {
        setAuthState(prev => ({ ...prev, user }))
    }

   // בתוך AuthProvider.tsx
const fetchUser = async () => {
    const token = getSession();
    if (token) {
        setSession(token);
        try {
            const decoded: any = jwtDecode(token);
            
            // --- כאן זה נכנס ---
            console.log("Full Decoded Token:", decoded); 
            // נסינו userId, אם לא עובד נסי nameid (הסטנדרט של .NET)
            const userId = decoded.userId || decoded.nameid || decoded.sub; 
            
            console.log("Extracted User ID:", userId);
            // ---------------------

            if (!userId) {
                throw new Error("No user ID found in token");
            }

            const freshUserData: AdminUser = await getUserById(Number(userId));
            
            const userToSet: User = {
                userId: freshUserData.id.toString(),
                userName: freshUserData.userName,
                email: freshUserData.email,
                role: freshUserData.isAdmin ? "Admin" : "User"
            };

            setUser(userToSet);
        } catch (error) {
            console.error("Failed to fetch fresh user data", error);
            removeSession(); 
        }
    }
    setAuthState(prev => ({ ...prev, isInitialized: true }));
};

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            ...authState,
            setUser,
            fetchUser, // עכשיו TypeScript יקבל את זה
            isAuthorized: !!authState.user
        }}>
            {children}
        </AuthContext.Provider>
    )
}