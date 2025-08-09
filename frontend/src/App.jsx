import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { myContext } from "./MyContext";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [promt, setPromt] = useState("");
  const [reply, setReply] = useState(null);
  const [threadId, setThreadId] = useState("");
  const [prevChats, setPrevChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
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
    newChat,
    setNewChat,

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
          <Route path="/chat/:Id" element={<ChatWindow />} />
        </Routes>
      </myContext.Provider>
    </div>
  );
}

export default App;
