import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { directLogin } from '../services/DirectLogin';
import { getApiBaseUrl } from '../apiConfig';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f7fa'
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#3B4F81',
    marginBottom: '20px',
    fontSize: '1.8rem'
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem'
  },
  errorIcon: {
    marginRight: '8px',
    color: '#c62828'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '8px',
    color: '#3B4F81'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1.5px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border 0.3s',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3B4F81',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonDisabled: {
    opacity: '0.7',
    cursor: 'not-allowed'
  },
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    fontSize: '0.9rem'
  },
  link: {
    color: '#3B4F81',
    textDecoration: 'none'
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'test.user@example.com', // Pre-filled for testing
    password: 'test123!'            // Pre-filled for testing
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Try the regular login first
      console.log('Attempting regular login');
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Regular login failed, attempting direct login:', error);
      
      try {
        // If regular login fails, try the direct login method
        console.log(`Attempting direct login with multiple URLs. Current API URL: ${getApiBaseUrl()}`);
        await directLogin(formData);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (directError) {
        console.error('Direct login also failed:', directError);
        setError(`Login failed: ${directError.message}`);
        toast.error('Login failed. Please check your credentials or network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Log In</h2>
        
        {error && (
          <div style={styles.errorMessage}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaExclamationTriangle style={styles.errorIcon} />
              {error}
            </div>
            <button 
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              style={{ 
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginTop: '5px',
                color: '#666',
                alignSelf: 'flex-start'
              }}
            >
              {showTechnicalDetails ? 'Hide details' : 'Show technical details'}
            </button>
            
            {showTechnicalDetails && (
              <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#666' }}>
                <p>Current API URL: {getApiBaseUrl()}</p>
                <p>Check browser console for more information.</p>
                <Link to="/status" style={{ color: '#3B4F81', textDecoration: 'underline' }}>
                  Go to Status Page
                </Link>
              </div>
            )}
          </div>
        )}
        
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            <FaEnvelope style={styles.icon} /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            <FaLock style={styles.icon} /> Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div style={styles.links}>
          <Link to="/register" style={styles.link}>Create an account</Link>
          <Link to="/status" style={styles.link}>Check System Status</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 