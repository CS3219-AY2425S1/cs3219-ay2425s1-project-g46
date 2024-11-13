// Author(s): Xiu Jia
import "./styles/QuestionPanel.css"

const QuestionPanel = ({ questionData }) => {
  let questionComplexityClass = "questionTag"

  if (questionData.complexity == "easy") {
    questionComplexityClass += " easy";
  } else if (questionData.complexity == "medium") {
    questionComplexityClass += " medium";
  } else if (questionData.complexity == "hard") {
    questionComplexityClass += " hard";
  }

  return (
    <div id="questionPanelContainer" className="container">
      <div className="row">
        <h1 id="questionPanelTitle">{questionData.title}</h1>
      </div>

      <div id="questionPanelTagContainer" className="row">
        {questionData.category.map((category, index) => (
          <div key={index} className="questionTag">
            {category.trim()}
          </div>
        ))}

        <div id="questionComplexity" className={questionComplexityClass}>{questionData.complexity}</div>
      </div>

      <div className="row">
        <p>{questionData.description}</p>
      </div>
    </div>
  );
};

export default QuestionPanel;
