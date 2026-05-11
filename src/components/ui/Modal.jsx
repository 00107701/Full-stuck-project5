// חלון מודאל גנרי – מציג תוכן כלשהו מעל שאר הדף
// לחיצה על הרקע הכהה סוגרת את החלון
export default function Modal({ children, onClose }) {
  return (
    // רקע כהה שמכסה את כל המסך – לחיצה עליו סוגרת את החלון
    <div className="modal-backdrop" onClick={onClose}>

      {/* תיבת החלון עצמה – עצירת ההתפשטות מונעת סגירה בלחיצה בתוך החלון */}
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}

        {/* כפתור סגירה – עצירת ההתפשטות מונעת הפעלה כפולה של onClose */}
        <button
          onClick={e => { e.stopPropagation(); onClose() }}
          style={{ marginTop: 20, width: '100%' }}
        >
          Close
        </button>
      </div>
    </div>
  )
}