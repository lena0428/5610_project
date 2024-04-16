import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { FaCloud, FaBug, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/white_logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import WeatherComponent from "./WeatherComponent";

const Header = ({ title }) => {
  const { user, isLoading, logout, isAuthenticated } = useAuth0();
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);

  const handleWeatherPopupClose = () => setShowWeatherPopup(false);
  const handleWeatherPopupShow = () => setShowWeatherPopup(true);

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/app">
            <Navbar.Brand>
              <img src={logo} alt="logo" height={40} width={40} />
              &nbsp;&nbsp;&nbsp;{title}
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleWeatherPopupShow}>
                <FaCloud /> Weather
              </Nav.Link>
              <Nav.Link href="/app/debugger">
                <FaBug /> Auth Debugger
              </Nav.Link>
              <Nav.Link href="/app/profile">
                <FaUser /> Profile
              </Nav.Link>
              <Nav.Link
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                <RiLogoutBoxRLine /> Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showWeatherPopup} onHide={handleWeatherPopupClose}>
        <Modal.Header closeButton>
          <Modal.Title>Weather Popup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WeatherComponent/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleWeatherPopupClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;
