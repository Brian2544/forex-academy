// Load environment variables FIRST before any other imports
import 'dotenv/config';

import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // TEMP DEBUG: Verify OWNER_EMAILS is loaded
  console.log('[SERVER STARTUP] OWNER_EMAILS:', process.env.OWNER_EMAILS || 'NOT SET');
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

