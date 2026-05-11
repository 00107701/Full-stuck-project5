import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPosts, getPostsByUser, createPost, updatePost, deletePost } from '../services/api'
import Navbar from '../components/layout/Navbar'
import PostList from '../components/posts/PostList'
import PostForm from '../components/posts/PostForm'
import SearchBar from '../components/ui/SearchBar'
import Modal from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

// דף הפוסטים והמתכונים
// תומך בשני מצבים: הצגת הפוסטים של המשתמש בלבד, או הצגת כל הפוסטים של כולם
export default function PostsPage() {

  // שליפת המשתמש המחובר ופונקציית ההתנתקות מה-Context
  const { user, logout } = useAuth()

  // פונקציה למעבר בין דפים
  const navigate = useNavigate()

  // רשימת הפוסטים שנטענו מהשרת
  const [posts,        setPosts]        = useState([])

  // האם כרגע מתבצעת טעינה מהשרת
  const [loading,      setLoading]      = useState(true)

  // טקסט החיפוש שהמשתמש הקליד
  const [search,       setSearch]       = useState('')

  // הפוסט שנבחר כרגע להצגה מורחבת – null אם אף פוסט לא נבחר
  const [selectedPost, setSelectedPost] = useState(null)

  // האם להציג את חלון פרטי המשתמש
  const [showInfo,     setShowInfo]     = useState(false)

  // האם להציג את כל הפוסטים של כולם או רק של המשתמש המחובר
  const [showAll,      setShowAll]      = useState(false)

  // טעינת הפוסטים מחדש בכל פעם שמשתנה המשתמש או מצב התצוגה
  useEffect(() => {
    setLoading(true)

    // בחירת הפונקציה המתאימה לפי מצב התצוגה הנוכחי
    const fetchPosts = showAll ? getPosts() : getPostsByUser(user.id)
    fetchPosts
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [user.id, showAll])

  // הוספת פוסט חדש – שולח לשרת ומוסיף לרשימה המקומית
  async function handleAdd(title, body) {
    const created = await createPost({ userId: user.id, title, body })
    setPosts(prev => [...prev, created])
  }

  // עדכון פוסט קיים – מחליף ברשימה ומעדכן גם את הפוסט הנבחר אם צריך
  async function handleEdit(post, title, body) {
    const updated = await updatePost(post.id, { ...post, title, body })
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))

    // אם הפוסט שעודכן הוא הנבחר כרגע – מעדכנים גם אותו
    if (selectedPost?.id === updated.id) setSelectedPost(updated)
  }

  // מחיקת פוסט – מסיר מהשרת ומהרשימה ומבטל בחירה אם צריך
  async function handleDelete(id) {
    await deletePost(id)
    setPosts(prev => prev.filter(p => p.id !== id))

    // אם הפוסט שנמחק הוא הנבחר – מבטלים את הבחירה
    if (selectedPost?.id === id) setSelectedPost(null)
  }

  // התנתקות וניווט לדף הכניסה
  function handleLogout() { logout(); navigate('/login') }

  // חישוב הפוסטים המוצגים לפי טקסט החיפוש – לפי כותרת או מזהה
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

        {/* כפתורי החלפה בין מצב הצגת הפוסטים של המשתמש לכל הפוסטים */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>

          {/* כפתור הצגת הפוסטים של המשתמש בלבד */}
          <button
            onClick={() => setShowAll(false)}
            className={!showAll ? 'primary' : ''}
          >
            My Posts
          </button>

          {/* כפתור הצגת כל הפוסטים של כולם */}
          <button
            onClick={() => setShowAll(true)}
            className={showAll ? 'primary' : ''}
          >
            All Posts
          </button>
        </div>

        {/* טופס הוספת פוסט חדש – מוסתר במצב הצגת כל הפוסטים */}
        {!showAll && <PostForm onAdd={handleAdd} />}

        {/* שורת חיפוש */}
        <div className="controls-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search recipes by id or title..." />
        </div>

        {/* רשימת הפוסטים – מחכה לסיום הטעינה לפני הרינדור */}
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