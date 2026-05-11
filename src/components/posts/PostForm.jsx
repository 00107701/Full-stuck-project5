import { useState } from 'react'

// קומפוננטה שמציגה טופס להוספת פוסט/מתכון חדש
// מקבלת כ-prop את הפונקציה שתופעל כשהמשתמש שולח את הטופס
export default function PostForm({ onAdd }) {

  // שדה הכותרת של המתכון
  const [title, setTitle] = useState('')

  // שדה תוכן המתכון (מצרכים והוראות הכנה)
  const [body,  setBody]  = useState('')

  // מטפלת בשליחת הטופס
  async function handleSubmit(e) {

    // מונעת רענון של הדף שהדפדפן עושה כברירת מחדל בשליחת טופס
    e.preventDefault()

    // אם אחד השדות ריק לא שולחים כלום
    if (!title.trim() || !body.trim()) return

    // קוראת לפונקציה שהועברה מהדף האב עם הכותרת והתוכן
    await onAdd(title.trim(), body.trim())

    // מנקה את שני השדות אחרי הוספה מוצלחת
    setTitle('')
    setBody('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>

      {/* שדה קלט לכותרת המתכון */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Recipe title..."
      />

      {/* אזור טקסט לתוכן המתכון – ניתן לשינוי גובה ידני על ידי המשתמש */}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Ingredients and instructions..."
        rows={4}
        style={{ resize: 'vertical' }}
      />

      {/* כפתור שליחת הטופס */}
      <button type="submit" className="primary" style={{ alignSelf: 'flex-start', padding: '8px 20px' }}>
        Add Recipe
      </button>
    </form>
  )
}