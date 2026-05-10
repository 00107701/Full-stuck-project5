import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import RegisterDetails  from './pages/RegisterDetails'
import HomePage         from './pages/HomePage'
import TodosPage        from './pages/TodosPage'
import PostsPage        from './pages/PostsPage'
import AlbumsPage       from './pages/AlbumsPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                   element={<Navigate to="/login" replace />} />
      <Route path="/login"              element={<LoginPage />} />
      <Route path="/register"           element={<RegisterPage />} />
      <Route path="/register/details"   element={<RegisterDetails />} />

      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Informative URLs: users/:userId/todos */}
      <Route path="/users/:userId/todos"              element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
      <Route path="/users/:userId/posts"              element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
      <Route path="/users/:userId/albums"             element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />
      <Route path="/users/:userId/albums/:albumId"    element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}