import { Request, Response } from 'express';
import ChatMessages from '../models/ChatMessage';
import ChatRooms from '../models/ChatRoom';

export const getOrCreateChatRoom = async (req: Request, res: Response): Promise<void> => {
  const { jobseekerId, agencyId,roomId } = req.body; // Get IDs from the request body
  try {
      let chatRoom = await ChatRooms.findOne({
          where: {
              jobseekerId: jobseekerId,
              agencyId: agencyId
          }
      });
      if (!chatRoom) {
          chatRoom = await ChatRooms.create({ jobseekerId, agencyId ,roomId});
      }
      res.status(200).json(chatRoom); // Ensure chatRoom includes an id property
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

    // Create the chat message
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
      order: [['createdAt', 'ASC']], // Order by creation time
    });
     res.status(200).json(messages);
     return
  } catch (error) {
    console.error('Error fetching chat history:', error);
     res.status(500).json({ error: 'Internal server error' });
     return
  }
};
