const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  slot: { type: String, required: true, unique: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model('Ad', adSchema);