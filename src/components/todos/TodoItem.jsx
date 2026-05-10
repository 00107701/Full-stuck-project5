import { useState } from 'react'

/**
 * TodoItem – single todo row.
 * Supports inline editing: clicking "Edit" switches to an input field.
 * Saving calls onEdit; cancelling restores the original title.
 */
export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)

  async function handleSave() {
    if (!editValue.trim()) return
    await onEdit(todo, editValue.trim())
    setIsEditing(false)
  }

  function handleCancel() {
    setEditValue(todo.title)   // reset to original
    setIsEditing(false)
  }

  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid #f0f0f0',
    }}>
      {/* ID badge */}
      <span style={{ minWidth: 32, color: '#aaa', fontSize: 13 }}>#{todo.id}</span>

      {/* Completed checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />

      {/* Title or inline edit input */}
      {isEditing ? (
        <>
          <input
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd' }}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <span style={{
            flex: 1,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#aaa' : 'inherit',
          }}>
            {todo.title}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)} style={{ color: '#c0392b' }}>Delete</button>
        </>
      )}
    </li>
  )
}