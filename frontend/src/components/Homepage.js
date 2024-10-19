// Author(s): Xinyi
import { useNavigate } from "react-router-dom";
import "./styles/Homepage.css";
import NavBar from "./NavBar";

const Homepage = () => {
  const navigate = useNavigate();

  const isLoggedIn = sessionStorage.token;

  return (
    <div id="homepageContainer">
      <NavBar />
      <div id="homepageContext">
        <div id="homepageContextContent">
          <h1>Welcome to PeerPrep!</h1>
          <span id="description">
              <p>PeerPrep is here to help students practise for interviews.</p>
              <p>Simply select your preferred category and difficulty level of questions to start matching with a peer.</p>
              <p>Once matched, start collaborating in real-time with your matched peer on a question from our databank.</p>
          </span>

          {isLoggedIn ?
              <button onClick={() => navigate("/matching/select")}>Start Matching</button>
            : <h4>Sign up or login to find a peer today!</h4>
          }
        </div>
      </div>
    </div>
  );
};

export default Homepage;