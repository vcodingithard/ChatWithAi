import { useContext, useState } from "react";
import { myContext } from "../MyContext";
import "../Styling/ChatWindow.css";
import Chat from "./Chat";
import { ScaleLoader } from "react-spinners";
function ChatWindow() {
  const [load, setLoad] = useState(false);
  const { promt, setPromt, reply, setReply, threadId } = useContext(myContext);

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: promt,
        threadId: threadId,
      }),
    };
    setLoad(true);
    try {
      const response = await fetch("http://localhost:3000/api/chat", options);
      const data = await response.json();
      console.log(data);
      setReply(data);
      setPromt("");
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
        <i style={{ marginRight: "1rem" }} className="fa fa-user"></i>
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
            // onKeyDown={(e)=>e.key==enter?handleSubmit:}
          />
          <button type="submit" style={{ fontSize: "1.5rem" }}>
            <i className="submit fa fa-paper-plane"></i>
          </button>
        </form>
        <p className="opacity">Doggpt can make mistakes and is not 100% percent right</p>
      </footer>
    </div>
  );
}

export default ChatWindow;
