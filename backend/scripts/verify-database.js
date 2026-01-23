/**
 * Quick script to verify database tables are created
 * Run: node scripts/verify-database.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const requiredTables = [
  'profiles',
  'plans',
  'subscriptions',
  'payment_events',
  'payments',
  'entitlements',
  'payment_intents',
  'app_settings',
  'courses',
  'lessons',
  'resources',
  'live_sessions',
  'announcements',
  'blog_posts',
  'market_analysis',
  'testimonials',
  'chat_groups',
  'chat_group_members',
  'chat_messages',
];

async function verifyTables() {
  console.log('🔍 Verifying database tables...\n');
  
  let allExist = true;
  const results = [];
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('schema cache')) {
          console.log(`❌ ${table}: NOT FOUND`);
          results.push({ table, exists: false });
          allExist = false;
        } else {
          // Other error might mean table exists but has issues
          console.log(`⚠️  ${table}: ${error.message}`);
          results.push({ table, exists: true, warning: error.message });
        }
      } else {
        console.log(`✅ ${table}: exists`);
        results.push({ table, exists: true });
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      results.push({ table, exists: false });
      allExist = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allExist) {
    console.log('🎉 SUCCESS! All tables are created!');
    console.log('\n✅ Database is ready!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start frontend: cd ../web && npm run dev');
    console.log('   2. Go to: http://localhost:5173');
    console.log('   3. Register your first user!');
    console.log('\n🚀 You can now start logging in!');
  } else {
    const missing = results.filter(r => !r.exists).map(r => r.table);
    console.log(`⚠️  Missing ${missing.length} table(s): ${missing.join(', ')}`);
    console.log('\n📋 Please run the SQL schema:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/drhpbpffnqvjoxatagdc/sql/new');
    console.log('   2. Copy SQL from: backend/database/schema.sql');
    console.log('   3. Paste and click "Run"');
    console.log('   4. Run this script again to verify');
  }
  
  return allExist;
}

verifyTables().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});

