
import { useState, useEffect } from 'react'
import {
  getPhotosByAlbumPage,
  createPhoto,
  deletePhoto,
  updatePhoto,
} from '../../services/api'
import PhotoItem from './PhotoItem'

// כמה תמונות נביא בכל פעם מהשרת
const PAGE_SIZE = 5


export default function PhotoGallery({ albumId, currentUser }) {
  // כל התמונות שכבר נטענו עד עכשיו
  const [photos, setPhotos] = useState([])

  // האם כרגע מתבצעת טעינה מהשרת
  const [loading, setLoading] = useState(false)

  // מספר העמוד הנוכחי שאנחנו מביאים מהשרת
  const [page, setPage] = useState(1)

  // האם יש עוד תמונות שאפשר להביא
  const [hasMore, setHasMore] = useState(true)

  // שדות של הוספת תמונה חדשה
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')

  // בכל פעם שמחליפים אלבום – מאפסים את הגלריה ומתחילים מחדש
  useEffect(() => {
    setPhotos([])
    setPage(1)
    setHasMore(true)
  }, [albumId])

  // בכל שינוי של albumId או page נביא רק קבוצה אחת של תמונות
  useEffect(() => {
    async function loadPhotos() {
      setLoading(true)

      try {
        // כאן מתבצעת הטעינה בשלבים מהשרת ולא כל התמונות ביחד
        const batch = await getPhotosByAlbumPage(albumId, page, PAGE_SIZE)

        // אם זה עמוד ראשון נחליף את הרשימה, אחרת נוסיף להמשך
        setPhotos(prev => (page === 1 ? batch : [...prev, ...batch]))

        // אם קיבלנו פחות מ־P AGE_SIZE סימן שאין עוד תמונות להמשך
        setHasMore(batch.length === PAGE_SIZE)
      } catch (error) {
        console.error('Failed to load photos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [albumId, page])

  // הוספת תמונה חדשה לאלבום
  async function handleAdd() {
    if (!newUrl.trim() || !newTitle.trim()) return

    const created = await createPhoto({
      albumId,
      title: newTitle.trim(),
      url: newUrl.trim(),
      thumbnailUrl: newUrl.trim(),
    })

    // מוסיפים את התמונה החדשה לרשימה שכבר מוצגת
    setPhotos(prev => [...prev, created])

    // ניקוי השדות אחרי ההוספה
    setNewUrl('')
    setNewTitle('')
  }

  // מחיקת תמונה
  async function handleDelete(id) {
    await deletePhoto(id)

    // מורידים את התמונה שנמחקה מהמסך
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  // עדכון תמונה קיימת
  async function handleUpdate(photo, newTitle, newUrl) {
    const updated = await updatePhoto(photo.id, {
      ...photo,
      title: newTitle,
      url: newUrl,
      thumbnailUrl: newUrl,
    })

    // מעדכנים ברשימה רק את התמונה ששונתה
    setPhotos(prev =>
      prev.map(p => (p.id === updated.id ? updated : p))
    )
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* טופס הוספת תמונה חדשה */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Photo title..."
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #ddd',
            flex: 1,
            minWidth: 150,
          }}
        />

        <input
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="Image URL..."
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #ddd',
            flex: 2,
            minWidth: 200,
          }}
        />

        <button onClick={handleAdd} style={{ padding: '6px 14px', cursor: 'pointer' }}>
          Add Photo
        </button>
      </div>

      {/* הצגת התמונות שכבר נטענו */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
        }}
      >
        {photos.map(photo => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {/* הודעה אם אין תמונות בכלל */}
      {!loading && photos.length === 0 && <p>No photos in this album yet.</p>}

      {/* הודעת טעינה */}
      {loading && <p>Loading photos...</p>}

      {/* כפתור שמביא את הקבוצה הבאה של התמונות */}
      {!loading && hasMore && photos.length > 0 && (
        <button
          onClick={() => setPage(prev => prev + 1)}
          style={{ marginTop: 16, padding: '8px 20px', cursor: 'pointer' }}
        >
          Load More
        </button>
      )}
    </div>
  )
}