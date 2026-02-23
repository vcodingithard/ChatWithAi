import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { myContext } from "../MyContext";

export const useSidebarLogic = () => {
  const [currentThread, setCurrentThread] = useState(null);
  const navigate = useNavigate();
  const { 
    allChats, setAllChats, setThreadId, deleteThread, 
    setDeleteThread, createNewThread, setCreateNewThread 
  } = useContext(myContext);

  const handleThreadCreate = () => {
    const newId = uuidv4();
    setThreadId(newId);
    setCreateNewThread(true); 
    setCurrentThread(null);
    navigate(`/chat/${newId}`);
  };

  const handleDelete = async (threadid) => {
    try {
      await axios.delete(`http://localhost:3000/api/thread/${threadid}`, { withCredentials: true });
      setAllChats(prev => prev.filter(m => m.threadId !== threadid));
      setDeleteThread(true);
      handleThreadCreate();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  useEffect(() => {
    async function fetchThreads() {
      try {
        const { data } = await axios.get("http://localhost:3000/api/thread", { withCredentials: true });
        setAllChats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch threads failed:", error);
      } finally {
        if (deleteThread) setDeleteThread(false);
      }
    }
    fetchThreads();
  }, [deleteThread, createNewThread, setAllChats, setDeleteThread]);

  return { allChats, currentThread, setCurrentThread, handleThreadCreate, handleDelete, setCreateNewThread };
};