import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onLogout, onInfo }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const uid = user?.id

  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '')

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate('/home')}
        style={{ cursor: 'pointer' }}
      >
        <h2>RecipeHub</h2>
        <span>My personal recipe book</span>
      </div>

      <NavLink to={`/users/${uid}/todos`}  className={linkClass}>Shopping List</NavLink>
      <NavLink to={`/users/${uid}/posts`}  className={linkClass}>Recipes</NavLink>
      <NavLink to={`/users/${uid}/albums`} className={linkClass}>Photos</NavLink>

      <button className="nav-btn" onClick={onInfo}>My Info</button>
      <button className="nav-btn nav-logout" onClick={onLogout}>← Logout</button>
    </nav>
  )
}