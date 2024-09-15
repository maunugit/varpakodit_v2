// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData'); // Adjust the path as needed


router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const dailyData = await DailyData.find({ userId }).sort({ date: -1 }).limit(30);
    const aggregatedData = await aggregateData(dailyData);
    console.log("Sending dashboard data:", aggregatedData);
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

  console.log("Aggregated data:", {
    dataEntries,
    happinessScale,
    userEngagement,
    averageTime,
    chartDataSummary: {
      labels: chartData.labels,
      datasets: chartData.datasets.map(ds => ({
        label: ds.label,
        dataPoints: ds.data.length
      }))
    }
  });

  return {
    dataEntries,
    happinessScale,
    userEngagement,
    averageTime,
    chartData
  };
}

async function calculateAverageHappiness(dailyData) {
  const totalHappiness = dailyData.reduce((sum, day) => {
    switch (day.generalMood) {
      case 'bad':
        return sum + 1;
      case 'okay':
        return sum + 3;
      case 'good':
        return sum + 5;
      default:
        return sum;
    }
  }, 0);
  const result = Math.round((totalHappiness / dailyData.length) * 20);
  return result;
}

async function calculateUserEngagement(dailyData) {
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
  dailyData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort dailyData by date

  const labels = dailyData.map(day => new Date(day.date).toLocaleDateString());
  const happinessData = dailyData.map(day => {
    switch (day.generalMood.toLowerCase()) {
      case 'bad': return 0;
      case 'okay': return 50;
      case 'good': return 100;
      default: return 0;
    }
  });
  const dataEntries = [50, 60, 70, 80, 90, 100];
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
        data: happinessData,
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