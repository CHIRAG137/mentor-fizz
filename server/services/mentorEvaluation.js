// services/mentorEvaluationService.js
const MentorEvaluation = require('../models/mentorEvaluation');

const mentorEvaluationService = {
  async createEvaluation(studentName, ideationMarks, executionMarks, vivaMarks) {
    try {
      const evaluation = new MentorEvaluation({
        studentName,
        ideationMarks,
        executionMarks,
        vivaMarks
      });
      await evaluation.save();
      return evaluation;
    } catch (error) {
      throw new Error('Could not create evaluation');
    }
  }
};

module.exports = mentorEvaluationService;
