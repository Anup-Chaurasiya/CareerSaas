const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');
const CoverLetter = require('../models/CoverLetter');
const InterviewQuestion = require('../models/InterviewQuestion');
const User = require('../models/User');
const analyticsService = require('../services/analyticsService');

// Get comprehensive dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user data in parallel
    const [resumes, coverLetters, interviewSessions, user] = await Promise.all([
      Resume.find({ userId }),
      CoverLetter.find({ userId }),
      InterviewQuestion.find({ userId }),
      User.findById(userId)
    ]);

    const stats = analyticsService.calculateUserStats(user, resumes, coverLetters, interviewSessions);
    const monthlyTrends = analyticsService.getMonthlyTrends(resumes);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        plan: user.subscription?.plan || 'free',
        joined: user.createdAt
      },
      stats,
      monthlyTrends,
      recentActivity: this.getRecentActivity(resumes, coverLetters, interviewSessions),
      quickActions: this.getQuickActions(user, resumes)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Get recent activity
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [recentResumes, recentCoverLetters, recentInterviews] = await Promise.all([
      Resume.find({ userId }).sort({ createdAt: -1 }).limit(5),
      CoverLetter.find({ userId }).sort({ createdAt: -1 }).limit(5),
      InterviewQuestion.find({ userId }).sort({ createdAt: -1 }).limit(5)
    ]);

    const activity = [
      ...recentResumes.map(r => ({
        type: 'resume',
        action: r.review ? 'analyzed' : 'uploaded',
        title: r.originalName,
        date: r.createdAt,
        id: r._id
      })),
      ...recentCoverLetters.map(cl => ({
        type: 'cover_letter',
        action: 'created',
        title: `${cl.jobTitle} at ${cl.company}`,
        date: cl.createdAt,
        id: cl._id
      })),
      ...recentInterviews.map(i => ({
        type: 'interview',
        action: 'practiced',
        title: `${i.jobTitle} practice`,
        date: i.createdAt,
        id: i._id
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load recent activity' });
  }
});

// Get usage statistics
router.get('/usage', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const resumes = await Resume.find({ userId: req.user.id });

    const stats = {
      currentMonth: user.subscription?.resumesThisMonth || 0,
      monthlyLimit: analyticsService.monthlyLimits[user.subscription?.plan || 'free'],
      totalResumes: resumes.length,
      analyzedResumes: resumes.filter(r => r.review).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load usage stats' });
  }
});

// Helper methods
function getRecentActivity(resumes, coverLetters, interviewSessions) {
  const activities = [];

  resumes.forEach(resume => {
    activities.push({
      type: 'resume',
      action: resume.review ? 'analyzed' : 'uploaded',
      title: resume.originalName,
      date: resume.createdAt,
      id: resume._id
    });
  });

  coverLetters.forEach(letter => {
    activities.push({
      type: 'cover_letter',
      action: 'created',
      title: `${letter.jobTitle} at ${letter.company}`,
      date: letter.createdAt,
      id: letter._id
    });
  });

  interviewSessions.forEach(session => {
    activities.push({
      type: 'interview',
      action: 'practiced',
      title: `${session.jobTitle} practice`,
      date: session.createdAt,
      id: session._id
    });
  });

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);
}

function getQuickActions(user, resumes) {
  const actions = [];

  if (resumes.length === 0) {
    actions.push({
      title: 'Upload Your First Resume',
      description: 'Get started with AI analysis',
      icon: 'upload',
      link: '/upload',
      priority: 'high'
    });
  } else {
    const hasUnanalyzed = resumes.some(r => !r.review);
    if (hasUnanalyzed) {
      actions.push({
        title: 'Analyze Pending Resumes',
        description: 'Complete your resume reviews',
        icon: 'analyze',
        link: '/resumes',
        priority: 'medium'
      });
    }

    if (resumes.length > 0) {
      actions.push({
        title: 'Generate Cover Letter',
        description: 'Create tailored application letters',
        icon: 'letter',
        link: '/resumes',
        priority: 'medium'
      });

      actions.push({
        title: 'Practice Interview',
        description: 'Prepare with AI-generated questions',
        icon: 'interview',
        link: '/resumes',
        priority: 'medium'
      });
    }
  }

  if (user.subscription?.plan === 'free' && resumes.length > 0) {
    actions.push({
      title: 'Upgrade to Pro',
      description: 'Unlock unlimited analyses and features',
      icon: 'upgrade',
      link: '/pricing',
      priority: 'high'
    });
  }

  return actions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

module.exports = router;