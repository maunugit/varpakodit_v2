// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: String,
  age: Number,
  grade: Number,
  weight: Number,
  bloodType: String,
  height: Number,
  hobbies: String,
  favoriteSubject: String,
  phoneNumber: String,
  bio: String,
});

module.exports = mongoose.model('Profile', profileSchema);
