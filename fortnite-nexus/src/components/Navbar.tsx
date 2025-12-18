import {Link} from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import './navbar.css';

export default function Navbar() {
const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <ul>
        <li className=''>
          <Link to="/"><h1>Fortnite<span className="nexus">Nexus</span></h1></Link>
        </li>
        <div className="right-nav">
        <Link to ="/store">
          <li className="right-nav">
          Store
          </li>
          </Link>
        <li className="right-nav">
          <button className='button-mode' onClick={toggleDarkMode}>
            {isDarkMode ? '🌞' : ' 🌙'}
          </button>
          </li>
        </div>
      </ul>
    </nav>
    
  );
}