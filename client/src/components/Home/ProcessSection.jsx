import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/home.css";

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: "User Inputs Initial Offer",
      description:
        "Buyer specifies fabric details, quantity, price range, quality preference, and delivery timeline",
    },
    {
      number: 2,
      title: "Manufacturer Constraints",
      description:
        "Manufacturers input their minimum acceptable prices, quality standards, and delivery capabilities",
    },
    {
      number: 3,
      title: "MPSO Optimization",
      description:
        "Algorithm evaluates all parameters and dynamically adjusts offers",
    },
    {
      number: 4,
      title: "Final Agreement",
      description: "System presents best matches and facilitates confirmation",
    },
  ];

  return (
    <section id="process" className="process-section py-5">
      <Container>
        <h2 className="text-center mb-5">How MPSO Negotiation Works</h2>
        <Row className="align-items-center">
          <Col md={6} className="order-md-2">
            <img
              src="/images/negotiation-process.png"
              alt="Negotiation process flow"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6} className="order-md-1">
            {steps.map((step) => (
              <div className="process-step mb-4" key={step.number}>
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
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
