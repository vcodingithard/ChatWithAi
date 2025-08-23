import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myContext } from "../MyContext";
import "../Styling/ChatWindow.css";
import Chat from "./Chat";
import { ScaleLoader } from "react-spinners";
import axios from "axios";

function ChatWindow() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);//for scaleLoader
  const [menuOpen, setMenuOpen] = useState(false);

  const { promt, setPromt, threadId, setThreadId, setCreateNewThread, setNewChat,setUser } = useContext(myContext);
  const { Id } = useParams();

  useEffect(() => {
    setThreadId(Id);
  }, [Id]);

  //styling for the loader
  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "fit-contnent",
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/user/logout", { withCredentials: true })
      setUser(null)
      navigate("/login");
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers:{ 
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        message: promt,
        threadId: threadId,
      }),
    };
    setLoad(true);
    try {
      const response = await fetch("http://localhost:3000/api/chat", options);
      await response.json();
      setPromt("");
      setCreateNewThread(false);
      setNewChat(true)
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoad(false);
  };

  return (
    <div className="chatwindow">
      <div className="navbar">
        <button>
          <p style={{ marginRight: "1rem", fontSize: "large" }}>
            Dogpt &nbsp;
            <i
              className="fa fa-arrow-down"
              style={{ fontSize: "small", opacity: "0.7" }}
            ></i>
          </p>
        </button>
        <i
          style={{ marginRight: "1rem", cursor: "pointer" }}
          className="fa fa-user"
          onClick={() => setMenuOpen((prev) => !prev)}
        ></i>
        {menuOpen && (
          <div className="dropdown">
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="fa fa-sign-out" style={{ marginRight: 8,color:"black" }}></i>
              Logout
            </button>
          </div>
        )}
      </div>

      <Chat className="chatStyling" />

      <ScaleLoader cssOverride={override} color="white" loading={load} />

      <footer>
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            placeholder="Ask anything"
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
          />
          <button type="submit" style={{ fontSize: "1.5rem" }}>
            <i className="submit fa fa-paper-plane"></i>
          </button>
        </form>
        <p className="opacity">
          Doggpt can make mistakes and is not 100% percent right
        </p>
      </footer>
    </div>
  );
}

export default ChatWindow;
