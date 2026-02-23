import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { AccountCircle, KeyboardArrowDown, Logout } from "@mui/icons-material";
import { useState } from "react";

const Navbar = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Button color="inherit" endIcon={<KeyboardArrowDown />}>
          Clone
        </Button>
        
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
          <AccountCircle />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={onLogout}>
            <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;