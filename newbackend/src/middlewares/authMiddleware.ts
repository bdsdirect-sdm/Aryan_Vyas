import jwt from "jsonwebtoken"
import { checkToken } from "../utils/checktoken";
import dotenv from "dotenv"

dotenv.config();

import { NextFunction, Response } from "express"
import UserDetail from "../models/userDetail";

interface Request{
    headers?:any;
    user? :any;
    body?:any;
    params? : any

}
export const auth = async(req : Request , res : Response, next : NextFunction) =>{
   
    let token = req.headers.authorization?.split(" ")[1];

    if(!token){
        res.status(401).json({ message: "No token provided." });   
        return;
         
    }
   try{
        const decoded = await jwt.verify(token, process.env.SECREAT_KEY as string);
      

        const user = await UserDetail.findByPk((decoded as any).userId);
        (req as any).user = user;
        next();
   }
   catch(error){
        res.status(500).json({
            message:"Failded in Authenticate Token",
            success:false,
            error:error
        })
        return;
   }
}