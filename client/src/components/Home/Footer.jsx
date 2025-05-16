import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "../../styles/footer.css";
import "../../App.css";
import { useAuthContext } from "../../context/AuthContext";

const Footer = () => {
  const { state } = useAuthContext();
  const role = state?.user?.role;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setMessage("❌ Subscription failed. Try again later.");
    }
  };


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
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/tuah.app"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.linkedin.com/company/tuah-ai"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
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
            {role === "admin" && (
              <Link to="/dashboard" className="footer-link">
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h4>Subscribe to Negotiation Insights</h4>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
          {message && (
            <p
              className="text-warning fw-bold mt-2"
              style={{ fontSize: "0.9em" }}
            >
              {message}
            </p>
          )}
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
