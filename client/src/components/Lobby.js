import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Lobby.css";

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      // .get(`${process.env.REACT_APP_API_URL}/api/codeblocks`)
      .get("https://tom-app-api.onrender.com/api/codeblocks")
      .then((response) => {
        console.log("hello1");
        console.log(response);
        console.log(response.data);

        setCodeBlocks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("hello2");

        console.error("Error fetching code blocks:", error);
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (e) => {
    const blockId = e.target.value;
    if (blockId) {
      setSelectedBlockId(blockId);
      navigate(`/codeblock/${blockId}`);
    }
  };

  if (loading) {
    return <div className="lobby-container">Loading...</div>;
  }

  return (
    <div className="lobby-container">
      <div className="lobby-box">
        <h1 className="lobby-title">Choose a Code Block</h1>
        <select
          className="code-block-dropdown"
          value={selectedBlockId}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select here
          </option>
          {codeBlocks.map((block) => (
            <option key={block._id} value={block._id}>
              {block.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Lobby;
