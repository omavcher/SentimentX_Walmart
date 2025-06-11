const Feedback = require('../models/Feedback');
const { analyzeSentiment } = require('../utils/gemini');

// Create multiple feedback entries with analysis
exports.createFeedback = async (req, res) => {
  try {
    const { feedbacks } = req.body;
    
    if (!Array.isArray(feedbacks)) {
      return res.status(400).json({ message: 'Feedbacks must be an array' });
    }

    // Process all feedbacks in parallel
    const analyzedFeedbacks = await Promise.all(
      feedbacks.map(async (feedback) => {
        // Get sentiment analysis from Gemini
        const analysis = await analyzeSentiment(feedback.feedback);
        
        // Create new feedback document
        const newFeedback = new Feedback({
          user: feedback.user,
          feedback: feedback.feedback,
          date: feedback.date || new Date(),
          analysis
        });
        
        return newFeedback.save();
      })
    );
    
    res.status(201).json(analyzedFeedbacks);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Error creating feedback' });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ date: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

// Get aggregate analysis
exports.getAggregateAnalysis = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    
    const sentimentCounts = feedback.reduce((acc, { analysis }) => {
      acc[analysis.sentiment] = (acc[analysis.sentiment] || 0) + 1;
      return acc;
    }, {});

    const averageConfidence = feedback.reduce((sum, { analysis }) => 
      sum + analysis.confidence, 0) / feedback.length;

    const allKeywords = feedback.flatMap(({ analysis }) => analysis.keywords);
    const keywordCounts = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {});

    const mostCommonKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword]) => keyword);

    res.json({
      totalFeedbacks: feedback.length,
      sentimentDistribution: sentimentCounts,
      averageConfidence,
      mostCommonKeywords
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting aggregate analysis' });
  }
}; 