const Task = require("../models/Task"); // Task model
const User = require("../models/User"); // User model

// Add Task
exports.addTask = async (req, res) => {
  const { taskName, taskLink, taskReward } = req.body;

  try {
    const task = new Task({ name: taskName, link: taskLink, reward: taskReward });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Task Reward
exports.updateTaskReward = async (req, res) => {
  const { taskId } = req.params;
  const { reward } = req.body;

  try {
    const task = await Task.findById(taskId);
    task.reward = reward;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gift Tokens to User
exports.giftTokens = async (req, res) => {
  const { telegramId, amount } = req.body;

  try {
    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.balance += Number(amount);
    await user.save();
    res.json({ telegramId: user.telegramId, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Ad Code
exports.addAdCode = async (req, res) => {
  const { code } = req.body;
  
  try {
    // Save the ad code to your ad management system (this example assumes it's just stored)
    // Ideally, you'd save it to a database or manage it via a third-party system.
    console.log("Ad Code Added: ", code);
    res.json({ message: "Ad code added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};