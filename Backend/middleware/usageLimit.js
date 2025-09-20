const Subscription = require('../models/Subscription');
const User = require('../models/User');

const checkUsageLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.subscription.plan === 'free') {
      // Reset counter at start of month
      const now = new Date();
      if (user.subscription.lastReset && new Date(user.subscription.lastReset).getMonth() !== now.getMonth()) {
        user.subscription.resumesThisMonth = 0;
        user.subscription.lastReset = now;
        await user.save();
      }
      
      // Check if user exceeded free limit
      if (user.subscription.resumesThisMonth >= 1) {
        return res.status(403).json({
          error: 'Free plan limit reached. Upgrade to analyze more resumes.'
        });
      }
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Usage check failed' });
  }
};

const incrementUsage = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { 'subscription.resumesThisMonth': 1 }
    });
  } catch (error) {
    console.error('Failed to increment usage:', error);
  }
};

module.exports = { checkUsageLimit, incrementUsage };