import { useLocation } from "react-router-dom";
import ContentEditor from "../../components/ContentEditor";
import NavBar from "../../components/NavBar"
import QuestionPanel from "../../components/QuestionPanel"

const CollaborationPage = () => {
  const location = useLocation();
  const data = location.state.data;
  const { id, questionData } = data;

  return (
    <div>
      <NavBar />
      <QuestionPanel questionData={questionData} />
      <form>
        <ContentEditor id={id} />
      </form>
    </div>
  )
}

export default CollaborationPage;