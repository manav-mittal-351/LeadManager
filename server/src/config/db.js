import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows environments where local router DNS refuses SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message);
}

// Safely encodes password in case it contains special characters like '@'
function sanitizeMongoUri(uri) {
  if (!uri || !uri.includes('://')) return uri;
  try {
    const protoIndex = uri.indexOf('://');
    const prefix = uri.substring(0, protoIndex + 3);
    const rest = uri.substring(protoIndex + 3);
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex === -1) return uri;

    const userPass = rest.substring(0, lastAtIndex);
    const hostAndQuery = rest.substring(lastAtIndex + 1);
    const colonIndex = userPass.indexOf(':');
    if (colonIndex === -1) return uri;

    const username = userPass.substring(0, colonIndex);
    const rawPassword = userPass.substring(colonIndex + 1);
    let decoded = rawPassword;
    try {
      decoded = decodeURIComponent(rawPassword);
    } catch {
      // Use raw password if decodeURIComponent fails on literal '%'
    }
    const encodedPassword = encodeURIComponent(decoded);

    return `${prefix}${username}:${encodedPassword}@${hostAndQuery}`;
  } catch {
    return uri;
  }
}

let cachedPromise = null;

export async function connectDB() {
  // Reuse existing active connection in serverless or local environments
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection attempt is already in-flight, await the same promise
  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const error = new Error('MONGODB_URI is not set in environment variables');
    console.error(error.message);
    throw error;
  }

  const connectionUri = sanitizeMongoUri(uri);

  try {
    cachedPromise = mongoose.connect(connectionUri);
    await cachedPromise;
    console.log('Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    cachedPromise = null; // Reset cache so subsequent requests can retry
    console.error('Failed to connect to MongoDB Atlas:', error.message);
    throw error;
  }
}
