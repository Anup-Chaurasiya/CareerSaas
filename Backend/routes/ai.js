const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');
const { checkUsageLimit, incrementUsage } = require('../middleware/usageLimit');

// POST /api/ai/resume-review/:resumeId
router.post('/resume-review/:resumeId', auth, checkUsageLimit, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { jobTitle, jobDescription } = req.body;

    // Find the resume
    const resume = await Resume.findOne({ 
      _id: resumeId, 
      userId: req.user.id 
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.textContent) {
      return res.status(400).json({ error: 'Resume text content is required for analysis' });
    }

    // Call AI service
    const review = await aiService.analyzeResume(
      resume.textContent, 
      jobTitle, 
      jobDescription
    );

    // Save review to database
    resume.review = review;
    await resume.save();
    await incrementUsage(req.user.id);

    res.json(review);
  } catch (error) {
    console.error('Resume review error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze resume' 
    });
  }
});

// GET /api/ai/resume-review/:resumeId
router.get('/resume-review/:resumeId', auth, async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find the resume
    const resume = await Resume.findOne({ 
      _id: resumeId, 
      userId: req.user.id 
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.review) {
      return res.status(404).json({ error: 'No review found for this resume' });
    }

    res.json(resume.review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Failed to fetch resume review' });
  }
});

module.exports = router;