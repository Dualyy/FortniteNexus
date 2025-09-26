
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Overview } from './pages/user/overview.tsx'
import { Store } from './pages/store.tsx'
import Navbar from './components/Navbar.tsx'
import { ThemeProvider, useTheme } from './ThemeContext.tsx'
import { ReactNode, useEffect } from 'react';

/**
 * A component that listens to the theme context and applies the
 * 'dark-mode' class to the document body when active.
 */
function ThemeManager({ children }: { children: ReactNode }) {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemeManager>
        <BrowserRouter>
        <header>
          <Navbar />
        </header>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/store" element={<Store />} />
          </Routes>
        </BrowserRouter>
      </ThemeManager>
    </ThemeProvider>
  </React.StrictMode>
)