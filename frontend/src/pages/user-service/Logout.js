// Author(s): Xinyi
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_GATEWAY_URL_API } from "../../config/constant";

function Logout() {
  const navigate = useNavigate();

  const logout = (event) => {
    // prevent page reload
    event.preventDefault();
    axios.post(`${API_GATEWAY_URL_API}/user/logout`).then((response) => {
      // clear token, email and username from session storage
      sessionStorage.clear();
      // display successful logout message in console
      console.log(response.data.message);
      // navigate to home page after logout
      navigate("/");
    }).catch((error) => {
      if (error.response && error.response.status === 429) {
        alert("You have exceeded the rate limit. Please wait a moment and try again.");
      }
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