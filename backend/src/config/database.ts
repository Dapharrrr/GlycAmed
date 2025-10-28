import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('❌ MONGODB_URI is not defined');
    }

    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Masque le password

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully');
    console.log('📦 Database:', mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};
