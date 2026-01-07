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

