import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../styles/home.css";

const HeroSection = () => {
  return (
    <section className="hero-section py-5 bg-light text-dark">
      <div className="container">
        <div className="row align-items-center">
          {/* Text Block */}
          <div className="col-md-6 mb-4 mb-md-0 fade-in-left">
            <h1 className="display-5 fw-bold mb-3">
              AI-Powered Fabric Deal Optimization with MPSO
            </h1>
            <p className="lead mb-4">
              Tuah transforms textile negotiations by matching buyers and
              manufacturers using our intelligent Multi-Swarm Particle Swarm
              Optimization (MPSO) agent.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button as={Link} to="/user" variant="primary" size="lg">
                Start as Buyer
              </Button>
              <Button
                as={Link}
                to="/manufacturer"
                variant="outline-primary"
                size="lg"
              >
                Join as Manufacturer
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="col-md-6 text-center fade-in-right">
            <img
              src="/images/negotiation-hero.png"
              alt="AI-driven negotiation system"
              className="img-fluid rounded shadow-sm"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
