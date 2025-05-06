import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/CtaSection.css";

const CtaSection = () => {
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
              as={Link}
              to="/user"
              size="lg"
              className="btn btn-light shadow-sm"
            >
              Start Your First Negotiation
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CtaSection;
