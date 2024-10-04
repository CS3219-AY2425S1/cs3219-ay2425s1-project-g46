// Author(s): Xinyi
import React from "react";
import "./styles/NavBar.css";
import Logout from "../pages/user-service/Logout"

function NavBar() {
  const isLoggedIn = sessionStorage.token;
  const username = sessionStorage.username;

  return (
    <nav id="navBar">
      <div id="navBarLogo">
        <a href="/"><strong>PeerPrep</strong></a>
      </div>

      {/* add welcome message if user is logged in */}
      {isLoggedIn ?
        <span id="welcomeUser">
          Welcome, {username}!
        </span>
        : null
      }

      <div id="navBarContent">
        <ul id="navBarLinks">
          {/* href links to be modified if needed */}
          <li>
            <a href="/">Home</a>
          </li>
          {/* hide signup button if logged in */}
          {isLoggedIn ? null :
            <li id="signUpBtn">
              <a href="/user/signup">Sign Up</a>
            </li>
          }
          {/* change login/logout button content based on presence of token */}
          {isLoggedIn ? <Logout></Logout> :
            <li id="logBtn">
              <a href="/user/login">Login</a>
            </li>
          }
        </ul>
      </div>
    </nav>
  )
}

export default NavBar;