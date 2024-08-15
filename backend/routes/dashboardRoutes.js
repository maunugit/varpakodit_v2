// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData'); // path for daily data
const { auth } = require('express-oauth2-jwt-bearer'); // for Auth0 authentication

router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.payload.sub; // Get user ID from Auth0 token
    const dailyData = await DailyData.find({ userId }).sort({ date: -1 }).limit(30);
    const aggregatedData = aggregateData(dailyData);
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

function aggregateData(dailyData) {
  // Implement your data aggregation logic here
  // This is just an example, adjust according to your needs
  return {
    dataEntries: dailyData.length,
    filesUploaded: dailyData.reduce((sum, day) => sum + (day.filesUploaded || 0), 0),
    happinessScale: calculateAverageHappiness(dailyData),
    userEngagement: calculateUserEngagement(dailyData),
    averageTime: calculateAverageTime(dailyData),
    chartData: generateChartData(dailyData),
  };
}

// Implement these helper functions based on your data structure
function calculateAverageHappiness(dailyData) { /* ... */ }
function calculateUserEngagement(dailyData) { /* ... */ }
function calculateAverageTime(dailyData) { /* ... */ }
function generateChartData(dailyData) { /* ... */ }

module.exports = router;