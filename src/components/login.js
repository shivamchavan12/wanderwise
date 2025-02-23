import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
import './login.css';
import { Link } from "react-router-dom"; 

// Initialize Supabase
const supabase = createClient(
  'https://epklyikbubnqckckyhjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa2x5aWtidWJucWNrY2t5aGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA4NzIsImV4cCI6MjA1NTc4Njg3Mn0.IhX7e7yzMYKPB12MP9nd4Sqfm7i8h4AO3anfqQGaocs'
);

const LoginForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!isLogin) {
      // Signup logic
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        console.log('Signup successful:', data);
        localStorage.setItem('loggedIn', 'true');
        setIsLoggedIn(true);
        navigate('/'); // Redirect to home
      }
    } else {
      // Login logic
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        console.log('Login successful:', data);
        localStorage.setItem('loggedIn', 'true');
        setIsLoggedIn(true);
        navigate('/');
      }
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent. Check your inbox.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div id="login-page">
      <div className="wrapper">
        {!isForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            
            {!isLogin && (
              <div className="input-field">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <label>Enter your name</label>
              </div>
            )}

            <div className="input-field">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label>Enter your email</label>
            </div>

            <div className="input-field">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label>Enter your password</label>
            </div>

            {!isLogin && (
              <div className="input-field">
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <label>Confirm your password</label>
              </div>
            )}

            {error && <p className="error-message">{error}</p>}

            <div className="forget">
              <label htmlFor="remember">
                <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <p>Remember me</p>
              </label>
              <a href="#" onClick={() => setIsForgotPassword(true)}>Forgot password?</a>
            </div>

            <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>

            <div className="register">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <a href="#" onClick={toggleForm}>{isLogin ? ' Register' : ' Login'}</a>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <h2>Reset Password</h2>
            <div className="input-field">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label>Enter your email</label>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <button type="submit">Send Reset Link</button>
            <div className="register">
              <p>
                Remembered your password? <a href="#" onClick={() => setIsForgotPassword(false)}>Login</a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
