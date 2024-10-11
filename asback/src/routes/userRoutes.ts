import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    getJobSeekersByAgency,
    uploadProfileImage,
    uploadResume,
    requestPasswordReset,
    resetPassword
} from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/register', uploadProfileImage, registerUser);


router.post('/login', loginUser);


router.get('/profile', authenticateJWT, getUserProfile);

router.get('/job-seekers', authenticateJWT, getJobSeekersByAgency);


router.post('/upload-resume', authenticateJWT, uploadResume);
router.post('/password-reset', requestPasswordReset);
router.post('/password-reset/confirm', resetPassword);


export default router;
