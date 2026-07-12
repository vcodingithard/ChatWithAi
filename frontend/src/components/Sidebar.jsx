import { Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, Avatar, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link } from "react-router-dom";
import { useSidebarLogic } from "../hooks/useSidebarLogic";
import { useContext } from "react";
import { myContext } from "../MyContext";

const SidebarContent = () => {
  const { user } = useContext(myContext);
  const { allChats, currentThread, setCurrentThread, handleThreadCreate, handleDelete, setCreateNewThread } = useSidebarLogic();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#0c101b", borderRight: "1px solid rgba(255,255,255,0.06)", color: "white" }}>
      {/* Header with Logo */}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 0.5 }}>
          <Box sx={{
            width: 32,
            height: 32,
            bg: "gradient-to-tr from-indigo-500 to-purple-600",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            D
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="700" sx={{ letterSpacing: "0.5px", fontSize: "0.95rem", bgGradient: "linear(to-r, white, rgba(255,255,255,0.7))" }}>
              Dogpt Studio
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              v2.1 Stable
            </Typography>
          </Box>
        </Box>

        {/* New Thread Button */}
        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton 
            onClick={handleThreadCreate} 
            sx={{ 
              borderRadius: "12px",
              background: "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
              color: "white",
              py: 1.25,
              px: 2,
              boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                background: "linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)",
                boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
                transform: "translateY(-1px)"
              },
              "&:active": {
                transform: "translateY(0)"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1.5 }}>
              <AddIcon fontSize="small" sx={{ color: "white" }} />
              <Typography variant="body2" fontWeight="600" sx={{ flexGrow: 1, letterSpacing: "0.2px" }}>
                New Session
              </Typography>
            </Box>
          </ListItemButton>
        </ListItem>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, mb: 2 }} />

      {/* History List */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, pb: 2 }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)", ml: 1.5, mb: 1.5, display: "block", fontSize: "0.72rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
          Recent Workspace Sessions
        </Typography>
        <List sx={{ p: 0 }}>
          {allChats.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "12px", m: 1 }}>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
                No active sessions
              </Typography>
            </Box>
          ) : (
            allChats.map((chat) => {
              const isActive = currentThread === chat.threadId;
              return (
                <ListItem 
                  key={chat.threadId} 
                  disablePadding
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDelete(chat.threadId)} 
                      sx={{ 
                        color: "rgba(255,255,255,0.2)", 
                        opacity: isActive ? 1 : 0,
                        transition: "all 0.2s",
                        "&:hover": { color: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.08)" },
                        p: "4px",
                        mr: "4px"
                      }}
                      className="delete-btn"
                    >
                      <DeleteIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  }
                  sx={{ 
                    mb: 0.75, 
                    borderRadius: "10px",
                    bgcolor: isActive ? "rgba(99, 102, 241, 0.12)" : "transparent",
                    border: "1px solid",
                    borderColor: isActive ? "rgba(99, 102, 241, 0.25)" : "transparent",
                    transition: "all 0.2s",
                    "&:hover": { 
                      bgcolor: isActive ? "rgba(99, 102, 241, 0.16)" : "rgba(255,255,255,0.03)",
                      "& .delete-btn": { opacity: 1 }
                    }
                  }}
                >
                  <ListItemButton 
                    component={Link} 
                    to={`/chat/${chat.threadId}`}
                    onClick={() => { setCreateNewThread(false); setCurrentThread(chat.threadId); }}
                    sx={{ py: 1, px: 1.5, borderRadius: "10px" }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: "16px", color: isActive ? "#818cf8" : "rgba(255,255,255,0.4)", mr: 1.5 }} />
                    <ListItemText 
                      primary={chat.title || "Untitled Session"} 
                      primaryTypographyProps={{ 
                        fontSize: "0.85rem", 
                        fontWeight: isActive ? "600" : "500",
                        color: isActive ? "#ececec" : "rgba(255,255,255,0.65)",
                        noWrap: true 
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>
      </Box>

      {/* Account Info Footer */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(0,0,0,0.15)" }}>
        <Avatar src="/media/account.png" sx={{ width: 34, height: 34, border: "1px solid rgba(255,255,255,0.1)" }} />
        <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
          <Typography variant="body2" fontWeight="600" noWrap sx={{ color: "#ececec", fontSize: "0.85rem" }}>
            {user?.username || "Active Developer"}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: "rgba(255,255,255,0.45)", display: "block", fontSize: "0.7rem" }}>
            {user?.email || "developer@dogpt.studio"}
          </Typography>
        </Box>
        <Box sx={{
          bgcolor: "rgba(99, 102, 241, 0.15)",
          color: "#818cf8",
          fontSize: "0.65rem",
          fontWeight: "700",
          px: 1.2,
          py: 0.4,
          borderRadius: "6px",
          border: "1px solid rgba(99,102,241,0.25)",
          textTransform: "uppercase"
        }}>
          Pro
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarContent;