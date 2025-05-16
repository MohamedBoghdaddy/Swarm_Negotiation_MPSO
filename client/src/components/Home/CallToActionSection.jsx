import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faIndustry,
  faHandshake,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../context/AuthContext";
import "../../styles/callToAction.css";

const CallToActionSection = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;

  const handleUserClick = () => navigate("/user");
  const handleManufacturerClick = () => navigate("/manufacturer");
  const handleAdminClick = () => navigate("/dashboard");

  const getGreeting = () => {
    if (!isAuthenticated) return null;

    const role = user?.role;
    const name = user?.firstName || user?.username;

    switch (role) {
      case "user":
        return `👋 Welcome back, ${name}! Ready to optimize your next deal?`;
      case "manufacturer":
        return `🏭 Hello ${name}, ready to list a new offer?`;
      case "admin":
        return `🛠️ Welcome Admin ${name}, monitoring ongoing negotiations.`;
      default:
        return `👋 Hello, ${name}`;
    }
  };

  return (
    <section className="cta-section text-white text-center">
      <Container>
        <Row className="justify-content-center mb-4">
          {isAuthenticated && (
            <Col
              lg={10}
              className="user-greeting d-flex align-items-center justify-content-center gap-3"
            >
              <Image
                src={user?.profilePhoto || "/default-avatar.png"}
                alt="User Avatar"
                roundedCircle
                width={60}
                height={60}
              />
              <h5 className="mb-0">{getGreeting()}</h5>
            </Col>
          )}
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="cta-badge mb-3">
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              Powered by Multi-Swarm PSO Intelligence
            </div>

            <h2 className="cta-title mb-4">
              Revolutionize Textile Negotiation with AI Optimization
            </h2>

            <p className="cta-text mb-5">
              Whether you're sourcing premium fabrics or offering top-quality
              materials, our intelligent negotiation agent ensures fair, fast,
              and optimized agreements for all parties.
            </p>

            <div className="cta-buttons d-flex flex-column flex-md-row justify-content-center gap-3">
              {!isAuthenticated && (
                <>
                  <Button variant="light" size="lg" onClick={handleUserClick}>
                    <FontAwesomeIcon icon={faHandshake} className="me-2" />
                    I’m a Fabric Buyer
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    onClick={handleManufacturerClick}
                  >
                    <FontAwesomeIcon icon={faIndustry} className="me-2" />
                    I’m a Manufacturer
                  </Button>
                </>
              )}

              {isAuthenticated && user?.role === "user" && (
                <Button variant="light" size="lg" onClick={handleUserClick}>
                  <FontAwesomeIcon icon={faHandshake} className="me-2" />
                  Go to Buyer Panel
                </Button>
              )}

              {isAuthenticated && user?.role === "manufacturer" && (
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={handleManufacturerClick}
                >
                  <FontAwesomeIcon icon={faIndustry} className="me-2" />
                  Go to Manufacturer Panel
                </Button>
              )}

              {isAuthenticated && user?.role === "admin" && (
                <Button variant="success" size="lg" onClick={handleAdminClick}>
                  <FontAwesomeIcon icon={faUsersCog} className="me-2" />
                  Admin Dashboard
                </Button>
              )}
            </div>

            <div className="trust-badges mt-5 d-flex flex-wrap justify-content-center gap-4">
              <div className="trust-item">
                <div className="trust-number">20,000+</div>
                <div className="trust-label">Optimized Transactions</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">97%</div>
                <div className="trust-label">Matched Preferences</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">4x</div>
                <div className="trust-label">Faster Decision Time</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CallToActionSection;
