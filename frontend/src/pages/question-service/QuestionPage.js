// Author(s): <name(s)>
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/QuestionPage.css";
import axios from "axios";
import PageNotFound from "../common/PageNotFound";
import { API_GATEWAY_URL_API } from "../../config/constant";
import NavBar from "../../components/NavBar";

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

        const response = await axios.get(`${API_GATEWAY_URL_API}/question/${questionId}`);
        setQuestionData(response.data);

        // Switch loading to false after fetch is completed
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setQuestionData([]);
          setLoading(false);
          alert("You have exceeded the rate limit. Please wait a moment and try again.");
        } else {
          setQuestionData(null);
          setLoading(false);
          console.error("Error fetching question:", error);
        }
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return (
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    );
  }

  let questionComplexityClass = "questionTag"

  if (!questionData) {
    return (
      <PageNotFound />
    );
  } else if (questionData.length > 0) {

    if (questionData.complexity === "easy") {
      questionComplexityClass += " easy";
    } else if (questionData.complexity === "medium") {
      questionComplexityClass += " medium";
    } else if (questionData.complexity === "hard") {
      questionComplexityClass += " hard";
    }
  }

  return (
    <div id="questionPage" className="container">
      <NavBar />
      <div id="questionContainer" className="container">
        {/* Title of Question */}
        <div className="row">
          <h1 id="questionTitle">{questionData.length > 0 && questionData.title}</h1>
        </div>

        <div id="questionTagContainer" className="row">
          {questionData.length > 0 && questionData.category.map((category, index) => (
            <div key={index} className="questionTag">
              {category.trim()}
            </div>
          ))}
          <div className={questionData.length > 0 && questionComplexityClass}>
            {questionData && questionData.complexity}
          </div>
        </div>

        <div className="row">
          <p>{questionData.length > 0 && questionData.description}</p>
        </div>

        <div className="row">
          <button id="backBtn" className="btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  )
}

export default QuestionPage;