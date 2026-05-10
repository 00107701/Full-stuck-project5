export default function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}
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