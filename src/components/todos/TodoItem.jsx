import { useState } from 'react'

// קומפוננטה שמציגה שורה אחת ברשימת המשימות
// תומכת בעריכה inline – לחיצה על Edit מחליפה את הטקסט לשדה קלט
// שמירה קוראת ל-onEdit, ביטול משחזר את הכותרת המקורית
export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {

  // האם המשימה נמצאת כרגע במצב עריכה
  const [isEditing, setIsEditing] = useState(false)

  // הטקסט הנוכחי בשדה העריכה – מאותחל עם הכותרת הקיימת של המשימה
  const [editValue, setEditValue] = useState(todo.title)

  // שמירת השינוי – שולחת את הכותרת החדשה לדף האב ויוצאת ממצב עריכה
  async function handleSave() {

    // אם השדה ריק לא שומרים
    if (!editValue.trim()) return

    // קוראת לפונקציה מהדף האב עם המשימה המלאה והכותרת החדשה
    await onEdit(todo, editValue.trim())

    // יציאה ממצב עריכה אחרי שמירה מוצלחת
    setIsEditing(false)
  }

  // ביטול עריכה – משחזר את הטקסט המקורי ויוצא ממצב עריכה
  function handleCancel() {

    // מחזירים את שדה העריכה לכותרת המקורית לפני השינוי
    setEditValue(todo.title)
    setIsEditing(false)
  }

  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid #f0f0f0',
    }}>

      {/* תג מזהה של המשימה */}
      <span style={{ minWidth: 32, color: '#aaa', fontSize: 13 }}>#{todo.id}</span>

      {/* צ'קבוקס לסימון המשימה כבוצעה או לביטול הסימון */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />

      {/* אם במצב עריכה מציגים שדה קלט, אחרת מציגים את הכותרת */}
      {isEditing ? (
        <>
          {/* שדה עריכת הכותרת */}
          <input
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd' }}
          />

          {/* שמירת השינויים ושליחה לשרת */}
          <button onClick={handleSave}>Save</button>

          {/* ביטול העריכה וחזרה לכותרת המקורית */}
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          {/* כותרת המשימה – עם קו חוצה ואפור אם המשימה בוצעה */}
          <span style={{
            flex: 1,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#aaa' : 'inherit',
          }}>
            {todo.title}
          </span>

          {/* כניסה למצב עריכה */}
          <button onClick={() => setIsEditing(true)}>Edit</button>

          {/* מחיקת המשימה לצמיתות */}
          <button onClick={() => onDelete(todo.id)} style={{ color: '#c0392b' }}>Delete</button>
        </>
      )}
    </li>
  )
}