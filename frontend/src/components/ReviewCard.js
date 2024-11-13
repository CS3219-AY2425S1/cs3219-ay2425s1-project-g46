import React from 'react';
import "./styles/ReviewCard.css";

export const ReviewCard = (props) => {
  // Generate stars for rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} style={{ color: index < props.rating ? 'gold' : 'gray', fontSize: '20px' }}>
      ★
    </span>
  ));

  
  const formatDate = (timestamp) => {
    const date = new Date(Date.parse(timestamp)); // Parse without timezone conversion
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  

  return (
    <div className='reviewCard'>
      <p><strong>Rating:</strong> {stars}</p>
      <p><strong>Comment:</strong> {props.comment}</p>
      <p><strong>From:</strong> {props.by}</p>
      <p className='fromText'> {formatDate(props.timestamp)}</p>
    </div>
  );
};
