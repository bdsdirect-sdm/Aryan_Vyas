import { Router } from 'express';
import userAuthMiddleware from "../middlewares/userAuth";
import { deleteNotification, getAllNotifications, markAsRead } from '../controllers/notificationController';


const router = Router();

router.get('/notifications',userAuthMiddleware, getAllNotifications);
router.put('/mark-read',userAuthMiddleware, markAsRead);
router.delete('/delete-notification/:notificationId',userAuthMiddleware, deleteNotification);


export default router;
