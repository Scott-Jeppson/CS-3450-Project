import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home.jsx'

// Entry point for the program
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
