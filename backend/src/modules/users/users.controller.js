import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return res.json({
      success: true,
      data: {
        profile: null,
        role: null,
        profileCompleted: false,
      },
    });
  }

  res.json({
    success: true,
    data: {
      profile,
      role: profile.role,
      profileCompleted: !!(profile.first_name && profile.last_name),
    },
  });
});

