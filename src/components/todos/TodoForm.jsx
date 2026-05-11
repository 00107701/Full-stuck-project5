import { useState } from 'react'

// קומפוננטה שמציגה טופס להוספת משימה או מצרך חדש לרשימה
// מקבלת כ-prop את הפונקציה שתופעל כשהמשתמש שולח את הטופס
export default function TodoForm({ onAdd }) {

  // שדה הטקסט של המשימה החדשה
  const [title, setTitle] = useState('')

  // מטפלת בשליחת הטופס
  async function handleSubmit(e) {

    // מונעת רענון של הדף שהדפדפן עושה כברירת מחדל בשליחת טופס
    e.preventDefault()

    // אם השדה ריק לא שולחים כלום
    if (!title.trim()) return

    // קוראת לפונקציה שהועברה מהדף האב עם כותרת המשימה
    await onAdd(title.trim())

    // מנקה את השדה אחרי הוספה מוצלחת
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>

      {/* שדה קלט לכותרת המשימה החדשה – תופס את כל הרוחב הפנוי */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add ingredient or task..."
        style={{ flex: 1 }}
      />

      {/* כפתור שליחת הטופס */}
      <button type="submit" className="primary">Add</button>
    </form>
  )
}