import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/react.svg';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Kit Santiago</span>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>
            About
          </Link>
        </li>
        <li>
          <Link to="/articles" className={location.pathname === '/articles' ? 'nav-link active' : 'nav-link'}>
            Portfolio
          </Link>
        </li>
      </ul>

      <div className="navbar-action">
        <Link to="/login" className="nav-button">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
