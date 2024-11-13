import React from 'react';

function RatingReview({ rating, setValues }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className='star'
          style={{
            cursor: 'pointer',
            color: rating >= star ? 'gold' : 'gray',
            fontSize: '35px',
          }}
          onClick={() => {
            setValues(prevValues => ({ ...prevValues, rating: star }));
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingReview;
