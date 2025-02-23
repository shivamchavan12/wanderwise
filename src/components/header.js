import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./header.css"; // This will be globally applied

// Initialize Supabase
const supabase = createClient(
  "https://epklyikbubnqckckyhjk.supabase.co",
  "your-supabase-api-key"
);

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();  // Get current route
  const [hideHeader, setHideHeader] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);

  // Set default headerClass based on location.pathname
  const [headerClass, setHeaderClass] = useState("default-header");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setHideHeader(true); // Hide header on scroll down
      } else {
        setHideHeader(false); // Show header on scroll up
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    // Update headerClass based on pathname
    if (location.pathname === "/") {
      setHeaderClass("home-header");
    } else if (location.pathname === "/login") {
      setHeaderClass("login-header");
    } else if (location.pathname === "/Tripplanner") {
      setHeaderClass("trip-header");
    } else {
      setHeaderClass("default-header");
    }
  }, [location.pathname]);  // This ensures headerClass updates when pathname changes

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem("loggedIn");
      setIsLoggedIn(false);
      navigate("/login");
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
        <Link className="button-link" to="/ContactUs">Contact Us</Link>

        {isLoggedIn ? (
          <>
            <Link className="button-link" to="/Tripplanner">Trip Planner 🗺️</Link>
            <Link className="button-link" to="/profile">Profile</Link>
            <Link className="button-link" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <Link className="button-link" to="/login">Login/SignIn</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
