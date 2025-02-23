import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Map, Clock, Zap } from "lucide-react";
import backgroundImage from "../assests/bg1.jpg";
import parisImage from "../assests/paris.jpg";
import tokyoImage from "../assests/tokyo.jpg";

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".feature-container").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleStartPlanning = () => {
    navigate("/tripplanner");
  };

  return (
    <>
      {/* Banner Section */}
      <div className="banner-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="banner-overlay">
          <h1 className="banner-title">WanderWise</h1>
        </div>
      </div>

      <div className="home-container">
        {/* Features Section */}
        <section className="features-section">
          {/* First Feature Set */}
          <div className="feature-container">
            <img src={parisImage} alt="Paris" className="feature-image" />
            <div className="feature-content">
              <h2 className="feature-title">Smart Travel Planning</h2>
              <div className="feature-list">
                <div className="feature-item">
                  <Map className="feature-icon" />
                  <div className="feature-text">
                    <h4>Intelligent Routing</h4>
                    <p>Optimize your daily itinerary with our smart routing algorithm</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Clock className="feature-icon" />
                  <div className="feature-text">
                    <h4>Time Management</h4>
                    <p>Perfect timing suggestions for attractions and activities</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Zap className="feature-icon" />
                  <div className="feature-text">
                    <h4>Quick Planning</h4>
                    <p>Create comprehensive travel plans in minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Feature Set */}
          <div className="feature-container right">
            <img src={tokyoImage} alt="Tokyo" className="feature-image" />
            <div className="feature-content">
              <h2 className="feature-title">Personalized Experience</h2>
              <div className="feature-list">
                <div className="feature-item">
                  <Map className="feature-icon" />
                  <div className="feature-text">
                    <h4>Custom Recommendations</h4>
                    <p>Get personalized suggestions based on your preferences</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Clock className="feature-icon" />
                  <div className="feature-text">
                    <h4>Flexible Scheduling</h4>
                    <p>Easily adjust your plans on the go</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Zap className="feature-icon" />
                  <div className="feature-text">
                    <h4>Local Insights</h4>
                    <p>Access curated tips from local experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;