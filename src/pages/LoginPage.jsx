import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUsers } from '../services/api'

// דף הכניסה לאפליקציה
// המשתמש מזין שם משתמש וסיסמה, והקוד מחפש התאמה ברשימת המשתמשים בשרת
export default function LoginPage() {

  // שדה שם המשתמש
  const [username, setUsername] = useState('')

  // שדה הסיסמה
  const [password, setPassword] = useState('')

  // הודעת שגיאה במקרה של כישלון בכניסה
  const [error, setError] = useState('')

  // פונקציית הכניסה מה-Context – שומרת את המשתמש ב-state וב-LocalStorage
  const { login } = useAuth()

  // פונקציה למעבר בין דפים
  const navigate = useNavigate()

  // טיפול בשליחת טופס הכניסה
  async function handleSubmit(e) {

    // מניעת רענון הדף
    e.preventDefault()

    // איפוס הודעת שגיאה קודמת
    setError('')

    try {
      // שליפת כל המשתמשים מהשרת לצורך בדיקת ההתאמה בצד הלקוח
      const users = await getUsers()

      // חיפוש משתמש שתואם את שם המשתמש והסיסמה שהוזנו
      // הסיסמה מאוחסנת בשדה website ב-db.json
      const match = users.find(u => u.username === username && u.website === password)

      // אם לא נמצאה התאמה – מציגים שגיאה ולא ממשיכים
      if (!match) { setError('Invalid username or password.'); return }

      // שמירת המשתמש ב-Context וב-LocalStorage וניווט לדף הבית
      login(match)
      navigate('/home')
    } catch {
      setError('Server error. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-logo">
          <h1>🍳 RecipeHub</h1>
          <p>Your personal recipe collection</p>
        </div>

        <div className="auth-divider">
          <h2>Sign in to your kitchen</h2>
        </div>

        <form onSubmit={handleSubmit}>

          {/* שדה שם המשתמש */}
          <div className="form-group">
            <label>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* שדה הסיסמה */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* הודעת שגיאה – מוצגת רק אם יש שגיאה */}
          {error && <p className="error-msg">{error}</p>}

          {/* כפתור שליחת הטופס */}
          <button type="submit" className="auth-submit">
            Login →
          </button>
        </form>

        {/* קישור לדף ההרשמה למי שאין לו חשבון */}
        <p className="auth-footer">
          No account? <Link to="/register">Register here</Link>
        </p>

      </div>
    </div>
  )
}