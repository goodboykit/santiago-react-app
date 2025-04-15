import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <h3>Kit Santiago</h3>
        <p>Passionate IT student specializing in mobile and web applications.</p>
        <div className="footer-links">
          <a href="https://linkedin.com/kit-nicholas-santiago" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:santiagonikos@gmail.com">Email</a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Kit Santiago. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
