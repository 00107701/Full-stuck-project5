import { useState } from 'react'
import CommentSection from './CommentSection'

// קומפוננטה שמציגה פוסט/מתכון אחד מתוך רשימת הפוסטים
// במצב רגיל מוצגים רק id וכותרת, ובמצב פתוח מוצג גם התוכן והתגובות
export default function PostItem({ post, currentUser, isSelected, onSelect, onEdit, onDelete }) {
  // האם הפוסט נמצא עכשיו במצב עריכה
  const [isEditing, setIsEditing] = useState(false)

  // שדות העריכה של הכותרת והתוכן
  const [editTitle, setEditTitle] = useState(post.title)
  const [editBody, setEditBody] = useState(post.body)

  // האם להציג את התגובות של הפוסט
  const [showComments, setShowComments] = useState(false)

  // שמירת השינויים אחרי עריכת פוסט
  async function handleSave() {
    await onEdit(post, editTitle, editBody)

    // אחרי השמירה יוצאים ממצב עריכה
    setIsEditing(false)
  }

  return (
    <li
      style={{
        // אם הפוסט נבחר, נותנים לו מסגרת מודגשת
        border: isSelected ? '2px solid #e67e22' : '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}
    >
      {/* שורת סקירה של הפוסט - לפי הדרישה מוצגים id וכותרת */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* מזהה הפוסט */}
        <span style={{ color: '#aaa', fontSize: 13, minWidth: 32 }}>
          #{post.id}
        </span>

        {/* כותרת הפוסט */}
        <span style={{ flex: 1, fontWeight: isSelected ? 500 : 400 }}>
          {post.title}
        </span>

        {/* פתיחה או סגירה של הפוסט */}
        <button onClick={() => onSelect(isSelected ? null : post)}>
          {isSelected ? 'Close' : 'View'}
        </button>

        {/* מעבר למצב עריכה וגם פתיחת הפוסט */}
        <button
          onClick={() => {
            setIsEditing(true)
            onSelect(post)
          }}
        >
          Edit
        </button>

        {/* מחיקת הפוסט */}
        <button
          onClick={() => onDelete(post.id)}
          style={{ color: '#c0392b' }}
        >
          Delete
        </button>
      </div>

      {/* תצוגה מורחבת של הפוסט כאשר הוא נבחר */}
      {isSelected && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          {/* אם נמצאים במצב עריכה, מציגים שדות לעריכת כותרת ותוכן */}
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* עריכת כותרת הפוסט */}
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #ddd',
                }}
              />

              {/* עריכת תוכן הפוסט */}
              <textarea
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                rows={4}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #ddd',
                }}
              />

              {/* כפתורי שמירה וביטול לעריכה */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSave}>
                  Save
                </button>

                <button onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // אם לא עורכים, מציגים את תוכן הפוסט
            <p style={{ margin: 0, color: '#555', lineHeight: 1.6 }}>
              {post.body}
            </p>
          )}

          {/* כפתור לפתיחה וסגירה של התגובות */}
          <button
            onClick={() => setShowComments(prev => !prev)}
            style={{ marginTop: 12, cursor: 'pointer' }}
          >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>

          {/* הצגת קומפוננטת התגובות רק אם המשתמש ביקש לראות אותן */}
          {showComments && (
            <CommentSection postId={post.id} currentUser={currentUser} />
          )}
        </div>
      )}
    </li>
  )
}