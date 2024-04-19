import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { FaBug, FaUser, FaCloud } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/white_logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import WeatherComponent from "./WeatherComponent";

const Header = ({ title }) => {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);

  const handleWeatherPopupClose = () => setShowWeatherPopup(false);
  const handleWeatherPopupShow = () => setShowWeatherPopup(true);

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to={isAuthenticated ? "/app" : "/"}>
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
              {!isAuthenticated ? (
                <Nav.Link onClick={() => loginWithRedirect()}>
                  <FaUser /> Sign In
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link href="/app/debugger">
                    <FaBug /> Auth Debugger
                  </Nav.Link>
                  <Nav.Link href="/app/profile">
                    <FaUser /> Profile
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => logout({ returnTo: `${process.env.REACT_APP_BASE_URL}`  })}
                  >
                    <RiLogoutBoxRLine /> Log Out
                  </Nav.Link>
                </>
              )}

              {/* <button onClick={() => loginWithRedirect()}>Log In</button> */}
              {/* </LinkContainer> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showWeatherPopup} onHide={handleWeatherPopupClose} style={{
        width: "100%"
      }}>
        <Modal.Body>
          <WeatherComponent />
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;
