import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import "../../styles/footer.css";
import "../../App.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* App Description */}
        <div className="footer-col">
          <h4>Tuah — MPSO Negotiation System</h4>
          <p>
            Tuah revolutionizes multi-party negotiation using intelligent
            Multi-Swarm Particle Swarm Optimization (MPSO) agents. Users and
            manufacturers collaborate on price, quality, and delivery —
            optimized in real-time.
          </p>
          <div className="icons">
            <a
              href="https://www.facebook.com/tuah.app"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/tuah.app"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.linkedin.com/company/tuah-ai"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="footer-col">
          <h4>Navigation</h4>
          <div className="footer-links">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/user" className="footer-link">
              User Form
            </Link>
            <Link to="/manufacturer" className="footer-link">
              Manufacturer Form
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h4>Subscribe to Negotiation Insights</h4>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Tuah MPSO Negotiation System. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
