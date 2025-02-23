import React from "react";
import "./Footer.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub , FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>
            <FaEnvelope style={{ color: "yellow", marginRight: "8px" }} />
            <a href="mailto:info@wanderwise.com">info@wanderwise.com</a>
          </p>
          <p>
            <FaPhone
              style={{
                color: "yellow",
                marginRight: "8px",
                transform: "scaleX(-1)", // Flip the icon horizontally
              }}
            />
            +91 98765 43210
          </p>
          <p>
            <FaMapMarkerAlt style={{ color: "yellow", marginRight: "8px" }} />
            Pune, India
          </p>
        </div>

        <div className="footer-section">
        <h3>Follow Us</h3>
          <div className="social-icons">
            <a 
              href="https://github.com/shivamchavan12/wanderwise" 
              className="icon" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaGithub style={{ color: "yellow", fontSize: "24px" }} />
            </a>
          </div>
          <h3>
            <FaLinkedin style={{ color: "#0077b5", marginRight: "8px" }} />
            Connect on LinkedIn
          </h3>
              <div className="linkedin-links">
                <a href="https://www.linkedin.com/in/shivam-chavan-07940728b/" target="_blank" rel="noopener noreferrer">Shivam</a>
                <a href="https://www.linkedin.com/in/ritesh-chaudhari-b77120283/" target="_blank" rel="noopener noreferrer">Ritesh</a>
                <a href="https://www.linkedin.com/in/ninad-mahajan-014a0b28b/" target="_blank" rel="noopener noreferrer">Ninad</a>
                <a href="https://www.linkedin.com/in/pallavi-chimanchode-789320287/" target="_blank" rel="noopener noreferrer">Pallavi</a>
              </div>
        </div>


        <div className="footer-section">
        <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/Tripplanner">Trip Planner</a></li>
            <li><a href="/form">Profile</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 WanderWise. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
