import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req: Request, res: Response) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use((req: Request, res: Response) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('❌ MONGODB_URI not found in .env');
  }

  console.log('🔗 Connecting to MongoDB...');
  console.log('📍 URI:', uri.replace(/:[^:@]+@/, ':****@'));

  await mongoose.connect(uri);
  
  console.log('✅ MongoDB connected successfully');
  console.log('📦 Database:', mongoose.connection.db?.databaseName);
}

async function startServer() {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      }
      console.error('❌ Server error:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
