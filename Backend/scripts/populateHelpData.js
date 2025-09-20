// Create scripts/populateHelpData.js
const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');
const Article = require('../models/Article');
require('dotenv').config();

const sampleFAQs = [
  {
    question: "How do I upload my resume?",
    answer: "To upload your resume, go to the Dashboard and click the 'Upload Resume' button. Select your PDF or DOCX file and wait for the upload to complete. Our system will automatically extract the text from your resume.",
    category: "Resumes",
    order: 1
  },
  {
    question: "What file formats are supported for resumes?",
    answer: "We currently support PDF and DOCX (Microsoft Word) formats. The maximum file size is 5MB.",
    category: "Resumes",
    order: 2
  },
  {
    question: "How does the AI analysis work?",
    answer: "Our AI analyzes your resume using natural language processing to identify strengths, weaknesses, and areas for improvement. It evaluates content, formatting, keywords, and overall effectiveness for your target industry.",
    category: "AI Analysis",
    order: 1
  },
  {
    question: "How can I improve my resume score?",
    answer: "Focus on using action verbs, quantifying achievements, including relevant keywords, ensuring proper formatting, and tailoring content to specific job descriptions. Our AI provides specific suggestions for improvement.",
    category: "Resumes",
    order: 3
  },
  {
    question: "What subscription plans are available?",
    answer: "We offer Free, Basic, Pro, and Business plans. The Free plan includes basic resume analysis, while paid plans offer advanced features like unlimited analyses, cover letter generation, and interview preparation.",
    category: "Billing",
    order: 1
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time from your Account Settings page. Your access to premium features will continue until the end of your billing period.",
    category: "Billing",
    order: 2
  }
];

const sampleArticles = [
  {
    title: "How to Create an Effective Resume",
    description: "Learn the key elements of a successful resume that gets noticed by employers and AI systems.",
    content: `# How to Create an Effective Resume

## Introduction
Creating an effective resume is crucial for standing out in today's competitive job market. This guide will walk you through the essential components of a winning resume.

## Key Sections
1. **Contact Information** - Ensure your name, phone, email, and LinkedIn profile are up-to-date
2. **Professional Summary** - A brief overview of your skills and experience
3. **Work Experience** - Focus on achievements, not just responsibilities
4. **Education** - Include relevant degrees and certifications
5. **Skills** - List both technical and soft skills

## Best Practices
- Use action verbs to start each bullet point
- Quantify achievements with numbers and metrics
- Tailor your resume to each specific job application
- Keep it concise (1-2 pages maximum)
- Use a clean, professional format

## Common Mistakes to Avoid
- Spelling and grammatical errors
- Using an unprofessional email address
- Including irrelevant personal information
- Using dense paragraphs instead of bullet points
- Exaggerating or lying about experience`,
    category: "Resume Tips",
    readTime: 5,
    published: true,
    tags: ["resume", "tips", "career"]
  },
  {
    title: "Understanding Your AI Resume Score",
    description: "Learn how our AI evaluates your resume and what the score means for your job search.",
    content: `# Understanding Your AI Resume Score

## How Scoring Works
Our AI analyzes your resume based on several key factors:

### Content Quality (40%)
- Relevance to target industry
- Use of action verbs and quantifiable achievements
- Proper keyword usage
- Clear and concise writing

### Formatting (25%)
- Consistent formatting throughout
- Readable font and spacing
- Proper section organization
- Appropriate length

### Effectiveness (35%)
- ATS (Applicant Tracking System) compatibility
- Impact on recruiters
- Overall persuasiveness

## Score Interpretation
- **90-100**: Excellent - Your resume is highly effective
- **75-89**: Good - Minor improvements needed
- **60-74**: Fair - Several areas need improvement
- **Below 60**: Needs work - Significant revisions recommended

## Improving Your Score
Follow the specific suggestions provided in your analysis report. Common improvements include:
- Adding more quantifiable achievements
- Including industry-specific keywords
- Improving formatting consistency
- Tailoring content to your target role`,
    category: "AI Analysis",
    readTime: 7,
    published: true,
    tags: ["ai", "score", "analysis"]
  }
];

const populateData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await FAQ.deleteMany({});
    await Article.deleteMany({});
    
    // Insert sample data
    await FAQ.insertMany(sampleFAQs);
    await Article.insertMany(sampleArticles);
    
    console.log('Sample data populated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error populating data:', error);
    process.exit(1);
  }
};

populateData();