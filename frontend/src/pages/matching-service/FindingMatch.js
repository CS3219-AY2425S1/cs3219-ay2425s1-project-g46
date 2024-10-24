import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/FindingMatch.css";
import { matchingSocket, collaborationSocket } from "../../config/socket";
import useSessionStorage from "../../hook/useSessionStorage";
import NavBar from "../../components/NavBar";

function FindingMatch() {

  const [displayedText, setDisplayedText] = useState("Matching in progress...");
  const [timeLeft, setTimeLeft] = useState(60); // Set timer to 10 seconds
  const [matchStatus, setMatchStatus] = useState(""); // To track if match is found or not
  // const [animationKey, setAnimationKey] = useState(0); // Key to reset the animation effect
  // let typingInterval;
  // const fullText = "  Matching in progress.... ";
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to retrieve state
  const { topic, difficultyLevel, email, token, username } = location.state || {}; // Destructure updatedFormData from state
  const [isAnyDifficulty, setIsAnyDifficulty] = useState(false);

  const [roomId, setRoomId] = useSessionStorage("", "roomId");

  // check for backtrack, navigate back to criteria selection if user confirms action,
  // otherwise stay on page
  window.onpopstate = (event) => {
    event.preventDefault();
    var confirmation = window.confirm("You are exiting the matching queue, continue?");
    if (confirmation) {
      matchingSocket.emit("cancel_matching", { topic, difficultyLevel, email, token, username, isAny: isAnyDifficulty });
      // location.state = undefined;
      location.state = "";
      navigate("/matching/select");
    } else {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  // check for refresh, allow user to stay on page regardless if refresh is cancelled or confirmed
  window.onbeforeunload = (event) => {
    matchingSocket.emit("cancel_matching", { topic, difficultyLevel, email, token, username, isAny: isAnyDifficulty });
  }

  // if refresh and the page reloads, send user back to queue
  window.onload = (event) => {
    matchingSocket.emit("join_matching_queue", { topic, difficultyLevel, email, token, username, isAny: isAnyDifficulty });
  }

  // detect changes for isAnyDifficulty (used for cancelling queue)
  useEffect(() => {
    setIsAnyDifficulty((prevState) => !prevState);
  }, []);

  useEffect(() => {
    console.log("changing isAnyDifficulty", isAnyDifficulty);
  }, [isAnyDifficulty]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);  // Stop the timer when it reaches zero
          if (matchStatus !== "Matching cancelled") {
            setMatchStatus("No match found"); // Set status when timer reaches 0
          }
          console.log("Matching failed due to timeout");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [matchStatus]); // Restart the timer whenever matchStatus or animationKey changes

  // // Loading animation 
  // useEffect(() => {
  //     let currentIndex = 0;
  //     clearInterval(typingInterval); // Clear previous intervals

  //     const startTyping = () => {
  //         setDisplayedText(""); // Clear the text
  //         typingInterval = setInterval(() => {
  //             setDisplayedText((prev) => prev + fullText[currentIndex]);
  //             currentIndex++;

  //             // Stop typing when the text is fully typed
  //             if (currentIndex >= fullText.length - 1) {
  //                 clearInterval(typingInterval); // Stop the interval after the text is fully typed
  //                 setTimeout(() => {
  //                     currentIndex = 0; // Reset the index for the next cycle
  //                     setDisplayedText(""); // Clear the text for the next cycle
  //                     startTyping(); // Restart typing after clearing
  //                 }, 1000); // Wait for 1 second before restarting
  //             }
  //         }, 100); // Typing speed (100ms delay between each character)
  //     };

  //     startTyping();

  //     // Cleanup interval on unmount to avoid memory leaks
  //     return () => clearInterval(typingInterval);
  // }, [animationKey]); // Restart the animation whenever the animationKey changes

  useEffect(() => {
    matchingSocket.on("match_found", ({ data, id }) => {
      setRoomId(id);
      collaborationSocket.emit("createSocketRoom", { data: data, id: id, currentUser: sessionStorage.getItem("email") });
    });

    collaborationSocket.on("readyForCollab", (data) => {
      navigate("/collaboration", { state: { data: data } });
    });

    return () => {
      matchingSocket.off("match_found");
      collaborationSocket.off("readyForCollab");
    };
  }, [navigate]);

  // Function to reset the matching process (reset timer and animation)
  const handleRetry = () => {
    setDisplayedText("Matching in progress...");
    setMatchStatus(""); // Reset match status
    setTimeLeft(60); // Reset timer to 10 seconds
    // setAnimationKey(prevKey => prevKey + 1); // Change animation key to restart the animation
    console.log("Retrying match...");

    setIsAnyDifficulty(false);
    matchingSocket.emit("join_matching_queue", { topic, difficultyLevel, email, token, username, isAny: false });
  };

  // Function to reset the matching process with any difficulty levels (reset timer and animation)
  const handleRetryWithAnyDifficultyLevel = () => {
    setDisplayedText("Matching in progress...");
    setMatchStatus(""); // Reset match status
    setTimeLeft(60); // Reset timer to 10 seconds
    // setAnimationKey(prevKey => prevKey + 1); // Change animation key to restart the animation
    console.log("Retrying match with any difficulty...");

    setIsAnyDifficulty(true);
    matchingSocket.emit("join_matching_queue", { topic, difficultyLevel, email, token, username, isAny: true });
  };

  // Function to cancel the matching process
  const handleCancel = () => {
    setTimeLeft(0);
    setMatchStatus("Matching cancelled");
    console.log("Cancelling match...");
    matchingSocket.emit("cancel_matching", { topic, difficultyLevel, email, token, username, isAny: isAnyDifficulty });
  };

  // Function to bring user back to criteria selection
  const handleBackToSelect = () => {
    console.log("Navigating back to criteria selection");
    navigate("/matching/select");
  };

  return (
    <div>
      <NavBar />
      <div id="FindingMatchController">
        {matchStatus === "" ? ( // Show typing and timer when match status is empty
          // when user is in queue
          <>
            <h1>{displayedText}</h1>
            <h1>Time left: {timeLeft} seconds</h1> {/* Display the timer */}
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          // when user is NOT in queue
          <>
            {isAnyDifficulty ?
              <h1 className="criterias">Topic: {topic}, Difficulty: Any</h1>
              : <h1 className="criterias">Topic: {topic}, Difficulty: {difficultyLevel}</h1>
            }
            <h1>{matchStatus}</h1> {/* Show match status when match is found or time runs out */}
            <button className="criterias" onClick={handleRetry}>Retry with Topic: {topic}, Difficulty: {difficultyLevel}</button>
            <button onClick={handleRetryWithAnyDifficultyLevel}>Retry with Topic: {topic}, Difficulty: Any</button>
            <button onClick={handleBackToSelect}>Back to Criteria Selection</button>
          </>
        )}
      </div>
    </div>
  );
}

export default FindingMatch;
