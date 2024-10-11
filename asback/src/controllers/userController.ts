import { Request, Response } from 'express';
import UserHobby from '../models/user_hobbies';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/mail';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

export const registerUser = async (req: Request, res: any) => {
    const { firstName, lastName, email, phone, gender, userType, password, agencyId, hobbies } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserHobby.create({
            firstName,
            lastName,
            email,
            phone,
            gender,
            userType,
            password: hashedPassword,
            profileImage: req.file?.path || '',
            agencyId: userType === 'Job Seeker' ? agencyId : null,
            hobbies,
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Welcome to Job Portal',
            text: `Your account has been created. Here are your details:\nEmail: ${email}\nPassword: ${password}`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const loginUser = async (req: Request, res: any) => {
    const { email, password } = req.body;

    try {
        const user = await UserHobby.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return res.status(200).json({ token, user });
    } catch (error) {
        return res.status(500).json({ error});
    }
};

export const getUserProfile = async (req: any, res: any) => {
    const userId = req.user.id;

    try {
        const user = await UserHobby.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error});
    }
};

export const getJobSeekersByAgency = async (req: any, res: any) => {
    const agencyId = req.user.agencyId;
    console.log(req.user,"<<<<<<<<<<<<<<>>>>>...")

    try {
        const jobSeekers = await UserHobby.findAll({ where: { agencyId } });
        return res.status(200).json(jobSeekers);
    } catch (error) {
        return res.status(500).json({ error});
    }
};

export const uploadProfileImage = upload.single('profileImage');
export const uploadResume = upload.single('resume');

export const requestPasswordReset = async (req: any, res: any) => {
    const { email } = req.body;

    try {
        const user = await UserHobby.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });


        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Password Reset',
            text: `To reset your password, click the link below:\n\n${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        return res.status(500).json({ error});
    }
};
export const resetPassword = async (req: any, res: any) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };  
        const user = await UserHobby.findOne({ where: { email: decoded.email } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
    
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
};
