import { Request, Response } from 'express';
import User from '../models/User';
import { upload } from '../middeware/multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import generatePassword from '../services/PasswordGenertor';
import { sendRegistrationEmail } from '../services/emailService';
import sequelize from '../config/db';
import { Console, log, profile } from 'console';
import { IntegerDataType } from 'sequelize';
import ChatRoom from '../models/ChatRoom';
import Message from '../models/Message';
const JWT_SECRET = '12345';
import { v4 as uuidv4 } from 'uuid'; 

export const registerUser = async (req: any, res: any) => {
  try {
    const { firstName, lastName, email, phone, gender, hobbies, userType, agencyId } = req.body;
    

    if (!firstName || !lastName || !email || !phone || !gender || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("typeof agencyId", typeof agencyId);


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    const password = generatePassword();  
    const hashedPassword = await bcrypt.hash(password, 10);

    const filesData = req.files as {
      profileImage?: Express.Multer.File[];
      resumeFile?: Express.Multer.File[];
    };

    console.log(filesData.profileImage)
    console.log(filesData.resumeFile);

    const profileImage = userType === '1' && filesData.profileImage ? filesData.profileImage[0].filename : null;
    const resumeFile = userType === '1' && filesData.resumeFile ? filesData.resumeFile[0].filename : null;

    console.log("profileImage{{{{", profileImage);


    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      gender,
      userType,
      hobbies: Array.isArray(hobbies) ? hobbies : [hobbies], 
      profileImage,
      password: hashedPassword,
      resumeFile,
      agencyId: userType === '1' ? agencyId : null 
    });

    console.log("AgencyId", user.agencyId);
  
    await sendRegistrationEmail(email, firstName, password);
  
   
    return res.status(201).json({ message: "User Registered Successfully", user });
  } catch (error) {
    console.error("Error message", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const loginUser = async (req: Request, res: any) => {
  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email ,
        status: user.status        
      },
      
      process.env.JWT_SECRET as string || JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(user);

    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const dashboard = async (req: any, res: any) => {
  try {   
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string || JWT_SECRET); 
    const userId = decoded.userId; 


    const user: any = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userType = user.userType;
    const firstName = user.firstName; 
    const lastName = user.lastName; 
    const email = user.email;
    const status = user.status;
    const phone=user.phone;
    const hobbies=user.hobbies;

    let userList: any[] = [];

 
    if (userType === '1') {
      userList = await User.findAll({
        where: { userType: 2 },
        attributes: ['id', 'firstName', 'lastName', 'gender', 'phone', 'email', 'userType', 'profileImage', 'resumeFile', 'status'],
      });
    }

    else if (userType === '2') {
      userList = await User.findAll({
        where: {
          userType: 1,
          agencyId: userId,
        },
        attributes: ['id', 'firstName', 'lastName', 'gender', 'phone', 'email', 'userType', 'profileImage', 'status', 'resumeFile'],
      });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const updatedUserList = userList.map(user => ({
      ...user.toJSON(),
      profileImage: user.profileImage ? `${baseUrl}${user.profileImage}` : null,
      resumeFile: user.resumeFile ? `${baseUrl}${user.resumeFile}` : null,
    }));

    const loggedInUserDetail = {
      firstName,
      lastName,
      email,
      userType,
      userId,
      status,
      phone,
      hobbies,
    };

    return res.status(200).json({ updatedUserList, loggedInUserDetail });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAgency = async (req: any, res: any) => {
  try {

    const agencies = await User.findAll({
      where: {
        userType: 2, 
  
      },
      attributes: ['id', 'firstName', 'lastName'], 
    });

    return res.status(200).json({ agencies });
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateStatus = async (req: any, res: any) => {
  try {
    const { userId, status } = req.body;
    console.log(userId)
    const [updated] = await User.update(
      { status: status },
      { where: { id: userId } }
    );

    if (updated) {
      const updatedUser = await User.findOne({ where: { id: userId } });
      return res.status(200).json({ message: "Status updated successfully", user: updatedUser });
    }

    return res.status(404).json({ message: "User not found" });

  } catch (error) {

    return res.status(500).json({ message: "Error updating status", error: error });
  }
};

export const createChatRoom = async (req: Request, res: any) => {
  const { agencyId, userId } = req.body;


  if (!agencyId) {
    return res.status(400).json({ message: 'Agency ID is required' });
  }


  const finalUserId = userId || uuidv4();
  console.log("Final User ID: ", finalUserId);

  try {

    const chatRoom = await ChatRoom.create({ agencyId, userId: finalUserId });
    return res.status(201).json({ success: true, chatRoom });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return res.status(500).json({
      message: 'Error creating chat room',
      error: error || 'An unexpected error occurred'
    });
  }
};


export const getChatHistory = async (req: Request, res: any) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  try {
    
    const messages = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'ASC']],
    });

    if (!messages.length) {
      return res.status(404).json({ message: 'No messages found for this room' });
    }

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return res.status(500).json({
      message: 'Error retrieving chat history',
      error: error || 'An unexpected error occurred'
    });
  }
};

export const sendMessage = async (req: Request, res: any) => {
  const { roomId, senderId, content } = req.body;


  if (!roomId || !senderId || !content) {
    return res.status(400).json({ message: 'Room ID, sender ID, and message content are required' });
  }

  try {

    const message = await Message.create({ roomId, senderId, content });
    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      message: 'Error sending message',
      error: error || 'An unexpected error occurred'
    });
  }
};
