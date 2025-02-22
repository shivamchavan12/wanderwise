import React from "react";
import "./Home.css";
import backgroundImage from "../assests/homebackground.jpg";
import Paris from "../assests/paris.jpg";

const Home = () => {
  return (
    <div className="home-container">
      {/* Transparent Header */}
      <header className="transparent-header">
        <h1 className="logo">WanderWise</h1>
      </header>

      {/* Hero Section with Background Image */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="overlay">
          <h1 className="hero-title">WanderWise</h1>
          <button className="start-button">Start Planning</button>
        </div>
      </div>

      {/* Favorite Places Section */}
      <section className="favorite-places">
        <h2 className="section-title">Favorite Places</h2>
        <div className="places-grid">
          {["Paris", "Bali", "New York"].map((place, index) => (
            <div key={index} className="place-card">
              <h3>{place}</h3>
              <p>Explore the beauty of {place} with curated travel plans.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 WanderWise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
