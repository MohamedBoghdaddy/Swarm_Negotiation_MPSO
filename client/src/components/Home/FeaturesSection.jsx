import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaRobot,
  FaBalanceScale,
  FaHandshake,
  FaChartLine,
  FaUserShield,
} from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import "../../styles/Features.css";

const FeaturesSection = () => {
  const { state } = useAuthContext();
  const role = state?.user?.role || "guest";

  const baseFeatures = [
    {
      icon: <FaRobot size={40} />,
      title: "AI-Driven Negotiation",
      description:
        "Leverage our MPSO engine to dynamically adjust offers and reach optimal deals between users and manufacturers.",
    },
    {
      icon: <FaBalanceScale size={40} />,
      title: "Multi-Criteria Decisions",
      description:
        "Negotiate based on price, quality tier (Economy, Standard, Premium), and delivery deadline—all in real-time.",
    },
    {
      icon: <FaHandshake size={40} />,
      title: "Optimized Matchmaking",
      description:
        "Instantly connect users with compatible manufacturers while maintaining preferences and constraints.",
    },
  ];

  const adminFeatures = [
    {
      icon: <FaUserShield size={40} />,
      title: "Admin Dashboard",
      description:
        "Monitor negotiations, manage users and manufacturers, and oversee system-wide performance with full visibility.",
    },
  ];

  const manufacturerFeatures = [
    {
      icon: <FaChartLine size={40} />,
      title: "Market Insights",
      description:
        "View user trends and optimize your offers based on real-time buyer preferences and historical deals.",
    },
  ];

  let featuresToDisplay = baseFeatures;

  if (role === "admin") {
    featuresToDisplay = [...baseFeatures, ...adminFeatures];
  } else if (role === "manufacturer") {
    featuresToDisplay = [...baseFeatures, ...manufacturerFeatures];
  }

  return (
    <section id="features" className="features-section">
      <Container>
        <h2 className="text-center mb-5">What Makes Tuah Powerful?</h2>
        <Row>
          {featuresToDisplay.map((feature, index) => (
            <Col md={4} className="mb-4" key={index}>
              <div className="feature-card h-100 text-center p-4 shadow-sm rounded">
                <div className="icon text-primary mb-3">{feature.icon}</div>
                <h4 className="mb-2">{feature.title}</h4>
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
