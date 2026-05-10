import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createUser } from '../services/api'

export default function RegisterDetails() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [form, setForm]   = useState({ name: '', email: '', phone: '', city: '' })
  const [error, setError] = useState('')

  if (!state?.username) { navigate('/register'); return null }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const created = await createUser({
        username: state.username,
        website:  state.password,
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        address:  { city: form.city },
      })
      login(created)
      navigate('/home')
    } catch {
      setError('Registration failed. Please try again.')
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
          <h2>Complete your profile</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'name',  label: 'Full Name', type: 'text',  placeholder: 'Your full name' },
            { name: 'email', label: 'Email',     type: 'email', placeholder: 'your@email.com' },
            { name: 'phone', label: 'Phone',     type: 'text',  placeholder: '050-0000000' },
            { name: 'city',  label: 'City',      type: 'text',  placeholder: 'Your city' },
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
            Join RecipeHub →
          </button>
        </form>

      </div>
    </div>
  )
}