import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const socketIo = io("http://localhost:5000");
    setSocket(socketIo);

    socketIo.on("user-list", (usersList) => {
      setUsers(Object.values(usersList));
    });

    socketIo.on("text-change", (newText) => {
      setText(newText);
    });

    socketIo.on("typing", (username) => {
      setTypingUser(username);
      setTimeout(() => {
        setTypingUser(null);
      }, 1000);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleUsernameSubmit = () => {
    if (username.trim() !== "") {
      socket.emit("set-username", username);
      setIsJoined(true);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit("text-change", newText);
    socket.emit("typing");
  };

  return (
    <div className="app-container">
      {/* Sidebar for users */}
      <aside className="sidebar">
        <h3>👥 Active Users</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index} className={username === user ? "self-user" : ""}>
              {username === user ? "🟢 You" : `🟡 ${user}`}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Editor Section */}
      <main className="main-content">
        {/* Username Input */}
        {!isJoined && (
          <div className="username-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
            />
            <button onClick={handleUsernameSubmit}>Join</button>
          </div>
        )}

        {/* Editor & Typing Indicator */}
        {isJoined && (
          <>
            <h1>Real-Time Collaboration</h1>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing..."
            />
            {typingUser && <p className="typing-indicator">{typingUser} is typing...</p>}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
