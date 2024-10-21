import { useLocation } from "react-router-dom";
import ContentEditor from "../../components/ContentEditor";
import CodeEditor from "../../components/CodeEditor";

import NavBar from "../../components/NavBar"
import QuestionPanel from "../../components/QuestionPanel"

const CollaborationPage = () => {
  const location = useLocation();
  const data = location.state.data;
  const { roomId, questionData } = data;

  return (
    <div>
      <NavBar />
      <QuestionPanel questionData={questionData} />
      <form>
        <CodeEditor roomId={roomId} />
        <ContentEditor roomId={roomId} />
      </form>
    </div>
  )
}

export default CollaborationPage;