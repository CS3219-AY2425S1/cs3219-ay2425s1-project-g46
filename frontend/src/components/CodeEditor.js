// Author(s): Xue ling, Calista
import "./styles/CodeEditor.css";
import { useEffect, useRef, useState } from "react";
import { collaborationSocket } from "../config/socket";
import Editor from "@monaco-editor/react";
import supportedLanguages from "../data/supportedLanguages.json";
import useSessionStorage from "../hook/useSessionStorage";

const CodeEditor = ({ id }) => {
  const [code, setCode] = useSessionStorage("", "code");
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  

  useEffect(() => {
    console.log(id);
    
    // emit once for default values
    collaborationSocket.emit("sendCode", { id, code });
    collaborationSocket.emit("languageChange", { id, language });

    collaborationSocket.on("receiveCode", ({ code }) => {
      setCode(code);
    });

    collaborationSocket.on("languageChange", ({ language }) => {
      setLanguage(language);
    });

    return () => {
      collaborationSocket.off("receiveCode");
      collaborationSocket.off("languageChange");
    };
  }, [id, language, code]);

  function handleEditorChange(code, event) {
    setCode(code);
    collaborationSocket.emit("sendCode", { id, code });
  }

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setLanguage(language);
    collaborationSocket.emit("languageChange", { id, language });
  };

  return (
    <div id="editor-container" className="container">
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="">--Please choose a language--</option>
        {supportedLanguages.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Editor
        height="100vh"
        language={language}
        defaultValue={"// your code here"}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: true,
            renderCharacters: true, // Show characters in the minimap
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
