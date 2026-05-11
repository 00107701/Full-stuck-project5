import PostItem from './PostItem'

export default function PostList({ posts, currentUser, selectedPost, onSelect, onEdit, onDelete, showAll }) {
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
            isOwner={post.userId === currentUser.id}
          />
        ))}
      </ul>
    </div>
  )
}