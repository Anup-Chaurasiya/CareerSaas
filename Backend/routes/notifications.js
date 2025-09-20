// Create routes/notifications.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const NotificationPreferences = require('../models/NotificationPreferences');

// Get notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    let preferences = await NotificationPreferences.findOne({ userId: req.user.id });
    
    if (!preferences) {
      // Create default preferences if none exist
      preferences = new NotificationPreferences({
        userId: req.user.id,
        email: {
          welcome: true,
          resumeAnalyzed: true,
          subscription: true,
          promotional: true,
          productUpdates: true
        },
        inApp: {
          resumeAnalyzed: true,
          subscription: true,
          recommendations: true
        }
      });
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const preferences = await NotificationPreferences.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;