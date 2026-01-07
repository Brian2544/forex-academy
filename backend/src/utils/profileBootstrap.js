/**
 * Profile bootstrap utility
 * Ensures a profile exists for a user and assigns correct role based on owner email allowlist
 */

import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { logger } from './logger.js';
import { getOwnerEmails, ROLES } from './roleUtils.js';

/**
 * Bootstrap a user profile - ensures profile exists and role is correct
 * @param {string} userId - User ID from auth.users
 * @param {string} userEmail - User email from auth.users
 * @param {object} profileData - Optional profile data (first_name, last_name, country, country_code)
 * @returns {Promise<object>} - Profile object
 */
export const bootstrapProfile = async (userId, userEmail, profileData = {}) => {
  if (!userId || !userEmail) {
    throw new Error('User ID and email are required');
  }

  // Normalize email
  const normalizedEmail = (userEmail || '').trim().toLowerCase();
  
  // Get owner emails from env
  const ownerEmails = getOwnerEmails();
  const isOwner = ownerEmails.includes(normalizedEmail);

  // Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    logger.error('Error fetching profile:', fetchError);
    throw new Error('Failed to fetch profile');
  }

  // Determine role to set
  let roleToSet;
  if (isOwner) {
    // Owner email always gets owner role
    roleToSet = ROLES.OWNER;
    logger.info(`Owner email detected: ${normalizedEmail}, assigning owner role`);
  } else if (existingProfile?.role) {
    // Keep existing role (don't downgrade)
    roleToSet = existingProfile.role;
  } else {
    // Default to student
    roleToSet = ROLES.STUDENT;
  }

  // If profile exists, update it
  if (existingProfile) {
    const updateData = {
      role: roleToSet, // Always update role (server-authoritative for owner)
      updated_at: new Date().toISOString(),
    };

    // Only update other fields if provided and not empty
    if (profileData.first_name !== undefined && profileData.first_name !== '') {
      updateData.first_name = profileData.first_name;
    }
    if (profileData.last_name !== undefined && profileData.last_name !== '') {
      updateData.last_name = profileData.last_name;
    }
    if (profileData.country !== undefined && profileData.country !== '') {
      updateData.country = profileData.country;
    }
    if (profileData.country_code !== undefined && profileData.country_code !== '') {
      updateData.country_code = profileData.country_code;
    }

    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      logger.error('Profile update error:', updateError);
      throw new Error('Failed to update profile');
    }

    return updatedProfile;
  }

  // Create new profile
  const { data: newProfile, error: createError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: userId,
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      country: profileData.country || '',
      country_code: profileData.country_code || '',
      role: roleToSet,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError) {
    logger.error('Profile creation error:', createError);
    throw new Error('Failed to create profile');
  }

  logger.info(`Profile ${existingProfile ? 'updated' : 'created'} for user ${userId} with role: ${roleToSet}`);
  return newProfile;
};

/**
 * Ensure profile exists (lightweight check and create if missing)
 * Used in middleware to guarantee profile exists before role checks
 */
export const ensureProfileExists = async (userId, userEmail) => {
  if (!userId || !userEmail) {
    return null;
  }

  try {
    // Quick check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      return existingProfile;
    }

    // Profile missing - bootstrap it
    logger.warn(`Profile missing for user ${userId}, bootstrapping...`);
    return await bootstrapProfile(userId, userEmail);
  } catch (error) {
    logger.error('Error ensuring profile exists:', error);
    return null;
  }
};

