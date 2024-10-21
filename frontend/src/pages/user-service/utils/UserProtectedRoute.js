// Author(s): Xinyi
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {

  // if user is logged-out (and therefore a token is not stored in session storage),
  // redirect to another page (link to be modified/changed)
  return sessionStorage.token ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default UserProtectedRoute;