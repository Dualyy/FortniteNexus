
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Overview } from './pages/user/overview.tsx'
import { Store } from './pages/store.tsx'
import Navbar from './components/navbar.tsx'


createRoot(document.getElementById('root')!).render(
  <>
  <BrowserRouter>
  <header>
    <Navbar />
  </header>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/user/overview" element={<Overview />} />
      <Route path="/store" element={<Store />} />
    </Routes>
  </BrowserRouter>
  </>
)