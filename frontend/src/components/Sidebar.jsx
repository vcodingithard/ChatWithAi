import { Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip, Avatar, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { Link } from "react-router-dom";
import { useSidebarLogic } from "../hooks/useSidebarLogic";
import { useContext } from "react";
import { myContext } from "../MyContext";

const SidebarContent = () => {
  const { user } = useContext(myContext);
  const { allChats, currentThread, setCurrentThread, handleThreadCreate, handleDelete, setCreateNewThread } = useSidebarLogic();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#171717", color: "white" }}>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <ListItem disablePadding sx={{ borderRadius: 2, mb: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
          <ListItemButton onClick={handleThreadCreate} sx={{ borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
              <img src="/media/logo.png" alt="Logo" style={{ height: 28, width: 28, borderRadius: "50%", background: "white", padding: "2px" }} />
              <Typography variant="body1" fontWeight="500" sx={{ flexGrow: 1 }}>New chat</Typography>
              <AddCommentIcon fontSize="small" />
            </Box>
          </ListItemButton>
        </ListItem>
      </Box>

      {/* History */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", ml: 2, mb: 1, display: "block" }}>
          Recent Chats
        </Typography>
        <List>
          {allChats.map((chat) => (
            <ListItem 
              key={chat.threadId} 
              disablePadding
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(chat.threadId)} sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "error.main" } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
              sx={{ 
                mb: 0.5, 
                borderRadius: 2,
                bgcolor: currentThread === chat.threadId ? "rgba(255,255,255,0.1)" : "transparent" 
              }}
            >
              <ListItemButton 
                component={Link} 
                to={`/chat/${chat.threadId}`}
                onClick={() => { setCreateNewThread(false); setCurrentThread(chat.threadId); }}
              >
                <ListItemText 
                  primary={chat.title || "New Conversation"} 
                  primaryTypographyProps={{ fontSize: "0.875rem", noWrap: true }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer / Account */}
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src="/media/account.png" sx={{ width: 32, height: 32 }} />
        <Box sx={{ overflow: "hidden" }}>
          <Typography variant="body2" noWrap>{user?.email}</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>Free Plan</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarContent;