const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  analysis: {
    sentiment: {
      type: String,
      enum: ['Positive', 'Negative', 'Neutral'],
      required: true
    },
    confidence: {
      type: Number,
      required: true
    },
    keywords: [{
      type: String
    }],
    summary: {
      type: String
    },
    emotions: [{
      name: String,
      value: Number
    }],
    topics: [{
      name: String,
      value: Number
    }]
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 