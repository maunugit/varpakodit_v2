const mongoose = require('mongoose');

const dailyDataSchema = new mongoose.Schema({
  userId: String,
  userName: String, 
  date: { type: Date, default: Date.now },
  sleep: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  eating: String,
  hobbies: String,
  school: String,
  friendsFamily: String,
  generalMood: String,
  outsideTime: String, 
  hygiene: String, 
  screenTime: Number, 
  timeWithAdults: String, 
});

module.exports = mongoose.model('DailyData', dailyDataSchema);
