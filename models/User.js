const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, unique: true, sparse: true }, // optional, will be empty for some
    username: { type: String, required: true, unique: true }, // username is unique and required
    balance: { type: Number, default: 0 },
    rank: { type: String, default: "Dwarf Lantern shark" },
    clickLimit: { type: Number, default: 50 },
    clicks: { type: Number, default: 0 },
    ip: { type: String, default: '' },

    // Direct list of all referred user IDs
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Parent referrer who referred this user
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Track completed tasks
    tasksCompleted: { type: [String], default: [] },

    // Accumulated rewards from referral bonuses
    referralRewards: { type: Number, default: 0 },

    // Detailed referral information
    referralDetails: [
      {
        referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reward: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
