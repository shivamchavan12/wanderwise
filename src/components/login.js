import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './login.css';


// Initialize Supabase
const supabase = createClient(
  'https://epklyikbubnqckckyhjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa2x5aWtidWJucWNrY2t5aGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA4NzIsImV4cCI6MjA1NTc4Njg3Mn0.IhX7e7yzMYKPB12MP9nd4Sqfm7i8h4AO3anfqQGaocs'
);

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        navigate('/dashboard'); // Redirect to dashboard
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
        navigate('/dashboard'); // Redirect to dashboard
      }
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
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
        
        <div className="register">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <a href="#" onClick={toggleForm}>{isLogin ? 'Register' : 'Login'}</a>
          </p>
        </div>
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
