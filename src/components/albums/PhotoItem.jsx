import { useState } from 'react'

// קומפוננטה שמציגה תמונה בודדת מתוך האלבום
// מאפשרת לערוך ולמחוק תמונה
export default function PhotoItem({ photo, onDelete, onUpdate }) {

  // שומר האם כרגע נמצאים במצב עריכה
  const [isEditing, setIsEditing] = useState(false)

  // שדות העריכה של הכותרת והקישור
  const [editTitle, setEditTitle] = useState(photo.title)
  const [editUrl, setEditUrl] = useState(photo.url)

  // שמירת השינויים של התמונה
  async function handleSave() {
    await onUpdate(photo, editTitle, editUrl)

    // יציאה ממצב עריכה אחרי השמירה
    setIsEditing(false)
  }

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* הצגת התמונה */}
      <img
        src={photo.thumbnailUrl}
        alt={photo.title}
        style={{
          width: '100%',
          height: 100,
          objectFit: 'cover',
        }}

        // אם התמונה לא נטענת – מציגים תמונת ברירת מחדל
        onError={e => {
          e.target.src = 'https://via.placeholder.com/150'
        }}
      />

      <div style={{ padding: 8 }}>

        {/* אם נמצאים במצב עריכה */}
        {isEditing ? (
          <>
            {/* שדה עריכת כותרת */}
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              style={{
                width: '100%',
                marginBottom: 4,
                padding: '4px 6px',
                borderRadius: 4,
                border: '1px solid #ddd',
                fontSize: 12,
              }}
            />

            {/* שדה עריכת כתובת תמונה */}
            <input
              value={editUrl}
              onChange={e => setEditUrl(e.target.value)}
              style={{
                width: '100%',
                marginBottom: 4,
                padding: '4px 6px',
                borderRadius: 4,
                border: '1px solid #ddd',
                fontSize: 12,
              }}
            />

            {/* כפתורי שמירה וביטול */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={handleSave}
                style={{ fontSize: 12, padding: '2px 8px' }}
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                style={{ fontSize: 12, padding: '2px 8px' }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* הצגת כותרת התמונה */}
            <p
              style={{
                margin: '0 0 6px',
                fontSize: 12,
                color: '#555',
                lineHeight: 1.4,
              }}
            >
              {photo.title}
            </p>

            {/* כפתורי עריכה ומחיקה */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{ fontSize: 12, padding: '2px 8px' }}
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(photo.id)}
                style={{
                  fontSize: 12,
                  padding: '2px 8px',
                  color: '#c0392b',
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}