import React, { useState } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { FaBug, FaUser, FaCloud } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/white_logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import WeatherComponent from "./WeatherComponent";



const HeaderWithoutLogin = ({ title }) => {
  const { user, isLoading, logout, loginWithRedirect, isAuthenticated } =
    useAuth0();
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);
  const handleWeatherPopupShow = () => setShowWeatherPopup(true);
  const handleWeatherPopupClose = () => setShowWeatherPopup(false);


  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
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
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    <RiLogoutBoxRLine /> Log Out
                  </Nav.Link>
                </>
              )}

              {/* <button onClick={() => loginWithRedirect()}>Log In</button> */}
              {/* </LinkContainer> */}
            </Nav>
          </Navbar.Collapse>
          <Modal show={showWeatherPopup} onHide={handleWeatherPopupClose} style={{
            width: "100%"
          }}>
            <Modal.Body>
              <WeatherComponent />
            </Modal.Body>
          </Modal>
        </Container>
      </Navbar>
    </header>
  );
};

export default HeaderWithoutLogin;
