import mongoose from 'mongoose';
import dns from 'dns';

// Ensure SRV DNS resolution works reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if unable to set custom DNS
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: MONGODB_URI is not set in environment variables');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}
