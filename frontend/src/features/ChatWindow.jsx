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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [toolMode, setToolMode] = useState("chat"); // "chat" or "text_tools"
  const [selectedTool, setSelectedTool] = useState("auto"); // "auto", "summarize", "explain", "describe", "generate_pdf", "generate_image"
  
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
    if (!promt.trim() && !selectedFile) return;
    
    setLoad(true);
    try {
      if (selectedFile) {
        // Image tools mode: Send multipart form data to /api/chat
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("message", promt);
        formData.append("threadId", threadId);
        formData.append("toolMode", toolMode);
        formData.append("selectedTool", selectedTool);

        await axios.post(
          "http://localhost:3000/api/chat", 
          formData, 
          { 
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true 
          }
        );

        // Clear file upload selection
        setSelectedFile(null);
        if (filePreview) {
          URL.revokeObjectURL(filePreview);
          setFilePreview("");
        }
      } else if (toolMode === "text_tools") {
        // Text tools mode: Send JSON input to /api/chat
        await axios.post(
          "http://localhost:3000/api/chat",
          { message: promt, threadId, toolMode, selectedTool },
          { withCredentials: true }
        );
      } else {
        // Standard chat: Send JSON to /api/chat
        await axios.post(
          "http://localhost:3000/api/chat", 
          { message: promt, threadId, toolMode, selectedTool: "chat" }, 
          { withCredentials: true }
        );
      }

      // Clear input and stop "New Thread" mode
      setPromt("");
      setCreateNewThread(false);
      setSelectedTool("auto");

      // If this thread isn't in our sidebar list yet, add it (Fixes 404 on refresh)
      const exists = allChats.some(chat => chat.threadId === threadId);
      if (!exists) {
        setAllChats(prev => [{ threadId, title: promt.slice(0, 30) || "Image/Text Query" }, ...prev]);
      }

      // Trigger typing animation in useChatLogic
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
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        filePreview={filePreview}
        setFilePreview={setFilePreview}
        toolMode={toolMode}
        setToolMode={setToolMode}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
    </Box>
  );
}

export default ChatWindow;