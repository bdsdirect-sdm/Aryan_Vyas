import { Request, Response } from 'express';
import User from '../models/User';
import { upload } from '../middeware/multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import generatePassword from '../services/PasswordGenertor';
import { sendRegistrationEmail } from '../services/emailService';
import sequelize from '../config/db';
import { log } from 'console';
const JWT_SECRET = '12345'; 

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

    const profileImage = userType === '1' && filesData.profileImage ? filesData.profileImage[0].originalname : null;
    const resumeFile = userType === '1' && filesData.resumeFile ? filesData.resumeFile[0].originalname : null;

   
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
      const user:any = await User.findOne({ where: {email} });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user.id, userType: user.userType }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      
      res.json({ message: 'Login successful', token , user});
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  };
  
  export const getJobSeekerById = async (req: any, res: any) => {
    const userId = req.userType;
    const jobSeekerId = req.params.id;
  
    const user: any = await User.findByPk(userId);
  
    if (!user || user.userType !== '2') {
      return res.status(403).json({ message: 'Unauthorized UserType' });
    }
  
    const jobSeeker: any = await User.findByPk(jobSeekerId);
  
    if (!jobSeeker || jobSeeker.userType !== '2' || jobSeeker.agencyId !== user.agencyId) {
      return res.status(404).json({ message: 'Job Seeker not found or unauthorized' });
    }

    res.json(jobSeeker);
  }
  
export const dashboard = async (req: any, res: any) => {

    const token = req.headers.authorization?.split(' ')[1]; 
    
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

 
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
   
    const userType = decoded.userType;
    const userId = decoded.userId;
    console.log("uxdaSDQFQW",userType);
   
 
    const userList = await User.findAll({
      where: {
        userType: userType,id:userId 
      },
      attributes: ['id', 'firstName', 'lastName','gender','phone','email','userType',"profileImage","resumeFile"], 
    });
  
    return res.status(200).json({ userList });

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
// export const getAgencyById=async(req:any res:any)=>{
//   const agencies=await User.findOne({
//     where: {userType=2
//   })
// }
