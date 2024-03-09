// routes/mentorEvaluationRoutes.js
const express = require('express');
const router = express.Router();
const mentorEvaluationService = require('../services/mentorEvaluationService');

// POST route to create a new mentor evaluation
router.post('/evaluations', async (req, res) => {
  const { studentName, ideationMarks, executionMarks, vivaMarks } = req.body;
  try {
    const evaluation = await mentorEvaluationService.createEvaluation(studentName, ideationMarks, executionMarks, vivaMarks);
    res.json({ success: true, evaluation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
