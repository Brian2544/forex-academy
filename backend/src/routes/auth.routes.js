const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/auth/register - Browser-friendly response
router.get('/register', (req, res) => {
  res.status(200).json({
    ok: true,
    note: 'Use POST /api/auth/register to register'
  });
});

// POST /api/auth/register - Registration endpoint
router.post('/register', register);

// GET /api/auth/login - Browser-friendly response
router.get('/login', (req, res) => {
  res.status(200).json({
    ok: true,
    note: 'Use POST /api/auth/login to login'
  });
});

// POST /api/auth/login - Login endpoint
router.post('/login', login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authMiddleware, getMe);

module.exports = router;

