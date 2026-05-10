import AlbumItem from './AlbumItem'

// קומפוננטה שמציגה את רשימת האלבומים
// כל אלבום ברשימה ניתן ללחיצה, ואז נפתחות התמונות שלו
export default function AlbumList({ albums, currentUser, selectedAlbum, onSelect }) {
  // אם אין אלבומים להצגה, מציגים הודעה מתאימה
  if (albums.length === 0) return <p>No albums found.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {/* מעבר על כל האלבומים והצגת כל אלבום כפריט נפרד */}
      {albums.map(album => (
        <AlbumItem
          key={album.id}
          album={album}
          currentUser={currentUser}
          isSelected={selectedAlbum?.id === album.id}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}