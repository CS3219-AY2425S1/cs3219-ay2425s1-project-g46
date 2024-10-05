// Author(s): <name(s)>
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div id="errorContainer" class="container">
      <h1>Error 404: Page Not Found</h1>
      <div class="row">
        <button id="backBtn" class="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default PageNotFound;