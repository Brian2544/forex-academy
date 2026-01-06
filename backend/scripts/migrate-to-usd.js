/**
 * Migration script to convert price_ngn to price_usd
 * Run: node scripts/migrate-to-usd.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const connectionString = 'postgresql://postgres.drhpbpffnqvjoxatagdc:T9dcSPls5RCA9ru7@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';

async function migrateToUSD() {
  console.log('🔄 Migrating payment system from NGN to USD...\n');
  
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Check if price_ngn column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plans' AND column_name = 'price_ngn'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('ℹ️  price_ngn column not found. Checking for price_usd...\n');
      
      const checkUSD = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'plans' AND column_name = 'price_usd'
      `);
      
      if (checkUSD.rows.length > 0) {
        console.log('✅ Already using price_usd. Migration not needed.\n');
        await client.end();
        return;
      }
    }
    
    // Step 1: Add price_usd column if it doesn't exist
    console.log('📝 Step 1: Adding price_usd column...');
    try {
      await client.query(`
        ALTER TABLE plans 
        ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10, 2)
      `);
      console.log('✅ price_usd column added\n');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
      console.log('✅ price_usd column already exists\n');
    }
    
    // Step 2: Convert existing NGN prices to USD (approximate: 1 USD = 1500 NGN)
    // Or set default USD prices if no NGN data exists
    console.log('📝 Step 2: Converting prices...');
    const plans = await client.query('SELECT id, price_ngn, price_usd FROM plans');
    
    for (const plan of plans.rows) {
      let usdPrice;
      
      if (plan.price_ngn && !plan.price_usd) {
        // Convert NGN to USD (approximate rate: 1500 NGN = 1 USD)
        usdPrice = (parseFloat(plan.price_ngn) / 1500).toFixed(2);
        console.log(`   Converting plan ${plan.id}: ₦${plan.price_ngn} → $${usdPrice}`);
      } else if (plan.price_usd) {
        console.log(`   Plan ${plan.id} already has USD price: $${plan.price_usd}`);
        continue;
      } else {
        // Set default USD prices based on plan name
        if (plan.name?.toLowerCase().includes('one-time')) {
          usdPrice = '50.00';
        } else if (plan.name?.toLowerCase().includes('monthly')) {
          usdPrice = '15.00';
        } else {
          usdPrice = '50.00'; // Default
        }
        console.log(`   Setting default USD price for plan ${plan.id}: $${usdPrice}`);
      }
      
      await client.query(
        'UPDATE plans SET price_usd = $1 WHERE id = $2',
        [usdPrice, plan.id]
      );
    }
    console.log('✅ Prices converted\n');
    
    // Step 3: Make price_usd NOT NULL (after setting all values)
    console.log('📝 Step 3: Making price_usd required...');
    try {
      await client.query(`
        ALTER TABLE plans 
        ALTER COLUMN price_usd SET NOT NULL
      `);
      console.log('✅ price_usd is now required\n');
    } catch (error) {
      console.log('⚠️  Could not set NOT NULL constraint:', error.message);
    }
    
    // Step 4: Remove price_ngn column (optional - comment out if you want to keep it)
    console.log('📝 Step 4: Removing price_ngn column...');
    try {
      await client.query('ALTER TABLE plans DROP COLUMN IF EXISTS price_ngn');
      console.log('✅ price_ngn column removed\n');
    } catch (error) {
      console.log('⚠️  Could not remove price_ngn column:', error.message);
      console.log('   You can remove it manually later if needed\n');
    }
    
    // Step 5: Update default plan prices to USD
    console.log('📝 Step 5: Updating default plans...');
    await client.query(`
      UPDATE plans 
      SET price_usd = 50.00 
      WHERE name LIKE '%One-Time%' AND price_usd IS NULL
    `);
    await client.query(`
      UPDATE plans 
      SET price_usd = 15.00 
      WHERE name LIKE '%Monthly%' AND price_usd IS NULL
    `);
    console.log('✅ Default plans updated\n');
    
    console.log('='.repeat(50));
    console.log('🎉 Migration completed successfully!');
    console.log('✅ Payment system now uses USD');
    console.log('\n📋 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Verify plans show USD prices in the frontend');
    console.log('   3. Update Paystack to use USD currency');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

migrateToUSD().catch(error => {
  console.error('❌ Migration error:', error);
  process.exit(1);
});

