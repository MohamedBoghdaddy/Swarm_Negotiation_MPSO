import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../../styles/storytelling.css";

const StorytellingSection = () => {
  return (
    <section className="storytelling-section" id="about">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="storytelling-image">
              <img
                src={logo}
                alt="MPSO Negotiation Logo"
                className="img-fluid rounded shadow"
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="storytelling-content">
              <h2 className="section-title mb-4">
                Empowering Negotiation with MPSO
              </h2>
              <p className="highlight">
                From ideation to innovation, we set out to redefine negotiation
                through AI. The Tuah App brings together intelligent agents and
                MPSO algorithms to ensure efficient, fair, and optimal
                deal-making for buyers and manufacturers.
              </p>
              <p>
                With a deep understanding of industrial constraints and
                real-world complexities, our system empowers decision-makers to
                negotiate multi-dimensional offers—price, quality, delivery—at
                scale and in real-time.
              </p>
              <p>
                Trusted by forward-thinking manufacturers and buyers alike, we
                are committed to transparency, adaptive intelligence, and
                delivering real business outcomes.
              </p>
              <div className="milestones mt-4">
                <h5>Our Milestones:</h5>
                <ul className="timeline-list">
                  <li>
                    <strong>2019:</strong> Research on PSO for industrial
                    negotiation
                  </li>
                  <li>
                    <strong>2020:</strong> MPSO-based prototype completed
                  </li>
                  <li>
                    <strong>2021:</strong> Pilot run with textile manufacturers
                  </li>
                  <li>
                    <strong>2022:</strong> Full platform launch across
                    industries
                  </li>
                </ul>
              </div>
              <div className="cta-buttons mt-4">
                <Button as={Link} to="/user" variant="primary" className="me-3">
                  Try Our System
                </Button>
                <Button as={Link} to="/manufacturer" variant="outline-primary">
                  Learn More
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
