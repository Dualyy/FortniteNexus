import {Link} from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export default function Navbar() {
const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <ul>
        <li>
          <Link to="/"><h1>Fortnite<span className="nexus">Nexus</span></h1></Link>
        </li>
        <div className="right-nav">
        <li className="right-nav">
          <Link to="/user/overview">User Overview</Link>
        </li>
        <li className="right-nav">
          <Link to ="/store">Store</Link>
        </li>
        <li className="right-nav">
          <button onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          </li>
        </div>
      </ul>
    </nav>
    
  );
}