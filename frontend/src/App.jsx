import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Drawer } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Context & Features
import { myContext } from "./MyContext";
import SidebarContent from "./components/Sidebar"; // The modular sidebar content
import ChatWindow from "./features/ChatWindow";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [promt, setPromt] = useState("");
  const [threadId, setThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [createNewThread, setCreateNewThread] = useState(false);
  const [deleteThread, setDeleteThread] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mobile Sidebar State
  const [mobileOpen, setMobileOpen] = useState(false);

  const providerValues = {
    promt, setPromt,
    threadId, setThreadId,
    prevChats, setPrevChats,
    allChats, setAllChats,
    deleteThread, setDeleteThread,
    createNewThread, setCreateNewThread,
    newChat, setNewChat,
    user, setUser,
    setMobileOpen, // Passing this to Navbar via Context to trigger drawer
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#343541' }}>
        <CircularProgress sx={{ color: '#10a37f' }} />
      </Box>
    );
  }

  return (
    <myContext.Provider value={providerValues}>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#343541", color: "white" }}>
        {user ? (
          <>
            {/* 1. MOBILE DRAWER (Only shows on small screens) */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }} // Better mobile performance
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, bgcolor: "#171717" },
              }}
            >
              <SidebarContent />
            </Drawer>

            {/* 2. DESKTOP SIDEBAR (Permanent on medium+) */}
            <Box sx={{ display: { xs: "none", md: "block" }, width: "260px", flexShrink: 0 }}>
              <SidebarContent />
            </Box>

            {/* 3. MAIN CONTENT AREA */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <Routes>
                <Route path="/" element={<Navigate to={`/chat/${threadId}`} />} />
                <Route path="/chat" element={<Navigate to={`/chat/${threadId}`} />} />
                <Route path="/chat/:Id" element={<ChatWindow />} />
                <Route path="*" element={<Navigate to="/chat" />} />
              </Routes>
            </Box>
          </>
        ) : (
          /* AUTH ROUTES (Full screen) */
          <Box sx={{ width: "100%" }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Box>
        )}
      </Box>
    </myContext.Provider>
  );
}

export default App;