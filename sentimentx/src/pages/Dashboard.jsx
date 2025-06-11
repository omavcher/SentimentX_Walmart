import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import * as XLSX from 'xlsx';
import '../styles/Dashboard.css';
import { FaRegSmile, FaChartLine, FaRegChartBar, FaFileExcel } from "react-icons/fa";
import { CiFaceFrown, CiFaceMeh } from "react-icons/ci";
import { VscOpenPreview } from "react-icons/vsc";
import { BsGraphUp, BsListUl } from "react-icons/bs";

const COLORS = {
  Positive: '#10B981',
  Negative: '#EF4444',
  Neutral: '#6B7280',
  Joy: '#F59E0B',
  Satisfaction: '#3B82F6',
  'Software Update': '#8B5CF6',
  'Product Features': '#EC4899'
};

const Dashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  // Calculate aggregate data
  const aggregateData = feedbackData.reduce((acc, feedback) => {
    const sentiment = feedback.analysis.sentiment;
    acc.sentimentCounts[sentiment] = (acc.sentimentCounts[sentiment] || 0) + 1;
    
    feedback.analysis.emotions.forEach(emotion => {
      acc.emotionTotals[emotion.name] = (acc.emotionTotals[emotion.name] || 0) + emotion.value;
    });
    
    feedback.analysis.topics.forEach(topic => {
      acc.topicTotals[topic.name] = (acc.topicTotals[topic.name] || 0) + topic.value;
    });
    
    return acc;
  }, {
    sentimentCounts: {},
    emotionTotals: {},
    topicTotals: {},
    totalFeedbacks: feedbackData.length
  });

  // Prepare chart data
  const sentimentData = Object.entries(aggregateData.sentimentCounts).map(([name, count]) => ({
    name,
    value: (count / aggregateData.totalFeedbacks) * 100,
    count,
    color: COLORS[name]
  }));

  const emotionData = Object.entries(aggregateData.emotionTotals).map(([name, total]) => ({
    name,
    value: total / feedbackData.length,
    fill: COLORS[name] || '#8884d8'
  }));

  const topicData = Object.entries(aggregateData.topicTotals).map(([name, total]) => ({
    name,
    value: total / feedbackData.length,
    fill: COLORS[name] || '#8884d8'
  }));

  const keywordData = feedbackData.reduce((acc, feedback) => {
    feedback.analysis.keywords.forEach(keyword => {
      const existing = acc.find(item => item.name === keyword);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: keyword, value: 1 });
      }
    });
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 10);

  const exportToExcel = () => {
    setExporting(true);
    
    try {
      // Prepare data for export
      const exportData = feedbackData.map(feedback => ({
        'User': feedback.user,
        'Date': new Date(feedback.date).toLocaleDateString(),
        'Feedback': feedback.feedback,
        'Sentiment': feedback.analysis.sentiment,
        'Confidence (%)': Math.round(feedback.analysis.confidence * 100),
        'Summary': feedback.analysis.summary,
        'Keywords': feedback.analysis.keywords.join(', '),
        'Emotions': feedback.analysis.emotions.map(e => `${e.name}: ${e.value}%`).join(', '),
        'Topics': feedback.analysis.topics.map(t => `${t.name}: ${t.value}%`).join(', ')
      }));

      // Create summary sheet
      const summaryData = [
        ['Feedback Analysis Report', '', `Generated: ${new Date().toLocaleString()}`],
        [],
        ['Summary Metrics', 'Value'],
        ['Total Feedback', feedbackData.length],
        ['Positive Feedback', `${sentimentData.find(s => s.name === 'Positive')?.value.toFixed(1) || 0}%`],
        ['Negative Feedback', `${sentimentData.find(s => s.name === 'Negative')?.value.toFixed(1) || 0}%`],
        ['Neutral Feedback', `${sentimentData.find(s => s.name === 'Neutral')?.value.toFixed(1) || 0}%`],
        [],
        ['Top Keywords', 'Frequency'],
        ...keywordData.map(k => [k.name, k.value]),
        [],
        ['Average Emotion Scores', 'Value (%)'],
        ...emotionData.map(e => [e.name, e.value.toFixed(1)]),
        [],
        ['Average Topic Relevance', 'Value (%)'],
        ...topicData.map(t => [t.name, t.value.toFixed(1)])
      ];

      // Create workbook with multiple sheets
      const wb = XLSX.utils.book_new();
      
      // Add main data sheet with styling
      const wsData = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, wsData, "Feedback Data");
      
      // Add summary sheet with styling
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
      
      // Generate file and trigger download
      const fileName = `Feedback_Analysis_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Feedback Analysis Dashboard</h1>
            <p className="subtitle">Detailed insights from customer feedback</p>
          </div>
          <button 
            className="export-btn" 
            onClick={exportToExcel}
            disabled={exporting || feedbackData.length === 0}
          >
            <FaFileExcel /> 
            {exporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <VscOpenPreview />
            </div>
            <div>
              <h3>Total Reviews</h3>
              <p className="stat-value">{feedbackData.length}</p>
            </div>
          </div>
          
          {sentimentData.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.name === 'Positive' && <FaRegSmile />}
                {stat.name === 'Negative' && <CiFaceFrown />}
                {stat.name === 'Neutral' && <CiFaceMeh />}
              </div>
              <div>
                <h3>{stat.name}</h3>
                <p className="stat-value">{stat.value.toFixed(1)}%</p>
                <p className="stat-detail">{stat.count} reviews</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="dashboard-grid">
          <div className="card">
            <h2><FaChartLine /> Sentiment Distribution</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="card">
            <h2><BsGraphUp /> Emotion Analysis</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={emotionData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Emotions"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <div className="card">
            <h2><FaRegChartBar /> Topic Relevance</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topicData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Relevance']} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Relevance Score">
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="card">
            <h2><BsListUl /> Top Keywords</h2>
            <div className="keyword-cloud">
              {keywordData.length > 0 ? (
                keywordData.map((keyword, index) => {
                  const size = 12 + (keyword.value * 2);
                  return (
                    <span
                      key={index}
                      className="keyword"
                      style={{
                        fontSize: `${size}px`,
                        backgroundColor: `rgba(16, 185, 129, ${0.1 + (keyword.value / keywordData[0].value) * 0.5})`
                      }}
                    >
                      {keyword.name} ({keyword.value})
                    </span>
                  );
                })
              ) : (
                <p>No keywords found</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2>Recent Feedback</h2>
          <div className="reviews-list">
            {feedbackData.slice(0, 5).map(review => (
              <div
                key={review._id}
                className={`review-item ${selectedReview?._id === review._id ? 'selected' : ''}`}
                onClick={() => setSelectedReview(review)}
              >
                <div className="review-content">
                  <p className="review-text">{review.feedback}</p>
                  <div className="review-meta">
                    <span className={`sentiment-tag ${review.analysis.sentiment.toLowerCase()}`}>
                      {review.analysis.sentiment} ({Math.round(review.analysis.confidence * 100)}% confidence)
                    </span>
                    <span className="review-user">{review.user}</span>
                    <span className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedReview && (
          <div className="card detailed-review">
            <h2>Detailed Analysis</h2>
            <div className="detailed-content">
              <div className="review-summary">
                <h3>Summary</h3>
                <p>{selectedReview.analysis.summary}</p>
                
                <div className="metrics-grid">
                  <div className="metric">
                    <h4>Sentiment</h4>
                    <div className="metric-value">
                      <span className={`sentiment-tag ${selectedReview.analysis.sentiment.toLowerCase()}`}>
                        {selectedReview.analysis.sentiment}
                      </span>
                      <span>({Math.round(selectedReview.analysis.confidence * 100)}% confidence)</span>
                    </div>
                  </div>
                  
                  <div className="metric">
                    <h4>Keywords</h4>
                    <div className="keyword-list">
                      {selectedReview.analysis.keywords.map((keyword, i) => (
                        <span key={i} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="analysis-charts">
                <div className="chart-container">
                  <h3>Emotion Scores</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={selectedReview.analysis.emotions}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      <Bar dataKey="value" name="Score">
                        {selectedReview.analysis.emotions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                  <h3>Topic Relevance</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={selectedReview.analysis.topics}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Relevance']} />
                      <Bar dataKey="value" name="Relevance">
                        {selectedReview.analysis.topics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;