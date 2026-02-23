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
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="/media/logo.png" alt="Logo" style={{ height: 32 }} />
        <Tooltip title="New Chat">
          <IconButton onClick={handleThreadCreate} sx={{ color: "white" }}>
            <AddCommentIcon />
          </IconButton>
        </Tooltip>
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