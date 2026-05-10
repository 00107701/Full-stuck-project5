import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTodosByUser, getPostsByUser, getAlbumsByUser } from '../services/api'
import Navbar from '../components/layout/Navbar'
import Modal from '../components/ui/Modal'

const HERO_IMG = 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80'

export default function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showInfo, setShowInfo] = useState(false)
  const [stats, setStats] = useState({ todos: 0, posts: 0, albums: 0, doneTodos: 0 })

  // Fetch counts for the stats cards
  useEffect(() => {
    if (!user) return
    Promise.all([
      getTodosByUser(user.id),
      getPostsByUser(user.id),
      getAlbumsByUser(user.id),
    ]).then(([todos, posts, albums]) => {
      setStats({
        todos:     todos.length,
        posts:     posts.length,
        albums:    albums.length,
        doneTodos: todos.filter(t => t.completed).length,
      })
    })
  }, [user])

  function handleLogout() { logout(); navigate('/login') }

  return (
    <div className="page-layout">
      <Navbar onLogout={handleLogout} onInfo={() => setShowInfo(true)} />

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>

        {/* ── Hero ── */}
        <div className="hero">
          <img src={HERO_IMG} alt="Recipes hero" className="hero-img" />
          <div className="hero-overlay">
            <p className="hero-sub">Welcome back</p>
            <h1 className="hero-title">{user?.name}'s Kitchen</h1>
            <p className="hero-desc">
              Your personal space to collect, share and cook amazing recipes
            </p>
            <button
              className="primary"
              style={{ marginTop: 20, padding: '10px 28px', fontSize: 14, alignSelf: 'flex-start' }}
              onClick={() => navigate(`/users/${user.id}/posts`)}
            >
              Browse Recipes →
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ padding: '2.5rem 2.5rem' }}>
          <h2 style={{ marginBottom: '0.4rem' }}>Your Kitchen at a glance</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1.8rem' }}>
            Here's what you've been cooking up
          </p>

          <div className="stats-grid">
            <div className="stat-card" onClick={() => navigate(`/users/${user.id}/posts`)}>
              <span className="stat-emoji">📖</span>
              <span className="stat-number">{stats.posts}</span>
              <span className="stat-label">Recipes</span>
            </div>
            <div className="stat-card" onClick={() => navigate(`/users/${user.id}/todos`)}>
              <span className="stat-emoji">✅</span>
              <span className="stat-number">{stats.doneTodos} / {stats.todos}</span>
              <span className="stat-label">Tasks Done</span>
            </div>
            <div className="stat-card" onClick={() => navigate(`/users/${user.id}/albums`)}>
              <span className="stat-emoji">📸</span>
              <span className="stat-number">{stats.albums}</span>
              <span className="stat-label">Photo Albums</span>
            </div>
          </div>

          {/* ── Quote ── */}
          <div className="kitchen-quote">
            <p>"Cooking is like love. It should be entered into with abandon or not at all."</p>
            <span>— Harriet Van Horne</span>
          </div>
        </div>

      </main>

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