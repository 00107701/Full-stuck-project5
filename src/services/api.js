// כתובת הבסיס של השרת המקומי שלנו
const BASE = 'http://localhost:3001'

// פונקציה כללית שמבצעת בקשות לשרת
// משתמשים בה כדי שלא נכתוב fetch מחדש בכל פעולה
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // אם הבקשה נכשלה – נזרוק שגיאה כדי שנוכל לטפל בה בקומפוננטות
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  // מחזירים את המידע שהשרת שלח בפורמט JSON
  return res.json()
}

// ── Users ──────────────────────────────────────────────
// שליפת כל המשתמשים
export const getUsers = () => request('/users')

// שליפת משתמש לפי id
export const getUserById = (id) => request(`/users/${id}`)

// יצירת משתמש חדש
export const createUser = (data) =>
  request('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// ── Todos ──────────────────────────────────────────────
// שליפת המשימות של המשתמש המחובר
export const getTodosByUser = (userId) =>
  request(`/todos?userId=${userId}`)

// יצירת משימה חדשה
export const createTodo = (data) =>
  request('/todos', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// עדכון משימה קיימת
export const updateTodo = (id, data) =>
  request(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// מחיקת משימה
export const deleteTodo = (id) =>
  request(`/todos/${id}`, {
    method: 'DELETE',
  })

// ── Posts ──────────────────────────────────────────────
// שליפת כל הפוסטים של כולם
export const getPosts = () =>
  request('/posts')

// שליפת הפוסטים של המשתמש המחובר
export const getPostsByUser = (userId) =>
  request(`/posts?userId=${userId}`)

// יצירת פוסט חדש
export const createPost = (data) =>
  request('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// עדכון פוסט קיים
export const updatePost = (id, data) =>
  request(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// מחיקת פוסט
export const deletePost = (id) =>
  request(`/posts/${id}`, {
    method: 'DELETE',
  })

// ── Comments ───────────────────────────────────────────
// שליפת כל התגובות של פוסט מסוים
export const getCommentsByPost = (postId) =>
  request(`/comments?postId=${postId}`)

// יצירת תגובה חדשה
export const createComment = (data) =>
  request('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// עדכון תגובה קיימת
export const updateComment = (id, data) =>
  request(`/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// מחיקת תגובה
export const deleteComment = (id) =>
  request(`/comments/${id}`, {
    method: 'DELETE',
  })

// ── Albums ─────────────────────────────────────────────
// שליפת האלבומים של המשתמש המחובר
export const getAlbumsByUser = (userId) =>
  request(`/albums?userId=${userId}`)

// יצירת אלבום חדש
export const createAlbum = (data) =>
  request('/albums', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// ── Photos ─────────────────────────────────────────────
// שליפת כל התמונות של אלבום מסוים
// נשאיר את זה כדי לא לשבור קוד קיים שמשתמש בפונקציה הזאת
export const getPhotosByAlbum = (albumId) =>
  request(`/photos?albumId=${albumId}`)

// שליפת תמונות בשלבים לפי עמוד וכמות
// זה התיקון החשוב להנחיה: לא מביאים את כל התמונות בפעם אחת
export const getPhotosByAlbumPage = (albumId, page = 1, limit = 6) =>
  request(`/photos?albumId=${albumId}&_page=${page}&_limit=${limit}`)

// יצירת תמונה חדשה באלבום
export const createPhoto = (data) =>
  request('/photos', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// עדכון תמונה קיימת
export const updatePhoto = (id, data) =>
  request(`/photos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// מחיקת תמונה
export const deletePhoto = (id) =>
  request(`/photos/${id}`, {
    method: 'DELETE',
  })