import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/CtaSection.css";
import { useAuthContext } from "../../context/AuthContext";

const CtaSection = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const { isAuthenticated, user } = state;

  const handleClick = () => {
    if (!isAuthenticated) return navigate("/signup");

    switch (user?.role) {
      case "user":
        navigate("/user");
        break;
      case "manufacturer":
        navigate("/manufacturer");
        break;
      case "admin":
        navigate("/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const getCtaText = () => {
    if (!isAuthenticated) return "Start Your First Negotiation";
    if (user?.role === "user") return "Negotiate as Buyer";
    if (user?.role === "manufacturer") return "Manage Your Offers";
    if (user?.role === "admin") return "Go to Admin Dashboard";
    return "Explore";
  };

  return (
    <section className="cta-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} className="text-center">
            <h2 className="mb-4">
              Ready to Transform Textile Deals with Tuah?
            </h2>
            <p className="lead mb-4">
              Join our AI-powered negotiation platform driven by Multi-Swarm
              Particle Swarm Optimization (MPSO) and achieve optimal agreements
              between users and manufacturers.
            </p>
            <Button
              size="lg"
              className="btn btn-light shadow-sm"
              onClick={handleClick}
            >
              {getCtaText()}
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CtaSection;
