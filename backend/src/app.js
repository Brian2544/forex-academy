// Load environment variables FIRST before any other imports
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import ownerRoutes from './modules/owner/owner.routes.js';
import paymentRoutes from './modules/payments/payments.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import { requireAuth } from './middleware/requireAuth.js';
import { supabaseAdmin } from './config/supabaseAdmin.js';
import { getCourses } from './modules/student/student.controller.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Special handling for Paystack webhook - must be before express.json()
// Paystack webhook needs raw body for signature verification
app.use('/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Public courses endpoint (no auth required for browsing)
app.get('/courses', async (req, res) => {
  try {
    const { level } = req.query;
    let query = supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch courses',
      });
    }

    res.json({
      success: true,
      data: {
        courses: data || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    });
  }
});

// Public signals endpoint (no auth required for browsing)
app.get('/signals', async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabaseAdmin
      .from('signals')
      .select('*')
      .eq('is_active', true);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch signals',
      });
    }

    res.json({
      success: true,
      data: {
        signals: data || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch signals',
    });
  }
});

// Public live-classes endpoint (no auth required for browsing)
app.get('/live-classes', async (req, res) => {
  try {
    // Get both upcoming and past sessions for public viewing
    const { data, error } = await supabaseAdmin
      .from('live_sessions')
      .select('*')
      .eq('is_active', true)
      .order('scheduled_at', { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch live classes',
      });
    }

    // Transform data to match frontend expectations
    const liveClasses = (data || []).map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      scheduledDate: session.scheduled_at,
      duration: session.duration_minutes,
      status: session.status || 'scheduled',
      isWebinar: session.is_webinar || false,
      meetingLink: session.meeting_link || session.meeting_url,
      recordingUrl: session.recording_url,
      instructor: session.instructor_id ? {
        firstName: session.instructor_first_name || 'Instructor',
        lastName: session.instructor_last_name || ''
      } : null
    }));

    res.json({
      success: true,
      data: {
        liveClasses: liveClasses || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live classes',
    });
  }
});

// TEMP DEBUG ROUTE - Remove after confirming fix
app.get('/debug/me', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    res.json({
      session: {
        email: user?.email,
        id: user?.id,
      },
      profile: profile || null,
      role: profile?.role || 'student',
      ownerEmails: process.env.OWNER_EMAILS || '',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);
app.use('/owner', ownerRoutes);
app.use('/billing', paymentRoutes);
app.use('/payments', paymentRoutes);
app.use('/chat', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

export default app;

