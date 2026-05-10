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

const SORT_OPTIONS = [
  { value: 'id',        label: 'Sort by ID' },
  { value: 'title',     label: 'Sort by Title' },
  { value: 'completed', label: 'Sort by Status' },
]

const FILTER_OPTIONS = [
  { value: 'all',       label: 'All Tasks' },
  { value: 'completed', label: 'Completed' },
  { value: 'active',    label: 'Active' },
]

export default function TodosPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [todos,        setTodos]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [sortBy,       setSortBy]       = useState('id')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showInfo,     setShowInfo]     = useState(false)

  useEffect(() => {
    getTodosByUser(user.id)
      .then(setTodos)
      .finally(() => setLoading(false))
  }, [user.id])

  async function handleAdd(title) {
    const created = await createTodo({ userId: user.id, title, completed: false })
    setTodos(prev => [...prev, created])
  }

  async function handleToggle(todo) {
    const updated = await updateTodo(todo.id, { ...todo, completed: !todo.completed })
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function handleEdit(todo, newTitle) {
    const updated = await updateTodo(todo.id, { ...todo, title: newTitle })
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function handleDelete(id) {
    await deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function handleLogout() { logout(); navigate('/login') }

  const displayed = todos
    .filter(t => {
      const searchLower = search.toLowerCase()
      const statusText  = t.completed ? 'completed' : 'active'
      const matchesSearch =
        String(t.id).includes(search) ||
        t.title.toLowerCase().includes(searchLower) ||
        statusText.includes(searchLower)
      const matchesStatus =
        statusFilter === 'all'       ? true :
        statusFilter === 'completed' ? t.completed :
                                       !t.completed
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
          <h2>🛒 My Shopping List</h2>
          <p>Manage your ingredients and cooking tasks</p>
        </div>

        <TodoForm onAdd={handleAdd} />

        <div className="controls-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by id, title or status..."
          />
          <SortSelect value={sortBy}       onChange={setSortBy}       options={SORT_OPTIONS} />
          <SortSelect value={statusFilter} onChange={setStatusFilter} options={FILTER_OPTIONS} />
        </div>

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