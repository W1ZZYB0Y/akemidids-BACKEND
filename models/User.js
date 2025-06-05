const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  balance: { type: Number, default: 0 },
  rank: { type: String, default: "Dwarf Lantern shark" },
  clickLimit: { type: Number, default: 50 },
  clicks: { type: Number, default: 0 },
  ip: String,
  referrals: [{ type: String }],
  referredBy: String,
  tasksCompleted: [String],
  referralRewards: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);