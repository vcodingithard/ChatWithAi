import { useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import "../Styling/Sidebar.css";
import axios from "axios";
import { myContext } from "../MyContext";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
  const { allChats,
    setAllChats,
    setThreadId,
    deleteThread, 
    setDeleteThread,
    createNewThread,
    setCreateNewThread,
   } = useContext(myContext);

  const navigate = useNavigate();

  const  handleThreadCreate = async () => {
    const newId = uuidv4();
    setThreadId(newId);
    setCreateNewThread(true); 
    navigate(`/chat/${newId}`);
  };

  const handleDelete = async (threadid) => {
    try {
      await axios.delete(`http://localhost:3000/api/thread/${threadid}`,{withCredentials:true});
      setAllChats(allChats.filter(m => m.threadId !== threadid));
      setDeleteThread(true)
      handleThreadCreate();
    } catch (e) {
      console.error("Failed to delete the thread:", e);
    }
  };

  //only  trigger this when the new thread for a new chat has been created
  useEffect(() => {
    async function fetchThreads() {
      try {
        const response = await axios.get("http://localhost:3000/api/thread",{withCredentials:true});
        if (response.data.message === "No threads found") {
          setAllChats([]);
        } else {
          setAllChats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      } finally {
        if (deleteThread) setDeleteThread(false); // reset after delete
      }
    }
    fetchThreads();
  }, [deleteThread,createNewThread]);

  return (
    <div className="sidebar">
      <div className="icon">
        <Button onClick={handleThreadCreate}>
          <img src="/media/logo.png" alt="Logo" />
        </Button>
        <Tooltip title="New Chat" placement="top">
          <Button onClick={handleThreadCreate}>
            <img src="/media/new chat.png" alt="New Chat" />
          </Button>
        </Tooltip>
      </div>
      <div className="history">
        <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>Chats</p>
        {allChats.length > 0 ?
          <div className="allchats">
            {allChats.map((m) => (
              <Link style={{ textDecoration: "none" }} onClick={()=>{
                setCreateNewThread(false)
              }} key={m.threadId} to={`/chat/${m.threadId}`} className="chat-link">
                <div className="chat">
                  <p>{m.title}</p>
                  <button className="delete" onClick={(e) => {
                    e.preventDefault();
                    handleDelete(m.threadId);
                  }}><i className="fa fa-solid fa-trash"></i></button>
                </div>
              </Link>
            ))}
          </div> : ""}

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
