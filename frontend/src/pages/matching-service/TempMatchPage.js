import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import socket from "../collaboration-service/utils/socket";

const TempMatchPage = () => {
  const navigate = useNavigate();

  console.log("TempMatchPage");

  useEffect(() => {
    console.warn("use effect");
    socket.on("readyForCollab", (data) => {
      console.warn("socket", data);
      navigate("/collaboration", { state: { data } });
    });
  }, [navigate]);

  const handleMatchClick = () => {
    // Temporary hard coded values to replace 
    socket.emit("match_found", {
      user1: {
        email: "test@gmail.com",
        category: "Algorithms",
        complexity: "easy",
        isAny: false
      },
      user2: {
        email: "anoncapy@gmail.com",
        category: "Algorithms",
        complexity: "easy",
        isAny: false
      }
    });
  };

  return (
    <div>
      <NavBar />
      <div id="MatchFoundController">
        <h1>Match Found</h1>
        <p>Click to run a match found process!</p>
        <button onClick={() => { handleMatchClick() }}>
          test
        </button>
      </div>
    </div>
  );
}

export default TempMatchPage;