import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (uri) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB successfully.');
      return;
    } catch (error) {
      console.error('❌ Failed to connect to primary MongoDB:', error);
      if (isProduction) {
        throw new Error('Production MongoDB connection failed. Halting server startup.');
      }
    }
  }

  // Fallback for local development when MONGODB_URI is not set or local MongoDB is offline
  if (!isProduction) {
    console.warn('⚠️ Primary MongoDB connection unconfigured or failed. Initializing local in-memory MongoDB fallback server...');
    try {
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to In-Memory MongoDB Server successfully.');
    } catch (memErr) {
      console.error('❌ Failed to start In-Memory MongoDB:', memErr);
      throw memErr;
    }
  } else {
    throw new Error('MONGODB_URI environment variable is missing in production.');
  }
};

