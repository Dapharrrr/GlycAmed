import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/glycamed';

/**
 * connectDB connects to MongoDB with a small retry/backoff logic.
 */
export default async function connectDB(): Promise<void> {
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await mongoose.connect(MONGO_URI);
            console.log('✅ Connected to MongoDB');
            return;
        } catch (err) {
            attempt += 1;
            const delay = Math.min(1000 * 2 ** attempt, 30000);
            console.error(`MongoDB connection attempt ${attempt} failed:`, err);
            if (attempt >= maxRetries) {
                console.error('Exceeded max MongoDB connection attempts.');
                throw err;
            }
            console.log(`Retrying in ${delay}ms...`);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((res) => setTimeout(res, delay));
        }
    }
}
