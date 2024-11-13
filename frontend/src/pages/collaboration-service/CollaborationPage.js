import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentEditor from "../../components/ContentEditor";
import CodeEditor from "../../components/CodeEditor";
import "./styles/CollaborationPage.css";
import { apiGatewaySocket } from "../../config/socket";
import useSessionStorage from "../../hook/useSessionStorage";

import NavBar from "../../components/NavBar";
import QuestionPanel from "../../components/QuestionPanel";
import ChatBox from "../../components/ChatBox";

const CollaborationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalCount, setTotalCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(2);

  const data = location.state.data;
  const { id, questionData } = data;
  const [activeTab, setActiveTab] = useState("code", "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userDisconnected, setUserDisconnected] = useState(false);
  const [unloadFlag, setUnloadFlag] = useSessionStorage("", false);

  window.onload = () => {
    if (unloadFlag) {
      apiGatewaySocket.emit("userReconnect", { id });
      setUnloadFlag(false);
      apiGatewaySocket.emit("reloadSession", { id });
    }
    apiGatewaySocket.emit("receiveCount", { id });
  };
  const [email] = useSessionStorage("", "email");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
      apiGatewaySocket.emit("cancelendSession", { id });
    } else {
      setIsSubmitted(true);
      apiGatewaySocket.emit("endSession", { id });
    }
  };

  apiGatewaySocket.on("submissionCount", ({ count, totalUsers }) => {
    setTimeout(() => {
      setTotalCount(count);
      setTotalUsers(totalUsers);
    }, 1000)
   
  });

  apiGatewaySocket.on("userDisconnect", () => {
    setUserDisconnected(true);
    setTotalCount(0);
    setTotalUsers(1);
  });

  apiGatewaySocket.on("userReconnect", () => {
    setUserDisconnected(false);
  });

  window.addEventListener("beforeunload", (event) => {
    setUnloadFlag(true);
    apiGatewaySocket.emit("userDisconnect", { id });
  });

  apiGatewaySocket.on("sessionEnded", ({ user1Email, user2Email, roomId }) => {
    const otherEmail = email === user1Email ? user2Email : user1Email;
    navigate("/user/userfeedback", {
      state: {
        otherUserEmail: otherEmail,
        roomId: roomId,
      },
      replace: true,
    });
  });

  useEffect(() => {
    if (id) {
      console.log(`email ${email}`);
      apiGatewaySocket.emit("reconnecting", { id: id, currentUser: email });
    }
  }, [id, apiGatewaySocket]);

  return (
    <div id="collaborationPageContainer" className="container">
      <NavBar />
      <QuestionPanel questionData={questionData} />
      <div id="tabs">
        <button
          className={activeTab == "code" ? "active" : ""}
          onClick={() => handleTabChange("code")}
        >
          Code
        </button>
        <button
          className={activeTab == "content" ? "active" : ""}
          onClick={() => handleTabChange("content")}
        >
          Text
        </button>
        <button id="submitButton" onClick={handleSubmit}>
          {isSubmitted ? "Cancel" : "Submit"}
        </button>
        <span id="submitCount" class="count-badge">
          ({totalCount}/{totalUsers})
        </span>
        {userDisconnected && (
          <span id="disconnection-text">The other user has disconnected.</span>
        )}
      </div>

      <div id="tab-content">
        {/* Render both components with inline styles for visibility control */}
        <div style={{ display: activeTab === "code" ? "block" : "none" }}>
          <CodeEditor id={id} />
        </div>
        <div style={{ display: activeTab === "content" ? "block" : "none" }}>
          <ContentEditor id={id} />
        </div>
      </div>
      <ChatBox id={id} />
    </div>
  );
};

export default CollaborationPage;