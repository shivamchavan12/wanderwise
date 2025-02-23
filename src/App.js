import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Home from './components/Home';
import Trip from './components/Tripplanner';
import ContactUs from './components/contactUs';
import Footer from './components/Footer';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Forget from "./components/ForgetPassword"; // Import it
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
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/Tripplanner" element={<Trip />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/ForgetPassword" element={<Forget />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;