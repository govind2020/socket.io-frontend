import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";

const Chat = ({ socket, userName, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

   // Function to fetch chat messages for a specific room from JSON server
  //  const fetchRoomMessages = async () => {
  //   console.log('rooms name:', room)
  //   try {
  //     const response = await axios.get(`http://localhost:3002/rooms/`);
  //     const historyData = response?.data?.rooms;
  //     const roomMessages = historyData[room] || [];
  //     setMessageList(roomMessages || []);
      
  //   } catch (error) {
  //     console.error("Error fetching chat messages:", error);
  //   }
  // };

  const fetchRoomMessages = async () => {
    console.log('rooms name:', room);
    try {
      const response = await axios.get(`http://localhost:3002/rooms/`);
      const historyData = response?.data?.rooms;

      let roomFound = false;
      for (const key in historyData) {
        console.log('key no:', key)
        if (key === room) {
          roomFound = true;
          const roomMessages = historyData[key] || [];
          console.log('roomMessages:', roomMessages)
          if(!roomFound){
            return
          }
          setMessageList(roomMessages);

          socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
          });

          roomFound = true;
          break; 
        }else{

          roomFound = false;

          return;
        }
      }
  
      if (!roomFound) {
        console.log(`Room ${room} not found in history data`);

        socket.on("receive_message", (data) => {
          setMessageList((list) => [...list, data]);
        });

        return () => {
          socket.off("receive_message");
        };
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };
  

  useEffect(() => {
    // fetchRoomMessages();

    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [room]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessageList((list) => [...list, data]);
  //   });
  
  //   // Cleanup function
  //   return () => {
  //     socket.off("receive_message");
  //   };
  // }, []);
  // console.log('messageList==>', messageList)

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
              key={index}
                className="message"
                id={userName === messageContent.author ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat;