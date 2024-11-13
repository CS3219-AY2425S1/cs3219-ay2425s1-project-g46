// Author(s): Xiu Jia
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Route to ensure that users without ongoing collaboration cannot access collab pages
const CollaborationRestrictedRoute = () => {
  const location = useLocation();
  console.log("location", location.state);

  if (!location.state?.data?.id) {
    return (
      <Navigate
        to="*"
        state={{ from: location }} // Save the intended location in state
        replace
      />
    );
  }

  return <Outlet />;
  // // if user does not have ongoing collaboration (and therefore no roomId in session storage),
  // // redirect to another page (link to be modified/changed)
  // if (!sessionStorage.roomId) {
  //   return (
  //     <Navigate to="*" />
  //   );
  // }
  // return <Outlet />;
};

export default CollaborationRestrictedRoute;