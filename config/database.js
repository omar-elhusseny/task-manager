import mongoose from 'mongoose';
import asyncWrapper from '../middlewares/asyncWrapper.js';

const connectDB = asyncWrapper(async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
});

export default connectDB;