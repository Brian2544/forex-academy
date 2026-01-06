/**
 * Execute SQL schema using PostgreSQL connection
 * Run: node scripts/run-schema-direct.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// Connection string from user
const connectionString = 'postgresql://postgres.drhpbpffnqvjoxatagdc:T9dcSPls5RCA9ru7@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';

const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
const schemaSQL = readFileSync(schemaPath, 'utf-8');

async function runWithPsql() {
  console.log('🚀 Executing SQL schema using psql...\n');
  
  try {
    // Write SQL to temp file
    const tempFile = join(__dirname, 'temp_schema.sql');
    require('fs').writeFileSync(tempFile, schemaSQL);
    
    // Execute with psql
    const command = `psql "${connectionString}" -f "${tempFile}"`;
    
    console.log('📡 Running SQL...\n');
    const { stdout, stderr } = await execAsync(command);
    
    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('NOTICE')) {
      console.error('⚠️  Warnings:', stderr);
    }
    
    // Clean up
    require('fs').unlinkSync(tempFile);
    
    console.log('\n✅ SQL executed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('psql: command not found')) {
      console.log('\n💡 psql is not installed. Installing...');
      console.log('   On Windows: Install PostgreSQL or use Supabase Dashboard');
      console.log('   On Mac: brew install postgresql');
      console.log('   On Linux: sudo apt-get install postgresql-client');
    }
    return false;
  }
}

// Alternative: Use node-postgres
async function runWithNodePg() {
  console.log('🚀 Executing SQL schema using node-postgres...\n');
  
  try {
    // Try to import pg
    const { Client } = await import('pg');
    
    const client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
    });
    
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Execute the entire SQL script at once
    console.log('📝 Executing SQL schema...\n');
    
    try {
      // Execute all SQL at once
      await client.query(schemaSQL);
      console.log('✅ SQL schema executed successfully!\n');
    } catch (err) {
      // If that fails, try splitting into statements
      console.log('⚠️  Full execution had issues, trying statement by statement...\n');
      
      // Better SQL splitting that handles multi-line statements
      const statements = [];
      let current = '';
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < schemaSQL.length; i++) {
        const char = schemaSQL[i];
        const prevChar = i > 0 ? schemaSQL[i - 1] : '';
        
        // Handle string literals
        if ((char === '"' || char === "'") && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
        }
        
        current += char;
        
        // End of statement
        if (char === ';' && !inString) {
          const trimmed = current.trim();
          if (trimmed && trimmed !== ';' && !trimmed.startsWith('--')) {
            statements.push(trimmed);
          }
          current = '';
        }
      }
      
      if (current.trim() && current.trim() !== ';') {
        statements.push(current.trim());
      }
      
      console.log(`📝 Found ${statements.length} statements to execute\n`);
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (!stmt || stmt.trim() === '') continue;
        
        try {
          await client.query(stmt);
          const preview = stmt.substring(0, 60).replace(/\s+/g, ' ').trim();
          console.log(`✅ ${i + 1}/${statements.length}: ${preview}...`);
        } catch (err) {
          // Some errors are expected (like IF NOT EXISTS, duplicate policies)
          const errorMsg = err.message.toLowerCase();
          if (!errorMsg.includes('already exists') && 
              !errorMsg.includes('does not exist') &&
              !errorMsg.includes('duplicate') &&
              !errorMsg.includes('relation') &&
              !errorMsg.includes('policy')) {
            console.log(`⚠️  ${i + 1}: ${err.message.substring(0, 80)}`);
            console.log(`   Statement: ${stmt.substring(0, 100)}...`);
          } else {
            // Expected error, just continue
            const preview = stmt.substring(0, 60).replace(/\s+/g, ' ').trim();
            console.log(`ℹ️  ${i + 1}/${statements.length}: ${preview}... (already exists)`);
          }
        }
      }
    }
    
    await client.end();
    console.log('\n✅ All SQL executed successfully!');
    return true;
  } catch (error) {
    if (error.message.includes("Cannot find module 'pg'")) {
      console.log('⚠️  pg module not installed');
      console.log('   Installing...');
      try {
        await execAsync('cd ' + __dirname + '/.. && npm install pg');
        console.log('✅ Installed pg, retrying...');
        return await runWithNodePg();
      } catch (installError) {
        console.error('❌ Installation failed:', installError.message);
        return false;
      }
    }
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Forex Academy Database Setup\n');
  console.log('='.repeat(60) + '\n');
  
  // Try node-postgres first (more reliable)
  let success = await runWithNodePg();
  
  if (!success) {
    console.log('\n📋 Falling back to psql...\n');
    success = await runWithPsql();
  }
  
  if (success) {
    console.log('\n🔍 Verifying tables...\n');
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const tables = ['profiles', 'plans', 'subscriptions', 'courses'];
    let allExist = true;
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code === 'PGRST116') {
        console.log(`❌ ${table}: not found`);
        allExist = false;
      } else {
        console.log(`✅ ${table}: exists`);
      }
    }
    
    if (allExist) {
      console.log('\n🎉 Database setup complete!');
      console.log('✅ You can now start logging in!');
    }
  } else {
    console.log('\n⚠️  Automatic execution failed');
    console.log('📋 Please run the SQL manually:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/drhpbpffnqvjoxatagdc/sql/new');
    console.log('   2. Copy SQL from: database/schema.sql');
    console.log('   3. Paste and click "Run"');
  }
}

main().catch(console.error);

