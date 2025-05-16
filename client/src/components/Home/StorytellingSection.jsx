import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../../styles/storytelling.css";

const StorytellingSection = () => {
  return (
    <section className="storytelling-section py-5 bg-white" id="about">
      <Container>
        <Row className="align-items-center">
          {/* Image Section */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="storytelling-image text-center">
              <img
                src={logo}
                alt="Tuah MPSO Negotiation Logo"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </Col>

          {/* Content Section */}
          <Col lg={6}>
            <div className="storytelling-content">
              <h2 className="section-title fw-bold mb-4">
                Empowering Fabric Deals with Swarm Intelligence
              </h2>

              <p className="lead highlight text-muted">
                Tuah combines real-world supply chain needs with powerful
                Multi-Swarm Particle Swarm Optimization (MPSO) to automate
                textile negotiation like never before.
              </p>

              <p>
                Our system intelligently balances cost, quality, and timeline
                across multiple parties—helping buyers and manufacturers find
                optimized outcomes with full transparency.
              </p>

              <p>
                From R&D breakthroughs to industry-wide rollout, Tuah is
                transforming negotiation from a manual bottleneck into a smart,
                real-time collaboration channel.
              </p>

              <div className="milestones mt-4">
                <h5 className="mb-3">🚀 Key Milestones</h5>
                <ul className="timeline-list ps-3">
                  <li>
                    <strong>2019:</strong> PSO research in industrial
                    procurement
                  </li>
                  <li>
                    <strong>2020:</strong> Multi-Swarm AI prototype deployed
                  </li>
                  <li>
                    <strong>2021:</strong> Textile pilot with measurable ROI
                  </li>
                  <li>
                    <strong>2022–Now:</strong> Cross-industry SaaS rollout
                  </li>
                </ul>
              </div>

              <div className="cta-buttons mt-4">
                <Button
                  as={Link}
                  to="/user"
                  variant="primary"
                  size="lg"
                  className="me-3"
                >
                  🎯 Try Tuah Now
                </Button>
                <Button
                  as={Link}
                  to="/manufacturer"
                  variant="outline-primary"
                  size="lg"
                >
                  🏭 I’m a Manufacturer
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StorytellingSection;
