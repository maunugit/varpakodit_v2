// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData'); // Adjust the path as needed


router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const dailyData = await DailyData.find({ userId }).sort({ date: -1 }).limit(30);
    const aggregatedData = await aggregateData(dailyData);
    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(400).json({ error: error.message });
  }
});

async function aggregateData(dailyData) {
  const dataEntries = dailyData.length;
  const happinessScale = await calculateAverageHappiness(dailyData);
  const userEngagement = await calculateUserEngagement(dailyData);
  const averageTime = await calculateAverageTime(dailyData);
  const chartData = await generateChartData(dailyData);

  return {
    dataEntries,
    happinessScale,
    userEngagement,
    averageTime,
    chartData
  };
}

async function calculateAverageHappiness(dailyData) {
  // Implement your logic to calculate the average happiness score
  // based on the "generalMood" field in the dailyData
  // For example:
  const totalHappiness = dailyData.reduce((sum, day) => {
    switch (day.generalMood) {
      case 'Bad':
        return sum + 1;
      case 'Okay':
        return sum + 3;
      case 'Good':
        return sum + 5;
      default:
        return sum;
    }
  }, 0);
  // return Math.round((totalHappiness / dailyData.length) * 20);
  return 75;
}

async function calculateUserEngagement(dailyData) {
  // Implement your logic to calculate user engagement
  // based on the frequency of daily data entries
  const daysWithData = dailyData.filter(day => day.sleep !== '').length;
  return Math.round((daysWithData / 30) * 100);
}

async function calculateAverageTime(dailyData) {
  // Implement your logic to calculate the average time spent
  // by the user on the app, based on the daily data entries
  // For example, you could store the login and logout times
  // in the dailyData and calculate the average time difference
  return 15; // Replace with your actual calculation
}

async function generateChartData(dailyData) {
  // Implement your logic to generate the chart data
  // based on the daily data entries
  const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
  const dataEntries = [50, 60, 70, 80, 90, 100];
  const happinessScale = [60, 65, 70, 75, 80, 85];
  const userEngagement = [70, 75, 80, 85, 90, 95];
  const averageTime = [0, 10, 20, 30];

  return {
    labels,
    datasets: [
      {
        label: 'Data Entries',
        data: dataEntries,
        borderColor: '#ff6b6b',
        fill: false,
      },
      {
        label: 'Happiness Scale',
        data: happinessScale,
        borderColor: '#1a535c',
        fill: false,
      },
      {
        label: 'User Engagement',
        data: userEngagement,
        borderColor: '#ffe66d',
        fill: false,
      },
      {
        label: 'Average Time',
        data: averageTime,
        borderColor: '#ffe66d',
        fill: false,
      },
    ],
  };
}

module.exports = router;