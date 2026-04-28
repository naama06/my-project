// auth.utils.ts
export const setSession = (token: string) => {
    localStorage.setItem('token', token);
};

export const getSession = () => {
    return localStorage.getItem('token');
};

export const removeSession = () => {
    localStorage.removeItem('token');
    // במקום redirect אלים, עדיף לתת ל-AuthContext לטפל בזה
    // אם בכל זאת חייב: window.location.href = '/login';
};