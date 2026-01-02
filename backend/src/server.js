const path = require('path');

// Load environment variables FIRST
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Validate DATABASE_URL exists and is valid
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL missing. Check backend/.env');
  process.exit(1);
}

// Validate DATABASE_URL format
if (!process.env.DATABASE_URL.startsWith('postgresql://') && !process.env.DATABASE_URL.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must start with postgresql:// or postgres://');
  console.error(`   Current value starts with: ${process.env.DATABASE_URL.substring(0, 20)}...`);
  process.exit(1);
}

// Log database connection info (safe - no password)
try {
  const dbUrl = new URL(process.env.DATABASE_URL);
  console.log('📊 Database Connection:');
  console.log(`   Host: ${dbUrl.hostname}`);
  console.log(`   Username: ${dbUrl.username}`);
  console.log(`   Database: ${dbUrl.pathname.slice(1) || '(default)'}`);
} catch (err) {
  console.error('❌ Invalid DATABASE_URL format:', err.message);
  console.error('   DATABASE_URL should be in format: postgresql://user:password@host:port/database');
  process.exit(1);
}

// Import app AFTER dotenv is loaded
const app = require('./app');
const { connectDB } = require('./config/db');
const env = require('./config/env');

const PORT = env.PORT || 5000;

// Connect to database and start server
(async () => {
  try {
    await connectDB();
    
    // Only start listen if DB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();

