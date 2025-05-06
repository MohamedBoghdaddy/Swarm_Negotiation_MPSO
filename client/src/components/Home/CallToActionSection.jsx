import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faIndustry,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/callToAction.css";

const CallToActionSection = () => {
  const navigate = useNavigate();

  const handleUserClick = () => navigate("/user");
  const handleManufacturerClick = () => navigate("/manufacturer");

  return (
    <section className="cta-section text-white text-center">
      <Container>
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
