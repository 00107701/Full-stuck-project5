import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import RegisterDetails  from './pages/RegisterDetails'
import HomePage         from './pages/HomePage'
import TodosPage        from './pages/TodosPage'
import PostsPage        from './pages/PostsPage'
import AlbumsPage       from './pages/AlbumsPage'

// נתיב מוגן – אם המשתמש לא מחובר מעביר אותו לדף הכניסה
// אם מחובר – מציג את הדף המבוקש
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// קומפוננטת הניתוב הראשית של האפליקציה
// מגדירה את כל הנתיבים האפשריים ואת הדפים המתאימים להם
export default function App() {
  return (
    <Routes>

      {/* נתיב הבסיס – מפנה אוטומטית לדף הכניסה */}
      <Route path="/"                   element={<Navigate to="/login" replace />} />

      {/* דפים פתוחים לכולם ללא צורך בכניסה */}
      <Route path="/login"              element={<LoginPage />} />
      <Route path="/register"           element={<RegisterPage />} />
      <Route path="/register/details"   element={<RegisterDetails />} />

      {/* דף הבית – מוגן, רק למשתמש מחובר */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* נתיבים מידעיים – ה-URL מכיל את מזהה המשתמש */}
      <Route path="/users/:userId/todos"              element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
      <Route path="/users/:userId/posts"              element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
      <Route path="/users/:userId/albums"             element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />

      {/* נתיב לאלבום ספציפי – מכיל גם את מזהה האלבום */}
      <Route path="/users/:userId/albums/:albumId"    element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />

      {/* כל נתיב לא מוכר – מפנה לדף הכניסה */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}