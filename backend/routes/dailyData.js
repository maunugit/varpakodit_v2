const express = require('express');
const router = express.Router();
const DailyData = require('../models/DailyData');

router.post('/', async (req, res) => {
  const dailyData = new DailyData(req.body);
  try {
    await dailyData.save();
    res.status(201).send(dailyData);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const data = await DailyData.find({ userId: req.params.userId });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
