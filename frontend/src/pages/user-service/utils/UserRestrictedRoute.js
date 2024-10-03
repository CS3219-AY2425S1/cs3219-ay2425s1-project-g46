// Author(s): Xinyi
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRestrictedRoute = () => {

  // if user is logged-in (and therefore a token is stored in session storage),
  // redirect to another page (link to be modified/changed)
  if (sessionStorage.token) {
    return (
      <Navigate to="/" />
    );
  }
  return <Outlet />;
};

export default UserRestrictedRoute;