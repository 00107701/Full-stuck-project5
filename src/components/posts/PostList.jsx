import PostItem from './PostItem'

/**
 * PostList – renders list of posts in review mode (id + title only).
 * Selected post is highlighted and shown in full below the list.
 */
export default function PostList({ posts, currentUser, selectedPost, onSelect, onEdit, onDelete }) {
  if (posts.length === 0) return <p>No posts found.</p>

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={currentUser}
            isSelected={selectedPost?.id === post.id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}