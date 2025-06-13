import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import UserService from '../services/UserService';
import { directLogin } from '../services/DirectLogin';

import Illustration1 from '../assets/illustration.svg';
import Illustration2 from '../assets/illustration2.svg';
import Illustration3 from '../assets/illustration3.svg';

const illustrations = [Illustration1, Illustration2, Illustration3];

function LoginPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('test.user@example.com'); // Pre-filled for testing
  const [password, setPassword] = useState('test123!'); // Pre-filled for testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % illustrations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (UserService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Auto-login for testing (will run once after component mounts)
  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log('Auto-login enabled for testing');
        await handleLogin({
          preventDefault: () => {}
        });
      } catch (error) {
        console.error('Auto-login failed:', error);
      }
    };

    // Only run auto-login in production for testing
    if (import.meta.env.PROD && !UserService.isAuthenticated()) {
      autoLogin();
    }
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter email and password.');
      }

      try {
        // Try regular login first
        console.log('Attempting regular login via UserService');
        const response = await UserService.loginUser({ email, password });
        
        if (response.success) {
          // Navigate to loading page with user info
          navigate('/loading', { 
            state: { 
              email: response.data.user.email,
              userInfo: response.data.user 
            } 
          });
        }
      } catch (loginError) {
        console.error('Regular login failed, attempting direct login:', loginError);
        
        // If regular login fails, try direct login
        const directResponse = await directLogin({ email, password });
        
        if (directResponse.success) {
          console.log('Direct login successful');
          navigate('/loading', { 
            state: { 
              email: directResponse.data.user.email,
              userInfo: directResponse.data.user 
            } 
          });
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <svg className="wave-bg" viewBox="0 0 1440 320">
        <path
          fill="#4C62A1"
          fillOpacity="1"
          d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,208C672,213,768,203,864,170.7C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128V0H0Z"
        />
      </svg>

      <div className="login-wrapper">
        <div className="login-left">
          <img
            src={illustrations[currentIndex]}
            alt="Changing Illustration"
            className="illustration-image"
          />
        </div>

        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtext">Login to continue</p>

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

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <label>Email Address</label>
            </div>

            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <label>Password</label>
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="separator"><span>or</span></div>

            <button
              type="button"
              className="btn-register"
              onClick={() => navigate('/auth/register')}
              disabled={loading}
            >
              Create New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
