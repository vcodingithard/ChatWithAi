import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button } from "@mui/material";
import { AccountCircle, KeyboardArrowDown, Logout, Menu as MenuIcon, Edit as EditIcon } from "@mui/icons-material";
import { useState, useContext } from "react";
import { myContext } from "../MyContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { setMobileOpen, setCreateNewThread, setThreadId } = useContext(myContext);
  const navigate = useNavigate();

  const handleNewChat = () => {
    setCreateNewThread(true);
    setThreadId(Date.now().toString()); // Just a fallback for new thread ID
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#212121", boxShadow: "none", borderBottom: { xs: "1px solid rgba(255,255,255,0.1)", md: "none" } }}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton 
            onClick={() => setMobileOpen && setMobileOpen(true)} 
            sx={{ display: { md: "none" }, color: "white" }}
          >
            <MenuIcon />
          </IconButton>
          
          <Button 
            color="inherit" 
            endIcon={<KeyboardArrowDown fontSize="small" />}
            sx={{ textTransform: "none", fontSize: "1.1rem", fontWeight: "600", color: "#ececec", "&:hover": { bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 } }}
          >
            ChatGPT 4o
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleNewChat} sx={{ display: { md: "none" }, color: "white" }}>
            <EditIcon fontSize="small" />
          </IconButton>
          
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "white" }}>
            <AccountCircle />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { bgcolor: "#2f2f2f", color: "white", borderRadius: 2, mt: 1, minWidth: 150 }
          }}
        >
          <MenuItem onClick={onLogout} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
            <Logout fontSize="small" sx={{ mr: 2, color: "white" }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;