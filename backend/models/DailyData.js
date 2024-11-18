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

//backend/models/DailyData.js

// const mongoose = require('mongoose');

// const dailyDataSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   sleep: { type: Number, required: true }, // 1-5
//   eating: { type: String, enum: ['bad', 'okay', 'good'], required: true },
//   school: { type: String, enum: ['bad', 'okay', 'good'], required: true },
//   hobbies: { type: String, enum: ['bad', 'okay', 'good'], required: true },
//   friendsFamily: { type: String, enum: ['bad', 'okay', 'good'], required: true },
//   generalMood: { type: String, enum: ['bad', 'okay', 'good', 'very unhappy', 'unhappy', 'neutral', 'happy', 'very happy'], required: true },
//   outsideTime: { type: String, enum: ['Not at all', 'less than an hour', '1-2 hours', '3+ hours'], required: true },
//   hygiene: { type: String, enum: ['bad', 'good'], required: true },
//   screenTime: { type: Number, required: true }, // Hours
//   timeWithAdults: { type: String, enum: ['bad', 'okay', 'good'], required: true },
//   date: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('DailyData', dailyDataSchema);

