import { Router } from "express";
import { upload } from "../middeware/multer";
import {dashboard, getAgency, loginUser, registerUser, updateStatus } from '../controllers/userController'
import { authMiddleware } from "../middeware/auth";
const router = Router();

router.post('/register', upload,  registerUser);
router.post("/login", loginUser);
router.get("/dashboard",dashboard);
router.get("/agencies", getAgency);
router.post("/update-status", updateStatus);


export default router;