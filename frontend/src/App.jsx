import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Drawer, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { myContext as MyContext } from "./MyContext";
import SidebarContent from "./components/Sidebar";
import ChatWindow from "./features/ChatWindow";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar"; // New component for mobile toggle

function App() {
  const [promt, setPromt] = useState("");
  const [threadId, setThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createNewThread, setCreateNewThread] = useState(false);
  const [deleteThread, setDeleteThread] = useState(false);
  const [newChat, setNewChat] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#212121' }}>
        <CircularProgress sx={{ color: '#10a37f' }} />
      </Box>
    );
  }

  return (
    <MyContext.Provider value={{ 
      promt, setPromt, 
      threadId, setThreadId, 
      prevChats, setPrevChats, 
      allChats, setAllChats, 
      user, setUser, 
      setMobileOpen,
      createNewThread, setCreateNewThread,
      deleteThread, setDeleteThread,
      newChat, setNewChat
    }}>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", bgcolor: "#212121" }}>
        {user ? (
          <>
            {/* Mobile Drawer */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": { width: 280, bgcolor: "#171717", borderRight: "1px solid #333" },
              }}
            >
              <SidebarContent closeDrawer={() => setMobileOpen(false)} />
            </Drawer>

            {/* Desktop Sidebar */}
            <Box sx={{ display: { xs: "none", md: "block" }, width: 260, flexShrink: 0, bgcolor: "#171717", borderRight: "1px solid #333" }}>
              <SidebarContent />
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", position: "relative", height: "100%", width: "100%" }}>
              <Box component="main" sx={{ flexGrow: 1, overflowY: "auto", position: "relative", bgcolor: "#212121" }}>
                <Routes>
                  <Route path="/" element={<Navigate to={`/chat/${threadId}`} />} />
                  <Route path="/chat/:Id" element={<ChatWindow />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ width: "100%", height: "100%" }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Box>
        )}
      </Box>
    </MyContext.Provider>
  );
}

export default App;