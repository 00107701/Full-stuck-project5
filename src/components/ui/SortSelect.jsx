// רכיב תפריט נפתח לבחירת קריטריון מיון או סינון
// מקבל את הערך הנבחר, פונקציית עדכון, ורשימת האפשרויות להצגה
export default function SortSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #ddd',
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {/* רינדור כל אפשרות בתפריט לפי הרשימה שהתקבלה */}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}