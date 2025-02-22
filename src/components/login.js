import React, { useState } from 'react';
import './login.css'; // Ensure your CSS is in this file or adjust the path

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [name, setName] = useState(''); // State for name (only for sign up)
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and SignUp

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Placeholder logic for login (without Supabase)
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Login successful');
        setError('');
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Check if passwords match during sign up
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Placeholder logic for sign up (without Supabase)
      console.log('SignUp successful');
      setError('');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and signup
    setError(''); // Reset error message when toggling
    setName(''); // Reset name field when toggling
    setPassword(''); // Reset password field when toggling
    setConfirmPassword(''); // Reset confirm password field when toggling
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2> {/* Toggle heading */}
        
        {!isLogin && (
          <div className="input-field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Enter your name</label>
          </div>
        )}
        
        <div className="input-field">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Enter your email</label>
        </div>
        
        <div className="input-field">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Enter your password</label>
        </div>
        
        {!isLogin && (
          <div className="input-field">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm your password</label>
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="forget">
          <label htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <p>Remember me</p>
          </label>
          <a href="#">Forgot password?</a>
        </div>
        
        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button> {/* Toggle button text */}
        
        <div className="register">
          <p>
            {isLogin
              ? "Don't have an account?"
              : 'Already have an account?'}
            <a href="#" onClick={toggleForm}>
              {isLogin ? 'Register' : 'Login'}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
