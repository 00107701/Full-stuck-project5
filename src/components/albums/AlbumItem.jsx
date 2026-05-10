import PhotoGallery from './PhotoGallery'

// קומפוננטה שמציגה אלבום אחד מתוך רשימת האלבומים
export default function AlbumItem({ album, currentUser, isSelected, onSelect }) {
  return (
    <li
      style={{
        // אם האלבום נבחר, נותנים לו מסגרת בולטת יותר
        border: isSelected ? '2px solid #e67e22' : '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* הצגת מזהה האלבום */}
        <span style={{ color: '#aaa', fontSize: 13, minWidth: 32 }}>
          #{album.id}
        </span>

        {/* לחיצה על שם האלבום פותחת או סוגרת את התמונות שלו */}
        <span
          onClick={() => onSelect(isSelected ? null : album)}
          style={{
            flex: 1,
            cursor: 'pointer',
            color: '#e67e22',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          {album.title}
        </span>
      </div>

      {/* אם האלבום נבחר, מציגים את גלריית התמונות שלו */}
      {isSelected && (
        <PhotoGallery albumId={album.id} currentUser={currentUser} />
      )}
    </li>
  )
}