import { Request, Response } from 'express';
import User from '../models/userModel'; 


export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, dob, gender, phoneNumber } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      phoneNumber
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error });
  }
};


export const getProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile', error });
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  const { firstName, lastName, email, dob, gender, phoneNumber } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const existingUserWithEmail = await User.findOne({ where: {  email, id: { $ne: userId } }  });
    if (existingUserWithEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    await user.update({
      firstName,
      lastName,
      email,
      dob,
      gender,
      phoneNumber,
    });

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};