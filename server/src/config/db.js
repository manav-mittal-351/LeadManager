import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows environments where local router DNS refuses SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const error = new Error('MONGODB_URI is not set in environment variables');
    console.error(error.message);
    throw error;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error.message);
    throw error;
  }
}
