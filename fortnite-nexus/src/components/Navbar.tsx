import {Link} from 'react-router-dom';
import { useState } from 'react';



export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <nav>
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
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          </li>
        </div>
      </ul>
    </nav>
    
  );
}