/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { Local } from '../environment/env';
import { io, Socket } from 'socket.io-client'; 
import profileImg from "../photos/profile1.avif";
import moment from 'moment'; 
import "./Chat.css";

let socket: Socket;
const doctype = Number(localStorage.getItem("doctype"));

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
    console.log("time", response.data)
    return response.data;
};

const formatTimestampToIST = (timestamp: string) => {
    const date = moment.utc(timestamp).add(5.5, 'hours');


    const formattedTime = date.format('hh:mm A');


    if (date.isSame(moment(), 'day')) {
        return `Today, ${formattedTime}`;
    }
    if (date.isSame(moment().add(1, 'days'), 'day')) {
        return `Tomorrow, ${formattedTime}`;
    }

    return date.format('MMMM D, YYYY, hh:mm A');
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
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
    const [receiverName, setReceiverName] = useState<string>('');


    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { data: chatRooms, isLoading: roomsLoading, error: roomsError } = useQuery({
        queryKey: ['chatRooms'],
        queryFn: () => fetchChatRooms(token!),
    });

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


        socket = io(`${Local.BASE_URL,{
            transports: ['websocket', 'polling'],   
        }}`);

        socket.on('receive_message', (messageData) => {
            setChatMessages((prevMessages) => [...prevMessages, messageData]);
        });


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

    useEffect(() => {

        if (chatRooms) {
            const filtered = chatRooms.filter((room: any) =>
                room.patientName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRooms(filtered);
        }
    }, [searchQuery, chatRooms]);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }


        if (messageInputRef.current) {
            messageInputRef.current.focus();
        }
    }, [chatMessages, selectedRoom]);

    const handleSelectRoom = (roomId: string) => {
        setSelectedRoom(roomId);
        setChatMessages([]);
        fetchChatMessages(roomId, token!).then((messages) => {
            setChatMessages(messages);
        });

        const selectedRoom = chatRooms.find((room: any) => room.roomId === roomId);
        if (selectedRoom) {
            setReceiverName(selectedRoom.patientName);
        }
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


    const getReceiverName = (messages: any[], userId: string) => {
        const receiverMessage = messages.find((msg: any) => msg.senderId !== userId);
        if (receiverMessage) {
            return `${receiverMessage.senderFirstName} ${receiverMessage.senderLastName}`;
        }
        return 'Receiver';
    };

    return (
        <div className="chat-container">
            <div className='top row'>

                <div className="chat-header col">
                    <h5>Messages</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ul className="list-group">
                        {roomsLoading ? (
                            <div>Loading rooms...</div>
                        ) : roomsError ? (
                            <div>Error loading rooms: {roomsError instanceof Error ? roomsError.message : 'Unknown error'}</div>
                        ) : (
                            filteredRooms?.map((room: any) => (
                                <li
                                    key={room.roomId}
                                    className="list-group-item"
                                    onClick={() => handleSelectRoom(room.roomId)}
                                >
                                    <img className="p-img" style={{ width: 50, height: 50 }} src={profileImg} alt="profile" />
                                    <span className="patient-name">{room.patientName}</span>
                                    {doctype === 2 ? (
                                        <p className='doctor-name'>Referred To: {getReceiverName(chatMessages, userId)}</p>
                                    ) : (
                                        <p className='doctor-name'>Referred By: {getReceiverName(chatMessages, userId)}</p>
                                    )}
                                </li>

                            ))
                        )}
                    </ul>
                </div>


                <div className="chat-messages col">
                    {selectedRoom ? (
                        <>

                            <div className="chat-head">
                                <p className="chat-heading">
                                    {getReceiverName(chatMessages, userId)}{" "}
                                </p>
                            </div>


                            <div className="messages-container">
                                <div className="messages-part">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
                                            <strong className='chat-message'>
                                                <br></br><span className='user-message'>{msg.message} </span><span className='message-time'>{formatTimestampToIST(msg.createdAt)}</span>
                                            </strong>
                                        </div>
                                    ))}
                                </div>

                                <div ref={messagesEndRef} />
                            </div>

                            <div className="message-input">
                                <textarea
                                    ref={messageInputRef}
                                    className="form-control"
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <span
                                    className="btn btn-primary my-2 send-button"
                                    onClick={handleSendMessage}
                                >
                                    Send
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className='ho1'>
                        <span  className='color-height'>No Chat To Show</span>
                        <span className='height-no-chat'>No Chat To Show</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
