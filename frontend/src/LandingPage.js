import React, { useEffect } from "react";
import "./LandingPage.css";
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
        <div className="logo">Varpakodit</div>
        <nav className="nav">
          <a href="#features">Features</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Tervetuloa Varpakodit-Sovellukseen!</h1>
          <p>.</p>

          {/* Show sign in button if not authenticated, else show logout */}
          {!isAuthenticated ? (
            <button onClick={handleGetStarted} className="get-started-button">
              Kirjaudu sisään tai rekisteröidy täältä
            </button>
          ) : (
            <button onClick={() => logout({ returnTo: window.location.origin })} className="get-started-button">
              Kirjaudu ulos
            </button>
          )}
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>Monitoroi käyttäjien kehitystä</h3>
            <p>Tarkastele käyttäjien kehitystä erilaisten mittarien ja taulukoiden avulla.</p>
          </div>
          <div className="feature-item">
            <h3>Päämäärät</h3>
            <p>Käyttäjät voivat saavuttaa omia tavoitteitaan tämän sovelluksen avulla.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Varpakodit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;