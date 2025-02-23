import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Login from './components/login';
import Home from './components/Home';
import Trip from './components/Tripplanner';
import Footer from './components/Footer';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Profile from './components/form';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('loggedIn');
    if (userLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/Tripplanner" element={<Trip />} />
        <Route path="/form" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;