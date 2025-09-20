const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  storedName: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    default: ''
  },
  review: {
    type: Object,
    default: null
  },
  isAnalyzed: {
    type: Boolean,
    default: false
  },
  analyzedAt: {
    type: Date
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: Object // or you can create a more specific schema
  },
  suggestions: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

resumeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);