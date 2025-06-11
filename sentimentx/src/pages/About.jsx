import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="container">
        <div className="card">
          <h1 className="mb-3">About SentimentX</h1>
          <p className="mb-4">
            SentimentX is an AI-powered sentiment analysis tool designed to help businesses 
            understand customer feedback at scale. Our platform analyzes reviews, surveys, 
            and social media comments to provide actionable insights.
          </p>
          
          <h2 className="mb-3">Our Mission</h2>
          <p className="mb-4">
            We believe that every piece of customer feedback contains valuable insights. 
            Our mission is to make these insights accessible to businesses of all sizes, 
            helping them improve customer satisfaction and make data-driven decisions.
          </p>
          
          <h2 className="mb-3">How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Natural Language Processing</h3>
              <p>
                Our advanced NLP algorithms understand the context and nuances in customer feedback.
              </p>
            </div>
            <div className="step">
              <h3>2. Sentiment Analysis</h3>
              <p>
                We classify feedback into positive, negative, and neutral sentiments with high accuracy.
              </p>
            </div>
            <div className="step">
              <h3>3. Actionable Insights</h3>
              <p>
                Get clear, actionable recommendations to improve your products and services.
              </p>
            </div>
          </div>
          
          <h2 className="mb-3">Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="avatar">OA</div>
              <h3>Om Avchar</h3>
              <p>Founder & Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;