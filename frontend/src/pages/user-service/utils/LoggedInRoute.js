// Author(s): Xinyi
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Route to ensure that users not logged in cannot access certain pages
const LoggedOutRoute = () => {

  // if user is NOT logged-in (and therefore no token in session storage),
  // redirect to another page (link to be modified/changed)
  if (!sessionStorage.token) {
    return (
      <Navigate to="*" />
    );
  }
  return <Outlet />;
};

export default LoggedOutRoute;