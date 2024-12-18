import Notifications from "../models/Notification";
import { Request, Response } from 'express';
import User from "../models/User";
import { where } from "sequelize";


export const getAllNotifications = async (req: any, res: Response): Promise<void> => {
    const { uuid } = req.user;  
  
    try {
      const messages = await Notifications.findAll({
        where: { receiverId : uuid },
        order: [['createdAt', 'DESC']],
        include: [
          {model: User, attributes: ['firstname', 'lastname', 'email','profile_photo']},
        ]
      });
      res.status(200).json(messages);
  
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const deleteNotification = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const { notificationId } = req.params; 
        
        const notification = await Notifications.findOne({ where: { id: notificationId } });

        if (notification) {
            await notification.destroy();
            res.status(200).json({ message: "Notification deleted successfully" });
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (err:any) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
};



export const markAsRead = async (req: any, res: Response):Promise<void>  =>{
  try { 
    const { uuid } = req.user; 

     await Notifications.update(
      { isSeen: true },
      { where: { isSeen: false, receiverId: uuid } } 
    );

     res.status(200).json({ message: 'Notifications marked as read successfully' });
     return
  } catch (err) {
    console.error('Error marking notifications as read:', err);
     res.status(500).json({ error: 'Internal server error' });
     return
  }
};
