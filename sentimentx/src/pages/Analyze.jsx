import React, { useState } from 'react';
import { FiUpload, FiFileText, FiAlertCircle, FiCheckCircle, FiBarChart2, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import '../styles/Analyze.css';

const Analyze = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('text');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType === 'txt' || fileType === 'json' || fileType === 'csv') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError('');
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setText(event.target.result);
        };
        reader.readAsText(selectedFile);
      } else {
        setError('Please upload a .txt, .json, or .csv file');
        setFile(null);
        setFileName('');
      }
    }
  };

  const parseFeedback = (text) => {
    try {
      // Try parsing as JSON first
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        const jsonData = JSON.parse(text);
        if (Array.isArray(jsonData)) {
          return jsonData.map(item => ({
            user: item.User || 'Anonymous',
            feedback: item.Feedback,
            date: item.Date || new Date().toISOString()
          }));
        }
      }

      // Try parsing as CSV
      if (text.includes(',') && text.includes('\n')) {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const userIndex = headers.findIndex(h => h.toLowerCase() === 'user');
        const feedbackIndex = headers.findIndex(h => h.toLowerCase() === 'feedback');
        const dateIndex = headers.findIndex(h => h.toLowerCase() === 'date');

        if (userIndex === -1 || feedbackIndex === -1) {
          throw new Error('CSV must contain User and Feedback columns');
        }

        return lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return {
            user: values[userIndex] || 'Anonymous',
            feedback: values[feedbackIndex],
            date: values[dateIndex] || new Date().toISOString()
          };
        });
      }

      // Try parsing as structured text
      const regex = /{\s*User:\s*(.*?)\s*,\s*Feedback:\s*(.*?)\s*(?:,\s*Date:\s*(.*?)\s*)?}/g;
      const feedbacks = [];
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        feedbacks.push({
          user: match[1]?.trim() || 'Anonymous',
          feedback: match[2]?.trim(),
          date: match[3]?.trim() || new Date().toISOString()
        });
      }

      if (feedbacks.length === 0) {
        throw new Error('No valid feedback found. Please use JSON, CSV, or structured text format');
      }

      return feedbacks;
    } catch (error) {
      throw new Error(`Failed to parse feedback: ${error.message}`);
    }
  };

  const calculateAggregateAnalysis = (feedbacks) => {
    const totalFeedbacks = feedbacks.length;
    const sentimentDistribution = {
      Positive: 0,
      Negative: 0,
      Neutral: 0
    };
    
    let totalConfidence = 0;
    const keywordMap = {};
    const emotionMap = {};
    const topicMap = {};

    feedbacks.forEach(feedback => {
      // Sentiment distribution
      sentimentDistribution[feedback.analysis.sentiment]++;
      totalConfidence += feedback.analysis.confidence;

      // Keywords
      feedback.analysis.keywords.forEach(keyword => {
        keywordMap[keyword] = (keywordMap[keyword] || 0) + 1;
      });

      // Emotions
      feedback.analysis.emotions.forEach(emotion => {
        emotionMap[emotion.name] = (emotionMap[emotion.name] || 0) + emotion.value;
      });

      // Topics
      feedback.analysis.topics.forEach(topic => {
        topicMap[topic.name] = (topicMap[topic.name] || 0) + topic.value;
      });
    });

    const mostCommonKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword]) => keyword);

    const dominantEmotion = Object.entries(emotionMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    const prevalentTopics = Object.entries(topicMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);

    return {
      totalFeedbacks,
      sentimentDistribution,
      averageConfidence: totalConfidence / totalFeedbacks,
      mostCommonKeywords,
      dominantEmotion,
      prevalentTopics
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (activeTab === 'text' && !text.trim()) {
      setError('Please enter some text to analyze');
      setIsLoading(false);
      return;
    }
    
    if (activeTab === 'file' && !file) {
      setError('Please upload a file to analyze');
      setIsLoading(false);
      return;
    }

    try {
      const feedbacks = parseFeedback(text);
      
      if (feedbacks.length === 0) {
        setError('No valid feedback found. Please use JSON, CSV, or structured text format');
        setIsLoading(false);
        return;
      }

      // Send feedbacks to backend
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbacks }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze feedback');
      }

      const analyzedFeedbacks = await response.json();
      
      // Calculate aggregate analysis from response
      const aggregateResults = calculateAggregateAnalysis(analyzedFeedbacks);

      setAnalysis({
        individualResults: analyzedFeedbacks,
        aggregateResults
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to analyze feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setText('');
    setFile(null);
    setFileName('');
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="analyze-container">
      <div className="container">
        <h1 className="text-center mb-3">Analyze Customer Feedback</h1>
        <p className="text-center mb-5">Get detailed sentiment analysis from structured feedback</p>
        
        <div className="tabs mb-4">
          <button
            className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            <FiFileText className="icon" /> Text Analysis
          </button>
          <button
            className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            <FiUpload className="icon" /> File Upload
          </button>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            {activeTab === 'text' ? (
              <div className="input-group">
                <label htmlFor="feedback-text">Enter Customer Feedback</label>
                <textarea
                  id="feedback-text"
                  rows="8"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Enter feedback in any of these formats:

1. JSON Format:
[
  {
    "User": "Name",
    "Feedback": "Text",
    "Date": "YYYY-MM-DD"
  }
]

2. CSV Format:
User,Feedback,Date
Name,Text,YYYY-MM-DD

3. Structured Text:
{ User: Name, Feedback: Text, Date: YYYY-MM-DD }`}
                />
              </div>
            ) : (
              <div className="file-upload-container">
                <label htmlFor="file-upload" className="file-upload-label">
                  <FiUpload className="upload-icon" />
                  <span>{fileName || 'Choose a .txt, .json, or .csv file to upload'}</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.json,.csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {fileName && (
                  <div className="file-preview">
                    <FiFileText className="file-icon" />
                    <span>{fileName}</span>
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <FiAlertCircle className="error-icon" /> {error}
              </div>
            )}
            
            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Feedback'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        
        {analysis && (
          <div className="results-container fade-in">
            <div className="card">
              <h2 className="mb-4">Aggregate Analysis Results</h2>
              
              <div className="results-summary">
                <div className="summary-box">
                  <h3>Overview</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{analysis.aggregateResults.totalFeedbacks}</div>
                      <div className="stat-label">Total Feedbacks</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{(analysis.aggregateResults.averageConfidence * 100).toFixed(1)}%</div>
                      <div className="stat-label">Average Confidence</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{analysis.aggregateResults.sentimentDistribution.Positive}</div>
                      <div className="stat-label">Positive</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{analysis.aggregateResults.sentimentDistribution.Negative}</div>
                      <div className="stat-label">Negative</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{analysis.aggregateResults.sentimentDistribution.Neutral}</div>
                      <div className="stat-label">Neutral</div>
                    </div>
                  </div>
                </div>
                
                <div className="sentiment-distribution">
                  <h3>Sentiment Distribution</h3>
                  <div className="sentiment-bars">
                    {Object.entries(analysis.aggregateResults.sentimentDistribution).map(([sentiment, count]) => (
                      <div key={sentiment} className="sentiment-bar-item">
                        <div className="sentiment-label">{sentiment}</div>
                        <div className="sentiment-bar-container">
                          <div 
                            className={`sentiment-bar ${sentiment.toLowerCase()}`}
                            style={{
                              width: `${(count / analysis.aggregateResults.totalFeedbacks) * 100}%`
                            }}
                          ></div>
                          <div className="sentiment-count">{count} ({Math.round((count / analysis.aggregateResults.totalFeedbacks) * 100)}%)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="results-details">
                <div className="detail-card">
                  <h3>Most Common Keywords</h3>
                  <div className="keywords-container">
                    {analysis.aggregateResults.mostCommonKeywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="detail-card">
                  <h3>Dominant Emotion</h3>
                  <div className="dominant-emotion">
                    <div className={`emotion-badge ${analysis.aggregateResults.dominantEmotion.toLowerCase()}`}>
                      {analysis.aggregateResults.dominantEmotion}
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <h3>Prevalent Topics</h3>
                  <ul className="topics-list">
                    {analysis.aggregateResults.prevalentTopics.map((topic, index) => (
                      <li key={index} className="topic-item">
                        <FiMessageSquare className="topic-icon" /> {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h2 className="mb-4">Individual Feedback Analysis</h2>
              <div className="feedback-list">
                {analysis.individualResults.map((feedback) => (
                  <div key={feedback._id} className="feedback-item">
                    <div className="feedback-header">
                      <div className="user-info">
                        <FiUser className="icon" /> {feedback.user}
                      </div>
                      <div className="feedback-date">
                        <FiCalendar className="icon" /> 
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="feedback-content">
                      <p className="feedback-text">{feedback.feedback}</p>
                      <div className={`sentiment-badge ${feedback.analysis.sentiment.toLowerCase()}`}>
                        {feedback.analysis.sentiment} ({(feedback.analysis.confidence * 100).toFixed(1)}%)
                      </div>
                    </div>
                    
                    <div className="feedback-analysis">
                      <div className="analysis-section">
                        <h4>Summary</h4>
                        <p>{feedback.analysis.summary}</p>
                      </div>
                      
                      <div className="analysis-section">
                        <h4>Keywords</h4>
                        <div className="keywords-container">
                          {feedback.analysis.keywords.map((keyword, idx) => (
                            <span key={idx} className="keyword-tag">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="analysis-section">
                        <h4>Emotions</h4>
                        <div className="emotions-container">
                          {feedback.analysis.emotions.map((emotion) => (
                            <div key={emotion._id} className="emotion-item">
                              <span className="emotion-name">{emotion.name}</span>
                              <div className="emotion-bar-container">
                                <div 
                                  className="emotion-bar"
                                  style={{ width: `${emotion.value}%` }}
                                ></div>
                                <span className="emotion-value">{emotion.value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="analysis-section">
                        <h4>Topics</h4>
                        <div className="topics-container">
                          {feedback.analysis.topics.map((topic) => (
                            <div key={topic._id} className="topic-item">
                              <span className="topic-name">{topic.name}</span>
                              <div className="topic-bar-container">
                                <div 
                                  className="topic-bar"
                                  style={{ width: `${topic.value}%` }}
                                ></div>
                                <span className="topic-value">{topic.value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h2 className="mb-3">Suggested Actions</h2>
              <div className="suggestions-list">
                {analysis.aggregateResults.sentimentDistribution.Positive > 
                 analysis.aggregateResults.sentimentDistribution.Negative ? (
                  <>
                    <div className="suggestion-item positive">
                      <FiCheckCircle className="suggestion-icon" />
                      <span>Continue enhancing user experience and interface design</span>
                    </div>
                    <div className="suggestion-item positive">
                      <FiCheckCircle className="suggestion-icon" />
                      <span>Promote positive feedback in marketing campaigns</span>
                    </div>
                  </>
                ) : analysis.aggregateResults.sentimentDistribution.Negative > 
                   analysis.aggregateResults.sentimentDistribution.Positive ? (
                  <>
                    <div className="suggestion-item negative">
                      <FiAlertCircle className="suggestion-icon" />
                      <span>Investigate and fix mobile responsiveness issues</span>
                    </div>
                    <div className="suggestion-item negative">
                      <FiAlertCircle className="suggestion-icon" />
                      <span>Improve loading speed and onboarding process</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="suggestion-item neutral">
                      <FiBarChart2 className="suggestion-icon" />
                      <span>Balance feature enhancements with performance improvements</span>
                    </div>
                    <div className="suggestion-item neutral">
                      <FiBarChart2 className="suggestion-icon" />
                      <span>Conduct user testing to identify specific pain points</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;