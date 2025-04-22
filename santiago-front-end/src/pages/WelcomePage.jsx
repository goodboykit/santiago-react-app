import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faEye,
  faCommentDots,
  faTrophy,
  faUserCircle,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

export default function WelcomePage() {
  const { state } = useLocation();
  const email = state?.email || 'guest@portfolio.com';
  const navigate = useNavigate();

  // ✅ Define logout function ABOVE the return statement
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="wp-dashboard">
      <nav className="wp-navbar">
        <div className="wp-logo">My Portfolio</div>
        <div className="wp-user-group">
          <div className="wp-user">
            <FontAwesomeIcon icon={faUserCircle} className="wp-avatar" />
            <span className="wp-username">{email}</span>
          </div>
          <button className="wp-logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </nav>

      <header className="wp-hero">
        <svg className="wp-wave" viewBox="0 0 1440 320">
          <path
            fill="#3B4F81"
            d="M0,192L80,186.7C160,181,320,171,480,165.3C640,160,800,160,960,165.3C1120,171,1280,181,1360,186.7L1440,192V0H1360C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0H0Z"
          />
        </svg>
        <div className="wp-hero-content">
          <h1>Welcome back, <span>{email}</span>!</h1>
          <p>Your portfolio dashboard at a glance.</p>
        </div>
      </header>

      <section className="wp-stats">
        <div className="wp-card">
          <div className="wp-icon"><FontAwesomeIcon icon={faBriefcase} /></div>
          <h3>Projects</h3>
          <p>24 Completed</p>
        </div>
        <div className="wp-card">
          <div className="wp-icon"><FontAwesomeIcon icon={faEye} /></div>
          <h3>Views</h3>
          <p>8.4K Total</p>
        </div>
        <div className="wp-card">
          <div className="wp-icon"><FontAwesomeIcon icon={faCommentDots} /></div>
          <h3>Feedback</h3>
          <p>112 Comments</p>
        </div>
        <div className="wp-card">
          <div className="wp-icon"><FontAwesomeIcon icon={faTrophy} /></div>
          <h3>Awards</h3>
          <p>5 Achievements</p>
        </div>
      </section>

      <section className="wp-recent">
        <h2>Recent Projects</h2>
        <div className="wp-recent-grid">
          <div className="wp-recent-card">Portfolio Redesign</div>
          <div className="wp-recent-card">E‑Commerce Mockup</div>
          <div className="wp-recent-card">Mobile App Concept</div>
          <div className="wp-recent-card">Brand Identity</div>
        </div>
      </section>
    </div>
  );
}
