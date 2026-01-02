#!/usr/bin/env node

/**
 * Test script to diagnose database connection issues
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testing database connections...\n');
  
  // Test 1: Direct URL
  if (process.env.DIRECT_URL) {
    console.log('📋 Testing DIRECT_URL:');
    console.log(`   Host: ${new URL(process.env.DIRECT_URL).hostname}`);
    console.log(`   Port: ${new URL(process.env.DIRECT_URL).port || '5432'}`);
    console.log(`   User: ${new URL(process.env.DIRECT_URL).username}`);
    console.log('');
    
    try {
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DIRECT_URL,
      });
      
      console.log('   ⏳ Attempting connection...');
      await prisma.$connect();
      console.log('   ✅ Connection successful!\n');
      await prisma.$disconnect();
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}\n`);
    }
  } else {
    console.log('❌ DIRECT_URL not set in .env\n');
  }
  
  // Test 2: Regular DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('📋 Testing DATABASE_URL (for app queries):');
    const url = new URL(process.env.DATABASE_URL);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port || '5432'}`);
    console.log(`   User: ${url.username}`);
    console.log(`   Using pooler: ${process.env.DATABASE_URL.includes('pgbouncer') ? 'Yes' : 'No'}`);
    console.log('');
  }
  
  console.log('💡 TIPS:');
  console.log('   - If DIRECT_URL fails, check Supabase → Settings → Database → Network Restrictions');
  console.log('   - Make sure "Allow connections from anywhere" is enabled, or add your IP');
  console.log('   - The direct connection host should be: db.xxxxx.supabase.co (not pooler.supabase.com)');
  console.log('');
}

testConnection().catch(console.error);

