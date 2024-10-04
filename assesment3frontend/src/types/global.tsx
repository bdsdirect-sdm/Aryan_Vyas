import { Request } from "express";

export interface User {
  id: number
  firstName:string,
  lastName: string,
  email: string,
  companyAddress: string,
  companyCity: string,
  companyState: string,
  companyZip: number,
  homeAddress:string,
  homeState:string,
  homeZip:number,
};

export interface RequestWithUser extends Request {
  user: User
  }