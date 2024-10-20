// Author(s): <name(s)>
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/QuestionPage.css";
import axios from "axios";
import PageNotFound from "../../components/PageNotFound";

function QuestionPage() {
  const { questionId } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // Set loading to true before calling API
        setLoading(true);

        const response = await axios.get(`http://localhost:5000/question/${questionId}`);
        setQuestionData(response.data);

        // Switch loading to false after fetch is completed
        setLoading(false);
      } catch (error) {
        setQuestionData(null);
        setLoading(false);
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return (
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    );
  }

  if (!questionData) {
    return (
      <PageNotFound />
    );
  }

  return (
    <div id="questionContainer" className="container">
      {/* Title of Question */}
      <div className="row">
        <h1 id="questionTitle">{questionData.title}</h1>
      </div>

      <div id="questionTagContainer" className="row">
        <div className="questionTag">
          {questionData.category}
        </div>
        <div className="questionTag">
          {questionData.complexity}
        </div>
      </div>

      <div className="row">
        <p>{questionData.description}</p>
      </div>

      <div className="row">
        <button id="backBtn" className="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  )
}

export default QuestionPage;