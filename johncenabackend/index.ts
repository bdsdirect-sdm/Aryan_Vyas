

import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import sequelize from './src/config/database';
import Userdetails from './src/models/Userdetails';
import ChatRooms from './src/models/ChatRoom';
import ChatMessages from './src/models/ChatMessage';
import CORS from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes';
import chatRoutes from './src/routes/chatRoutes';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173", // Allow your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(CORS({
  origin: true, 
  optionsSuccessStatus: 200 
}));

app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoutes);
app.use('/chat', chatRoutes);

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('joinRoom', (roomId) => {
//     socket.join(roomId);
//     console.log(`User joined room: ${roomId}`);
//   });

//   socket.on('sendMessage', async (data) => {
//     const { chatRoomId, senderId, message } = data;

//     const chatMessage = await ChatMessages.create({ chatRoomId, senderId, message });

//     io.to(chatRoomId).emit('message', chatMessage);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// try{
//   io.on("connection", (socket: Socket) => {
//     console.log(`User Connected: ${socket.id}`);
  
//     socket.on("join_room", (room: string) => {
//       console.log(`${socket.id} joined room ${room}`);
//       socket.join(room);  
//     });
  
//     socket.on("send_message", async (data) => {
//       const { message, room, senderId } = data;
      
//       console.log(`Received message data:`, data);
    
//       if (!room || !senderId) {
//         console.error("Chat room ID or sender ID is missing.");
//         return; // Exit if any required data is missing
//       }
    
//       // const chatMessage = await ChatMessages.create({
//       //   chatRoomId: room,
//       //   senderId: senderId,
//       //   message: message
//       // });
    
//       // Emit the message to the room
//       io.to(room).emit("receive_message", data);
//     });
    
  
//     socket.on("disconnect", () => {
//       console.log(`User Disconnected: ${socket.id}`);
//     });
//   });
// }catch(err:any){
//   console.log(err)
// }
io.on("connection", (socket: Socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room: string) => {
    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);  
  });

  socket.on("send_message", async (data) => {
    const { message, room, senderId } = data;
    
    console.log(`Received message data:`, data);
  
    if (!room || !senderId) {
      console.error("Chat room ID or sender ID is missing.");
      return; // Exit if any required data is missing
    }
  
    // const chatMessage = await ChatMessages.create({
    //   chatRoomId: room,
    //   senderId: senderId,
    //   message: message
    // });
  
    // Emit the message to the room
    io.to(room).emit("receive_message", data);
  });
  

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await Userdetails.sync({ force: false });
    await ChatRooms.sync({ force: false }); 
    await ChatMessages.sync({ force: false }); 

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
