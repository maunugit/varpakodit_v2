// /backend/models/BDIQuestionnaire.js

const mongoose = require('mongoose');

const bdiQuestionnaireSchema = new mongoose.Schema({
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
      'Normaali (0-12 pistettä)', 
      'Lievä masennus (13-18 pistettä)', 
      'Kohtalainen tai keskivaikea masennus (19-29 pistettä)', 
      'Vaikea masennus (30 pistettä tai yli)']
  }
});

module.exports = mongoose.model('BDIQuestionnaire', bdiQuestionnaireSchema);
