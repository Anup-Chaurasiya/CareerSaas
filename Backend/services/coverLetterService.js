const { GoogleGenerativeAI } = require("@google/generative-ai");

class CoverLetterService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.modelName = process.env.AI_MODEL || 'gemini-pro';
  }

  async generateCoverLetter(resumeText, jobTitle, company, industry, tone = 'professional', length = 'medium') {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      });

      const lengthWords = {
        'short': 150,
        'medium': 250,
        'long': 400
      };

      const prompt = `
As a professional cover letter writer, generate a compelling cover letter based on the resume below.

JOB INFORMATION:
- Position: ${jobTitle}
- Company: ${company}
- Industry: ${industry || 'Not specified'}

RESUME CONTENT:
${resumeText.substring(0, 10000)}

WRITING GUIDELINES:
- Tone: ${tone}
- Length: Approximately ${lengthWords[length]} words
- Format: Professional business letter format
- Include: Specific skills from resume, enthusiasm for the role, company research hints
- Exclude: Generic phrases, overly emotional language, spelling errors

OUTPUT REQUIREMENTS:
Return ONLY the cover letter content (no JSON, no explanations). Use placeholders like [Your Name] and [Your Phone] where appropriate.

Generate a ${tone} cover letter for ${jobTitle} at ${company}:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Cover letter generation error:', error);
      throw new Error('Failed to generate cover letter: ' + error.message);
    }
  }

  async generateMultipleVersions(resumeText, jobTitle, company, industry) {
    const tones = ['professional', 'enthusiastic', 'formal'];
    const versions = [];

    for (const tone of tones) {
      try {
        const content = await this.generateCoverLetter(
          resumeText, jobTitle, company, industry, tone, 'medium'
        );
        versions.push({ tone, content });
      } catch (error) {
        console.error(`Failed to generate ${tone} version:`, error);
      }
    }

    return versions;
  }
}

module.exports = new CoverLetterService();