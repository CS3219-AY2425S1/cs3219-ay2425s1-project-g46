// Author(s): Xinyi
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  const logout = (event) => {
    // prevent page reload
    event.preventDefault();
    axios.post(`http://localhost:5001/user/logout`).then((response) => {
      // clear token, email and username from session storage
      sessionStorage.clear();
      // display successful logout message in console
      console.log(response.data.message);
      // navigate to home page after logout
      navigate("/");
    }).catch((error) => {
      console.log(error);
      return
    });

  }

  return (
    <li id="logBtn">
      {/* href to refresh page, link to be modified/changed if needed */}
      <a href="/" onClick={logout}>Logout</a>
    </li>
  )
}

export default Logout;  