import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import logo from '../assets/avatar.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="React Logo" />
        </Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/articles">Articles</Link></li>
      </ul>

      <div className="navbar-right">
        <Button>Login</Button>
      </div>
    </nav>
  );
}

export default Navbar;
