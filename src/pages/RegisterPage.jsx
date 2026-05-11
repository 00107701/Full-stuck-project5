import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getUsers } from '../services/api'

// דף הרשמה ראשוןם
// המשתמש בוחר שם משתמש וסיסמה
export default function RegisterPage() {

  // אובייקט הטופס עם שלושת השדות – שם משתמש, סיסמה, ואימות סיסמה
  const [form, setForm]   = useState({ username: '', password: '', passwordVerify: '' })

  // הודעת שגיאה למקרה שהולידציה נכשלת
  const [error, setError] = useState('')

  const navigate = useNavigate()

  // עדכון שדה בודד באובייקט הטופס בלי לדרוס את שאר השדות
  // [e.target.name] הוא computed property – לוקח את שם השדה מהאלמנט שהשתנה
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // טיפול בשליחת הטופס – בדיקות לפני פנייה לשרת
  async function handleSubmit(e) {

    // מניעת רענון הדף
    e.preventDefault()

    // איפוס הודעת שגיאה קודמת
    setError('')

    // בדיקה שהסיסמאות תואמות לפני פנייה לשרת
    if (form.password !== form.passwordVerify) { setError('Passwords do not match.'); return }

    try {
      // שליפת כל המשתמשים מהשרת כדי לבדוק אם שם המשתמש כבר תפוס
      const users = await getUsers()

      // אם קיים משתמש עם אותו שם – מציגים שגיאה ולא ממשיכים
      if (users.some(u => u.username === form.username)) { setError('Username already exists.'); return }
      // אם עברנו את כל הבדיקות בהצלחה – ממשיכים לשלב הבא עם פרטי הטופס
      navigate('/register/details', { state: { username: form.username, password: form.password } })
    } catch {
      setError('Server error. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-logo">
          <h1>RecipeHub</h1>
          <p>Your personal recipe collection</p>
        </div>

        <div className="auth-divider">
          <h2>Create your account</h2>
        </div>

        {/* הטופס בנוי מתוך מערך של הגדרות שדות */}
        <form onSubmit={handleSubmit}>
          {[
            { name: 'username',       label: 'Username',         type: 'text',     placeholder: 'Choose a username' },
            { name: 'password',       label: 'Password',         type: 'password', placeholder: 'Choose a password' },
            { name: 'passwordVerify', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
          ].map(f => (
            <div className="form-group" key={f.name}>
              <label>{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}

          {/* הודעת שגיאה – מוצגת רק אם יש שגיאה */}
          {error && <p className="error-msg">{error}</p>}

          {/* מעבר לשלב ב' */}
          <button type="submit" className="auth-submit">
            Next →
          </button>
        </form>

        {/* קישור לדף ההתחברות למי שכבר רשום */}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  )
}