#!/usr/bin/env node

/**
 * Migration script that uses DIRECT_URL for Prisma migrations
 * Supabase migrations require a direct connection (not pooler)
 * 
 * WHY? Think of it like this:
 * - Pooler = Fast water slide (great for playing, but can't build on it)
 * - Direct = The pool itself (slower, but you CAN build new things here)
 * 
 * Migrations need to "build" new tables, so they need the direct connection!
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Check if DIRECT_URL is set
if (!process.env.DIRECT_URL) {
  console.error('');
  console.error('❌ DIRECT_URL is not set in your .env file!');
  console.error('');
  console.error('📖 WHAT TO DO:');
  console.error('   1. Go to your Supabase dashboard: https://supabase.com/dashboard');
  console.error('   2. Click on your project');
  console.error('   3. Go to Settings → Database');
  console.error('   4. Find "Connection string" section');
  console.error('   5. Click on "Direct connection" tab');
  console.error('   6. Copy the connection string');
  console.error('   7. Add it to your .env file as: DIRECT_URL="your-connection-string"');
  console.error('');
  console.error('💡 TIP: The direct connection should NOT have "pgbouncer=true" in it!');
  console.error('   See DATABASE_SETUP.md for detailed instructions.');
  console.error('');
  process.exit(1);
}

// Check if DIRECT_URL looks like it's using the pooler (common mistake)
if (process.env.DIRECT_URL.includes('pgbouncer=true')) {
  console.error('');
  console.error('⚠️  WARNING: Your DIRECT_URL contains "pgbouncer=true"');
  console.error('   This means you might be using the pooler connection instead of direct!');
  console.error('');
  console.error('📖 WHAT TO DO:');
  console.error('   Go to Supabase → Settings → Database → "Direct connection"');
  console.error('   Make sure you copy the "Direct connection" string, NOT the "Session mode" one!');
  console.error('');
  console.error('   Your DIRECT_URL should NOT have "pgbouncer=true" in it.');
  console.error('');
  process.exit(1);
}

// Use DIRECT_URL for migrations
process.env.DATABASE_URL = process.env.DIRECT_URL;
console.log('✅ Using direct connection for migrations...');
console.log('');

// Execute Prisma migrate
const { execSync } = require('child_process');
const args = process.argv.slice(2).join(' ');

try {
  execSync(`npx prisma migrate dev ${args}`, {
    stdio: 'inherit',
    cwd: require('path').resolve(__dirname, '..'),
    env: process.env
  });
} catch (error) {
  process.exit(error.status || 1);
}

