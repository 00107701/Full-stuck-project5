import { useState, useEffect } from 'react'
import { getCommentsByPost, createComment, updateComment, deleteComment } from '../../services/api'

/**
 * CommentSection – displays and manages comments for a single post.
 * Only allows edit/delete of comments that belong to the current user.
 * Props:
 *   postId      – the post whose comments to load
 *   currentUser – logged-in user object
 */
export default function CommentSection({ postId, currentUser }) {
  const [comments,  setComments]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [newComment, setNewComment] = useState('')
  const [editingId,  setEditingId]  = useState(null)
  const [editValue,  setEditValue]  = useState('')

  useEffect(() => {
    getCommentsByPost(postId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [postId])

  async function handleAdd() {
    if (!newComment.trim()) return
    const created = await createComment({
      postId,
      name:  currentUser.name,
      email: currentUser.email,
      body:  newComment.trim(),
      userId: currentUser.id,
    })
    setComments(prev => [...prev, created])
    setNewComment('')
  }

  async function handleEdit(comment) {
    const updated = await updateComment(comment.id, { ...comment, body: editValue })
    setComments(prev => prev.map(c => c.id === updated.id ? updated : c))
    setEditingId(null)
  }

  async function handleDelete(id) {
    await deleteComment(id)
    setComments(prev => prev.filter(c => c.id !== id))
  }

  /** A comment belongs to the current user if userId matches */
  const isOwner = (comment) => comment.userId === currentUser.id

  if (loading) return <p>Loading comments...</p>

  return (
    <div style={{ marginTop: 12 }}>
      <h4 style={{ marginBottom: 8 }}>Comments ({comments.length})</h4>

      {comments.map(comment => (
        <div key={comment.id} style={{
          background: '#f9f9f9',
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 8,
        }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{comment.name}</p>

          {editingId === comment.id ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd' }}
              />
              <button onClick={() => handleEdit(comment)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#555' }}>{comment.body}</p>
          )}

          {/* Edit/Delete only for comments owned by current user */}
          {isOwner(comment) && editingId !== comment.id && (
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button onClick={() => { setEditingId(comment.id); setEditValue(comment.body) }}>
                Edit
              </button>
              <button onClick={() => handleDelete(comment.id)} style={{ color: '#c0392b' }}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add new comment */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button onClick={handleAdd}>Post</button>
      </div>
    </div>
  )
}