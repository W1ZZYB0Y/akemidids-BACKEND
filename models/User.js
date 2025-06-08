const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
  telegramId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 }, rank: { type: String, default: "Dwarf Lantern shark" },
  clickLimit: { type: Number, default: 50 },
  clicks: { type: Number, default: 0 },
  ip: String, referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasksCompleted: [String],
  referralRewards: { type: Number, default: 0 },
  referralDetails: [{ 
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reward: Number, 
    date: Date 
  }] 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
