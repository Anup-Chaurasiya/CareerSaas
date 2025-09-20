const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF text extraction error:', error);
    return ''; // Return empty string if extraction fails
  }
};

// Extract text from DOCX
const extractTextFromDOCX = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX text extraction error:', error);
    return ''; // Return empty string if extraction fails
  }
};

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX
};