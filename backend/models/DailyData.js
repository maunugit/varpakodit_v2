const mongoose = require('mongoose');

const dailyDataSchema = new mongoose.Schema({
  userId: String,
  userName: String, 
  date: { type: Date, default: Date.now },
  sleep: String,
  eating: String,
  hobbies: String,
  school: String,
  sports: String,
  friendsFamily: String,
  generalMood: String,
});

module.exports = mongoose.model('DailyData', dailyDataSchema);
