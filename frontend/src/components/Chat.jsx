import React, { useEffect } from "react";
import { myContext } from "../MyContext";
import { useContext } from "react";
import "../Styling/Chat.css"
import axios from "axios";
const Chat = ({threadId}) => {
  let {   prevChats, setPrevChats,newChat,setNewChat } = useContext(myContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/thread/${threadId}`);
        setPrevChats(response.data.messages)
        setNewChat(false)
      } catch (e) {
        console.log("Error", e)
      }
    }

    fetchChats();

  }, [threadId,newChat])
  

  return (
    <div className="chatbox">
      {prevChats.length === 0 ? (
        <h1>Start a new Chat</h1>
      ) : (
        <div className="chats">
          {prevChats.map((m, index) => (
            <div
              key={index}
              className={m.role === "user" ? "userdiv" : "gptdiv"}
            >
              <p
                className={m.role === "user" ? "usermessage" : "gptmessage"}
              >
                {m.content}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default Chat;