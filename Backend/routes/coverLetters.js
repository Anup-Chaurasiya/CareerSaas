const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CoverLetter = require('../models/CoverLetter');
const Resume = require('../models/Resume');
const coverLetterService = require('../services/coverLetterService');
const { checkUsageLimit, incrementUsage } = require('../middleware/usageLimit');

// Generate new cover letter
router.post('/generate', auth, checkUsageLimit, async (req, res) => {
  try {
    const { resumeId, jobTitle, company, industry, tone, length } = req.body;

    const resume = await Resume.findOne({ 
      _id: resumeId, 
      userId: req.user.id 
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.textContent) {
      return res.status(400).json({ error: 'Resume text content is required' });
    }

    const content = await coverLetterService.generateCoverLetter(
      resume.textContent,
      jobTitle,
      company,
      industry,
      tone,
      length
    );

    const coverLetter = new CoverLetter({
      userId: req.user.id,
      resumeId,
      jobTitle,
      company,
      industry,
      content,
      tone: tone || 'professional',
      length: length || 'medium',
      keywords: resume.review?.keywords || []
    });

    await coverLetter.save();
    await incrementUsage(req.user.id);

    res.json(coverLetter);
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate multiple versions
router.post('/generate-versions', auth, checkUsageLimit, async (req, res) => {
  try {
    const { resumeId, jobTitle, company, industry } = req.body;

    const resume = await Resume.findOne({ 
      _id: resumeId, 
      userId: req.user.id 
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const versions = await coverLetterService.generateMultipleVersions(
      resume.textContent,
      jobTitle,
      company,
      industry
    );

    // Save the professional version as primary
    const professionalVersion = versions.find(v => v.tone === 'professional');
    if (professionalVersion) {
      const coverLetter = new CoverLetter({
        userId: req.user.id,
        resumeId,
        jobTitle,
        company,
        industry,
        content: professionalVersion.content,
        tone: 'professional',
        length: 'medium',
        keywords: resume.review?.keywords || []
      });
      await coverLetter.save();
    }

    await incrementUsage(req.user.id);

    res.json({ versions, saved: professionalVersion ? true : false });
  } catch (error) {
    console.error('Multiple versions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's cover letters
router.get('/', auth, async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user.id })
      .populate('resumeId', 'originalName')
      .sort({ createdAt: -1 });

    res.json(coverLetters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cover letters' });
  }
});

// Get specific cover letter
router.get('/:id', auth, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('resumeId', 'originalName');

    if (!coverLetter) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }

    res.json(coverLetter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cover letter' });
  }
});

// Update cover letter
router.put('/:id', auth, async (req, res) => {
  try {
    const { content, isFavorite } = req.body;
    const updateData = {};

    if (content !== undefined) updateData.content = content;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;

    const coverLetter = await CoverLetter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!coverLetter) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }

    res.json(coverLetter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cover letter' });
  }
});

// Delete cover letter
router.delete('/:id', auth, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!coverLetter) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }

    res.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cover letter' });
  }
});

module.exports = router;