import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/home.css";

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: "Buyer Submits Offer",
      description:
        "The user defines fabric type, quantity, target price, preferred quality (Economy, Standard, Premium), and delivery deadline.",
    },
    {
      number: 2,
      title: "Manufacturer Constraints",
      description:
        "Each manufacturer sets their minimum price, available qualities, and delivery capabilities for comparison.",
    },
    {
      number: 3,
      title: "MPSO Optimization Engine",
      description:
        "The Multi-Swarm Particle Swarm Optimization algorithm calculates fitness scores, adjusts offers, and ranks matches in real-time.",
    },
    {
      number: 4,
      title: "Agreement Finalization",
      description:
        "The best-fit manufacturer is proposed. User can accept the deal, save history, or reconfigure preferences.",
    },
  ];

  return (
    <section id="process" className="process-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-uppercase">
          How the Tuah Negotiation Works
        </h2>
        <Row className="align-items-center">
          <Col md={6} className="order-md-2 mb-4 mb-md-0">
            <img
              src="/images/negotiation-process.png"
              alt="MPSO negotiation flow"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6} className="order-md-1">
            {steps.map((step) => (
              <div className="process-step d-flex mb-4" key={step.number}>
                <div className="step-number me-3">{step.number}</div>
                <div className="step-content">
                  <h4 className="fw-semibold">{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProcessSection;
