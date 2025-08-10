import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { myContext } from "./MyContext";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
function App() {
  const [promt, setPromt] = useState("");
  const [reply, setReply] = useState(null);
  const [threadId, setThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);//for getting all the previous chats 
  const [allChats, setAllChats] = useState([]);//for getting all the threads
  const [createNewThread,setCreateNewThread]=useState(false)
  const [deleteThread, setDeleteThread] = useState(false);
  const [newChat,setNewChat]=useState(false)
  const providerValues = {
    promt,
    setPromt,
    reply,
    setReply,
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
    setNewChat
  };

  return (
    <div className="app">
      <myContext.Provider value={providerValues}>
        <Sidebar />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/chat/${threadId}`} />}
          />
          <Route path="/chat" element={<Navigate to={`/chat/${threadId}`} />} />
          <Route path="/chat/:Id" element={<ChatWindow />} />
        </Routes>
      </myContext.Provider>
    </div>
  );
}

export default App;
