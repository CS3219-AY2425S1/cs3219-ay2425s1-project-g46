// Author(s): Xinyi
import React from "react";
import axios from "axios";

function Logout() {

  const logout = (event) => {
    // allows page reload
    axios.post(`http://localhost:5001/user/logout`).then((response) => {
      // clear token, email and username from session storage
      sessionStorage.clear();
      // display successful logout message in console
      console.log(response.data.message);
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