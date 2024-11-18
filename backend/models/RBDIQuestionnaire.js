// /backend/models/RBDIQuestionnaire.js
const mongoose = require('mongoose');

const rbdQuestionnaireSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  date: { type: Date, default: Date.now },
  answers: {
    type: Map,
    of: Number
  },
  totalScore: Number,
  category: {
    type: String,
    enum: [
      'No depression (0-9 points)',
      'Mild depression (10-18 points)',
      'Moderate depression (19-29 points)',
      'Severe depression (30-39 points)'
    ]
  }
});

module.exports = mongoose.model('RBDIQuestionnaire', rbdQuestionnaireSchema);
