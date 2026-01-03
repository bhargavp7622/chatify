import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        const { MONGO_URL } = ENV;
        if (!MONGO_URL) throw new Error(" MONFO_URL is not set")
        const connect = await mongoose.connect(MONGO_URL);
        console.log('mongo db connected successfully', connect.connection.host);
    } catch (err) {
        console.error('Error connect mongodb', err);
        process.exit(1);
    }
}