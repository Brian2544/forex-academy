/**
 * Script to create or promote a user to owner role
 * 
 * Usage:
 * node scripts/create-owner.js <user_email>
 * 
 * Or set OWNER_EMAIL in .env and run:
 * node scripts/create-owner.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createOwner(email) {
  if (!email) {
    console.error('❌ Please provide a user email');
    console.log('Usage: node scripts/create-owner.js <user_email>');
    process.exit(1);
  }

  try {
    // Get user from auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Error fetching users:', userError);
      process.exit(1);
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      console.log('Please make sure the user has signed up first.');
      process.exit(1);
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', profileError);
      process.exit(1);
    }

    if (!profile) {
      // Create profile with owner role
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          role: 'owner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating profile:', createError);
        process.exit(1);
      }

      console.log('✅ Profile created with owner role');
      console.log(`   User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: owner`);
    } else {
      // Update existing profile to owner
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'owner',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
        process.exit(1);
      }

      console.log('✅ Profile updated to owner role');
      console.log(`   User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: owner (was ${profile.role})`);
    }

    console.log('\n🎉 Owner user created successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Get email from command line or env
const email = process.argv[2] || process.env.OWNER_EMAIL;

createOwner(email);

