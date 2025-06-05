const express = require('express');
const router = express.Router();
// e.g. inside your “create user” route

const {
  registerUser,
  click,
  completeTask,
  getUser,
  getReferrals,
  getUserProfile
} = require('../controllers/userController');

// Register a new user
router.post('/register', registerUser);

// Handle user clicking
router.post('/click', click);

// Complete a task
router.post('/task', completeTask);

// Get user by Telegram ID
router.get('/:telegramId', getUser);

// Get user's referrals
router.get('/:telegramId/referrals', getReferrals);

// Get user profile by ID
router.get('/profile/:id', getUserProfile);

module.exports = router;