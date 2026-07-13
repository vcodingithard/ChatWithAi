import { useState, useEffect, useContext } from "react";
import { myContext } from "../MyContext";
import axios from "axios";
import { getApiUrl } from "../config";

export const useChatLogic = () => {
  const { 
    prevChats, setPrevChats, 
    threadId, 
    newChat, setNewChat, 
    createNewThread,
    allChats // We need this to check if thread exists
  } = useContext(myContext);

  const [lastReply, setLastReply] = useState(null);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    // 1. If user clicked "New Chat", just reset and stop
    if (createNewThread) {
      setPrevChats([]);
      setLastReply(null);
      setTypedText("");
      return;
    }

    const fetchChats = async () => {
      // 2. ONLY fetch if the thread is already in our history list (Prevents 404)
      const threadExistsOnServer = allChats.some(chat => chat.threadId === threadId);
      
      if (!threadExistsOnServer) {
        setPrevChats([]);
        setLastReply(null);
        return;
      }

      try {
        const { data } = await axios.get(getApiUrl(`/api/thread/${threadId}`), { 
          withCredentials: true 
        });
        const messages = data.messages || [];
        setPrevChats(messages);
        setLastReply(messages.at(-1));
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    if (threadId) fetchChats();
  }, [threadId, newChat, allChats, createNewThread, setPrevChats]); // Watch allChats for changes

  // Typing Animation Logic
  useEffect(() => {
    if (!lastReply?.content) {
      setTypedText("");
      return;
    }
    if (!newChat) {
      setTypedText(lastReply.content);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTypedText(lastReply.content.slice(0, index));
      if (index >= lastReply.content.length) {
        clearInterval(interval);
        setNewChat(false);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [lastReply, newChat, setNewChat]);

  return { prevChats, lastReply, typedText };
};