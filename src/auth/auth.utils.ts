import axiosInstance from "../services/axios"

//שומרת את ה-token ב-localStorage וגם מוסיפה אותו לכל קריאת axios אוטומטית
export const setSession = (token: string) => {
    localStorage.setItem('token', token)
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
}

// קוראת את ה-token מה-localStorage ומחזירה אותו
export const getSession = () => {
    return localStorage.getItem('token')
}

// מסירה את ה-token מה-localStorage ומנקה את כותרת Authorization של axios
export const removeSession = () => {
    localStorage.removeItem('token')
    axiosInstance.defaults.headers.common.Authorization = ''
    window.location.href = '/login'
}