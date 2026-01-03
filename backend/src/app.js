const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const errorHandler = require('./middlewares/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;

