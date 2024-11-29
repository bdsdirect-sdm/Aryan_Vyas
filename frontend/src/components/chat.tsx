import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { Local } from '../environment/env';
import { io, Socket } from 'socket.io-client'; // Import socket.io
import profileImg from "../photos/profile1.avif";
// import "./Chat.css";
// Create socket instance here
let socket: Socket;

const fetchChatRooms = async (token: string) => {
    const response = await api.get(`${Local.BASE_URL}chat/chatRooms`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const fetchChatMessages = async (chatRoomId: string, token: string) => {
    try {
        const response = await api.get(`${Local.BASE_URL}chat/chatMessages/${chatRoomId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const sendChatMessage = async (messageData: any, token: string) => {
    const response = await api.post(`${Local.BASE_URL}chat/sendMessage`, messageData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("message>>>>>>>>>>>>>.............",response)
    return response.data;
};

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId = decoded.uuid;
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [isJoined, setIsJoined] = useState(false);

    const { data: chatRooms, isLoading: roomsLoading, error: roomsError } = useQuery({
        queryKey: ['chatRooms'],
        queryFn: () => fetchChatRooms(token!),
    });

    console.log("chatrooooooooomsssss",chatRooms);
    
    const { mutate: sendMessage } = useMutation({
        mutationFn: (messageData: any) => sendChatMessage(messageData, token!),
        onSuccess: () => {
            setMessage('');
        },
        onError: (error) => {
            console.error('Error sending message:', error);
        },
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        // Initialize socket connection
        socket = io(`${Local.BASE_URL}`);
        
        socket.on('receive_message', (messageData) => {
            setChatMessages((prevMessages) => [...prevMessages, messageData]);
        });

        // Cleanup on unmount
        return () => {
            socket.off('receive_message');
            socket.disconnect();
        };
    }, [token, navigate]);

    useEffect(() => {
        if (selectedRoom && !isJoined) {
            socket.emit('join_room', selectedRoom);
            setIsJoined(true);
        }

        return () => {
            if (selectedRoom) {
                socket.emit('leave_room', selectedRoom);
            }
        };
    }, [selectedRoom]);

    const handleSelectRoom = (roomId: string) => {
        setSelectedRoom(roomId);
        setChatMessages([]);
        fetchChatMessages(roomId, token!).then((messages) => {
            console.log("inside", messages);
            setChatMessages(messages);
        });
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const messageData = {
            chatRoomId: selectedRoom,
            senderId: userId,
            message,
        };
      
        setChatMessages((prevMessages) => [
            ...prevMessages,
            { senderId: userId, message, firstname: 'You' },
        ]);

      
        socket.emit('send_message', messageData);

       
        sendMessage(messageData);
    };

    console.log(chatMessages);

    return (
        <div className="chat-container row">
            {/* Left Panel - Chat Rooms List */}
            <div className="chat-header col" style={{ marginLeft: "20%", width: '50%' }}>
                <h5>Messages</h5>
                <input type="text" className="form-control my-3" placeholder="Search..." />
                <ul className="list-group">
                    {roomsLoading ? (
                        <div>Loading rooms...</div>
                    ) : roomsError ? (
                        <div>Error loading rooms: {roomsError instanceof Error ? roomsError.message : 'Unknown error'}</div>
                    ) : (
                        chatRooms?.map((room: any) => (
                            <li
                                key={room.roomId}
                                className="list-group-item"
                                onClick={() => handleSelectRoom(room.roomId)}
                            >
                                <img className="p-img" style={{width:50,height:50}} src={profileImg} alt="profile" />
                                <span className="fw-bold">{room.patientName}</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Right Panel - Chat Window */}
            <div className="chat-messages col">
                {selectedRoom ? (
                    <>
                        <div className="chat-header">
                            <h1>Your Chat</h1>
                            
                        </div>
                        <div className="messages-container">
                            {chatMessages.map((msg: any, index) => (
                                <div key={index} className="message">
                                    <strong>{msg.senderId === userId ? 'You' : `${msg.senderFirstName}${" "} ${msg.senderLastName}`}: </strong>
                                    <span>{msg.message}</span>
                                </div>
                            ))}
                        </div>
                        <div className="message-input">
                            <textarea
                                className="form-control"
                                placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <span
                                className="btn btn-primary my-2"
                                onClick={handleSendMessage}
                            >
                                Send
                            </span>
                        </div>
                    </>
                ) : (
                    <div>Select a chat room to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default Chat;
