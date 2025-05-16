import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faLightbulb,
  faShieldAlt,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/home.css"; // you may separate a whoWeAre.css if needed

const WhoWeAre = () => {
  return (
    <section id="who-we-are" className="who-we-are-section py-5 bg-white">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="section-title fw-bold">Who We Are</h2>
            <p className="section-subtitle text-muted fs-5">
              Pioneers in AI-Powered Negotiation Using Swarm Intelligence
            </p>
          </Col>
        </Row>

        <Row className="align-items-center">
          {/* Optional Team Photo Block */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="team-photo-container text-center">
              <div className="team-photo-placeholder rounded shadow p-5 bg-light">
                {/* Placeholder - Replace with image if needed */}
                <h5 className="text-muted">Team Photo Coming Soon</h5>
              </div>
              <div className="experience-badge mt-3">
                <span className="fs-4 fw-bold">5+ Years</span>
                <div className="text-muted">in AI Research & Optimization</div>
              </div>
            </div>
          </Col>

          {/* Content Area */}
          <Col lg={6}>
            <div className="about-content">
              <p className="lead-text text-dark fs-5">
                We’re a collaborative team of AI researchers, economists, and
                software engineers reshaping the future of negotiation. Our
                mission is to enable real-time, multi-objective deal-making with
                fairness and efficiency at its core.
              </p>

              <div className="key-points mt-4">
                {/* Point 1 */}
                <div className="key-point d-flex mb-4">
                  <div className="key-point-icon me-3">
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                  </div>
                  <div>
                    <h5 className="fw-bold">Diverse Expertise</h5>
                    <p className="mb-0">
                      We merge backgrounds in swarm AI, supply chain, and
                      negotiation psychology.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="key-point d-flex mb-4">
                  <div className="key-point-icon me-3">
                    <FontAwesomeIcon icon={faLightbulb} size="lg" />
                  </div>
                  <div>
                    <h5 className="fw-bold">Innovation Driven</h5>
                    <p className="mb-0">
                      Our MPSO engine is built on the latest in swarm
                      intelligence and adaptive optimization.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="key-point d-flex mb-4">
                  <div className="key-point-icon me-3">
                    <FontAwesomeIcon icon={faShieldAlt} size="lg" />
                  </div>
                  <div>
                    <h5 className="fw-bold">Ethical Negotiation</h5>
                    <p className="mb-0">
                      We ensure transparency and fairness are hardcoded into
                      every deal.
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="key-point d-flex">
                  <div className="key-point-icon me-3">
                    <FontAwesomeIcon icon={faChartLine} size="lg" />
                  </div>
                  <div>
                    <h5 className="fw-bold">Proven Impact</h5>
                    <p className="mb-0">
                      Over 10,000 successful negotiations with 94%+ satisfaction
                      rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhoWeAre;
