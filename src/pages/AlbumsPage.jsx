import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAlbumsByUser, createAlbum } from '../services/api'
import Navbar from '../components/layout/Navbar'
import AlbumList from '../components/albums/AlbumList'
import SearchBar from '../components/ui/SearchBar'
import Modal from '../components/ui/Modal'
import { useNavigate, useParams } from 'react-router-dom'

// דף האלבומים של המשתמש
// האלבום הנבחר מנוהל דרך ה-URL ולא דרך state – מאפשר שיתוף קישור לאלבום ספציפי
export default function AlbumsPage() {

  // שליפת המשתמש המחובר ופונקציית ההתנתקות מה-Context
  const { user, logout } = useAuth()

  // פונקציה למעבר בין דפים
  const navigate = useNavigate()

  // שליפת מזהה האלבום הנבחר מה-URL – קיים רק כשהנתיב הוא albums/:albumId
  const { albumId } = useParams()

  // רשימת האלבומים שנטענו מהשרת
  const [albums,   setAlbums]   = useState([])

  // האם כרגע מתבצעת טעינה מהשרת
  const [loading,  setLoading]  = useState(true)

  // טקסט החיפוש שהמשתמש הקליד
  const [search,   setSearch]   = useState('')

  // כותרת האלבום החדש שהמשתמש מקליד בטופס ההוספה
  const [newTitle, setNewTitle] = useState('')

  // האם להציג את חלון פרטי המשתמש
  const [showInfo, setShowInfo] = useState(false)

  // חישוב האלבום הנבחר מתוך הרשימה לפי המזהה שב-URL
  // ?? null מבטיח שהערך יהיה null ולא undefined אם האלבום לא נמצא
  const selectedAlbum = albumId
    ? albums.find(a => String(a.id) === albumId) ?? null
    : null

  // טעינת האלבומים מהשרת פעם אחת כשהדף עולה
  useEffect(() => {
    getAlbumsByUser(user.id)
      .then(setAlbums)
      .finally(() => setLoading(false))
  }, [user.id])

  // הוספת אלבום חדש – שולח לשרת ומוסיף לרשימה המקומית
  async function handleAddAlbum(e) {

    // מניעת רענון הדף
    e.preventDefault()

    // אם שדה הכותרת ריק לא שולחים כלום
    if (!newTitle.trim()) return

    const created = await createAlbum({ userId: user.id, title: newTitle.trim() })
    setAlbums(prev => [...prev, created])

    // ניקוי שדה הקלט אחרי הוספה מוצלחת
    setNewTitle('')
  }

  // בחירה או ביטול בחירה של אלבום דרך שינוי ה-URL
  // לחיצה על אלבום שכבר נבחר – מבטלת את הבחירה וחוזרת לנתיב הבסיסי
  // לחיצה על אלבום חדש – מוסיפה את המזהה שלו לנתיב
  function handleSelect(album) {
    if (selectedAlbum?.id === album.id) {
      navigate(`/users/${user.id}/albums`)
    } else {
      navigate(`/users/${user.id}/albums/${album.id}`)
    }
  }

  // התנתקות וניווט לדף הכניסה
  function handleLogout() { logout(); navigate('/login') }

  // חישוב האלבומים המוצגים לפי טקסט החיפוש – לפי כותרת או מזהה
  const displayed = albums.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    String(a.id).includes(search)
  )

  return (
    <div className="page-layout">
      <Navbar onLogout={handleLogout} onInfo={() => setShowInfo(true)} />

      <main className="page-main">
        <div className="page-header">
          <h2>My Recipe Photos</h2>
        </div>

        {/* טופס הוספת אלבום חדש */}
        <form onSubmit={handleAddAlbum} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="New album title..."
            style={{ flex: 1, maxWidth: 360 }}
          />
          <button type="submit" className="primary">Add Album</button>
        </form>

        {/* שורת חיפוש אלבומים */}
        <div className="controls-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search albums by id or title..." />
        </div>

        {/* רשימת האלבומים – מחכה לסיום הטעינה לפני הרינדור */}
        {loading
          ? <p>Loading...</p>
          : <AlbumList
              albums={displayed}
              currentUser={user}
              selectedAlbum={selectedAlbum}
              onSelect={handleSelect}
            />
        }
      </main>

      {/* חלון פרטי המשתמש – מוצג רק אם לחצו על פרטים אישיים */}
      {showInfo && (
        <Modal onClose={() => setShowInfo(false)}>
          <h2 style={{ marginBottom: 16 }}>My Info</h2>
          {[
            ['Name',     user.name],
            ['Username', user.username],
            ['Email',    user.email],
            ['Phone',    user.phone],
            ['City',     user.address?.city],
          ].map(([label, value]) => (
            <div key={label} className="modal-row">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </Modal>
      )}
    </div>
  )
}