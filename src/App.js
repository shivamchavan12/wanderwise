import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Home from './components/Home';
import Trip from './components/Tripplanner';
import Profile from './components/form';
import ContactUs from './components/ContactUs';


// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const userLoggedIn = localStorage.getItem('loggedIn');
//     if (userLoggedIn) {
//       setIsLoggedIn(true);
//     }
//   }, []);
//   return (  
//     <Router>
//       <Header isLoggedIn={isLoggedIn} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ContactUs" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;