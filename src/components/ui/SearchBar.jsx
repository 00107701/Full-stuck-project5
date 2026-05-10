/**
 * SearchBar – reusable text input for filtering lists.
 *
 * Props:
 *   value       – controlled input value
 *   onChange    – setter function
 *   placeholder – input placeholder text
 */
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #ddd',
        fontSize: 14,
        width: '100%',
        maxWidth: 320,
      }}
    />
  )
}