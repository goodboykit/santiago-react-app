import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import '../styles/RegistrationPage.css';

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Registration submitted:', formData);
  };

  return (
    <div className="registration-container">
      <svg className="wave-bg" viewBox="0 0 1440 320">
        <path
          fill="#4C62A1"
          fillOpacity="1"
          d="M0,160L48,160C96,160,192,160,288,176C384,192,480,224,576,240C672,256,768,256,864,224C960,192,1056,128,1152,101.3C1248,75,1344,85,1392,90.7L1440,96V0H0Z"
        />
      </svg>

      <div className="registration-card">
        <h2 className="registration-title">Create Your Account</h2>
        <p className="registration-subtext">Join us and get started!</p>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="form-icon" />
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="fullName">Full Name</label>
          </div>

          <div className="input-wrapper">
            <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="form-icon" />
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="form-icon" />
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button type="submit" className="btn-register">Register</button>

          <p className="login-redirect">
            Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
