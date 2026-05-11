import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createUser } from '../services/api'

// דף הרשמה שני – השלמת פרטים אישיים אחרי בחירת שם משתמש וסיסמה
// משלים את פרטי המשתמש האישיים ויוצר את החשבון בשרת
export default function RegisterDetails() {

  // שליפת הנתונים שהועברו מהדף הקודם
  const { state } = useLocation()

  // פונקציה למעבר בין דפים
  const navigate = useNavigate()

  // פונקציית login מה-Context לצורך כניסה אוטומטית אחרי הרשמה
  const { login } = useAuth()

  // שדות הפרטים האישיים שהמשתמש ימלא בשלב זה
  const [form, setForm]   = useState({ name: '', email: '', phone: '', city: '' })

  // הודעת שגיאה במקרה של כשל ביצירת המשתמש
  const [error, setError] = useState('')

  // הגנה – אם המשתמש הגיע לדף הזה ישירות בלי לעבור משלב א
  // מחזירים אותו לתחילת תהליך ההרשמה
  if (!state?.username) { navigate('/register'); return null }

  // עדכון שדה בודד באובייקט הטופס בלי לדרוס את שאר השדות
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // יצירת המשתמש בשרת וכניסה אוטומטית אחרי הצלחה
  async function handleSubmit(e) {

    // מניעת רענון הדף
    e.preventDefault()

    // איפוס הודעת שגיאה קודמת
    setError('')

    try {
      // יצירת המשתמש בשרת עם שילוב הנתונים משני השלבים
      // הסיסמה נשמרת בשדה website כי json-server לא מיועד לאימות אמיתי
      const created = await createUser({
        username: state.username,
        website:  state.password,
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        address:  { city: form.city },
      })

      // כניסה אוטומטית – שומר את המשתמש ב-Context וב-LocalStorage
      login(created)

      // ניווט לדף הבית אחרי הרשמה וכניסה מוצלחות
      navigate('/home')
    } catch {
      setError('Registration failed. Please try again.')
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
          <h2>Complete your profile</h2>
        </div>

        {/* הטופס בנוי מתוך מערך של הגדרות שדות */}
        <form onSubmit={handleSubmit}>
          {[
            { name: 'name',  label: 'Full Name', type: 'text',  placeholder: 'Your full name' },
            { name: 'email', label: 'Email',     type: 'email', placeholder: 'your@email.com' },
            { name: 'phone', label: 'Phone',     type: 'text',  placeholder: '050-0000000' },
            { name: 'city',  label: 'City',      type: 'text',  placeholder: 'Your city' },
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

          {/* הודעת שגיאה – מוצגת רק אם יצירת המשתמש נכשלה */}
          {error && <p className="error-msg">{error}</p>}

          {/* השלמת ההרשמה ויצירת החשבון */}
          <button type="submit" className="auth-submit">
            Join RecipeHub →
          </button>
        </form>

      </div>
    </div>
  )
}