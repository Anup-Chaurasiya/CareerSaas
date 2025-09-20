// Create models/NotificationPreferences.js
const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    welcome: { type: Boolean, default: true },
    resumeAnalyzed: { type: Boolean, default: true },
    subscription: { type: Boolean, default: true },
    promotional: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true }
  },
  inApp: {
    resumeAnalyzed: { type: Boolean, default: true },
    subscription: { type: Boolean, default: true },
    recommendations: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationPreferences', notificationPreferencesSchema);