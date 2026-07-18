import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, LinearProgress, Typography, Divider, Paper, Chip } from "@mui/material";
import { myContext } from "../MyContext";
import axios from "axios";

import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import ChatContainer from "./ChatContainer";
import { getApiUrl } from "../config";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import ChatIcon from "@mui/icons-material/Chat";
import TerminalIcon from "@mui/icons-material/Terminal";

function ChatWindow() {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [load, setLoad] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [toolMode, setToolMode] = useState("chat"); // "chat" or "text_tools"
  const [selectedTool, setSelectedTool] = useState("auto"); // "auto", "summarize", "explain", "describe", "generate_pdf", "generate_image"
  
  // Destructure from global context
  const { 
    promt, setPrompt, 
    setThreadId, 
    setCreateNewThread, 
    setNewChat, 
    setUser, 
    threadId,
    allChats,
    setAllChats,
    rightSidebarOpen
  } = useContext(myContext);

  // Sync the URL ID with Global State
  useEffect(() => {
    if (Id) setThreadId(Id);
  }, [Id, setThreadId]);

  const handleLogout = async () => {
    try {
      await axios.get(getApiUrl("/api/user/logout"), { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const promptToSend = (promt || "").trim();
    if (!promptToSend && !selectedFile) return;
    
    setLoad(true);
    try {
      if (selectedFile) {
        // Image tools mode: Send multipart form data to /api/chat
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("message", promptToSend);
        formData.append("threadId", threadId);
        formData.append("toolMode", toolMode);
        formData.append("selectedTool", selectedTool);

        await axios.post(
          getApiUrl("/api/chat"), 
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
          getApiUrl("/api/chat"),
          { message: promptToSend, threadId, toolMode, selectedTool },
          { withCredentials: true }
        );
      } else {
        // Standard chat: Send JSON to /api/chat
        await axios.post(
          getApiUrl("/api/chat"), 
          { message: promptToSend, threadId, toolMode, selectedTool: "chat" }, 
          { withCredentials: true }
        );
      }

      // Clear input and stop "New Thread" mode
      setPrompt("");
      setCreateNewThread(false);
      setSelectedTool("auto");

      // If this thread isn't in our sidebar list yet, add it
      const exists = allChats.some(chat => chat.threadId === threadId);
      if (!exists) {
        setAllChats(prev => [{ threadId, title: promptToSend.slice(0, 30) || "Image/Text Query" }, ...prev]);
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

  // Helper strings for collapsible info panel
  const getModeTitle = () => {
    if (selectedFile) return "Image Analysis Studio";
    if (toolMode === "text_tools") return "Text Intel Studio";
    return "Standard Assistant";
  };

  const getModeIcon = () => {
    if (selectedFile) return <ImageIcon sx={{ color: "#818cf8" }} />;
    if (toolMode === "text_tools") return <AutoAwesomeIcon sx={{ color: "#a855f7" }} />;
    return <ChatIcon sx={{ color: "#34d399" }} />;
  };

  const getToolName = () => {
    if (selectedTool === "auto") return "Smart Routing (Auto)";
    if (selectedTool === "summarize") return "TL;DR Summarizer";
    if (selectedTool === "explain") return "Deep Conceptual Explainer";
    if (selectedTool === "describe") return "Entity Descriptor";
    if (selectedTool === "generate_pdf") return "Structured PDF Generator";
    if (selectedTool === "generate_image") return "Flux Image Studio";
    return selectedTool;
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      width: "100%",
      bgcolor: "#090d16"
    }}>
      <Navbar onLogout={handleLogout} />
      
      {load && (
        <LinearProgress 
          sx={{ 
            height: 2, 
            bgcolor: "rgba(99,102,241,0.06)", 
            "& .MuiLinearProgress-bar": { 
              background: "linear-gradient(90deg, #6366f1, #a855f7)" 
            } 
          }} 
        />
      )}

      {/* Split pane: Chat + Sidebar */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* Center Panel: Messages & Input */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#090d16" }}>
            <ChatContainer />
          </Box>

          <ChatInput 
            prompt={promt} 
            setPrompt={setPrompt} 
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
      </Box>
    </Box>
  );
}

export default ChatWindow;