import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { directLogin } from '../services/DirectLogin';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'test.user@example.com', // Pre-filled for testing
    password: 'test123!'            // Pre-filled for testing
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
        console.log('Attempting direct login to: https://santiago-react-app-f25a-klt4kv8hw-kit-santiagos-projects.vercel.app/api');
        await directLogin(formData);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (directError) {
        console.error('Direct login also failed:', directError);
        setError(`Login failed: ${directError.message}. Check console for details.`);
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Log In</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">
            <FaLock /> Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="links">
          <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 