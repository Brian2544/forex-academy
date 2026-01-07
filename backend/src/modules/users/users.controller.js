import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ensureProfileExists } from '../../utils/profileBootstrap.js';
import { logger } from '../../utils/logger.js';

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = req.user; // From requireAuth middleware

  if (!userId || !user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Ensure profile exists (bootstrap if missing)
  let profile = await ensureProfileExists(userId, user.email);

  if (!profile) {
    // If bootstrap failed, return minimal response
    logger.error(`Failed to bootstrap profile for user ${userId}`);
    return res.json({
      success: true,
      data: {
        profile: null,
        role: 'student',
        profileCompleted: false,
      },
    });
  }

  // Fetch full profile
  const { data: fullProfile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !fullProfile) {
    logger.error('Error fetching full profile:', error);
    return res.json({
      success: true,
      data: {
        profile: profile,
        role: profile.role || 'student',
        profileCompleted: !!(profile.first_name && profile.last_name),
      },
    });
  }

  res.json({
    success: true,
    data: {
      profile: fullProfile,
      role: fullProfile.role || 'student',
      profileCompleted: !!(fullProfile.first_name && fullProfile.last_name),
    },
  });
});

