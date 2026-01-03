import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const { MONGO_URL } = process.env;
        if (!MONGO_URL) throw new Error(" MONFO_URL is not set")
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log('mongo db connected successfully', connect.connection.host);
    } catch (err) {
        console.error('Error connect mongodb', err);
        process.exit(1);
    }
}