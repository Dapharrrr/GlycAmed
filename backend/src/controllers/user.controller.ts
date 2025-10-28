import { Request, Response } from 'express';
import User from '../models/user.model.js';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📥 Received data:', req.body);
    
    // Basic validation
    const { name, firstname, email, password } = req.body;
    
    if (!name || !firstname || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    // Create user
    const user = new User({
      name,
      firstname,
      email,
      password
    });
    
    await user.save();
    
    console.log('✅ User created successfully');
    
    const userResponse = {
      _id: user._id,
      name: user.name,
      firstname: user.firstname,
      email: user.email,
    //   createdAt: user.createdAt
    };
    
    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error: any) {
    console.error('❌ Error creating user:', error);
    
    // Handle MongoDB errors
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};
