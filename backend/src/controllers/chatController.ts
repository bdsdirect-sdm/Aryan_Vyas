import { Request, Response } from 'express';
import ChatMessages from '../models/ChatMessage';
import ChatRooms from '../models/ChatRoom';
import { Op } from 'sequelize';
import User from '../models/User';

export const getOrCreateChatRoom = async (req: Request, res: Response): Promise<void> => {
    const { referedById, referedToId,patientId, roomId } = req.body;
    try {
        let chatRoom = await ChatRooms.findOne({
            where: {
                referedById,
                referedToId,
                patientId,
            }
        });
        if (!chatRoom) {
            chatRoom = await ChatRooms.create({ referedById, referedToId ,patientId,roomId});
        }
        res.status(200).json(chatRoom); 
    } catch (error) {
        console.error('Error getting or creating chat room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { chatRoomId, senderId, message } = req.body;
  
    try {
      const chatRoomExists = await ChatRooms.findOne({
        where: { roomId: chatRoomId }, 
      });
  
      if (!chatRoomExists) {
        res.status(404).json({ error: 'Chat room not found' });
        return;
      }
  
      const chatMessage = await ChatMessages.create({ chatRoomId, senderId, message });
  
      res.status(201).json(chatMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  export const getChatHistory = async (req: Request, res: Response):Promise<void> => {
    const { chatRoomId } = req.params;
  
    try {
      const messages = await ChatMessages.findAll({
        where: { chatRoomId },
        // order: [['createdAt', 'ASC']],
      });
       res.status(200).json(messages);
       messages.map(async (mess)=>{
        const user = await User.findOne({where:{uuid:mess.senderId}})
        console.log("messssssssssss",user?.firstname)
       })
       return
    } catch (error) {
      console.error('Error fetching chat history:', error);
       res.status(500).json({ error: 'Internal server error' });
       return
    }
  };


  // Controller to get all chat rooms for the current logged-in user
export const getUserChatRooms = async (req: any, res: Response): Promise<void> => {
    try {
        const { uuid } = req.user;
//   console.log("loggggggedddinuser",uuid);
  
      const chatRooms = await ChatRooms.findAll({
        where: {
          [Op.or]: [
            { referedById: uuid },
            { referedToId: uuid }
          ]
        },
        // Optionally, include associated models (e.g., patient or doctor info) if needed
        include: [
          // Add associations here if needed, like Patient or Doctor model
          // {
          //   model: Patient,
          //   as: 'patient',
          //   attributes: ['firstname', 'lastname']  // Example
          // }
        ]
      });
  
      // If no chat rooms found
      if (!chatRooms || chatRooms.length === 0) {
         res.status(404).json({ message: 'No chat rooms found for this user' });
         return
      }
  
      // Return the chat rooms
      res.status(200).json(chatRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


