import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, UpdateUserDto } from '../types/dtos/auth.dto';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const userData: RegisterDto = req.body;
            const { user, token } = await AuthService.register(userData);
            res.status(201).json({ user, token });
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const credentials: LoginDto = req.body;
            const { user, token } = await AuthService.login(credentials);
            res.json({ user, token });
        } catch (err) {
            res.status(401).json({ error: (err as Error).message });
        }
    }

    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId!;
            const user = await AuthService.getProfile(userId);
            res.json(user);
        } catch (err) {
            res.status(404).json({ error: (err as Error).message });
        }
    }

    static async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId!;
            const updates: UpdateUserDto = req.body;
            const updatedUser = await AuthService.updateUser(userId, updates);
            res.json(updatedUser);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}