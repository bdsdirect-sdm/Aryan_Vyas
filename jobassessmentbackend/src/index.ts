import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import sequelize from './config/db';
import User from './models/User';
import ChatRoom from './models/ChatRoom';
import Message from './models/Message';
import UserRoutes from './routes/UserRoutes';
import cors from 'cors';
import path from 'path';
import { getChatHistory, createChatRoom, sendMessage } from './controllers/userController';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Aryan Vyas! Welcome to Your Server');
});


app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));


app.use('/api', UserRoutes);


app.post('/chat/rooms', createChatRoom);
app.get('/chat/history/:roomId', getChatHistory);
app.post('/chat/send', sendMessage);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

   
    socket.on('createChatRoom', async ({ jobSeekerId, agencyId }) => {
       
        const userId = jobSeekerId || uuidv4(); 
        try {
            const chatRoom = await ChatRoom.create({ agencyId, userId });
            console.log('Chat room created:', chatRoom);
            socket.emit('chatRoomCreated', chatRoom);
        } catch (error) {
            console.error('Error creating chat room:', error);
            socket.emit('chatRoomError', { message: 'Error creating chat room', error });
        }
    });

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

  
    socket.on('sendMessage', async ({ roomId, message, senderId }) => {
        try {
            const newMessage = await Message.create({
                roomId,
                message,
                senderId,
                sentAt: new Date(),
            });
            io.to(roomId).emit('newMessage', newMessage);  
            console.log('Message sent:', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('messageError', { message: 'Error sending message', error });
        }
    });

 
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});


const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
