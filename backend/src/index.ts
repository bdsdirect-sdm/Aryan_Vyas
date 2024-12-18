import express from 'express';
import http from "http";
import cors from 'cors';
import { Local } from './environment/env';
import sequelize from './config/db';
import User from './models/User';
import userRouter from './routers/userRouter';
import {createServer} from 'http';
import chatRouter from './routers/chatRouter';
import { Server,Socket } from 'socket.io';
import path from 'path';
import notificationRouter from './routers/notificationRouter';
import Notifications from './models/Notification';

// import sequelize from 'seq';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

export const httpServer = createServer(app);
   
app.use(cors());
app.use(express.json());
const uploadsPath=path.join(__dirname, "..","uploads");
app.use("/uploads",express.static(uploadsPath));

app.use("/", userRouter);
app.use("/chat", chatRouter);
app.use("/notifications", notificationRouter);

io.on("connection",(socket:Socket)=>{
    console.log(`A Doctor connected:${socket.id}`);

    socket.on("join_room", (room: string) => {
        console.log(`${socket.id} joined room ${room}`);
        socket.join(room);  
      });

      socket.on("leave_room", (room: string) => {
        console.log(`${socket.id} left room ${room}`);
        socket.leave(room);
      });
      socket.on("send_message", async (data) => {
        const { message, chatRoomId, senderId } = data;
      
        console.log(`Received message data:`, data);
      
        if (!chatRoomId || !senderId) {
          console.error("Chat room ID or sender ID is missing.");
          return;
        }

        try {
            const user = await User.findOne({ where: { uuid: senderId } });
        
            if (!user) {
              console.error("User not found.");
              return;
            }
                const messageWithSenderDetails = {
              ...data,
              senderFirstName: user.firstname,
              senderLastName: user.lastname
            };
        
            io.to(chatRoomId).emit("receive_message", messageWithSenderDetails);
        
          } catch (error) {
            console.error("Error fetching sender doctor details:", error);
          }
        });

        socket.on("send_notification", async (data) => {
          const { receiverId, senderId, notificationMessage } = data;
      
          if (!receiverId || !senderId || !notificationMessage) {
            console.error(
              "Receiver ID, Sender ID or Notification message is missing."
            );
            return;
          }
      
          try {
            await Notifications.create({
              receiverId,
              senderId,
              notifications: notificationMessage,
            });
      
            io.emit("receive_notification", {
              senderId,
              message: notificationMessage,
              receiverId,
            });
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        });
        
        socket.on("disconnect", () => {
          console.log(`Doctor Disconnected: ${socket.id}`);
        });
});
sequelize.sync({alter:false}).then(()=>{
    console.log('Database connected');
    
    server.listen(Local.SERVER_PORT,  () => {
        console.log(`Server is running on port ${Local.SERVER_PORT}`);
        });
}).catch((err)=>{
    console.log("Error: ", err);
})