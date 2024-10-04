import { Router } from 'express';
import { addUser, getUsers, getUserById, updateUser } from '../controllers/userController';
import upload from '../middleware/upload';

const router = Router();


router.post('/users', upload.fields([{ name: 'profilePhoto' }, { name: 'appointmentLetter' }]), addUser);


router.get('/users', getUsers);


router.get('/users/:id', getUserById);


router.put('/users/:id', upload.fields([{ name: 'profilePhoto' }, { name: 'appointmentLetter' }]), updateUser);


export default router;