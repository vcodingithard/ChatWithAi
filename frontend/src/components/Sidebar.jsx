import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import "../Styling/Sidebar.css";
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="icon">
        <img src="/media/logo.png"></img>
        <Tooltip title="New Chat" placement="top">
          <Button>
            <img src="/media/new chat.png" alt="New Chat" />
          </Button>
        </Tooltip>
      </div>
      <div className="history">
       <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>Chats</p>
        <div className="chats">
            <div className="chat">
                <p>Title</p>
                <i className="fa fa-ellipsis-vertical"></i>
            </div>
        </div>
      </div>
      <div className="account">
        <img src="/media/account.png" alt="Account" />
        <div className="profile">
          <span>Vivek Shenoy</span>
          <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Free</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
