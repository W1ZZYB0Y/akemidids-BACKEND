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
  const { telegramId, username, ip } = req.body;
  const refUsername = req.query.ref;

  try {
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId, username, ip });

      if (refUsername) {
        const referrer = await User.findOne({ username: refUsername });

        if (referrer && referrer.referrals.length < 10) {
          referrer.referrals.push(user._id);

          let reward = 10;
          if (referrer.referrals.length === 1) reward = 50;
          else if (referrer.referrals.length === 2) reward = 25;

          referrer.balance += reward;
          referrer.referralRewards += reward;

          referrer.referralDetails.push({
            referredUser: user._id,
            reward,
            date: new Date()
          });

          user.referredBy = referrer._id;

          updateRank(referrer);
          await referrer.save();
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

const getUser = async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.telegramId });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

const getReferrals = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Populate referralDetails with usernames
    const populated = await User.findById(user._id).populate({
      path: "referralDetails.referredUser",
      select: "username"
    });

    res.json(populated.referralDetails || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
};

const User = require('../models/User');

// GET USER PROFILE BY telegramId or username
const getUserProfile = async (req, res) => {
  const { telegramId } = req.params;

  try {
    let user = await User.findOne({ telegramId })
      .populate('referralDetails.referredUser', 'username');

    // Fallback if not found by telegramId — try username instead
    if (!user) {
      user = await User.findOne({ username: telegramId })
        .populate('referralDetails.referredUser', 'username');
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USERNAME
const updateUsername = async (req, res) => {
  const { telegramId, username } = req.body;

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID and username are required" });
  }

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findOneAndUpdate(
      { telegramId },
      { username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Username updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateUsername = async (req, res) => {
  const { telegramId, username } = req.body;

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID and username are required" });
  }

  try {
    const existingUser = await User.findOne({ username });

    // If the username exists and belongs to another user
    if (existingUser && existingUser.telegramId !== telegramId) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findOneAndUpdate(
      { telegramId },
      { username },
      { new: true }
    ).populate({
      path: "referralDetails.referredUser",
      select: "username"
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Respond with updated user object only
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  registerUser,
  click,
  completeTask,
  getUser,
  getReferrals,
  getUserProfile,
  updateUsername,
};
