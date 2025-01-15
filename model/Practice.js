const mongoose = require('mongoose');

// Define the schema
const MeditationPracticeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: [String], required: true },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model from the schema
const MeditationPractice = mongoose.model('MeditationPractice', MeditationPracticeSchema);

module.exports = MeditationPractice;
