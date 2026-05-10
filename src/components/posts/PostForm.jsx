import { useState } from 'react'

export default function PostForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [body,  setBody]  = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    await onAdd(title.trim(), body.trim())
    setTitle('')
    setBody('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Recipe title..."
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Ingredients and instructions..."
        rows={4}
        style={{ resize: 'vertical' }}
      />
      <button type="submit" className="primary" style={{ alignSelf: 'flex-start', padding: '8px 20px' }}>
        Add Recipe
      </button>
    </form>
  )
}