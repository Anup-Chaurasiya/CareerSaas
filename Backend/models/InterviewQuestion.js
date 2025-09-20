const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: String,
  industry: String,
  questions: [{
    question: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['technical', 'behavioral', 'cultural', 'situational', 'leadership'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    suggestedAnswer: String,
    userAnswer: String,
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  feedback: {
    overallScore: Number,
    strengths: [String],
    improvements: [String],
    tips: [String]
  },
  practiceSession: {
    totalQuestions: Number,
    completedQuestions: Number,
    timeSpent: Number, // in minutes
    recordedAnswers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      audioUrl: String,
      transcript: String,
      confidenceScore: Number
    }]
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

interviewQuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);