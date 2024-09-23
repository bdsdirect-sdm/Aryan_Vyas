import { Router } from 'express';

import { getProfile, signup, updateProfile } from '../controllers/userController';
 
const router = Router();
 

router.post('/signup', signup);

router.get('/profile/:id', getProfile);

router.put('/update/:id', updateProfile);
 
export default router;