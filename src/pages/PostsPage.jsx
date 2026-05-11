import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPosts, getPostsByUser, createPost, updatePost, deletePost } from '../services/api'
import Navbar from '../components/layout/Navbar'
import PostList from '../components/posts/PostList'
import PostForm from '../components/posts/PostForm'
import SearchBar from '../components/ui/SearchBar'
import Modal from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

export default function PostsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [posts,        setPosts]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [showInfo,     setShowInfo]     = useState(false)
  const [showAll,      setShowAll]      = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchPosts = showAll ? getPosts() : getPostsByUser(user.id)
    fetchPosts
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [user.id, showAll])

  async function handleAdd(title, body) {
    const created = await createPost({ userId: user.id, title, body })
    setPosts(prev => [...prev, created])
  }

  async function handleEdit(post, title, body) {
    const updated = await updatePost(post.id, { ...post, title, body })
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))
    if (selectedPost?.id === updated.id) setSelectedPost(updated)
  }

  async function handleDelete(id) {
    await deletePost(id)
    setPosts(prev => prev.filter(p => p.id !== id))
    if (selectedPost?.id === id) setSelectedPost(null)
  }

  function handleLogout() { logout(); navigate('/login') }

  const displayed = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  )

  return (
    <div className="page-layout">
      <Navbar onLogout={handleLogout} onInfo={() => setShowInfo(true)} />

      <main className="page-main">
        <div className="page-header">
          <h2>📖 My Recipes</h2>
          <p>Share and discover delicious recipes</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setShowAll(false)}
            className={!showAll ? 'primary' : ''}
          >
            My Posts
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={showAll ? 'primary' : ''}
          >
            All Posts
          </button>
        </div>

        {!showAll && <PostForm onAdd={handleAdd} />}

        <div className="controls-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search recipes by id or title..." />
        </div>

        {loading
          ? <p>Loading...</p>
          : <PostList
              posts={displayed}
              currentUser={user}
              selectedPost={selectedPost}
              onSelect={setSelectedPost}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showAll={showAll}
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