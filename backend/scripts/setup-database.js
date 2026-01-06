/**
 * Script to automatically set up database tables in Supabase
 * Run: node scripts/setup-database.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Read the schema file
const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
let schemaSQL;

try {
  schemaSQL = readFileSync(schemaPath, 'utf-8');
  console.log('✅ Schema file loaded\n');
} catch (error) {
  console.error('❌ Error reading schema file:', error.message);
  process.exit(1);
}

// Split SQL into individual statements
function splitSQL(sql) {
  // Remove comments
  sql = sql.replace(/--.*$/gm, '');
  
  // Split by semicolons, but keep CREATE EXTENSION and other statements together
  const statements = [];
  let currentStatement = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    
    // Handle string literals
    if ((char === '"' || char === "'") && sql[i - 1] !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
    }
    
    // Handle semicolons (end of statement)
    if (char === ';' && !inString) {
      currentStatement += char;
      const trimmed = currentStatement.trim();
      if (trimmed && trimmed !== ';') {
        statements.push(trimmed);
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Add last statement if exists
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements.filter(s => s.length > 0);
}

async function setupDatabase() {
  console.log('🔧 Setting up database tables...\n');
  
  const statements = splitSQL(schemaSQL);
  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  // Execute statements one by one
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const statementType = statement.substring(0, 20).toUpperCase();
    
    try {
      // Use Supabase REST API to execute SQL
      // Note: Supabase doesn't have a direct SQL execution endpoint via JS client
      // We'll use RPC or direct table operations where possible
      // For now, we'll try to execute via the REST API
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ sql: statement }),
      });
      
      // If RPC doesn't work, try alternative approach
      if (!response.ok && response.status !== 404) {
        // Try using Supabase's query builder for table creation
        // For CREATE TABLE statements, we need to use the SQL editor or REST API
        console.log(`⚠️  Statement ${i + 1}: Cannot execute via API (${statementType}...)`);
        console.log('   This needs to be run in Supabase SQL Editor');
        errorCount++;
        errors.push({ statement: i + 1, type: statementType, error: 'Needs manual execution' });
        continue;
      }
      
      successCount++;
      console.log(`✅ Statement ${i + 1}/${statements.length}: ${statementType}...`);
    } catch (error) {
      errorCount++;
      errors.push({ statement: i + 1, type: statementType, error: error.message });
      console.log(`❌ Statement ${i + 1}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully executed: ${successCount}`);
  console.log(`❌ Failed/Skipped: ${errorCount}`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some statements need to be run manually in Supabase SQL Editor');
    console.log('📋 Steps:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Click "SQL Editor" → "New query"');
    console.log('   4. Copy the entire contents of: database/schema.sql');
    console.log('   5. Paste and click "Run"');
    console.log('\n💡 Alternative: Use the Supabase CLI or run SQL directly in the dashboard');
  } else {
    console.log('\n🎉 Database setup complete!');
    console.log('✅ All tables created successfully');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the frontend: cd web && npm run dev');
    console.log('   2. Go to http://localhost:5173');
    console.log('   3. Register your first user!');
  }
}

// Alternative: Use Supabase Management API if available
// For now, let's provide a better solution using the Supabase JS client
// Actually, the best approach is to use Supabase's REST API with the PostgREST endpoint
// But CREATE TABLE statements need to be run via SQL Editor

// Let's create a simpler approach - use the Supabase client to check and create tables programmatically
async function setupDatabaseV2() {
  console.log('🔧 Setting up database tables...\n');
  console.log('📋 Using Supabase REST API approach...\n');
  
  // Since Supabase JS client doesn't support raw SQL execution,
  // we'll provide instructions and verify tables exist
  console.log('⚠️  Supabase JS client cannot execute raw SQL CREATE statements');
  console.log('📝 You need to run the SQL schema in Supabase SQL Editor\n');
  
  console.log('📋 Quick Setup Steps:');
  console.log('   1. Open: https://supabase.com/dashboard/project/drhpbpffnqvjoxatagdc/sql/new');
  console.log('   2. Copy the SQL from: forex-academy/backend/database/schema.sql');
  console.log('   3. Paste into the SQL Editor');
  console.log('   4. Click "Run" (or press Ctrl+Enter)\n');
  
  console.log('⏳ Waiting for you to run the SQL...');
  console.log('   (This script will verify tables in 10 seconds)\n');
  
  // Wait a bit, then verify
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Verify tables were created
  console.log('🔍 Verifying tables...\n');
  
  const requiredTables = [
    'profiles',
    'plans',
    'subscriptions',
    'payment_events',
    'app_settings',
    'courses',
    'lessons',
    'live_sessions',
    'announcements',
    'blog_posts',
    'market_analysis',
    'testimonials',
    'chat_groups',
    'chat_group_members',
    'chat_messages',
  ];
  
  let allTablesExist = true;
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        console.log(`❌ ${table}: ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ ${table}: exists`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
      allTablesExist = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allTablesExist) {
    console.log('🎉 All tables verified!');
    console.log('✅ Database setup complete!\n');
    console.log('📋 Next steps:');
    console.log('   1. Start the frontend: cd web && npm run dev');
    console.log('   2. Go to http://localhost:5173');
    console.log('   3. Register your first user!');
  } else {
    console.log('⚠️  Some tables are missing');
    console.log('   Please run the SQL schema in Supabase SQL Editor');
    console.log('   Then run this script again to verify');
  }
}

// Run the setup
setupDatabaseV2().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});

