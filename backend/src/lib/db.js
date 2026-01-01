import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
     const connect =  await mongoose.connect(process.env.MONGO_URL);
     console.log('mongo db connected successfully', connect.connection.host);
    }catch(err){
        console.error('Error connect mongodb', err);
        process.exit(1);
    }
}