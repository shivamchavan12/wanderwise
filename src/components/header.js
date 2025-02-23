import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./header.css"; // This will be globally applied

// Initialize Supabase
const supabase = createClient(
  "https://epklyikbubnqckckyhjk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa2x5aWtidWJucWNrY2t5aGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA4NzIsImV4cCI6MjA1NTc4Njg3Mn0.IhX7e7yzMYKPB12MP9nd4Sqfm7i8h4AO3anfqQGaocs"
);

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();  // Get current route
  const [hideHeader, setHideHeader] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);

  // Set default headerClass based on location.pathname
  const [headerClass, setHeaderClass] = useState("default-header");

  useEffect(() => {
    let lastScrollY = window.scrollY;
  
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      if (currentScrollY === 0) {
        setHideHeader(false); // Show header when at the top
      } else if (currentScrollY > lastScrollY) {
        setHideHeader(true); // Hide header when scrolling down
      }
  
      lastScrollY = currentScrollY;
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Update headerClass based on pathname
    if (location.pathname === "/") {
      setHeaderClass("home-header");
    } else if (location.pathname === "/login") {
      setHeaderClass("login-header");
    } else if (location.pathname === "/Tripplanner") {
      setHeaderClass("trip-header");
    } else if (location.pathname === "/form") {
        setHeaderClass("form-header");
    }  else {
      setHeaderClass("default-header");
    }
  }, [location.pathname]);  // This ensures headerClass updates when pathname changes

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem("loggedIn");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <header className={`sticky-header ${headerClass} ${hideHeader ? "hide" : ""}`}>
      <div className="logo">
        <Link className="name" to="/">WanderWise</Link>
      </div>
      <nav>
        <Link className="button-link" to="/">Home</Link>

        {isLoggedIn ? (
          <>
            <Link className="button-link" to="/Tripplanner">Trip Planner 🗺️</Link>
            <Link className="button-link" to="/form">Profile</Link>
            <Link className="button-link" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <Link className="button-link" to="/login">Login/Sign Up</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
