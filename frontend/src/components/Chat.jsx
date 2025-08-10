import React, { useEffect, useContext } from "react";
import { myContext } from "../MyContext";
import "../Styling/Chat.css";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const {
    prevChats,
    setPrevChats,
    createNewThread,
    threadId,
    newChat,
    setNewChat
  } = useContext(myContext);

 useEffect(() => {
  if (createNewThread) {
    setPrevChats([]);
    return; 
  }
  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/thread/${threadId}`);
        if(response.data.message==="Thread not found"){
          setPrevChats([])
        }else{
          setPrevChats(response.data.messages);
        }
        
    } catch (e) {
      console.log("Error", e);
    }finally{
      setNewChat(false)
    }
  };

  fetchChats();
}, [threadId,newChat]);


  return (
    <div className="chatbox">
      {prevChats.length == 0 ? (
        <h1>Start a new Chat</h1>
      ) : (
        <div className="chats">
          {prevChats.map((m, index) => (
            <div
              key={index}
              className={m.role === "user" ? "userdiv" : "gptdiv"}
            >
              {m.role === "user" ? (
                <div className="usermessage">{m.content}</div>
              ) : (
                <div className="gptmessage">
                  <Markdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
                    {m.content}
                  </Markdown>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;
