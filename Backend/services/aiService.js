const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.modelName = process.env.AI_MODEL || 'gemini-pro';
  }

  async analyzeResume(resumeText, jobTitle = '', company = '', industry = '') {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
          responseMimeType: "application/json"
        }
      });

      let prompt = `You are a professional career coach and resume reviewer. `;
      
      if (jobTitle) {
        prompt += `Analyze this resume specifically for a ${jobTitle} position`;
        if (company) prompt += ` at ${company}`;
        if (industry) prompt += ` in the ${industry} industry`;
        prompt += `. `;
      } else {
        prompt += `Analyze the given resume text and provide actionable feedback. `;
      }

      prompt += `
Resume text: ${resumeText.substring(0, 28000)}

Provide output in JSON format only with this structure:
{
  "summary": "A concise 2-3 sentence professional summary.",
  "strengths": [
    {"title": "Skill/Section Name", "detail": "Why this is strong."},
    ...
  ],
  "weaknesses": [
    {"title": "Skill/Section Name", "detail": "Why this needs improvement."},
    ...
  ],
  "suggestions": [
    {"title": "Actionable Advice", "detail": "Exactly what to add, remove, or improve."},
    ...
  ],
  "keywords": ["List", "of", "important", "skills", "or", "keywords"],
  "jobSpecificAdvice": "${jobTitle ? 'Advice specific to ' + jobTitle : 'General career advice'}"
}

Instructions:
1. Be professional and concise.
2. Include 5–7 strengths, 5–7 weaknesses, 5–10 suggestions.
3. ${jobTitle ? 'Focus on requirements for ' + jobTitle + ' positions.' : 'Provide general resume advice.'}
4. Output strictly in JSON format.
5. Make suggestions actionable.
6. Include ATS keywords.
7. Focus on impact and relevance.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      const cleanResponse = responseText.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('AI analysis failed: ' + error.message);
    }
  }
}

module.exports = new AIService();