import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { FaBug } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/white_logo.svg";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Header = ({ title }) => {
  const { user, isLoading, logout, loginWithRedirect, isAuthenticated } =
    useAuth0();

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
              {/* <LinkContainer to="/login"> */}

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
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
