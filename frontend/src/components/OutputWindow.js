import "./styles/OutputWindow.css";

const OutputWindow = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // Compilation error
      return (
        <pre className="output-text error-text">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="output-text success-text">
          {outputDetails.stdout
            ? `${atob(outputDetails.stdout)}`
            : "Compiled successfully"}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="output-text error-text">{`Time Limit Exceeded`}</pre>
      );
    } else {
      return (
        <pre className="output-text error-text">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };

  return (
    <>
      <div className="output-window">
        <h1 className="output-title">Output</h1>
        <div className="output-container">
          {outputDetails ? getOutput() : null}
        </div>
      </div>
    </>
  );
};

export default OutputWindow;
