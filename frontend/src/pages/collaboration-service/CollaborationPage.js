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
  const [userReconnected, setUserReconnected] = useState(false);
  const [savingData, setSavingData] = useState(false);

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

  useEffect(() => {
    if (id) {
      console.log(`email ${email}`);
      apiGatewaySocket.emit("reconnecting", { id: id, currentUser: email });
    }
  }, [id, email]);

  useEffect(() => {
    apiGatewaySocket.on("updateSubmissionCount", ({ count, totalUsers }) => {
      setTotalCount(count);
      setTotalUsers(totalUsers);
      // If other user disconnects, reset the end session status
      if (count === totalUsers) {
        setIsSubmitted(false);
        apiGatewaySocket.emit("cancelendSession", { id });
      }

      if (totalUsers < 2) {
        setUserDisconnected(true);
        setUserReconnected(false);

        setTimeout(() => {
          setUserDisconnected(false);
        }, 5000);
      }
    });

    apiGatewaySocket.on("sessionEnded", ({ user1Email, user2Email, roomId }) => {
      console.log("session end");
      const otherEmail = email === user1Email ? user2Email : user1Email;
      navigate("/user/userfeedback", {
        state: {
          otherUserEmail: otherEmail,
          roomId: roomId,
        },
        replace: true,
      });
    });

    apiGatewaySocket.on("checkRoomResponse", ({ isRoomExisting }) => {
      console.log('isRoomExisting', isRoomExisting);
      if (!isRoomExisting) {
        navigate("*", {
          state: { from: location }, // Save the intended location in state
          replace: true,
        });
      }
    });

    apiGatewaySocket.on("userReconnected", ({ currentUser }) => {
      if (currentUser !== email) {
        setUserDisconnected(false);
        setUserReconnected(true);

        setTimeout(() => {
          setUserReconnected(false);
        }, 5000);
      }
    })

    apiGatewaySocket.on("saveData", () => {
      setSavingData(true);

      setTimeout(() => {
        setSavingData(false);
      }, 5000);
    })

    return () => {
      apiGatewaySocket.off("updateSubmissionCount");
      apiGatewaySocket.off("sessionEnded");
      apiGatewaySocket.off("checkRoomResponse");
      apiGatewaySocket.off("userReconnected");
      apiGatewaySocket.off("saveData");
    }
  }, [totalCount, totalUsers, email, id, location, navigate]);

  return (
    <div id="collaborationPageContainer" className="container">
      <NavBar />
      <QuestionPanel questionData={questionData} />
      <div id="tabs">
        <button
          className={activeTab === "code" ? "active" : ""}
          onClick={() => handleTabChange("code")}
        >
          Code
        </button>
        <button
          className={activeTab === "content" ? "active" : ""}
          onClick={() => handleTabChange("content")}
        >
          Text
        </button>
        <button id="submitButton" onClick={handleSubmit}>
          {isSubmitted ? "Cancel" : "Submit"}
        </button>
        <span id="submitCount" className="count-badge">
          ({totalCount}/{totalUsers})
        </span>
        {userDisconnected && (
          <span id="disconnection-text">The other user has disconnected.</span>
        )}
        {userReconnected && (
          <span id="reconnection-text">The other user has reconnected.</span>
        )}
        {savingData && (
          <span id="reconnection-text">The data has been saved.</span>
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