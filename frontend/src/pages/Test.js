import "./Test.css";
import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests

const Test = () => {
  const [inputText, setInputText] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Input text before sending:", inputText);
    try {
      const response = await axios.post("http://localhost:5000/submit/text", {
        inputText,
      });
      console.log("Form submitted successfully:", response.data);
      setResponseMessage(response.data.message);
      setInputText("");
    } catch (error) {
      setResponseMessage("Error submitting form");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          id="inputText"
          name="inputText"
          placeholder="Start typing here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Test;
