const mongoose = require('mongoose');

const habitTrackerSchema = new mongoose.Schema({
  //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const HabitTracker = mongoose.model('HabitTracker', habitTrackerSchema);

module.exports = HabitTracker;