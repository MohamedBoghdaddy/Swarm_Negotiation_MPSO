import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Modal,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faSearch,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useAuthContext } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";
import Login from "../login&register/Login";
import logo from "../assets/images/logo.png";
import "../../styles/navbar.css";

const NavBar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const { user, isAuthenticated } = useAuthContext();
  const { logout } = useLogout();

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleNavCollapse = () => setExpanded((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setExpanded(false);
    }
  };

  const role = user?.role;

  return (
    <>
      <Navbar
        expand="lg"
        className="navbar-custom"
        variant="dark"
        fixed="top"
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Image
              src={logo}
              alt="Tuah App Logo"
              width="60"
              height="60"
              className="d-inline-block align-top rounded-circle"
            />
            <span className="ms-2 fs-5 fw-bold gradient-text">
              Tuah — MPSO Negotiation
            </span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar"
            onClick={handleNavCollapse}
          />

          <Navbar.Collapse id="main-navbar" className="justify-content-between">
            <Nav className="me-auto align-items-center">
              <ScrollLink
                to="hero-section"
                smooth
                className="nav-link"
                onClick={handleNavCollapse}
              >
                Home
              </ScrollLink>
              <ScrollLink
                to="features-section"
                smooth
                className="nav-link"
                onClick={handleNavCollapse}
              >
                Features
              </ScrollLink>
              <ScrollLink
                to="process-section"
                smooth
                className="nav-link"
                onClick={handleNavCollapse}
              >
                How It Works
              </ScrollLink>

              {isAuthenticated && role === "user" && (
                <Link
                  to="/user"
                  className="nav-link"
                  onClick={handleNavCollapse}
                >
                  User Form
                </Link>
              )}

              {isAuthenticated && role === "manufacturer" && (
                <Link
                  to="/manufacturer"
                  className="nav-link"
                  onClick={handleNavCollapse}
                >
                  Manufacturer Form
                </Link>
              )}

              {isAuthenticated && role === "admin" && (
                <Link
                  to="/dashboard"
                  className="nav-link"
                  onClick={handleNavCollapse}
                >
                  <FontAwesomeIcon icon={faGaugeHigh} className="me-1" />
                  Admin Dashboard
                </Link>
              )}
            </Nav>

            <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button type="submit" variant="outline-light">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>

            {isAuthenticated ? (
              <Nav className="align-items-center">
                <div
                  className="nav-link cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  Logout
                </div>
              </Nav>
            ) : (
              <div
                className="nav-link cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={handleLoginModalOpen}
              >
                <FontAwesomeIcon icon={faUser} className="me-1" /> Login
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLoginModal} onHide={handleLoginModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login to Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onLoginSuccess={handleLoginModalClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavBar;
