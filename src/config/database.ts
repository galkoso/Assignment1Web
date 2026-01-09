import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/assignment1web';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

