import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faLightbulb,
  faShieldAlt,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
// import teamPhoto from "../assets/images/team.jpg";
import "../../styles/home.css";

const WhoWeAre = () => {
  return (
    <section id="who-we-are" className="who-we-are-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center mb-5">
            <h2 className="section-title">Who We Are</h2>
            <p className="section-subtitle">
              Pioneers in Intelligent Negotiation Technology
            </p>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="team-photo-container">
              {/* <img
                src={teamPhoto}
                alt="MPSO Team"
                className="img-fluid rounded shadow"
              /> */}
              <div className="experience-badge">
                <span>5+ Years</span>
                <small>of AI Research</small>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="about-content">
              <p className="lead-text">
                We are an interdisciplinary team of AI researchers, negotiation
                experts, and software engineers committed to transforming how
                businesses negotiate through Multi-Swarm Particle Swarm
                Optimization technology.
              </p>

              <div className="key-points mt-4">
                <div className="key-point">
                  <div className="key-point-icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div>
                    <h4>Diverse Expertise</h4>
                    <p>
                      Combining AI specialists, economists, and industry
                      veterans to create balanced negotiation solutions.
                    </p>
                  </div>
                </div>

                <div className="key-point">
                  <div className="key-point-icon">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <div>
                    <h4>Innovation Driven</h4>
                    <p>
                      Continuously improving our algorithms based on the latest
                      research in swarm intelligence and game theory.
                    </p>
                  </div>
                </div>

                <div className="key-point">
                  <div className="key-point-icon">
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div>
                    <h4>Ethical Foundation</h4>
                    <p>
                      Committed to fair, transparent negotiations that benefit
                      all parties in the long term.
                    </p>
                  </div>
                </div>

                <div className="key-point">
                  <div className="key-point-icon">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <div>
                    <h4>Proven Results</h4>
                    <p>
                      Our technology has facilitated over 10,000 successful
                      negotiations with an average satisfaction rate of 94%.
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
