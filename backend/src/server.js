import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle port conflicts gracefully
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Run: npm run kill-port`);
    process.exit(1);
  } else {
    console.error('Server error:', error.message);
    process.exit(1);
  }
});

