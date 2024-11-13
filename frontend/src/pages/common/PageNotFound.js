// Author(s): Xiu Jia
import { useNavigate } from "react-router-dom";
import "./styles/PageNotFound.css";
import NavBar from "../../components/NavBar";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div id="pageNotFoundContainer" className="container">
      <NavBar />
      <div id="errorContainer" className="container">
        <h1>Error 404: Page Not Found</h1>
        <div className="row">
          <button id="backBtn" className="btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;