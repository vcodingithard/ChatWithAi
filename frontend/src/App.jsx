import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { myContext } from "./MyContext";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
function App() {
  const [promt,setPromt]=useState("");
  const [reply,setReply]=useState(null);
  const [threadId,setThreadId]=useState(uuidv4());
  const providerValues = {
    promt,
    setPromt,
    reply,
    setReply,
    threadId,
    setThreadId,
  };
  return (
    <div className="app">
      <myContext.Provider value={providerValues}>
      <Sidebar />
      <ChatWindow />
    </myContext.Provider>
    </div>
  );
}

export default App;
