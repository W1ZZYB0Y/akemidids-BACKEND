const express = require('express');
const router = express.Router();

const {
  registerUser,
  click,
  completeTask,
  getUser,
  getReferrals,
  updateUsername,
  getUserProfile,
} = require('../controllers/userController');

// ✅ Register a new user with optional referral code in query (?ref=<referrerUsername>)
router.post('/register', registerUser);

// ✅ Update a user's Telegram username
router.post('/update-username', updateUsername);

// ✅ Handle a click action for a user (earns coins)
router.post('/click', click);

// ✅ Complete a specific task for the user
router.post('/task', completeTask);

// ✅ Get a user profile by ID, Telegram ID, or username
// This will return the full profile including referrals
router.get('/profile/:id', getUserProfile);

// ✅ Get the list of referrals made by a user, using their username
router.get('/referrals/:username', getReferrals);

// ✅ Get a user directly by their Telegram ID
router.get('/telegram/:telegramId', getUser);

module.exports = router;
