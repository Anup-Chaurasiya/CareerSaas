// Create routes/settings.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const NotificationPreferences = require('../models/NotificationPreferences');

// GET /api/settings - Get user settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const notificationPreferences = await NotificationPreferences.findOne({ userId: req.user.id });
    
    res.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        jobTitle: user.jobTitle,
        industry: user.industry,
        bio: user.bio
      },
      notifications: notificationPreferences || {
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
      },
      preferences: {
        language: user.language || 'en',
        theme: user.theme || 'light',
        resumeAutoAnalyze: user.resumeAutoAnalyze !== undefined ? user.resumeAutoAnalyze : true,
        emailFrequency: user.emailFrequency || 'weekly'
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings/profile - Update profile settings
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, jobTitle, industry, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, 
        phone, 
        location, 
        jobTitle, 
        industry, 
        bio,
        profileCompleted: true 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profile updated successfully',
      profile: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        jobTitle: updatedUser.jobTitle,
        industry: updatedUser.industry,
        bio: updatedUser.bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /api/settings/preferences - Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { language, theme, resumeAutoAnalyze, emailFrequency } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { language, theme, resumeAutoAnalyze, emailFrequency },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Preferences updated successfully',
      preferences: {
        language: updatedUser.language,
        theme: updatedUser.theme,
        resumeAutoAnalyze: updatedUser.resumeAutoAnalyze,
        emailFrequency: updatedUser.emailFrequency
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// PUT /api/settings/notifications - Update notification preferences
router.put('/notifications', auth, async (req, res) => {
  try {
    const { email, inApp } = req.body;
    
    const preferences = await NotificationPreferences.findOneAndUpdate(
      { userId: req.user.id },
      { email, inApp },
      { new: true, upsert: true }
    );
    
    res.json({ 
      message: 'Notification preferences updated successfully',
      notifications: preferences
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// PUT /api/settings/change-password - Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// DELETE /api/settings/account - Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    // Additional validation can be added here (e.g., confirm password)
    await User.findByIdAndDelete(req.user.id);
    
    // Also delete related data (resumes, preferences, etc.)
    await NotificationPreferences.deleteOne({ userId: req.user.id });
    // Add other data deletion as needed
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;