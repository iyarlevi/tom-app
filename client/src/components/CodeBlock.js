import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import * as esprima from "esprima";
import estraverse from "estraverse";
import deepEqual from "deep-equal";
import "./CodeBlock.css";

const CodeBlock = () => {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const [codeBlock, setCodeBlock] = useState(null);
  const [role, setRole] = useState("student");
  const [code, setCode] = useState("");
  const [hints, setHints] = useState([]);
  const [hintIndex, setHintIndex] = useState(-1);
  const [socket, setSocket] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [showSmiley, setShowSmiley] = useState(false);
  const editorRef = useRef(null);

  // Fetch the selected code block from the server
  useEffect(() => {
    axios
      .get(`https://tom-app-api.onrender.com/api/codeblocks/${blockId}`)
      .then((response) => {
        setCodeBlock(response.data);
        setCode(response.data.template);
        setHints(response.data.hints);
      })
      .catch((error) => {
        console.error("Error fetching code block:", error);
      });

    const socketConnection = io("https://tom-app-api.onrender.com");
    setSocket(socketConnection);

    socketConnection.emit("join", { blockId });

    socketConnection.on("role", (assignedRole) => {
      setRole(assignedRole);
    });

    socketConnection.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socketConnection.on("studentCount", (count) => {
      setStudentCount(count);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [blockId]);

  // Generalize variable names
  const normalizeAST = (ast) => {
    estraverse.traverse(ast, {
      enter: (node) => {
        if (node.type === "Identifier") {
          // Replace all variable names with 'var'
          node.name = "var";
        }
      },
    });
    return ast;
  };

  const compareCodeWithSolution = (studentCode, solutionCode) => {
    try {
      const studentAST = esprima.parseScript(studentCode);
      const solutionAST = esprima.parseScript(solutionCode);

      const normalizedStudentAST = normalizeAST(studentAST);
      const normalizedSolutionAST = normalizeAST(solutionAST);

      return deepEqual(normalizedStudentAST, normalizedSolutionAST);
    } catch (error) {
      return false;
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket && role === "student") {
      socket.emit("codeChange", { blockId, code: value });

      if (compareCodeWithSolution(value, codeBlock.solution)) {
        setShowSmiley(true);
      } else {
        setShowSmiley(false);
      }
    }
  };

  const showNextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1);
    } else {
      setHintIndex(-1);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("mentorLeft", () => {
        navigate("/");
      });
    }
  }, [socket, navigate]);

  const goToLobby = () => {
    navigate("/");
  };

  if (!codeBlock) return <div className="loading">Loading...</div>;

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <h1>{codeBlock.title}</h1>
        <p>
          Role: <span className="role-label">{role}</span>
        </p>
        <p>Number of students in the room: {studentCount - 1}</p>
      </div>

      {role === "student" && hints.length > 0 && (
        <div className="hint-container">
          <button onClick={showNextHint} className="hint-button">
            Show Hint
          </button>
          {hintIndex >= 0 && hintIndex < hints.length && (
            <p className="hint-text">{hints[hintIndex]}</p>
          )}
        </div>
      )}

      <div className="editor-container">
        <MonacoEditor
          height="80vh"
          width="100%"
          language="javascript"
          value={code}
          onChange={handleCodeChange}
          editorDidMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            readOnly: role === "mentor",
            minimap: { enabled: false },
            padding: { top: 10, bottom: 10 },
            fontSize: 16,
            theme: "vs-dark",
          }}
        />
      </div>

      {showSmiley && (
        <div className="smiley-overlay">
          <span className="smiley-face">😊</span>
          <button onClick={goToLobby} className="go-to-lobby-button">
            Go to Lobby
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
