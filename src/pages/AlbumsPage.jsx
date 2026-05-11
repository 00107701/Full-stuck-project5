import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAlbumsByUser, createAlbum } from '../services/api'
import Navbar from '../components/layout/Navbar'
import AlbumList from '../components/albums/AlbumList'
import SearchBar from '../components/ui/SearchBar'
import Modal from '../components/ui/Modal'
import { useNavigate, useParams } from 'react-router-dom'

export default function AlbumsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { albumId } = useParams()

  const [albums,   setAlbums]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  const selectedAlbum = albumId
    ? albums.find(a => String(a.id) === albumId) ?? null
    : null

  useEffect(() => {
    getAlbumsByUser(user.id)
      .then(setAlbums)
      .finally(() => setLoading(false))
  }, [user.id])

  async function handleAddAlbum(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    const created = await createAlbum({ userId: user.id, title: newTitle.trim() })
    setAlbums(prev => [...prev, created])
    setNewTitle('')
  }

  function handleSelect(album) {
    if (selectedAlbum?.id === album.id) {
      navigate(`/users/${user.id}/albums`)
    } else {
      navigate(`/users/${user.id}/albums/${album.id}`)
    }
  }

  function handleLogout() { logout(); navigate('/login') }

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

        <form onSubmit={handleAddAlbum} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="New album title..."
            style={{ flex: 1, maxWidth: 360 }}
          />
          <button type="submit" className="primary">Add Album</button>
        </form>

        <div className="controls-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search albums by id or title..." />
        </div>

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