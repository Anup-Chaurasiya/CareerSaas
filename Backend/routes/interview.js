const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InterviewQuestion = require('../models/InterviewQuestion');
const Resume = require('../models/Resume');
const interviewService = require('../services/interviewService');
const { checkUsageLimit, incrementUsage } = require('../middleware/usageLimit');

// Generate interview questions
router.post('/generate', auth, checkUsageLimit, async (req, res) => {
  try {
    const { resumeId, jobTitle, company, industry } = req.body;

    const resume = await Resume.findOne({ 
      _id: resumeId, 
      userId: req.user.id 
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const interviewData = await interviewService.generateInterviewQuestions(
      resume.textContent,
      jobTitle,
      company,
      industry
    );

    const interviewSession = new InterviewQuestion({
      userId: req.user.id,
      resumeId,
      jobTitle,
      company,
      industry,
      questions: interviewData.questions,
      feedback: interviewData.feedback,
      practiceSession: {
        totalQuestions: interviewData.questions.length,
        completedQuestions: 0,
        timeSpent: 0
      }
    });

    await interviewSession.save();
    await incrementUsage(req.user.id);

    res.json(interviewSession);
  } catch (error) {
    console.error('Interview generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's interview sessions
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await InterviewQuestion.find({ userId: req.user.id })
      .populate('resumeId', 'originalName')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interview sessions' });
  }
});

// Get specific interview session
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await InterviewQuestion.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('resumeId', 'originalName');

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interview session' });
  }
});

// Evaluate answer
router.post('/:id/evaluate', auth, async (req, res) => {
  try {
    const { question, answer, questionIndex } = req.body;

    const session = await InterviewQuestion.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('resumeId');

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const evaluation = await interviewService.evaluateAnswer(
      question,
      answer,
      session.resumeId.textContent
    );

    // Update the session with user's answer and evaluation
    if (questionIndex >= 0 && questionIndex < session.questions.length) {
      session.questions[questionIndex].userAnswer = answer;
      session.questions[questionIndex].rating = evaluation.rating;
      session.questions[questionIndex].notes = evaluation.feedback;
      
      session.practiceSession.completedQuestions += 1;
      await session.save();
    }

    res.json(evaluation);
  } catch (error) {
    console.error('Answer evaluation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update session completion
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const session = await InterviewQuestion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isCompleted: true },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Delete interview session
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await InterviewQuestion.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json({ message: 'Interview session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;