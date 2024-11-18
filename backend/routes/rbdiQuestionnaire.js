// /backend/routes/rbdiQuestionnaire.js

const express = require('express');
const router = express.Router();
const RBDIQuestionnaire = require('../models/RBDIQuestionnaire');

router.post('/', async (req, res) => {
  console.log('Received R-BDI questionnaire submission');
  console.log('Request body:', req.body);

  const { userId, userName, answers } = req.body;

  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

  // Determine category based on total score
  let category;
  if (totalScore <= 9) category = 'No depression (0-9 points)';
  else if (totalScore <= 18) category = 'Mild depression (10-18 points)';
  else if (totalScore <= 29) category = 'Moderate depression (19-29 points)';
  else category = 'Severe depression (30-39 points)';

  const rbdiQuestionnaire = new RBDIQuestionnaire({
    userId,
    userName,
    answers,
    totalScore,
    category
  });

  try {
    const savedQuestionnaire = await rbdiQuestionnaire.save();
    console.log('Saved R-BDI questionnaire:', savedQuestionnaire);
    res.status(201).send(savedQuestionnaire);
  } catch (error) {
    console.error('Error saving R-BDI questionnaire:', error);
    res.status(400).send(error);
  }
});

module.exports = router;
