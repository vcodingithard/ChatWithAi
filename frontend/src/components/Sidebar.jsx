import { useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import "../Styling/Sidebar.css";
import axios from "axios";
import { myContext } from "../MyContext";
import { Link,useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
  const { allChats, setAllChats,threadId, setThreadId, } = useContext(myContext);
  const navigate = useNavigate();
  const handleNewChat =async () => {
    const newId = uuidv4();
    setThreadId(newId);

    navigate(`/chat/${newId}`);
  };
  useEffect(() => {
    async function fetchThreads() {
      try {
        const response = await axios.get("http://localhost:3000/api/thread");
        setAllChats(response.data);
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }
    }
    fetchThreads();
  }, []);

  return (
    <div className="sidebar">
      <div className="icon">
        <img src="/media/logo.png" alt="Logo" />
        <Tooltip title="New Chat" placement="top">
          <Button onClick={handleNewChat}>
            <img  src="/media/new chat.png" alt="New Chat" />
          </Button>
        </Tooltip>
      </div>
      <div className="history">
        <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>Chats</p>
        {allChats.length>0?      
        <div className="allchats">
          {allChats.map((m) => (
            <Link style={{textDecoration:"none"}} key={m.threadId} to={`/chat/${m.threadId}`} className="chat-link">
              <div className="chat">
                <p>{m.title}</p>
                <i className="fa fa-ellipsis-vertical"></i>
              </div>
            </Link>
          ))}
        </div>:""}

      </div>
      <div className="account">
        <img src="/media/account.png" alt="Account" />
        <div className="profile">
          <span>Vivek Shenoy</span>
          <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Free</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
