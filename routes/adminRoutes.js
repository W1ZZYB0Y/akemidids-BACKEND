const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Task = require("../models/Task");
const Ad = require("../models/Ad");

const verifyAdminToken = require('../middleware/verifyAdminToken');

// ---------- AUTH --------------------------------------------------


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Example protected route
router.get("/dashboard-data", verifyAdminToken, (_req, res) => {
  res.json({ message: "Protected admin data" });
});


// ---------- PROTECTED ROUTE EXAMPLE -------------------------------

router.get("/dashboard-data", verifyAdminToken, (_req, res) => {
  res.json({ message: "Only admins can see this data" });
});

// ---------- USER MANAGEMENT ---------------------------------------

router.get("/users", verifyAdminToken, async (_req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/users/:telegramId", verifyAdminToken, async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.telegramId });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/users/gift", verifyAdminToken, async (req, res) => {
  const { telegramId, amount } = req.body;
  const user = await User.findOne({ telegramId });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.balance += Number(amount);
  await user.save();
  res.json({ message: "Gifted successfully", newBalance: user.balance });
});

// ---------- TASK MANAGEMENT ----------------------------------------

// routes/adminRoutes.js

// Get tasks for admin dashboard
router.get('/tasks', verifyAdminToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json( tasks );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post("/tasks", verifyAdminToken, async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

router.delete("/tasks/:id", verifyAdminToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// ---------- ADS MANAGEMENT -----------------------------------------

router.get("/ads", verifyAdminToken, async (_req, res) => {
  const ads = await Ad.find();
  res.json(ads);
});

router.post("/ads", verifyAdminToken, async (req, res) => {
  const { slot, code } = req.body;
  const existingAd = await Ad.findOne({ slot });

  if (existingAd) {
    existingAd.code = code;
    await existingAd.save();
  } else {
    await Ad.create({ slot, code });
  }

  res.json({ message: "Ad saved" });
});

module.exports = router;