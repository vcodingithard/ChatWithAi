import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { myContext } from "./MyContext";
function App() {
  const providerValues = {};
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
