// /backend/routes/bdiQuestionnaire.js

const express = require('express');
const router = express.Router();
const BDIQuestionnaire = require('../models/BDIQuestionnaire');

router.post('/', async (req, res) => {
    console.log('Received BDI questionnaire submission');
    console.log('Request body:', req.body);

  const { userId, userName, answers } = req.body;

  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

  // Determine category based on total score
  let category;
  if (totalScore <= 13) category = 'Normaali (0-12 pistettä)';
  else if (totalScore <= 19) category = 'Lievä masennus (13-18 pistettä)';
  else if (totalScore <= 28) category = 'Kohtalainen tai keskivaikea masennus (19-29 pistettä';
  else category = 'Vaikea masennus (30 pistettä tai yli)';

  const bdiQuestionnaire = new BDIQuestionnaire({
    userId,
    userName,
    answers,
    totalScore,
    category
  });

  try {
    const savedQuestionnaire = await bdiQuestionnaire.save();
    console.log('Saved questionnaire:', savedQuestionnaire);
    res.status(201).send(savedQuestionnaire);
  } catch (error) {
    console.error('Error saving questionnaire:', error);
    res.status(400).send(error);
  }
});


// tämä oli kommentoituna, oliko joku syy?
router.get('/:userId', async (req, res) => {
  try {
    const data = await BDIQuestionnaire.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(30); // Optional: limit to last 30 entries
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;