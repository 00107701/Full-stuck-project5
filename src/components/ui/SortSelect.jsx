/**
 * SortSelect – dropdown for choosing sort criteria.
 *
 * Props:
 *   value    – currently selected option value
 *   onChange – setter function
 *   options  – array of { value, label } objects
 */
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
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}