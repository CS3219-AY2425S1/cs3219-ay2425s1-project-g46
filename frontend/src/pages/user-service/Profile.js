import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "./styles/Profile.css";
import { ReviewCard } from '../../components/ReviewCard';
import AvatarImage from '../../components/AvatarImage';
import useSessionStorage from "../../hook/useSessionStorage";
import { API_GATEWAY_URL_API } from '../../config/constant';

function Profile() {
  const [values, setValues] = useState({
    username: '',
    email: '',
  });

  const [reviews, setReviews] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [overallRating, setOverallRating] = useState(null);

  const email = useSessionStorage("", "email")[0];

  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      console.log(`Fetching profile for email: ${email} from URL: ${API_GATEWAY_URL_API}/user/profile/${email}`);
      fetch(`${API_GATEWAY_URL_API}/user/profile/${email}`)
        .then((response) => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            if (response && response.status === 429) {
              alert("You have exceeded the rate limit. Please wait a moment and try again.");
            }
            throw new Error(`Profile data could not be fetched. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched user data:', data);
          setValues({
            username: data.username,
            email: data.email,
          });
          setAvatarUrl(data.image || null); // Set avatar URL if available, otherwise null
          setProfileLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setProfileLoading(false);
        });
    } else {
      console.error('Email is not found in sessionStorage');
      setProfileLoading(false);
    }
  }, [email]);

  //The below should be for reviews. 
  // Fetch reviews
  useEffect(() => {
    if (email) {
      fetch(`${API_GATEWAY_URL_API}/user/getuserreview/${email}`)
        .then((response) => {
          if (!response.ok) {
            if (response && response.status === 429) {
              alert("You have exceeded the rate limit. Please wait a moment and try again.");
            }
            throw new Error(`Review data could not be fetched. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched review data:', data);
          let reviewsArray = Object.values(data || {});

          // Sort reviews by timestamp in descending order
          reviewsArray = reviewsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          setReviews(reviewsArray);
          setReviewsLoading(false);

          // Calculate the overall rating
          if (reviewsArray.length > 0) {
            const totalRating = reviewsArray.reduce((sum, review) => sum + review.rating, 0);
            setOverallRating((totalRating / reviewsArray.length).toFixed(1));
          } else {
            setOverallRating(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          setReviewsLoading(false);
        });
    } else {
      setReviewsLoading(false);
    }
  }, [email]);


  if (profileLoading || reviewsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="profilePage" className="container">
      <NavBar />
      <div id="profileContainer">
        <h1>My Profile</h1>
        <div className='profile-group'>
          <div className='avatar-center'>
            <AvatarImage avatarUrl={avatarUrl} email={email} />
          </div>
          <div>
            <h1 id='username'>{values.username}</h1>
            <h2 id='email'>{values.email}</h2>
          </div>
        </div>

        <div className='button-group'>
          <button className="history-button" onClick={() => navigate('/user/matchinghistory')} >Matching History</button>
          <button className="website-feedback-button" onClick={() => navigate('/user/websitefeedback')} >Website Feedback</button>
          <button className="change-password-button" onClick={() => navigate('/user/changepassword')} >Change Password</button>
        </div>

        <div className="reviews-container">
          <h1 className="reviews-title">Reviews</h1>
          {overallRating !== null && (
            <p className='overall-rating'> Overall Rating : {overallRating} / 5.0</p>
          )}
          {reviews.length > 0 ? (
            Object.entries(reviews).map(([key, review]) => (
              <ReviewCard
                key={key}
                rating={review.rating}
                comment={review.comment}
                by={review.by}
                timestamp={review.timestamp}
              />
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
