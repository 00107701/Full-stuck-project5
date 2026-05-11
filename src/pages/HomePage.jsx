import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTodosByUser, getPostsByUser, getAlbumsByUser } from '../services/api'
import Navbar from '../components/layout/Navbar'
import Modal from '../components/ui/Modal'

// תמונת הרקע של אזור הכותרת הראשית
const HERO_IMG = 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80'

// דף הבית של האפליקציה
export default function HomePage() {

  // שליפת המשתמש המחובר ופונקציית ההתנתקות מה-Context
  const { user, logout } = useAuth()

  // פונקציה למעבר בין דפים
  const navigate = useNavigate()

  // האם להציג את חלון פרטי המשתמש
  const [showInfo, setShowInfo] = useState(false)

  // סטטיסטיקות המשתמש – כמות משימות, פוסטים ואלבומים
  const [stats, setStats] = useState({ todos: 0, posts: 0, albums: 0, doneTodos: 0 })

  // טעינת הסטטיסטיקות בטעינת הדף
  useEffect(() => {

    // אם אין משתמש מחובר לא מבצעים טעינה
    if (!user) return

    // שליחת שלוש בקשות במקביל לחיסכון בזמן המתנה
    Promise.all([
      getTodosByUser(user.id),
      getPostsByUser(user.id),
      getAlbumsByUser(user.id),
    ]).then(([todos, posts, albums]) => {
      setStats({
        todos:     todos.length,
        posts:     posts.length,
        albums:    albums.length,

        // ספירת המשימות שסומנו כבוצעו בלבד
        doneTodos: todos.filter(t => t.completed).length,
      })
    })
  }, [user])

  // התנתקות וניווט לדף הכניסה
  function handleLogout() { logout(); navigate('/login') }

  return (
    <div className="page-layout">
      <Navbar onLogout={handleLogout} onInfo={() => setShowInfo(true)} />

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>

        {/* אזור הכותרת הראשית עם תמונת רקע וכפתור ניווט למתכונים */}
        <div className="hero">
          <img src={HERO_IMG} alt="Recipes hero" className="hero-img" />
          <div className="hero-overlay">
            <p className="hero-sub">Welcome back</p>

            {/* שם המשתמש המחובר בכותרת – ?. מגן מפני קריסה אם user עדיין null */}
            <h1 className="hero-title">{user?.name}'s Kitchen</h1>
            <p className="hero-desc">
              Your personal space to collect, share and cook amazing recipes
            </p>

            {/* כפתור מעבר ישיר לדף המתכונים */}
            <button
              className="primary"
              style={{ marginTop: 20, padding: '10px 28px', fontSize: 14, alignSelf: 'flex-start' }}
              onClick={() => navigate(`/users/${user.id}/posts`)}
            >
              Browse Recipes →
            </button>
          </div>
        </div>

        {/* אזור כרטיסי הסטטיסטיקות */}
        <div style={{ padding: '2.5rem 2.5rem' }}>
          <h2 style={{ marginBottom: '0.4rem' }}>Your Kitchen at a glance</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1.8rem' }}>
            Here's what you've been cooking up
          </p>

          {/* שלושה כרטיסי סטטיסטיקה – כל אחד גם כפתור ניווט לדף המתאים */}
          <div className="stats-grid">

            {/* כרטיס מספר המתכונים – לחיצה מנווטת לדף הפוסטים */}
            <div className="stat-card" onClick={() => navigate(`/users/${user.id}/posts`)}>
              <span className="stat-number">{stats.posts}</span>
              <span className="stat-label">Recipes</span>
            </div>

            {/* כרטיס המשימות – מציג כמה בוצעו מתוך הכלל */}
            <div className="stat-card" onClick={() => navigate(`/users/${user.id}/todos`)}>
              <span className="stat-number">{stats.doneTodos} / {stats.todos}</span>
              <span className="stat-label">Tasks Done</span>
            </div>

            {/* כרטיס מספר האלבומים – לחיצה מנווטת לדף האלבומים */}
            <div className="stat-card" onClick={() => navigate(`/users/${user.id}/albums`)}>
              <span className="stat-number">{stats.albums}</span>
              <span className="stat-label">Photo Albums</span>
            </div>
          </div>

          {/* ציטוט השראה בתחתית הדף */}
          <div className="kitchen-quote">
            <p>"Cooking is like love. It should be entered into with abandon or not at all."</p>
            <span>— Harriet Van Horne</span>
          </div>
        </div>

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