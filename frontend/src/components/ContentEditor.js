// Author(s): Xiu Jia
import "./styles/ContentEditor.css";
import { useEffect } from "react";
import socket from "../pages/collaboration-service/utils/socket";
import usePersistState from "../hook/usePersistState";

const ContentEditor = ({ roomId }) => {
  const [content, setContent] = usePersistState([], "content");

  useEffect(() => {
    console.log(roomId);
    socket.on("receiveContent", ({ content }) => {
      setContent(content);
    })

    return () => {
      socket.off("receiveContent");
    };
  }, [content]);

  const updateContent = (e) => {
    const content = e.target.value;
    setContent(content);
    socket.emit("sendContent", { roomId, content });
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