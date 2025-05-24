import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/RegistrationPage.css';
import UserService from '../services/UserService';

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (UserService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, age } = formData;

    if (!fullName.trim()) {
      throw new Error('Full name is required');
    }

    if (fullName.trim().length < 2) {
      throw new Error('Full name must be at least 2 characters long');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (age && (isNaN(age) || age < 13 || age > 120)) {
      throw new Error('Please enter a valid age between 13 and 120');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      validateForm();

      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      const response = await UserService.registerUser(userData);

      if (response.success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/loading', { 
            state: { 
              email: response.data.user.email,
              userInfo: response.data.user 
            } 
          });
        }, 1500);
      }

    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="error-message" style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{
            background: '#e8f5e8',
            color: '#2e7d32',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faUser} className="form-icon" />
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
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
              disabled={loading}
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-wrapper">
            <FontAwesomeIcon icon={faCalendarAlt} className="form-icon" />
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              min="13"
              max="120"
            />
            <label htmlFor="age">Age (Optional)</label>
          </div>

          <div className="input-wrapper">
            <FontAwesomeIcon icon={faLock} className="form-icon" />
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
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
              disabled={loading}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <p className="login-redirect">
            Already have an account? 
            <span 
              onClick={() => !loading && navigate('/auth/login')}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {' '}Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
