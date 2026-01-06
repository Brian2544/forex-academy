/**
 * Test script to verify Supabase connection
 * Run: node scripts/test-connection.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test connection by checking if we can query a table
async function testConnection() {
  try {
    // Try to query the profiles table (it might not exist yet, that's okay)
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist') || error.message.includes('schema cache')) {
        console.log('⚠️  Database tables not created yet');
        console.log('   ✅ Connection to Supabase is working!');
        console.log('\n📋 Next steps:');
        console.log('   1. Go to your Supabase Dashboard');
        console.log('   2. Navigate to SQL Editor');
        console.log('   3. Copy and paste the contents of database/schema.sql');
        console.log('   4. Run the SQL script');
        console.log('   5. Then you can create your first user!');
        return;
      }
      throw error;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log('✅ Database tables exist');
    console.log(`   Found ${data?.length || 0} profiles`);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.message.includes('Invalid API key')) {
      console.error('   Check your SUPABASE_SERVICE_ROLE_KEY in .env');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('   Check your SUPABASE_URL in .env');
    }
    process.exit(1);
  }
}

testConnection();

