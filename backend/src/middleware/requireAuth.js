import { supabaseClient } from '../config/supabaseClient.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ensureProfileExists } from '../utils/profileBootstrap.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authHeader.substring(7);

  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Ensure profile exists (lightweight bootstrap if missing)
    // This prevents "User not found" errors downstream
    await ensureProfileExists(user.id, user.email);

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
    });
  }
});

