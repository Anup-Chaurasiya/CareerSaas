// Create models/FAQ.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  helpful: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FAQ', faqSchema);