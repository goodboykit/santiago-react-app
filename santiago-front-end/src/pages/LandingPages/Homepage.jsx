import React from 'react';
import homeImage from '../../assets/image1.png';

function HomePage() {
  return (
    <div className="page home-page">
      <div className="hero-section">
        <h1 className="page-title">Kit Nicholas T. Santiago</h1>
        <p className="page-subtitle">
          3rd Year BS-IT Student | Specialized in Mobile & Web Apps
        </p>
        <img
          className="page-image"
          src={homeImage}
          alt="Home Banner"
        />
      </div>

      <p className="page-content">
        Welcome to my interactive landing page! I'm currently studying at
        <strong> National University – Manila</strong>, focusing on building
        dynamic mobile/web applications and engaging in collaborative tech
        communities.
      </p>
      <p className="page-content">
        <strong>Contact:</strong> santiagonikos@gmail.com | (+63) 956-896-4613 <br />
        <strong>Location:</strong> 364 San Diego Street, Sampaloc, Manila
      </p>
    </div>
  );
}

export default HomePage;
