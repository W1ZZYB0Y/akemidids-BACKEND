// models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reward: { type: Number, required: true },
  link: { type: String, required: true }
});

module.exports = mongoose.model('Task', taskSchema);