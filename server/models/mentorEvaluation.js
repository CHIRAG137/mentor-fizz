// models/MentorEvaluation.js
const mongoose = require('mongoose');

const MentorEvaluationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  ideationMarks: {
    type: Number,
    required: true
  },
  executionMarks: {
    type: Number,
    required: true
  },
  vivaMarks: {
    type: Number,
    required: true
  },
  evaluationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MentorEvaluation', MentorEvaluationSchema);
