import { useState, useEffect } from 'react'
import { getCommentsByPost, createComment, updateComment, deleteComment } from '../../services/api'

// קומפוננטה שמציגה ומנהלת את התגובות של פוסט מסוים
// מקבלת את מזהה הפוסט ואת המשתמש המחובר כ-props
export default function CommentSection({ postId, currentUser }) {

  // רשימת התגובות שנטענו מהשרת
  const [comments, setComments] = useState([])

  // האם כרגע מתבצעת טעינה מהשרת
  const [loading, setLoading] = useState(true)

  // תוכן התגובה החדשה שהמשתמש כותב
  const [newComment, setNewComment] = useState('')

  // מזהה התגובה שנמצאת כרגע במצב עריכה (null = אף תגובה לא בעריכה)
  const [editingId, setEditingId] = useState(null)

  // הטקסט הנוכחי בשדה העריכה של תגובה קיימת
  const [editValue, setEditValue] = useState('')

  // טעינת התגובות מהשרת בכל פעם שמשתנה הפוסט המוצג
  useEffect(() => {
    getCommentsByPost(postId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [postId])

  // הוספת תגובה חדשה לפוסט
  async function handleAdd() {

    // אם השדה ריק לא שולחים כלום
    if (!newComment.trim()) return

    // שולחים את התגובה לשרת עם פרטי המשתמש המחובר לזיהוי הבעלות
    const created = await createComment({
      postId,
      name:   currentUser.name,
      email:  currentUser.email,
      body:   newComment.trim(),
      userId: currentUser.id,  // שומר מי כתב את התגובה לצורך בדיקת בעלות בהמשך
    })

    // מוסיפים את התגובה החדשה לסוף הרשימה הקיימת
    setComments(prev => [...prev, created])

    // מנקים את שדה הקלט אחרי השליחה
    setNewComment('')
  }

  // שמירת עריכה של תגובה קיימת
  async function handleEdit(comment) {

    // שולחים את התגובה המעודכנת לשרת עם כל השדות הקיימים ורק body מוחלף
    const updated = await updateComment(comment.id, { ...comment, body: editValue })

    // מחליפים ברשימה רק את התגובה שעודכנה, כל השאר נשארות
    setComments(prev => prev.map(c => c.id === updated.id ? updated : c))

    // יוצאים ממצב עריכה
    setEditingId(null)
  }

  // מחיקת תגובה לפי מזהה
  async function handleDelete(id) {

    // מחיקה בשרת
    await deleteComment(id)

    // מסירים את התגובה שנמחקה מהרשימה המקומית
    setComments(prev => prev.filter(c => c.id !== id))
  }

  // בודקת האם תגובה מסוימת שייכת למשתמש המחובר
  // משמשת להחלטה אם להציג כפתורי עריכה ומחיקה
  const isOwner = (comment) => comment.userId === currentUser.id

  // כל עוד הנתונים טוענים מהשרת מציגים הודעת המתנה
  if (loading) return <p>Loading comments...</p>

  return (
    <div style={{ marginTop: 12 }}>

      {/* כותרת עם מספר התגובות הכולל */}
      <h4 style={{ marginBottom: 8 }}>Comments ({comments.length})</h4>

      {/* מעבר על כל התגובות והצגת כל אחת בנפרד */}
      {comments.map(comment => (
        <div key={comment.id} style={{
          background: '#f9f9f9',
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 8,
        }}>

          {/* שם כותב התגובה */}
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{comment.name}</p>

          {/* אם התגובה הזו נמצאת במצב עריכה – מציגים שדה טקסט במקום הטקסט */}
          {editingId === comment.id ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>

              {/* שדה עריכת תוכן התגובה */}
              <input
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd' }}
              />

              {/* שמירת השינויים ושליחה לשרת */}
              <button onClick={() => handleEdit(comment)}>Save</button>

              {/* ביטול העריכה וחזרה לתצוגה רגילה */}
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            // תצוגה רגילה של תוכן התגובה כשלא עורכים
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#555' }}>{comment.body}</p>
          )}

          {/* כפתורי עריכה ומחיקה – מוצגים רק אם המשתמש המחובר הוא בעל התגובה
              וגם רק כשהתגובה לא נמצאת כבר במצב עריכה */}
          {isOwner(comment) && editingId !== comment.id && (
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>

              {/* כניסה למצב עריכה – שומר את מזהה התגובה ואת הטקסט הנוכחי שלה */}
              <button onClick={() => { setEditingId(comment.id); setEditValue(comment.body) }}>
                Edit
              </button>

              {/* מחיקת התגובה לצמיתות */}
              <button onClick={() => handleDelete(comment.id)} style={{ color: '#c0392b' }}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* אזור הוספת תגובה חדשה – זמין לכל משתמש מחובר */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd' }}
        />

        {/* שליחת התגובה החדשה */}
        <button onClick={handleAdd}>Post</button>
      </div>
    </div>
  )
}