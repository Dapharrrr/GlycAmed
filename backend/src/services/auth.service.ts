import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { RegisterDto, LoginDto, UpdateUserDto } from '../types/dtos/auth.dto';
import { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export class AuthService {
    static generateToken(userId: string): string {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static async register(userData: RegisterDto): Promise<{ user: IUser; token: string }> {
        // Verify if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create new user
        const user = new User(userData);
        await user.save();

        // Generate token
        const token = this.generateToken(user._id.toString());

        // Return user (without password) and token
        const userObject = user.toObject();
        delete userObject.password;
        
        return { user: userObject as IUser, token };
    }

    static async login(credentials: LoginDto): Promise<{ user: IUser; token: string }> {
        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user._id.toString());

        // Return user (without password) and token
        const userObject = user.toObject();
        delete userObject.password;
        
        return { user: userObject as IUser, token };
    }

    static async updateUser(userId: string, updates: UpdateUserDto): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // If updating password, verify current password first
        if (updates.password && updates.currentPassword) {
            const isValid = await user.comparePassword(updates.currentPassword);
            if (!isValid) {
                throw new Error('Current password is incorrect');
            }
            // Only include new password in updates
            delete updates.currentPassword;
        }

        // Update user fields
        Object.assign(user, updates);
        await user.save();

        // Return updated user without password
        const userObject = user.toObject();
        delete userObject.password;
        
        return userObject as IUser;
    }

    static async getProfile(userId: string): Promise<IUser> {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}