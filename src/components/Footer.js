import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:info@wanderwise.com">info@wanderwise.com</a></p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Pune, India</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/Home">Home</a></li>
            <li><a href="/tripplanner">Trip Planner</a></li>
            <li><a href="/contactUs">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fab fa-facebook"></i></a>
            <a href="#" className="icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="icon"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 WanderWise. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
