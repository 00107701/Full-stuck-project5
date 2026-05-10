import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from './context/AuthContext'

// קבצי העיצוב הראשיים של האתר
import './styles/global.css'
import './styles/controls.css'
import './styles/auth.css'
import './styles/navbar.css'
import './styles/layout.css'
import './styles/components.css'

// יצירת root ראשי של React בתוך index.html
ReactDOM.createRoot(document.getElementById('root')).render(

  // StrictMode עוזר לזהות בעיות אפשריות בזמן פיתוח
  <React.StrictMode>

    {/* מאפשר שימוש ב־React Router בכל האפליקציה */}
    <BrowserRouter>

      {/* Provider גלובלי לניהול משתמש מחובר */}
      <AuthProvider>

        {/* קומפוננטת האפליקציה הראשית */}
        <App />

      </AuthProvider>
    </BrowserRouter>

  </React.StrictMode>
)