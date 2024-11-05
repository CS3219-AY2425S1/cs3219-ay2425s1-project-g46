// Author(s): Andrew
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/MatchingHistory.css";
import NavBar from "../../components/NavBar";
import { HistoryCard } from '../../components/HistoryCard';

export default function MatchingHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const email = sessionStorage.getItem("email");
        const response = await axios.post("http://localhost:5001/user/profile/gethistory", { email });
        console.log("Response", response);
        setHistoryData(response.data); // Set the data from API
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matching history data:", error);
        setErrorMessage("Failed to load matching history data.");
        setLoading(false);
      }
    };

    fetchHistoryData(); // Call fetchHistoryData on component mount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="matchingHistoryContainer">
        <h1>Matching History</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {Object.keys(historyData).length > 0 ? (
            Object.entries(historyData).map(([key, historyData]) => (
              <HistoryCard
                key={key} 
                otherUserEmail={historyData.otherUserEmail}
                title={historyData.title}
                category={historyData.category}
                complexity={historyData.complexity}
                description={historyData.description}
                timestamp={historyData.timestamp}
              />
            ))
          ) : (
            <p>No matching history available</p>
          )}
      </div>
    </div>
  );
}
