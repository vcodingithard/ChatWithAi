import  { useEffect, useContext, useState } from "react";
import { myContext } from "../MyContext";
import "../Styling/Chat.css";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const {
    prevChats,
    setPrevChats,
    createNewThread,
    threadId,
    newChat,
    setNewChat,
  } = useContext(myContext);

  const [lastReply, setLastReply] = useState(null);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (createNewThread) {
      setPrevChats([]);
      setLastReply(null);
      setTypedText("");
      return;
    }
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/thread/${threadId}`
        );
        if (response.data.message === "Thread not found") {
          setPrevChats([]);
          setLastReply(null);
          setTypedText("");
        } else {
          setPrevChats(response.data.messages);
          setLastReply(response.data.messages.at(-1));
          setTypedText("");
        }
      } catch (e) {
        console.log("Error", e);
      }
    };

    fetchChats();
  }, [threadId, newChat]);

useEffect(() => {
  if (!lastReply || !lastReply.content) return;

  if (!newChat) {
    setTypedText(lastReply.content);
    return;
  }

  let index = 0;
  const fullText = lastReply.content;

  const interval = setInterval(() => {
    index++;
    setTypedText(fullText.slice(0, index));

    if (index === fullText.length) {
      clearInterval(interval);
      setNewChat(false);  // Set this only once typing finished
    }
  },20);

  return () => clearInterval(interval);
}, [lastReply, newChat]);

  return (
    <div className="chatbox">
      {prevChats.length === 0 ? (
        <h1>Start a new Chat</h1>
      ) : (
        <div className="chats">
          {prevChats.slice(0, -1).map((m, index) => (
            <div
              key={index}
              className={m.role === "user" ? "userdiv" : "gptdiv"}
            >
              {m.role === "user" ? (
                <div className="usermessage">{m.content}</div>
              ) : (
                <div className="gptmessage">
                  <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {lastReply && (
            <div className="gptmessage">
              <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
                {typedText}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
