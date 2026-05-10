/**
 * Sidebar – פאנל צדדי שמוצג בתוך עמודים שונים באתר.
 * משמש למשל להצגת תוכן של פוסט שנבחר.
 * מקבל כותרת, תוכן פנימי ופונקציית סגירה.
 */
export default function Sidebar({ title, children, onClose }) {
  return (
    <aside
      style={{
        width: 320,
        borderLeft: '1px solid #e0e0e0',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
    >

      {/* כותרת הפאנל וכפתור סגירה */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* כותרת הפאנל */}
        <h3 style={{ margin: 0 }}>
          {title}
        </h3>

        {/* מציג כפתור סגירה רק אם התקבלה פונקציית onClose */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* התוכן שמועבר לתוך ה־Sidebar */}
      <div style={{ marginTop: 16 }}>
        {children}
      </div>
    </aside>
  )
}