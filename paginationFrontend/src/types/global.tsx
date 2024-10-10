import { Request } from "express";

export interface User {
  firstName:string,
  lastName: string,
  email: string,
  companyAddress: string,
  companyCity: string,
  companyState: string,
  companyZip: string,
  homeAddress:string,
  homeState:string,
  homeZip:string,
  homeCity:string
  profilePhoto:any,
  appointmentLetter:any,
};

export interface RequestWithUser extends Request {
  user: User
  }