import { useState } from 'react'

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await onAdd(title.trim())
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add ingredient or task..."
        style={{ flex: 1 }}
      />
      <button type="submit" className="primary">Add</button>
    </form>
  )
}