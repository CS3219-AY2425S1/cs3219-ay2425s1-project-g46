// Author(s): Xiu Jia
const QuestionPanel = ({ questionData }) => {

  return (
    <div id="questionContainer" className="container">
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
    </div>
  );
};

export default QuestionPanel;