const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create new feedback
router.post('/', feedbackController.createFeedback);

// Get all feedback
router.get('/', feedbackController.getAllFeedback);

// Get feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// Get aggregate analysis
router.get('/analysis/aggregate', feedbackController.getAggregateAnalysis);

module.exports = router; 