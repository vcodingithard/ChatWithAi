import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button, Tooltip } from "@mui/material";
import { AccountCircle, KeyboardArrowDown, Logout, Menu as MenuIcon, Edit as EditIcon, Tune as TuneIcon } from "@mui/icons-material";
import { useState, useContext } from "react";
import { myContext } from "../MyContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { setMobileOpen, setCreateNewThread, setThreadId, rightSidebarOpen, setRightSidebarOpen } = useContext(myContext);
  const navigate = useNavigate();

  const handleNewChat = () => {
    setCreateNewThread(true);
    setThreadId(Date.now().toString()); 
    navigate("/");
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: "rgba(9, 13, 22, 0.7)", 
        backdropFilter: "blur(12px)",
        boxShadow: "none", 
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backgroundImage: "none"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton 
            onClick={() => setMobileOpen && setMobileOpen(true)} 
            sx={{ display: { md: "none" }, color: "rgba(255,255,255,0.8)" }}
          >
            <MenuIcon />
          </IconButton>
          
          <Button 
            color="inherit" 
            endIcon={<KeyboardArrowDown fontSize="small" sx={{ color: "rgba(255,255,255,0.4)" }} />}
            sx={{ 
              textTransform: "none", 
              fontSize: "0.95rem", 
              fontWeight: "600", 
              color: "#ececec", 
              px: 1.5,
              py: 0.75,
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)",
              bgcolor: "rgba(255,255,255,0.02)",
              "&:hover": { 
                bgcolor: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.1)"
              } 
            }}
          >
            Studio Model v4.0
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Start New Session" placement="bottom">
            <IconButton onClick={handleNewChat} sx={{ display: { md: "none" }, color: "white" }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Toggle Right Studio Sidebar */}
          <Tooltip title={rightSidebarOpen ? "Collapse Control Panel" : "Expand Control Panel"} placement="bottom">
            <IconButton 
              onClick={() => setRightSidebarOpen(prev => !prev)}
              sx={{ 
                color: rightSidebarOpen ? "#818cf8" : "rgba(255,255,255,0.6)", 
                bgcolor: rightSidebarOpen ? "rgba(99, 102, 241, 0.1)" : "transparent",
                border: "1px solid",
                borderColor: rightSidebarOpen ? "rgba(99, 102, 241, 0.2)" : "transparent",
                transition: "all 0.2s",
                "&:hover": { 
                  bgcolor: rightSidebarOpen ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.06)" 
                }
              }}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "rgba(255,255,255,0.8)" }}>
            <AccountCircle />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { 
              bgcolor: "#111827", 
              color: "white", 
              borderRadius: "12px", 
              mt: 1, 
              minWidth: 160,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              p: 0.5
            }
          }}
        >
          <MenuItem 
            onClick={onLogout} 
            sx={{ 
              borderRadius: "8px", 
              fontSize: "0.85rem",
              py: 1,
              "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } 
            }}
          >
            <Logout fontSize="small" sx={{ mr: 1.5, color: "rgba(255,255,255,0.5)" }} /> Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;