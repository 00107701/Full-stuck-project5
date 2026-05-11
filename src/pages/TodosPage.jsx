import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTodosByUser, createTodo, updateTodo, deleteTodo } from '../services/api'
import Navbar from '../components/layout/Navbar'
import TodoList from '../components/todos/TodoList'
import TodoForm from '../components/todos/TodoForm'
import SearchBar from '../components/ui/SearchBar'
import SortSelect from '../components/ui/SortSelect'
import Modal from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

// אפשרויות המיון הזמינות לרשימת המשימות
const SORT_OPTIONS = [
  { value: 'id',        label: 'Sort by ID' },
  { value: 'title',     label: 'Sort by Title' },
  { value: 'completed', label: 'Sort by Status' },
]

// אפשרויות הסינון לפי סטטוס המשימה
const FILTER_OPTIONS = [
  { value: 'all',       label: 'All Tasks' },
  { value: 'completed', label: 'Completed' },
  { value: 'active',    label: 'Active' },
]

// דף ניהול רשימת המשימות והמצרכים של המשתמש המחובר
// כל הלוגיקה העסקית מרוכזת כאן והקומפוננטות הפנימיות רק מציגות
export default function TodosPage() {

  // שליפת המשתמש המחובר ופונקציית התנתקות מה-Context
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // רשימת המשימות שנטענו מהשרת
  const [todos,        setTodos]        = useState([])

  // האם כרגע מתבצעת טעינה ראשונית מהשרת
  const [loading,      setLoading]      = useState(true)

  // טקסט החיפוש שהמשתמש הקליד
  const [search,       setSearch]       = useState('')

  // קריטריון המיון הנוכחי של הרשימה
  const [sortBy,       setSortBy]       = useState('id')

  // סינון לפי סטטוס – כל המשימות, רק בוצעו, או רק פעילות
  const [statusFilter, setStatusFilter] = useState('all')

  // האם להציג את חלון פרטי המשתמש
  const [showInfo,     setShowInfo]     = useState(false)

  // טעינת המשימות מהשרת פעם אחת כשהדף עולה
  useEffect(() => {
    getTodosByUser(user.id)
      .then(setTodos)
      .finally(() => setLoading(false))
  }, [user.id])

  // הוספת משימה חדשה – שולחת לשרת ומוסיפה לרשימה המקומית
  async function handleAdd(title) {
    const created = await createTodo({ userId: user.id, title, completed: false })
    setTodos(prev => [...prev, created])
  }

  // החלפת סטטוס ביצוע של משימה – הופכת completed מ-true ל-false ולהיפך
  async function handleToggle(todo) {
    const updated = await updateTodo(todo.id, { ...todo, completed: !todo.completed })
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  // עדכון כותרת משימה קיימת – מחליפה רק את שדה הכותרת
  async function handleEdit(todo, newTitle) {
    const updated = await updateTodo(todo.id, { ...todo, title: newTitle })
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  // מחיקת משימה לפי מזהה – מסירה מהשרת ומהרשימה המקומית
  async function handleDelete(id) {
    await deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  // התנתקות המשתמש וניווט לדף הכניסה
  function handleLogout() { logout(); navigate('/login') }

  // חישוב הרשימה המוצגת – פילטור ומיון על גבי הנתונים המקוריים
  // זוהי derived value שמחושבת מחדש בכל רינדור ולא נשמרת ב-state
  const displayed = todos
    .filter(t => {
      const searchLower = search.toLowerCase()
      const statusText  = t.completed ? 'completed' : 'active'

      // בדיקה אם המשימה תואמת את טקסט החיפוש – לפי id, כותרת או סטטוס
      const matchesSearch =
        String(t.id).includes(search) ||
        t.title.toLowerCase().includes(searchLower) ||
        statusText.includes(searchLower)

      // בדיקה אם המשימה תואמת את פילטר הסטטוס הנבחר
      const matchesStatus =
        statusFilter === 'all'       ? true :
        statusFilter === 'completed' ? t.completed :
                                       !t.completed

      // המשימה תוצג רק אם היא עוברת את שני הפילטרים
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'title')     return a.title.localeCompare(b.title)
      if (sortBy === 'completed') return Number(b.completed) - Number(a.completed)
      return a.id - b.id
    })

  return (
    <div className="page-layout">
      <Navbar onLogout={handleLogout} onInfo={() => setShowInfo(true)} />

      <main className="page-main">
        <div className="page-header">
          <h2>My Shopping List</h2>
        </div>

        {/* טופס הוספת משימה חדשה */}
        <TodoForm onAdd={handleAdd} />

        {/* שורת פקדי חיפוש, מיון וסינון */}
        <div className="controls-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by id, title or status..."
          />

          {/* בחירת קריטריון מיון */}
          <SortSelect value={sortBy}       onChange={setSortBy}       options={SORT_OPTIONS} />

          {/* בחירת פילטר סטטוס */}
          <SortSelect value={statusFilter} onChange={setStatusFilter} options={FILTER_OPTIONS} />
        </div>

        {/* הצגת רשימת המשימות – מחכה לסיום הטעינה לפני הרינדור */}
        {loading
          ? <p>Loading...</p>
          : <TodoList
              todos={displayed}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        }
      </main>

      {/* חלון פרטי המשתמש – מוצג רק אם המשתמש לחץ על My Info */}
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