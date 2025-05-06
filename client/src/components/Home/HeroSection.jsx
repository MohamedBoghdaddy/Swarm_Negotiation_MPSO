import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../styles/home.css";

const HeroSection = () => {
  return (
    <section className="hero-section py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4 font-weight-bold mb-4">
              Intelligent Negotiation with MPSO Technology
            </h1>
            <p className="lead mb-4">
              Revolutionizing automated negotiations between buyers and
              manufacturers using Multi-Swarm Particle Swarm Optimization.
            </p>
            <div className="d-flex gap-3">
              <Button as={Link} to="/user" variant="primary" size="lg">
                Start Negotiating Now
              </Button>
              <Button
                as={Link}
                to="/manufacturer"
                variant="outline-primary"
                size="lg"
              >
                I'm a Manufacturer
              </Button>
            </div>
          </div>
          <div className="col-md-6">
            <img
              src="/images/negotiation-hero.png"
              alt="Negotiation process illustration"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
