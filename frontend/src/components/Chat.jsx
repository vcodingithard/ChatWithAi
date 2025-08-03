import React from "react";
import{myContext} from "../MyContext";
import { useContext } from "react";
import "../Styling/Chat.css"
const Chat = () => {
  let {newChat} =useContext(myContext)
  return (
    <div className="chatbox">
      {newChat && <h1>Start a new Chat</h1>}
      <div className="chats">
        <div className="userdiv">
          <p className="usermessage">User div</p>
        </div>
        <div className="gptdiv">
          <p className="gptmessage">Gpt message</p>
        </div>
      </div>
    </div>
  );
};
export default Chat;