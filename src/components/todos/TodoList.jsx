import TodoItem from './TodoItem'

// קומפוננטה שמציגה את כל רשימת המשימות
// כל משימה מועברת לקומפוננטת TodoItem
export default function TodoList({ todos, onToggle, onEdit, onDelete }) {

  // אם אין משימות ברשימה, מציגים הודעה מתאימה
  if (todos.length === 0) return <p>No todos found.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>

      {/* מעבר על כל המשימות והצגת כל אחת בנפרד */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}

          // פעולה לסימון/ביטול ביצוע
          onToggle={onToggle}

          // פעולה לעריכת משימה
          onEdit={onEdit}

          // פעולה למחיקת משימה
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}