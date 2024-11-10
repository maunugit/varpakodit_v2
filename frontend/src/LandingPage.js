import React, { useEffect } from "react";
import "./LandingPage.css"; // Assume there's a CSS file for styles
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: '/main' }  // Set returnTo to /main
      });
    } catch (error) {
      console.error("Error during Auth0 login", error);
    }
  };

  // If the user is authenticated, redirect to /main
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/main");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">Varpakoddit</div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Varpakoddit</h1>
          <p>Track your child's growth, milestones, and development all in one place.</p>

          {/* Show sign in button if not authenticated, else show logout */}
          {!isAuthenticated ? (
            <button onClick={handleGetStarted} className="get-started-button">
              Sign In or Create an account here!
            </button>
          ) : (
            <button onClick={() => logout({ returnTo: window.location.origin })} className="get-started-button">
              Log Out
            </button>
          )}
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>Growth Tracking</h3>
            <p>Monitor your child's physical growth with easy-to-use charts.</p>
          </div>
          <div className="feature-item">
            <h3>Milestone Monitoring</h3>
            <p>Track key developmental milestones and ensure your child is on the right path.</p>
          </div>
          <div className="feature-item">
            <h3>Personalized Insights</h3>
            <p>Get insights and recommendations tailored to your child's unique growth pattern.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works-section">
        <h2>How It Works</h2>
        <ol className="how-it-works-list">
          <li>Input your child's data, including height, weight, and other metrics.</li>
          <li>Track progress over time with easy-to-read charts and reports.</li>
          <li>Receive personalized insights to support your child's development.</li>
        </ol>
      </section>

      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@varpakoddit.com">support@varpakoddit.com</a>.</p>
      </section>

      <footer className="footer">
        <p>© 2024 Varpakoddit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;