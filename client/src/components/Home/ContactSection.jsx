import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";
import "../../styles/contact.css";

const ContactSection = () => {
  const form = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email) => email.includes("@");

  const sendEmail = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid email address with '@'");
      return;
    }

    emailjs
      .sendForm(
        "service_42p3sju",
        "template_t64w4wp",
        form.current,
        "PV9slaOWlMSALkZ3v"
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          setEmail("");
          setName("");
          setMessage("");
        },
        (error) => console.log("FAILED...", error.text)
      );
  };

  return (
    <section id="contact" className="contact-section py-5 bg-dark text-white">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-uppercase">
          Connect with Tuah
        </h2>
        <Row>
          <Col md={6} className="mb-4">
            <Form
              ref={form}
              onSubmit={sendEmail}
              className="p-4 rounded contact-form"
            >
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you regarding MPSO Negotiation?"
                  required
                />
              </Form.Group>
              <Button variant="light" type="submit" className="w-100">
                Send Message
              </Button>
            </Form>
          </Col>

          <Col md={6} className="d-flex flex-column justify-content-center p-4">
            <div className="contact-info">
              <h4 className="fw-bold mb-3">Our Headquarters</h4>
              <p className="mb-4">
                Tuah Labs, Innovation District
                <br />
                Smart Manufacturing Valley, Malaysia
                <br />
                Asia Pacific HQ
              </p>
              <h4 className="fw-bold mb-3">Email Support</h4>
              <p className="mb-4">support@tuah-negotiation.ai</p>
              <h4 className="fw-bold mb-3">Call Us</h4>
              <p className="mb-4">+60 12-345 6789</p>
              <div className="social-links d-flex gap-3 mt-3">
                <a
                  href="https://facebook.com"
                  className="social-icon"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="social-icon"
                  aria-label="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a
                  href="https://instagram.com"
                  className="social-icon"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactSection;
