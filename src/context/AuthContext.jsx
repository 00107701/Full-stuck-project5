import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * AuthProvider – wraps the app and exposes auth state + actions.
 * Reads from localStorage on first render so the user stays logged in
 * after a page refresh (this is the Cache / persistence challenge).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // On mount, restore user from localStorage if it exists
    const stored = localStorage.getItem('loggedUser')
    return stored ? JSON.parse(stored) : null
  })

  /** Save user to state AND localStorage */
  function login(userData) {
    localStorage.setItem('loggedUser', JSON.stringify(userData))
    setUser(userData)
  }

  /** Remove user from state AND localStorage */
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

/** Custom hook – shorthand for useContext(AuthContext) */
export function useAuth() {
  return useContext(AuthContext)
}
