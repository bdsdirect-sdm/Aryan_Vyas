import { Router } from 'express';
import { sendMessage, getChatHistory, getOrCreateChatRoom } from '../controller/chatController';

const router = Router();

router.post('/sendMessage', sendMessage);
router.post('/createRoom', getOrCreateChatRoom);

router.get('/chatHistory/:chatRoomId', getChatHistory);

export default router;
