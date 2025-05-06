import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/Features.css";

const FeaturesSection = () => {
  const features = [
    {
      icon: "🤝",
      title: "AI-Driven Negotiation",
      description:
        "Leverage our MPSO engine to dynamically adjust offers and reach optimal deals between users and manufacturers.",
    },
    {
      icon: "📦",
      title: "Multi-Criteria Decisions",
      description:
        "Negotiate based on price, quality tier (Economy, Standard, Premium), and delivery deadline—all in real-time.",
    },
    {
      icon: "🚀",
      title: "Optimized Matchmaking",
      description:
        "Instantly connect users with compatible manufacturers while maintaining preferences and constraints.",
    },
  ];

  return (
    <section id="features" className="features-section">
      <Container>
        <h2 className="text-center mb-5">What Makes Tuah Powerful?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={4} className="mb-4" key={index}>
              <div className="feature-card h-100">
                <div
                  className="icon mb-3"
                  role="img"
                  aria-label={feature.title}
                >
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;
