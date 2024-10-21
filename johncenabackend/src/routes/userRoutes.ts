// routes/userRoutes.ts
import { Router } from 'express';
import { getAgencies, addUser, loginUser, check, userDetails, updateApprovalStatus } from '../controller/userController';
import {validateUser} from '../middleware/validateUser'
import { upload } from '../middleware/upload';
import { authorizeUser } from '../middleware/authorizeUser';
// import { getMessages, sendMessage } from '../controller/chatController';

const router = Router();

router.get('/', check);
router.get('/agencies', getAgencies);
router.post('/signup', upload.fields([{name:"profileImg"},{name:"resume"}]), validateUser,addUser);
router.get('/userDetails/:userId',authorizeUser, userDetails)
router.post('/login',loginUser)
router.patch('/userApproval/:userId', updateApprovalStatus); // New route

// router.post('/chat/send', sendMessage);
// router.get('/chat/:userId/:agencyId', getMessages);


export default router;
