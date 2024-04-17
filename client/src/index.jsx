import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import Profile from "./components/Profile";
import HomeLoggedIn from "./components/HomeLoggedIn";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import "bootstrap/dist/css/bootstrap.min.css";
import GroupDetail from "./components/GroupDetail";
import GroupDetailWithoutLogin from "./components/GroupDetailWithoutLogin";
import { Container } from "react-bootstrap";
const container = document.getElementById("root");

const requestedScopes = ["profile", "email"];

function RequireAuth({ children }) {
  const { isLoading, loginWithRedirect, isAuthenticated } =
    useAuth0();
  // // If the user is not authenticated, redirect to the home page
  // if (!isLoading && !isAuthenticated) {
  //   return loginWithRedirect();
  // }

  // Otherwise, display the children (the protected page)
  return children;
}

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="/groups/:id" element={<GroupDetailWithoutLogin />} />
              <Route path="/verify-user" element={<VerifyUser />} />
              <Route path="/app" element={<HomeLoggedIn />} />
              <Route path="/app/groups/:id" element={<GroupDetail />} />
              <Route path="/app/debugger" element={<AuthDebugger />} />
              <Route path="/app/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
