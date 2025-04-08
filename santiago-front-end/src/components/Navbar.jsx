import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ /* Enhancement 1: your custom design or styling here */ }}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/articles">Articles</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
