import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';//create this

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Use the API instance from config.js
      const response = await api.post('/auth/login', credentials);
      
      // Store token and update auth context
      localStorage.setItem('token', response.data.access_token);
      await login(response.data.user);
      
      // Redirect to dashboard create this and signup
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to Notes Vault</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({
                ...credentials,
                username: e.target.value
              })}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-prompt">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;