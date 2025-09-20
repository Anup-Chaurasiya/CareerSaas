const { GoogleGenerativeAI } = require("@google/generative-ai");

class InterviewService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.modelName = process.env.AI_MODEL || 'gemini-2.5-flash';
  }

  async generateInterviewQuestions(resumeText, jobTitle, company, industry) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      });

      const prompt = `
As an experienced hiring manager and interview coach, generate relevant interview questions based on the resume and job details below.

JOB INFORMATION:
- Position: ${jobTitle}
- Company: ${company || 'Unknown'}
- Industry: ${industry || 'Not specified'}

RESUME CONTENT:
${resumeText.substring(0, 15000)}

Generate 15-20 interview questions covering:
1. Technical questions specific to the role and skills mentioned
2. Behavioral questions based on work experience
3. Cultural fit questions for the industry
4. Situational questions relevant to the position
5. Leadership questions if applicable

For each question, include:
- Category (technical, behavioral, cultural, situational, leadership)
- Difficulty level (easy, medium, hard)
- A brief suggested answer approach

Return in JSON format:
{
  "questions": [
    {
      "question": "string",
      "category": "technical|behavioral|cultural|situational|leadership",
      "difficulty": "easy|medium|hard",
      "suggestedAnswer": "string"
    }
  ],
  "feedback": {
    "overallScore": number,
    "strengths": ["string"],
    "improvements": ["string"],
    "tips": ["string"]
  }
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      const cleanResponse = responseText.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Interview questions generation error:', error);
      throw new Error('Failed to generate interview questions: ' + error.message);
    }
  }

  async evaluateAnswer(question, userAnswer, resumeText) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 500
        }
      });

      const prompt = `
Evaluate this interview answer and provide constructive feedback.

QUESTION: ${question}

USER'S ANSWER: ${userAnswer}

RELEVANT RESUME CONTEXT: ${resumeText.substring(0, 5000)}

Provide evaluation in JSON format:
{
  "rating": number (1-5),
  "feedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "betterAnswerExample": "string"
}

Be constructive, specific, and helpful. Focus on both content and delivery.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      const cleanResponse = responseText.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Answer evaluation error:', error);
      throw new Error('Failed to evaluate answer: ' + error.message);
    }
  }
}

module.exports = new InterviewService();