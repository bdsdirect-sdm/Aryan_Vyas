import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'; 
import { useParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "../css/Chat.css"

interface MessageData { 
  message: string;
  room: string;
  senderId: number;
  chatRoomId: any;
}

const socket: Socket = io("http://localhost:3000"); 

export default function ChatApp() {
  const { chatRoomId } = useParams();
  const [message, setMessage] = useState<string>(""); 
  const [messages, setMessages] = useState<MessageData[]>([]);
  const token: any = localStorage.getItem('token');
  const decoded: any = jwtDecode(token);
  const userId = decoded.id;
  
  const room = chatRoomId;

  useEffect(() => {
    socket.emit("join_room", room);
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/chat/chatHistory/${room}`);
        if (response.ok) {
          const chatHistory = await response.json();
          setMessages(chatHistory);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
    
    socket.on("receive_message", (data: MessageData) => {
      setMessages((prevMessages: MessageData[]) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [room]);

  const sendMessage = async () => {
    if (message.trim() !== "" && room && userId) { 
      const messageData: MessageData = {
        chatRoomId: room,
        senderId: userId,
        message,
        room: room
      };
      
      socket.emit("send_message", messageData);
      setMessage("");

      await fetch('http://localhost:3000/chat/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
    } else {
      console.error("Message cannot be sent. Ensure room and userId are valid.");
    }
  };

  return (
    
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
         
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
              <strong>{msg.senderId === userId ? 'You' : 'Agency'}</strong>: {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            className="form-control"
            placeholder="Type a message..."
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button className="send" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
