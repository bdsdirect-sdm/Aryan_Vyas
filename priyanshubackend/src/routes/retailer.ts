import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Retailer from '../models/Retailer';
import nodemailer from 'nodemailer';
import upload from '../middleware/upload';

const router = express.Router();

interface RequestFiles {
  companyLogo?: Express.Multer.File[];
  profileImage?: Express.Multer.File[];
}

router.post('/register', upload.fields([{ name: 'companyLogo' }, { name: 'profileImage' }]), async (req, res) => {
  const { firstName, lastName, companyName, email, phone, address } = req.body;
  const password = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(password, 10);


  const files = req.files as RequestFiles;

  if (!files || !files.companyLogo || !files.profileImage) {
    return res.status(400).json({ message: 'Both companyLogo and profileImage are required' });
  }

  try {
    const retailer = await Retailer.create({
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

    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering retailer' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const retailer = await Retailer.findOne({ where: { email } });
    if (!retailer) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, retailer.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: retailer.id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;
