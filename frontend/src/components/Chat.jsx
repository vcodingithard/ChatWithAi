import React, { useEffect, useContext } from "react";
import { myContext } from "../MyContext";
import "../Styling/Chat.css";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import Markdown from "react-markdown";
import ReactMarkdown from "react-markdown";
const Chat = ({ threadId }) => {
  const {
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    setNewThread,
    newThread,
    setHandleNewThread,
  } = useContext(myContext);

  useEffect(() => {
    const fetchChats = async () => {
      if (newThread) {
        setPrevChats([]);
        setNewThread(false);
        return;
      } else {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/thread/${threadId}`
          );
          setPrevChats(response.data.messages);
          setNewChat(false);
          setHandleNewThread(false);
        } catch (e) {
          console.log("Error", e);
        }
      }
    };

    fetchChats();
  }, [threadId, newChat]);

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
