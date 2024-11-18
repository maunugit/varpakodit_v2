// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData');
const BDIQuestionnaire = require('../models/BDIQuestionnaire');
const { checkJwt } = require('../middleware/auth');

// Get daily data for a specific user
router.get('/daily-data/:userId', checkJwt, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get last 30 days of daily data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyData = await DailyData.find({
      userId: userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    res.status(200).json(dailyData);
  } catch (error) {
    console.error("Error fetching daily data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get BDI data for a specific user
router.get('/bdi/:userId', checkJwt, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get all BDI questionnaires for the user, sorted by date
    const bdiData = await BDIQuestionnaire.find({
      userId: userId
    }).sort({ date: -1 });

    res.status(200).json(bdiData);
  } catch (error) {
    console.error("Error fetching BDI data:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;