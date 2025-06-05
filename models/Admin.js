const User = require("../models/User");
const Task = require("../models/Task");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);

exports.completeTimedTask = async (req, res) => {
  try {
    const { telegramId, taskId } = req.body;

    const user = await User.findOne({ telegramId });
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({ error: "User or task not found" });
    }

    // Ensure task hasn't already been completed
    if (user.tasksCompleted.includes(task.name)) {
      return res.status(400).json({ error: "Task already completed" });
    }

    // Check if timer was started
    const startedAt = user.taskTimers?.[taskId];
    if (!startedAt) {
      return res.status(400).json({ error: "Task not started" });
    }

    const now = Date.now();
    const elapsed = now - startedAt;

    if (elapsed < 60 * 1000) {
      return res.status(400).json({ error: "Please wait 1 minute before getting reward" });
    }

    user.balance += task.reward;
    user.tasksCompleted.push(task.name);
    delete user.taskTimers[taskId];

    await user.save();

    res.json({ message: "Task completed and rewarded.", balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};