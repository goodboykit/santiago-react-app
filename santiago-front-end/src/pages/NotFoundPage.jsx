import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1 className="nf-title">404</h1>
      <p className="nf-subtitle">Oops! Page not found.</p>
      <p className="nf-message">The page you're looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="nf-button">Go Back Home</Link>
    </div>
  );
}

export default NotFoundPage;
