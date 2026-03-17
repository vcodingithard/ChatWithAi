import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";
import { myContext } from "../MyContext";
import axios from "axios";

import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import ChatContainer from "./ChatContainer";

function ChatWindow() {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [load, setLoad] = useState(false);
  
  // Destructure allChats and setAllChats from context
  const { 
    promt, setPromt, 
    setThreadId, 
    setCreateNewThread, 
    setNewChat, 
    setUser, 
    threadId,
    allChats,
    setAllChats 
  } = useContext(myContext);

  // Sync the URL ID with Global State
  useEffect(() => {
    if (Id) setThreadId(Id);
  }, [Id, setThreadId]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/user/logout", { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!promt.trim()) return;
    
    setLoad(true);
    try {
      // 1. Switched to Axios + withCredentials to fix 401
      await axios.post(
        "http://localhost:3000/api/chat", 
        { message: promt, threadId }, 
        { withCredentials: true }
      );

      // 2. Clear input and stop "New Thread" mode
      setPromt("");
      setCreateNewThread(false);

      // 3. If this thread isn't in our sidebar list yet, add it (Fixes 404 on refresh)
      const exists = allChats.some(chat => chat.threadId === threadId);
      if (!exists) {
        setAllChats(prev => [{ threadId, title: promt.slice(0, 30) }, ...prev]);
      }

      // 4. Trigger typing animation in useChatLogic
      setNewChat(true);

    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoad(false);
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      width: "100%"
    }}>
      <Navbar onLogout={handleLogout} />
      
      {load && <LinearProgress color="primary" sx={{ height: 2 }} />}

      <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#212121" }}>
        <ChatContainer />
      </Box>

      <ChatInput 
        prompt={promt} 
        setPrompt={setPromt} 
        onSubmit={handleSubmit} 
        loading={load} 
      />
    </Box>
  );
}

export default ChatWindow;