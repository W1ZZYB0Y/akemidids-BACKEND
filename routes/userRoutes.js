const express = require('express');
const router = express.Router();

const {
  registerUser,
  click,
  completeTask,
  getUser,
  getReferrals,
  updateUsername,
  getUserProfile
} = require('../controllers/userController');

// ✅ Register a user with optional referral username
router.post('/register', registerUser);

// ✅ Update user's Telegram username
router.post('/update-username', updateUsername);

// ✅ Handle user click (earn 1 coin)
router.post('/click', click);

// ✅ Mark a task as completed
router.post('/task', completeTask);

// ✅ Get user's full profile by internal DB ID
router.get('/profile/:id', getUserProfile);

// ✅ Get user's referrals by Telegram username
router.get('/referrals/:username', getReferrals);

// ✅ Get user by Telegram ID
router.get('/telegram/:telegramId', getUser);

module.exports = router;
