require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Start server with DB connection retry logic to avoid immediate crash
const startServer = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await connectDB();
      const server = http.createServer(app);
      server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      server.on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
      });
      return;
    } catch (err) {
      attempt++;
      console.error(`DB connection attempt ${attempt} failed:`, err.message || err);
      if (attempt >= maxRetries) {
        console.error('Max DB connection attempts reached. Will continue to retry in the background every 30s.');
        // Schedule background retry without exiting so nodemon doesn't report immediate crash
        setInterval(async () => {
          try {
            await connectDB();
            console.log('DB reconnected. Please restart the server (nodemon will pick up restart or you can press r).');
            // exit so nodemon restarts the process with connected DB
            process.exit(0);
          } catch (e) {
            console.error('Background reconnection failed:', e.message || e);
          }
        }, 30000);
        return;
      }

      const delay = Math.min(5000 * attempt, 30000);
      console.log(`Retrying DB connection in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
};

startServer();
