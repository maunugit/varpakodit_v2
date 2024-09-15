// backend/routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const { analyzeHabits } = require('../habitAnalysis'); // Adjust the path as needed

router.get('/analyze/:userId', async (req, res) => {
    console.log('Received request for habit analysis. User ID:', req.params.userId);
    try {
      const habitAnalysis = await analyzeHabits(req.params.userId);
      console.log('Habit analysis completed:', habitAnalysis);
      res.json(habitAnalysis);
    } catch (error) {
      console.error('Error in habit analysis:', error);
      res.status(500).json({ message: 'Error analyzing habits', error: error.message });
    }
  });
  
  module.exports = router;
