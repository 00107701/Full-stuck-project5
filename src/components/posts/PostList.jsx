import PostItem from './PostItem'

// קומפוננטה שמציגה את רשימת הפוסטים
// מקבלת את כל הפוסטים, המשתמש המחובר, הפוסט הנבחר וכל פונקציות הטיפול כ-props
export default function PostList({ posts, currentUser, selectedPost, onSelect, onEdit, onDelete, showAll }) {

  // אם אין פוסטים להצגה (אחרי סינון או בכלל) מציגים הודעה מתאימה
  if (posts.length === 0) return <p>No posts found.</p>

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>

        {/* מעבר על כל הפוסטים והצגת כל אחד כקומפוננטת PostItem נפרדת */}
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}

            // המשתמש המחובר – מועבר ל-PostItem לצורך הצגת תגובות עם זיהוי
            currentUser={currentUser}

            // האם הפוסט הזה הוא הנבחר כרגע – קובע אם להציג אותו מודגש עם תוכן
            isSelected={selectedPost?.id === post.id}

            // פונקציה לבחירה/ביטול בחירה של פוסט
            onSelect={onSelect}

            // פונקציה לעדכון תוכן פוסט
            onEdit={onEdit}

            // פונקציה למחיקת פוסט
            onDelete={onDelete}

            // האם המשתמש המחובר הוא בעל הפוסט – קובע אם להציג כפתורי עריכה ומחיקה
            isOwner={post.userId === currentUser.id}
          />
        ))}
      </ul>
    </div>
  )
}