import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

export const verifyToken = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
