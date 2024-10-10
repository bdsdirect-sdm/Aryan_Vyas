import { Request, Response } from 'express';
import User from '../models/User';
import Address from '../models/Address';
import welcomeEmailTemplate from '../emailTemplates/welcomeEmailTemplate';
import transporter from '../utils/mailer';

export const addUser = async (req: Request, res: Response) => {
  try {
    const files:any = {...req?.files}

    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      appointmentLetter: files?.appointmentLetter?.[0]?.filename,
      profilePhoto: files?.profilePhoto?.[0]?.filename,

    };
    //
    const exsistUser = await User.findOne({where:{
      email:userData.email
  }})

  if(exsistUser){
      res.status(400).json({
          message:"User is already exist",
          success:false
      })
      return;
  }
    //

    const user = await User.create(userData);
    
    const addressData = {
      userId: user.id,
      companyAddress: req.body.companyAddress,
      companyCity: req.body.companyCity,
      companyState: req.body.companyState,
      companyZip: req.body.companyZip,
      homeAddress: req.body.homeAddress,
      homeCity: req.body.homeCity,
      homeState: req.body.homeState,
      homeZip: req.body.homeZip,
      
    };

    await Address.create(addressData);

    //
    const mailOptions = {
      from: "vyasaryan786@gmail.com",
      to: userData.email,
      subject: "Hello! Welcome To Our Family",
      html:welcomeEmailTemplate(userData.firstName,userData.lastName),
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('Error occurred:' + error.message);
      }
      console.log('Message sent: %s', info.messageId);
  });

  //

    res.status(201).json(user);
  } catch (error:any) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.findAll({ include: Address });
      res.json(users);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getUserById = async (req: Request, res: any) => {
    try {
      const user = await User.findByPk(req?.params?.id, { include: Address });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error:any) {
      res.status(500).json({ message: error?.message });
    }
  };
  
  export const updateUser = async (req: Request, res: any) => {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
   
      const updatedUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profilePhoto: req.file ? req.file.path : user.profilePhoto,
        appointmentLetter: req.body.appointmentLetter,
      };
      await User.update(updatedUserData, { where: { id: userId } });
  
     
      const addressData = {
        companyAddress: req.body.companyAddress,
        companyCity: req.body.companyCity,
        companyState: req.body.companyState,
        companyZip: req.body.companyZip,
        homeAddress: req.body.homeAddress,
        homeCity: req.body.homeCity,
        homeState: req.body.homeState,
        homeZip: req.body.homeZip,
      };
      await Address.update(addressData, { where: { userId } });
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // export const deleteUser = async (req: Request, res: any) => {
  //   const userId = req.params.id;
  //   try {
  //     const user = await User.findByPk(userId);
  //     if (!user) return res.status(404).json({ message: 'User not found' });
  //     await Address.destroy({ where: { userId } });
  
      
  //     await User.destroy({ where: { id: userId } });
  
  //     res.status(204).send(); 
  //   } catch (error:any) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };