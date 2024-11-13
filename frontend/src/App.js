// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Test from "./pages/Test";
import Homepage from "./pages/common/Homepage";
import Question from "./pages/question-service/Question";
import QuestionPage from "./pages/question-service/QuestionPage";
import CollaborationPage from "./pages/collaboration-service/CollaborationPage"
import PageNotFound from "./pages/common/PageNotFound";
import Signup from "./pages/user-service/Signup";
import Login from "./pages/user-service/Login";
import Profile from "./pages/user-service/Profile";
import ChangePassword from "./pages/user-service/ChangePassword";
import MatchingHistory from "./pages/user-service/MatchingHistory";
import UserFeedback from "./pages/user-service/UserFeedback";
import WebsiteFeedback from "./pages/user-service/WebsiteFeedback";
import Select from "./pages/matching-service/Select";
import FindingMatch from "./pages/matching-service/FindingMatch";
import MatchFound from "./pages/matching-service/MatchFound";
import LoggedInRoute from "./pages/user-service/utils/LoggedInRoute";
import LoggedOutRoute from "./pages/user-service/utils/LoggedOutRoute";
import CollaborationRestrictedRoute from "./pages/collaboration-service/utils/CollaborationRestrictedRoute";

/**
 * 
 * Main application, sets up routing. 
 * Uses react-router-dom to manage navigation between different pages.
 */
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Homepage />} />

        <Route path="/question" element={<Question />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/question/:questionId" element={<QuestionPage />} />


        {/* users NOT logged in cannot access routes included in 'LoggedInRoute' */}
        <Route element={<LoggedInRoute />}>
          <Route path="/matching/select" element={<Select />} />
          <Route path="/matching/findingmatch" element={<FindingMatch />} />
          <Route path="/matching/matchFound" element={<MatchFound />} />
          
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/changepassword" element={<ChangePassword />} />
          <Route path="/user/matchingHistory" element={<MatchingHistory />} />
          <Route path="/user/userfeedback" element={<UserFeedback />} />
          <Route path="/user/websitefeedback" element={<WebsiteFeedback />} />

          <Route element={<CollaborationRestrictedRoute />}>
            <Route path="/collaboration" element={<CollaborationPage />} />
          </Route>
        </Route>

        {/* logged-in users cannot access routes included in 'LoggedOutRoute' */}
        <Route element={<LoggedOutRoute />}>
          <Route path="/user/signup" element={<Signup />}></Route>
          <Route path="/user/login" element={<Login />}></Route>
        </Route>

        {/* Error page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
