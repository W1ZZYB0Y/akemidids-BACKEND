const User = require("../models/User");

const ranks = [
  { name: "Dwarf Lantern shark", balance: 0, clicks: 50 },
  { name: "Pygmy shark", balance: 500, clicks: 100 },
  { name: "Spotted cat shark", balance: 1000, clicks: 150 },
  { name: "Horn shark", balance: 2000, clicks: 200 },
  { name: "Blacktop reef shark", balance: 3000, clicks: 250 },
  { name: "Bull Shark", balance: 4000, clicks: 300 },
  { name: "Great Hammerhead Shark", balance: 5000, clicks: 350 },
  { name: "Tiger Shark", balance: 10000, clicks: 400 },
  { name: "Great White Shark", balance: 50000, clicks: 450 },
  { name: "Whale Shark", balance: 500000, clicks: 500 },
];

const updateRank = (user) => {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (user.balance >= ranks[i].balance) {
      user.rank = ranks[i].name;
      user.clickLimit = ranks[i].clicks;
      break;
    }
  }
};

const registerUser = async (req, res) => {
  const { telegramId, username, referredBy, ip } = req.body;
  try {
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId, username, ip });
      if (referredBy) {
        const referrer = await User.findOne({ telegramId: referredBy });
        if (referrer && referrer.referrals.length < 10) {
          referrer.referrals.push(telegramId);
          let reward = 10;
          if (referrer.referrals.length === 1) reward = 50;
          else if (referrer.referrals.length === 2) reward = 25;
          referrer.balance += reward;
          referrer.referralRewards += reward;
          updateRank(referrer);
          await referrer.save();
          user.referredBy = referredBy;
        }
      }
      await user.save();
    }
    return res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const click = async (req, res) => {
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.clicks < user.clickLimit) {
    user.clicks++;
    user.balance += 1;
    updateRank(user);
    await user.save();
    return res.json({ balance: user.balance, clicks: user.clicks });
  } else {
    return res.status(403).json({ error: "Click limit reached" });
  }
};


const getUser = async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.telegramId });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

const getReferrals = async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.telegramId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const referredUsers = await User.find({ referredBy: user.telegramId });
  res.json(referredUsers);
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      rank: user.rank,
      referralCount: user.referrals.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// controllers/userController.js
const completeTask = async (req, res) => {
  try {
    const { telegramId, taskName, reward } = req.body;
    const user = await User.findOne({ telegramId });

    if (!user || user.tasksCompleted.includes(taskName)) {
      return res.status(400).json({ error: "Invalid or duplicate task" });
    }

    user.balance += reward;
    user.tasksCompleted.push(taskName);
    updateRank(user);
    await user.save();

    res.json({ balance: user.balance, tasksCompleted: user.tasksCompleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete task" });
  }
};

// Export it
module.exports = {
  registerUser,
  click,
  completeTask,  // ✅ include it here
  getUser,
  getReferrals,
  getUserProfile,
};
