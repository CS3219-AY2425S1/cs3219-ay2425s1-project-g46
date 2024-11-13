import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/HistoryCard.css";

export const HistoryCard = ({ historyData }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(Date.parse(timestamp));
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const passingData = () => {
    navigate('/user/userfeedback', {
      state: {
        otherUserEmail: historyData.otherUserEmail,
        roomId: historyData.roomId,
      },
    });
  };

  console.log("historyData: ", historyData);

  return (
    <div className='historyCard'>
      <p><strong>With: </strong> {historyData.otherUserEmail}</p>
      <p><strong>Title: </strong> {historyData.title}</p>
      <p><strong>Category, Difficulty: </strong>{historyData.category}, {historyData.complexity}</p>

      <button className="toggle-button" onClick={toggleExpand}>
        {isExpanded ? "Close Details" : "Show Details"}
      </button>

      {isExpanded && (
        <div className="extra-info">
          <div className="info-item">
            <p className="info-label">Question</p>
            <p>{historyData.description}</p>
          </div>
          <div className="info-item">
            <p className="info-label">User Text</p>
            <p>{historyData.contextText || "Users didn't provide it"}</p>
          </div>
          <div className="info-item">
            <p className="info-label">User Code</p>
            <pre className="code-block">
              <code>{historyData.contextCode || "Users didn't provide it"}</code>
            </pre>
          </div>

          <div className="info-item">
            <p className="info-label">Room ID</p>
            <p>{historyData.roomId}</p>
          </div>
        </div>
      )}

      {historyData.reviewGiven ? (
        <button className="review-given-button" disabled={true}>Review already given</button>
      ) : (
        <button className="review-button" onClick={passingData}>Give Review</button>
      )}

      
      <p className='fromText'>{formatDate(historyData.timestamp)}</p>
    </div>
  );
};
