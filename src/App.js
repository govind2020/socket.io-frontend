import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("https://socket-io-8veu.onrender.com");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinROom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a Chat</h3>
          <input
            type="text"
            placeholder="Enter Name"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <button onClick={joinROom}>Join Room</button>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} room={room} />
      )}
    </div>
  );
}

export default App;
