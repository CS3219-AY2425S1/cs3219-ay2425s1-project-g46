// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Test from "./pages/Test";
import Question from "./pages/question-service/Question";
import QuestionPage from "./pages/question-service/QuestionPage";
import PageNotFound from "./components/PageNotFound";
import Signup from "./pages/user-service/Signup";
import Login from "./pages/user-service/Login";
import UserRestrictedRoute from "./pages/user-service/utils/UserRestrictedRoute";

/**
 * 
 * Main application, sets up routing. 
 * Uses react-router-dom to manage navigation between different pages.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Question />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/question/:questionId" element={<QuestionPage />} />

        {/* logged-in users cannot access routes included in 'UserRestrictedRoute' */}
        <Route element={<UserRestrictedRoute />}>
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
