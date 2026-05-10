import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * AuthProvider – wraps the app and exposes auth state + actions.
 * המשתמש נשמר ב-LocalStorage כנדרש בדרישות חלק ג:
 * "משתמש מורשה שביצע כניסה – יישמר במערכת (Local Storage = LS)"
 * וגם: "לחיצה על כפתור Logout תוציא את המשתמש (תמחק את המידע ב-LS)"
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('loggedUser')
    return stored ? JSON.parse(stored) : null
  })

  /** שמירת המשתמש ב-state וב-LocalStorage */
  function login(userData) {
    localStorage.setItem('loggedUser', JSON.stringify(userData))
    setUser(userData)
  }

  /** מחיקת המשתמש מה-state ומה-LocalStorage */
  function logout() {
    localStorage.removeItem('loggedUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Custom hook – גישה קצרה ל-AuthContext */
export function useAuth() {
  return useContext(AuthContext)
}