import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import Signup from "./components/Signup";

import { myContext } from "./MyContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [promt, setPromt] = useState("");
  const [threadId, setThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]); //for getting all the previous chats 
  const [allChats, setAllChats] = useState([]); //for getting all the threads
  const [createNewThread, setCreateNewThread] = useState(false);
  const [deleteThread, setDeleteThread] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(true);

  const providerValues = {
    promt,
    setPromt,
    threadId,
    setThreadId,
    prevChats,
    setPrevChats,
    allChats,
    setAllChats,
    deleteThread,
    setDeleteThread,
    createNewThread,
    setCreateNewThread,
    newChat,
    setNewChat,
    user,
    setUser,
  };
  useEffect(() => {
    axios.get("http://localhost:3000/api/user/me", { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="app">
      <myContext.Provider value={providerValues}>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>

        ) : user ? (
          <>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Navigate to={`/chat/${threadId}`} />} />
              <Route path="/chat" element={<Navigate to={`/chat/${threadId}`} />} />
              <Route path="/chat/:Id" element={<ChatWindow />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </myContext.Provider>

    </div>
  );
}

export default App;
