const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const { extractTextFromPDF, extractTextFromDOCX } = require('../utils/textExtractor');
const { sendResumeAnalyzedEmail } = require('../services/emailService'); // Add this line
const User = require('../models/User'); // Add this line

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for PDF and DOCX
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// POST /api/resumes/upload - Upload resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = '';
    
    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(req.file.path);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDOCX(req.file.path);
    }

    // Create resume record in database
    const resume = new Resume({
      user: req.user.id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      text: extractedText,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await resume.save();

    res.status(201).json({
      resumeId: resume._id,
      originalName: resume.originalName,
      message: 'Resume uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// GET /api/resumes - Get all resumes for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select('originalName filename size mimetype createdAt isAnalyzed score')
      .sort({ createdAt: -1 });
    
    res.json(resumes);
  } catch (error) {
    console.error('Fetch resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// POST /api/resumes/:id/analyze - Analyze a specific resume
router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    if (resume.isAnalyzed) {
      return res.status(400).json({ error: 'Resume already analyzed' });
    }
    
    // Simulate AI analysis (replace with your actual AI analysis logic)
    // This is where you would integrate with your AI service
    const analysisResult = await analyzeResumeWithAI(resume.text);
    
    // Update resume with analysis results
    resume.isAnalyzed = true;
    resume.analyzedAt = new Date();
    resume.score = analysisResult.score;
    resume.feedback = analysisResult.feedback;
    resume.suggestions = analysisResult.suggestions;
    
    await resume.save();
    
    // Send email notification after successful analysis
    try {
      const user = await User.findById(req.user.id);
      await sendResumeAnalyzedEmail(user, resume);
    } catch (emailError) {
      console.error('Failed to send analysis email:', emailError);
      // Don't fail the analysis if email fails
    }
    
    res.json({
      message: 'Resume analyzed successfully',
      score: resume.score,
      feedback: resume.feedback
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// GET /api/resumes/:id - Get a specific resume with analysis details
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Fetch resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// DELETE /api/resumes/:id - Delete a specific resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Delete the file from uploads directory
    const filePath = path.join(uploadsDir, resume.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete the record from database
    await Resume.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Helper function to simulate AI analysis (replace with your actual AI integration)
async function analyzeResumeWithAI(resumeText) {
  // This is a mock analysis - replace with your actual AI service call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple scoring based on text length and content (for demo purposes)
      const score = Math.min(100, Math.floor(resumeText.length / 10) + 50);
      
      const feedback = {
        strengths: [
          "Good use of action verbs",
          "Clear section organization",
          "Appropriate length"
        ],
        weaknesses: [
          "Could use more quantifiable achievements",
          "Consider adding more industry-specific keywords"
        ]
      };
      
      const suggestions = [
        "Add more metrics to quantify your achievements",
        "Include relevant certifications",
        "Tailor your resume to specific job descriptions"
      ];
      
      resolve({
        score,
        feedback,
        suggestions
      });
    }, 2000); // Simulate processing time
  });
}

module.exports = router;