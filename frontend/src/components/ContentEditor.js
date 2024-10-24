// Author(s): Xiu Jia
import "./styles/ContentEditor.css";
import { useEffect } from "react";
import { collaborationSocket } from "../config/socket";
import useSessionStorage from "../hook/useSessionStorage";

const ContentEditor = ({ id }) => {
  const [content, setContent] = useSessionStorage("", "content");

  useEffect(() => {
    console.log(id);
    collaborationSocket.on("receiveContent", ({ content }) => {
      setContent(content);
      console.log("content received: ", content);
    })

    return () => {
      collaborationSocket.off("receiveContent");
    };
  }, [content]);

  const updateContent = (e) => {
    const content = e.target.value;
    setContent(content);
    collaborationSocket.emit("sendContent", { id: id, content });
  };

  return (
    <div id="contentEditorContainer" className="container">
      <textarea
        id="contentArea"
        name="code"
        placeholder="Start typing here..."
        value={content}
        onChange={updateContent}
        autoFocus
      ></textarea>
    </div>
  )
}

export default ContentEditor;