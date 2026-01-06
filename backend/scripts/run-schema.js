/**
 * Script to execute SQL schema directly via Supabase REST API
 * Run: node scripts/run-schema.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

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

// Execute SQL via Supabase REST API
async function executeSQL() {
  console.log('🚀 Executing SQL schema via Supabase API...\n');
  
  try {
    // Use Supabase's PostgREST API to execute SQL
    // Note: We need to use the management API endpoint
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    
    if (!projectRef) {
      throw new Error('Could not extract project reference from URL');
    }
    
    // Try using the Supabase Management API
    const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
    
    console.log('📡 Attempting to execute SQL...\n');
    
    const response = await fetch(managementUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        query: schemaSQL,
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SQL executed successfully!\n');
      console.log('Result:', result);
      return true;
    } else {
      const errorText = await response.text();
      console.log('⚠️  Management API approach failed');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
      return false;
    }
  } catch (error) {
    console.log('⚠️  API execution failed:', error.message);
    return false;
  }
}

// Alternative: Use direct PostgREST approach
async function executeViaPostgREST() {
  console.log('📡 Trying PostgREST approach...\n');
  
  // Supabase doesn't expose a direct SQL execution endpoint via REST
  // We need to use the SQL Editor or Management API
  // For now, let's provide a curl command that the user can run
  
  console.log('💡 Since Supabase JS client cannot execute raw SQL,');
  console.log('   here are two options:\n');
  
  console.log('📋 Option 1: Use Supabase Dashboard (Easiest)');
  console.log('   1. Open: https://supabase.com/dashboard/project/drhpbpffnqvjoxatagdc/sql/new');
  console.log('   2. Copy the SQL below (or from database/schema.sql)');
  console.log('   3. Paste and click "Run"\n');
  
  console.log('📋 Option 2: Use Supabase CLI');
  console.log('   1. Install: npm install -g supabase');
  console.log('   2. Login: supabase login');
  console.log('   3. Link: supabase link --project-ref drhpbpffnqvjoxatagdc');
  console.log('   4. Run: supabase db push\n');
  
  console.log('📋 Option 3: Use curl (if you have API access)');
  console.log('   Run this command:\n');
  console.log(`curl -X POST '${supabaseUrl}/rest/v1/rpc/exec_sql' \\`);
  console.log(`  -H "apikey: ${supabaseServiceKey.substring(0, 20)}..." \\`);
  console.log(`  -H "Authorization: Bearer ${supabaseServiceKey.substring(0, 20)}..." \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"sql": "${schemaSQL.substring(0, 100)}..."}'\n`);
  
  // Actually, let's try to open the browser or provide a direct link
  console.log('🌐 Opening Supabase SQL Editor in your browser...\n');
  
  // Try to open browser (works on most systems)
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  const sqlEditorUrl = `https://supabase.com/dashboard/project/drhpbpffnqvjoxatagdc/sql/new`;
  
  try {
    // Try to open browser
    if (process.platform === 'win32') {
      await execAsync(`start ${sqlEditorUrl}`);
    } else if (process.platform === 'darwin') {
      await execAsync(`open ${sqlEditorUrl}`);
    } else {
      await execAsync(`xdg-open ${sqlEditorUrl}`);
    }
    console.log('✅ Opened SQL Editor in your browser!\n');
  } catch (err) {
    console.log('⚠️  Could not open browser automatically');
    console.log(`   Please open: ${sqlEditorUrl}\n`);
  }
  
  console.log('📝 SQL to copy and paste:\n');
  console.log('='.repeat(60));
  console.log(schemaSQL);
  console.log('='.repeat(60));
  console.log('\n✅ After running the SQL, verify with: node scripts/test-connection.js\n');
}

// Main execution
async function main() {
  console.log('🔧 Forex Academy Database Setup\n');
  console.log('='.repeat(60) + '\n');
  
  // Try API approach first
  const apiSuccess = await executeSQL();
  
  if (!apiSuccess) {
    // Fall back to manual instructions
    await executeViaPostgREST();
  } else {
    // Verify tables
    console.log('\n🔍 Verifying tables...\n');
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const tables = ['profiles', 'plans', 'subscriptions'];
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code === 'PGRST116') {
        console.log(`❌ ${table}: not found`);
      } else {
        console.log(`✅ ${table}: exists`);
      }
    }
  }
}

main().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});

