import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getUsers } from '../services/api'

export default function RegisterPage() {
  const [form, setForm]   = useState({ username: '', password: '', passwordVerify: '' })
  const [error, setError] = useState('')
  const navigate          = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.passwordVerify) { setError('Passwords do not match.'); return }
    try {
      const users = await getUsers()
      if (users.some(u => u.username === form.username)) { setError('Username already exists.'); return }
      navigate('/register/details', { state: { username: form.username, password: form.password } })
    } catch {
      setError('Server error. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-logo">
          <h1>🍳 RecipeHub</h1>
          <p>Your personal recipe collection</p>
        </div>

        <div className="auth-divider">
          <h2>Create your account</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'username',       label: 'Username',         type: 'text',     placeholder: 'Choose a username' },
            { name: 'password',       label: 'Password',         type: 'password', placeholder: 'Choose a password' },
            { name: 'passwordVerify', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
          ].map(f => (
            <div className="form-group" key={f.name}>
              <label>{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="auth-submit">
            Next →
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  )
}