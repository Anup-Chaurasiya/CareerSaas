const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'trial'],
      default: 'active'
    },
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  resumesThisMonth: {
    type: Number,
    default: 0
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    location: String,
    jobTitle: String,
    company: String,
    website: String,
    bio: String,
    avatar: String,
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false },
    resumeAutoSave: { type: Boolean, default: true },
  },
  jobTitle: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  },
  theme: {
    type: String,
    default: 'light'
  },
  resumeAutoAnalyze: {
    type: Boolean,
    default: true
  },
  emailFrequency: {
    type: String,
    enum: ['never', 'daily', 'weekly', 'monthly'],
    default: 'weekly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.comparePassword = async function (password) {
  try {
    // Add validation to ensure both passwords exist
    if (!password || !this.password) {
      console.log('Missing password for comparison');
      console.log('Input password:', password);
      console.log('Stored password:', this.password);
      return false;
    }
    
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);