// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
var jwt = require('jsonwebtoken');
import { httpStatusCodes } from '../../constants';

export const authorizeUser = async (req: any, res: any, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(httpStatusCodes.UN_AUTHORIZED).json({ message: 'No token provided' });
        }

        const decoded: any = jwt.verify(token, "secret_keu");
        const userId = decoded.id;

        req.userId = userId;

        const requestedUserId = parseInt(req.params.userId, 10);
        if (requestedUserId && requestedUserId !== userId) {
            return res.status(httpStatusCodes.FORBIDDEN).json({ message: 'You do not have access to this resource' });
        }
        next();
    } catch (error) {
        return res.status(httpStatusCodes.UN_AUTHORIZED).json({ message: 'Failed to authenticate token' });
    }
};
