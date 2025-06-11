const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeSentiment = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
    Analyze the following customer feedback and return a structured JSON response.
    
    Feedback:
    "${text}"
    
    Instructions:
    - Detect the overall sentiment as "Positive", "Negative", or "Neutral"
    - Provide a confidence score between 0.0 to 1.0
    - Extract relevant keywords (3–5 max)
    - Generate a short summary of the feedback
    - Analyze emotions (use only these labels): Joy, Anger, Satisfaction, Positive
    - Analyze topics (use only these): Technical, Stocks, Behavior
    
    Your response must follow this exact JSON format:
    
    {
      "sentiment": "Positive" | "Negative" | "Neutral",
      "confidence": 0.0 to 1.0,
      "keywords": ["keyword1", "keyword2", ...],
      "summary": "Brief summary of the feedback",
      "emotions": [
        { "name": "Joy", "value": 0-100 },
        { "name": "Anger", "value": 0-100 },
        { "name": "Satisfaction", "value": 0-100 },
        { "name": "Positive", "value": 0-100 }
      ],
      "topics": [
        { "name": "Technical", "value": 0-100 },
        { "name": "Stocks", "value": 0-100 },
        { "name": "Behavior", "value": 0-100 }
      ]
    }
    
    Only return valid JSON.
    Do not explain anything or include text outside of the JSON.
    `;
    

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Clean the response to remove Markdown code block markers
    responseText = responseText
      .replace(/```json\n/, '') // Remove opening ```json
      .replace(/```\n/, '')     // Remove closing ```
      .replace(/```/, '')       // Remove any stray backticks
      .trim();                  // Remove leading/trailing whitespace

    // Parse the cleaned response
    const analysis = JSON.parse(responseText);

    return analysis;
  } catch (error) {
    console.error('Error in Gemini API:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

module.exports = { analyzeSentiment };