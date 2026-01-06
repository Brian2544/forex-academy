/**
 * Update plan prices to USD defaults
 */

import { Client } from 'pg';

const connectionString = 'postgresql://postgres.drhpbpffnqvjoxatagdc:T9dcSPls5RCA9ru7@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

async function updatePrices() {
  await client.connect();
  console.log('✅ Connected\n');
  
  await client.query("UPDATE plans SET price_usd = 50.00 WHERE name LIKE '%One-Time%'");
  await client.query("UPDATE plans SET price_usd = 15.00 WHERE name LIKE '%Monthly%'");
  
  const result = await client.query('SELECT name, price_usd FROM plans');
  console.log('📋 Updated plans:');
  result.rows.forEach(plan => {
    console.log(`   ${plan.name}: $${plan.price_usd}`);
  });
  
  await client.end();
  console.log('\n✅ Prices updated!');
}

updatePrices().catch(console.error);

