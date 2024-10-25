"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Retailer_1 = __importDefault(require("../models/Retailer"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post('/register', upload_1.default.fields([{ name: 'companyLogo' }, { name: 'profileImage' }]), async (req, res) => {
    const { firstName, lastName, companyName, email, phone, address } = req.body;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const files = req.files;
    if (!files || !files.companyLogo || !files.profileImage) {
        return res.status(400).json({ message: 'Both companyLogo and profileImage are required' });
    }
    try {
        const retailer = await Retailer_1.default.create({
            firstName,
            lastName,
            companyName,
            email,
            phone,
            address,
            companyLogo: files.companyLogo[0].path,
            profileImage: files.profileImage[0].path,
            password: hashedPassword,
        });
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'vyasaryan786@gmail.com',
                pass: 'srshixgdtbttkbza',
            },
        });
        const mailOptions = {
            from: 'vyasaryan786@gmail.com',
            to: email,
            subject: 'Your account details',
            text: `Your login email is ${email} and your password is ${password}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Retailer registered, email sent' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering retailer' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const retailer = await Retailer_1.default.findOne({ where: { email } });
        if (!retailer)
            return res.status(404).json({ message: 'User not found' });
        const isPasswordValid = await bcrypt_1.default.compare(password, retailer.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: retailer.id }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.default = router;
