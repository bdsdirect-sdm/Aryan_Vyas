import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import sequelize from './src/config/database';
import Userdetails from './src/models/Userdetails';
import ChatRooms from './src/models/ChatRoom';
import ChatMessages from './src/models/ChatMessage';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes';
import chatRoutes from './src/routes/chatRoutes';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "localhost:5173/  ",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(express.json());

app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoutes);
app.use('/chat', chatRoutes);

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
      return;
    }
  
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
