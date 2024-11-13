import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/MatchingHistory.css";
import NavBar from "../../components/NavBar";
import { HistoryCard } from '../../components/HistoryCard';
import { API_GATEWAY_URL_API } from "../../config/constant";
import useSessionStorage from "../../hook/useSessionStorage";

export default function MatchingHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const email = useSessionStorage("", "email")[0];

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.post(`${API_GATEWAY_URL_API}/user/profile/gethistory`, { email });
        console.log("Response", response);

        if (response.data.message !== 'No matching history made.') {
          const sortedHistoryData = Object.entries(response.data)
            .sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp
            .map(([, value]) => value); 

          setHistoryData(sortedHistoryData); 
        }
        
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error("Error fetching matching history data:", error);
          alert("You have exceeded the rate limit. Please wait a moment and try again.");
          setLoading(false);
        } else {
          setErrorMessage("Failed to load matching history data.");
          setLoading(false);
        }
      }
    };

    fetchHistoryData();
  }, [email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("History Data ", historyData);
  return (
    <div id="matchingHistoryPage" className="container">
      <NavBar />
      <div className="matchingHistoryContainer">
        <h1>Matching History</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {historyData.length > 0 ? (
          historyData.map((historyData, index) => (
            <HistoryCard
              key={index} 
              historyData={historyData}
            />
          ))
        ) : (
          <p>No matching history available</p>
        )}
      </div>
    </div>
  );
}
