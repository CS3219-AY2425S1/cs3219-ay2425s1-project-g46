// Author(s): Xiu Jia, Calista
import "./styles/ContentEditor.css";
import { useEffect } from "react";
import { apiGatewaySocket } from "../config/socket";
import useSessionStorage from "../hook/useSessionStorage";

const ContentEditor = ({ id }) => {
  const [content, setContent, removeContent] = useSessionStorage("", "content");

  useEffect(() => {
    console.log(id);

    // emit once for default values
    apiGatewaySocket.emit("sendContent", { id, content });
  }, [id, content]);

  useEffect(() => {
    apiGatewaySocket.on("receiveContent", ({ content }) => {
      setContent(content);
      console.log("content received: ", content);
    });

    apiGatewaySocket.on("sessionEnded", (socketId) => {
      removeContent();
    });

    apiGatewaySocket.on("checkRoomResponse", ({ isRoomExisting, content }) => {
      console.log('isRoomExisting', isRoomExisting);
      if (isRoomExisting) {
        setContent(content);
      }
    });


    return () => {
      apiGatewaySocket.off("receiveContent");
      apiGatewaySocket.off("sessionEnded");
      apiGatewaySocket.off("checkRoomResponse");
    }
  });

  const updateContent = (e) => {
    const content = e.target.value;
    setContent(content);
    apiGatewaySocket.emit("sendContent", { id: id, content });
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
  );
};

export default ContentEditor;
