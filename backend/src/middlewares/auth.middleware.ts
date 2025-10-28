import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
    userId: string;
}

import { Document } from 'mongoose';
import { IUser } from '../models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: Document & IUser;
            userId?: string;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};
