"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.uploadResume = exports.uploadProfileImage = exports.getJobSeekersByAgency = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const user_hobbies_1 = __importDefault(require("../models/user_hobbies"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = __importDefault(require("../config/mail"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, email, phone, gender, userType, password, agencyId, hobbies } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield user_hobbies_1.default.create({
            firstName,
            lastName,
            email,
            phone,
            gender,
            userType,
            password: hashedPassword,
            profileImage: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '',
            agencyId: userType === 'Job Seeker' ? agencyId : null,
            hobbies,
        });
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Welcome to Job Portal',
            text: `Your account has been created. Here are your details:\nEmail: ${email}\nPassword: ${password}`,
        };
        yield mail_1.default.sendMail(mailOptions);
        return res.status(201).json(newUser);
    }
    catch (error) {
        return res.status(400).json({ error });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_hobbies_1.default.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword)
            return res.status(401).json({ message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.loginUser = loginUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield user_hobbies_1.default.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getUserProfile = getUserProfile;
const getJobSeekersByAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agencyId = req.user.agencyId;
    console.log(req.user, "<<<<<<<<<<<<<<>>>>>...");
    try {
        const jobSeekers = yield user_hobbies_1.default.findAll({ where: { agencyId } });
        return res.status(200).json(jobSeekers);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getJobSeekersByAgency = getJobSeekersByAgency;
exports.uploadProfileImage = upload.single('profileImage');
exports.uploadResume = upload.single('resume');
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_hobbies_1.default.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const resetToken = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Password Reset',
            text: `To reset your password, click the link below:\n\n${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        };
        yield mail_1.default.sendMail(mailOptions);
        return res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield user_hobbies_1.default.findOne({ where: { email: decoded.email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: 'Password successfully reset' });
    }
    catch (error) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
});
exports.resetPassword = resetPassword;
