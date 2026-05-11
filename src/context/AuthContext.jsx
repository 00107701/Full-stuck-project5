import { createContext, useContext, useState } from 'react'

// יצירת ה-Context שיחזיק את פרטי המשתמש המחובר
const AuthContext = createContext(null)

// עוטף את כל האפליקציה ומספק את מצב המשתמש לכל הקומפוננטות
// המשתמש נשמר גם בזיכרון המקומי של הדפדפן כדי לשרוד רענון דף
export function AuthProvider({ children }) {

  // אתחול המשתמש מהזיכרון המקומי – אם היה מחובר בעבר הוא ישוחזר אוטומטית
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('loggedUser')
    return stored ? JSON.parse(stored) : null
  })

  // שמירת המשתמש לאחר כניסה מוצלחת – גם בזיכרון וגם בזיכרון המקומי
  function login(userData) {
    localStorage.setItem('loggedUser', JSON.stringify(userData))
    setUser(userData)
  }

  // מחיקת המשתמש בעת התנתקות – גם מהזיכרון וגם מהזיכרון המקומי
  function logout() {
    localStorage.removeItem('loggedUser')
    setUser(null)
  }

  // העמדת המשתמש ופונקציות הכניסה וההתנתקות לרשות כל הקומפוננטות
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// גישה קצרה למידע המשתמש מכל קומפוננטה
export function useAuth() {
  return useContext(AuthContext)
}