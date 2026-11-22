import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { default: app } = await import('./app.js');
const { connectDB } = await import('./config/db.js');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Wait for MongoDB to connect before accepting requests
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`🚀 Meru Lead Manager Server is running`);
      console.log(`📍 Port: http://localhost:${PORT}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Server cannot start: Database connection failed.');
    process.exit(1);
  }
}

startServer();
