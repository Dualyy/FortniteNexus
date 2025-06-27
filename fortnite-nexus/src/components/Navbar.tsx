import {Link} from 'react-router-dom';

export default function Navbar() {
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
        </div>
      </ul>
    </nav>
    
  );
}