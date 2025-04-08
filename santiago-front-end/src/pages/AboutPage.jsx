import React from 'react';

function AboutPage() {
  return (
    <div className="page about-page">
      <h1 className="page-title">About Me & Community Work</h1>
      <img
        className="page-image"
        src="/src/assets/about.png"
        alt="About Section"
      />

      <p className="page-content">
        <strong>Community Involvement:</strong><br />
        • Vice Finance Officer at AWS Learning Club Legarda (2024–Present)<br />
        • Core Volunteer at FlutterFlow Manila (2024–Present)<br />
        • Technical Team at GDSC NU (2023–Present)
      </p>

      <p className="page-content">
        <strong>Certifications:</strong><br />
        • CISCO Python Essentials 1 & 2 (2023)<br />
        • CISCO IT Essentials (2023)<br />
        • AWS Foundation: Responsive Web (2023)<br />
        • Microsoft Learn: Data Analytics (2024)
      </p>

      <p className="page-content">
        I thrive in collaborative environments, organizing hackathons, coding
        workshops, and mentorship programs. My technical background includes
        Flutter, React, Java/Kotlin, MongoDB, and more.
      </p>
    </div>
  );
}

export default AboutPage;
