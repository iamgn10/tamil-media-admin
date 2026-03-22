import mongoose from 'mongoose';
import { config } from './app.config';

let isConnected = false;

const connectDB = async (retries = 5): Promise<void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected');
    return;
  }

  const mongoUri = config.database.uri;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        maxPoolSize: config.database.maxPoolSize,
        serverSelectionTimeoutMS: config.database.serverSelectionTimeoutMS,
        socketTimeoutMS: config.database.socketTimeoutMS,
        bufferCommands: config.database.bufferCommands
      });
      
      isConnected = true;
      console.log('MongoDB connected successfully');
      console.log(`Database: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt === retries) {
        console.error('All connection attempts failed. Exiting...');
        process.exit(1);
      }
      
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`Retrying connection in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default connectDB; 