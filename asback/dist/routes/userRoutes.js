"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/register', userController_1.uploadProfileImage, userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/profile', authMiddleware_1.authenticateJWT, userController_1.getUserProfile);
router.get('/job-seekers', authMiddleware_1.authenticateJWT, userController_1.getJobSeekersByAgency);
router.post('/upload-resume', authMiddleware_1.authenticateJWT, userController_1.uploadResume);
router.post('/password-reset', userController_1.requestPasswordReset);
router.post('/password-reset/confirm', userController_1.resetPassword);
exports.default = router;
