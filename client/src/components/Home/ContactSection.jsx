import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Image,
} from "react-bootstrap";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/contact.css";

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // success or error

  const onSubmit = async (data) => {
    setStatusMessage("");
    setStatusType("");
    try {
      const res = await emailjs.send(
        "service_h21foc9",
        "template_t64w4wp",
        data,
        "PV9slaOWlMSALkZ3v"
      );
      if (res.status === 200) {
        setStatusMessage("✅ Message sent successfully!");
        setStatusType("success");
        reset();
      } else {
        setStatusMessage("❌ Failed to send message. Please try again.");
        setStatusType("error");
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatusMessage("❌ Error sending message.");
      setStatusType("error");
    }
  };

  return (
    <section id="contact" className="contact-section py-5 bg-dark text-white">
      <Container>
        <h2 className="text-center mb-5 fw-bold text-uppercase">
          Connect with Tuah
        </h2>
        <Row>
          {/* Contact Form */}
          <Col md={6}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 rounded contact-form"
            >
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name", {
                    required: "Name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                  })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@domain.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="How can we help you regarding MPSO Negotiation?"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "At least 10 characters required",
                    },
                    maxLength: {
                      value: 500,
                      message: "Message too long (max 500 characters)",
                    },
                  })}
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="light"
                type="submit"
                className="w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Send Message"
                )}
              </Button>

              {statusMessage && (
                <div
                  className={`mt-3 text-center fw-bold ${
                    statusType === "success" ? "text-success" : "text-danger"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      statusType === "success" ? faCheckCircle : faTimesCircle
                    }
                    className="me-2"
                  />
                  {statusMessage}
                </div>
              )}
            </Form>
          </Col>

          {/* Contact Info */}
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
