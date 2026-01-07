import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';
import { isOwnerEmail, ROLES } from '../../utils/roleUtils.js';
import { bootstrapProfile } from '../../utils/profileBootstrap.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, country, country_code } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for now
    });

    if (authError) {
      logger.error('Auth creation error:', authError);
      return res.status(400).json({
        success: false,
        message: authError.message || 'Failed to create user',
      });
    }

    const userId = authData.user.id;

    // Create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        first_name: first_name || '',
        last_name: last_name || '',
        country: country || '',
        country_code: country_code || '',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Profile creation error:', profileError);
      // User was created but profile failed - try to clean up
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      } catch (deleteError) {
        logger.error('Failed to clean up user:', deleteError);
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create profile',
        error: profileError.message,
      });
    }

    // Create a session token for the new user
    // Note: Frontend will handle session via Supabase client
    // We'll return the user data and let frontend sign in
    
    // Return user and profile
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: authData.user,
      profile,
      // Frontend will sign in using Supabase client with email/password
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
});

export const bootstrapProfileHandler = asyncHandler(async (req, res) => {
  const { first_name, last_name, country, country_code } = req.body;
  const userId = req.userId;
  const user = req.user; // From requireAuth middleware

  if (!userId || !user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Get user email from authenticated user (trusted source)
  const userEmail = user.email;
  if (!userEmail) {
    logger.error('User email not found in auth token');
    return res.status(400).json({
      success: false,
      message: 'User email not found',
    });
  }

  try {
    // Use centralized bootstrap utility
    const profile = await bootstrapProfile(userId, userEmail, {
      first_name,
      last_name,
      country,
      country_code,
    });

    return res.json({
      success: true,
      ok: true,
      role: profile.role,
      data: profile,
      profile: profile,
    });
  } catch (error) {
    logger.error('Bootstrap error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to bootstrap profile',
    });
  }
});

