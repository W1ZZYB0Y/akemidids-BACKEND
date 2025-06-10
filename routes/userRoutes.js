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

// ✅ Register with referral username (handle in controller)
router.post('/register', registerUser);

// ✅ Update username
router.post('/update-username', updateUsername);

// ✅ Handle user clicking
router.post('/click', click);

// ✅ Complete a task
router.post('/task', completeTask);

// ✅ Get user profile (must come before /:telegramId to avoid conflict)
router.get('/profile/:id', getUserProfile);

// ✅ Get user's referrals
router.get('/:telegramId/referrals', getReferrals);

// ✅ Get user by Telegram ID
router.get('/:telegramId', getUser);

module.exports = router;
