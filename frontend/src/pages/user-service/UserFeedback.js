// Author(s): Andrew
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./styles/UserFeedback.css";
import NavBar from "../../components/NavBar";
import RatingReview from "../../components/RatingReview";
import useSessionStorage from "../../hook/useSessionStorage";
import { API_GATEWAY_URL_API } from "../../config/constant";

function Signup() {
  const email = useSessionStorage("", "email")[0];
  const location = useLocation();
  const navigate = useNavigate();
  const { otherUserEmail, roomId } = location.state || {};

  const [values, setValues] = useState({
    otherUserEmail: otherUserEmail,
    rating: 0,
    comment: '',
    roomId: roomId,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Reset previous errors
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');

    // Simple validation: check if fields are empty
    let newErrors = {};
    if (!values.otherUserEmail) newErrors.otherUserEmail = "Email is required.";
    if (!values.rating) newErrors.rating = "Rating is required.";
    if (!values.comment) newErrors.comment = "Comment is required.";

    // Set errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const requestedData = {
      otherUserEmail: values.otherUserEmail,
      newReview: {
        by: email,
        comment: values.comment,
        rating: values.rating,
        roomId: roomId
      }
    };

    // If all fields are filled, proceed with submission
    axios.post(`${API_GATEWAY_URL_API}/user/adduserreview`, requestedData)
      .then(res => {
        setValues({
          email: '',
          rating: 0,
          comment: ''
        });
        setSuccessMessage("Feedback submitted successfully!");
        setIsSubmitted(true);
      })
      .catch(err => {
        if (err.response && err.response.data.message) {
          setErrors(prevErrors => ({ ...prevErrors, email: err.response.data.message }));
        } else {
          if (err.response && err.response.status === 429) {
            alert("You have exceeded the rate limit. Please wait a moment and try again.");
          }
          console.log(err);
        }
        setErrorMessage("An error occurred. Please try again.");
      });
  };


  return (
    <div id="userFeedbackPage" className="container">
      <NavBar />
      <div id="feedbackFormContainer">
        <h1>Feedback Form</h1>
        <form action='' onSubmit={handleSubmit}>
          <div className="messageContainer">
            {successMessage && <p className="successLabel">{successMessage}</p>}
            {errorMessage && <p className="errorLabel">{errorMessage}</p>}
            </div>
          <div className='formGroup'>
            <label htmlFor='otherUserEmail' className='inputLabel'><strong>Collaborator's Email</strong></label>
            <input type='otherUserEmail' placeholder='Email' name='otherUserEmail' value={values.otherUserEmail} onChange={handleInput} className='inputBox' readOnly/>
            {errors.otherUserEmail && <span className='error-Label'> {errors.otherUserEmail}</span>}
          </div>
          
          <div className='formGroup'>
            <label htmlFor='rating' className='inputLabel'><strong>Rating</strong></label>
            <RatingReview rating={values.rating} setValues={setValues} readOnly={isSubmitted}/>
            {errors.rating && <span className='error-Label'> {errors.rating}</span>}
          </div>
          <div className='formGroup'>
            <label htmlFor='comment' className='inputLabel'><strong>Comment</strong></label>
            <textarea
              placeholder='Enter your comment here'
              name='comment'
              value={values.comment}
              onChange={handleInput}
              className='inputBox'
              rows="4" 
              readOnly={isSubmitted}
            />
            {errors.comment && <span className='error-Label'> {errors.comment}</span>}
          </div>
          <div className="submitButton">
            <button className="register-button" onClick={() => navigate("/", { replace: true })}>Return to Home Page</button>
            {isSubmitted ? 
              null
              : 
              <button className="register-button" >Submit</button>}
          </div>

        </form>
      </div>

    </div>
  )
}

export default Signup