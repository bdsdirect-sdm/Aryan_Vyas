import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './ChatRoom.css';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:4001');

interface Message {
    id: number;
    roomId: number;
    senderId: number;
    content: string;
}

const ChatRoom: React.FC<{ userType: '1' | '2'; userId: number }> = ({ userType, userId }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
    const agencyId = userType === '1' ? 1 : null; 
    const jobSeekerId = userType === '2' ? 1 : null; 

  
    useEffect(() => {
        
        socket.on('newMessage', (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

       
        socket.on('chatRoomCreated', (chatRoom: { id: number }) => {
            setCurrentRoomId(chatRoom.id);
            socket.emit('joinRoom', chatRoom.id);
        });

        return () => {
            socket.off('newMessage');
            socket.off('chatRoomCreated');
        };
    }, []);

    
    const createChatRoom = () => {
        if (!userId) {
            console.error("User ID is missing!");
            return;
        }

        const roomData = userType === '1'
            ? { jobSeekerId: userId, agencyId }
            : { agencyId: userId, jobSeekerId };

        socket.emit('createChatRoom', roomData);
    };

    
    const sendMessage = () => {
        if (!content.trim()) return;

        if (currentRoomId) {
            socket.emit('sendMessage', { roomId: currentRoomId, senderId: userId, content });
            setContent('');
        }
    };

    return (
        <div className="chat-room">
            <h1>{userType === '1' ? 'Job Seeker' : 'Agency'} Chat Room</h1>
            
            <button onClick={createChatRoom} disabled={currentRoomId !== null}>
                {currentRoomId ? 'Chat Room Created' : 'Create Chat Room'}
            </button>

            <div className="message-container">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div className="message" key={message.id}>
                            <strong>User {message.senderId}:</strong> {message.content}
                        </div>
                    ))
                ) : (
                    <p>No messages yet. Start the conversation!</p>
                )}
            </div>

            <div className="message-input">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} disabled={!content.trim()}>
                    Send
                </button>
            </div>

            <div className="navigation-buttons">
                <button onClick={() => navigate("/login")}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
