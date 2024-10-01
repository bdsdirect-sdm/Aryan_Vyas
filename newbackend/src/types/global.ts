import { Request } from "express";

export interface RequestWithUser extends Request {
    user: {
      id: number
      firstName:string,
      lastName: string,
      email: string,
      password: string,
      dateOfBirth: string,
      gender: 'male' | 'female' | 'other',
      phoneNumber: string,
  };
  }