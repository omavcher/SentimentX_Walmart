import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">SentimentX</h1>
          <p className="hero-subtitle">
            Transform customer feedback into actionable insights with AI-powered sentiment analysis
          </p>
          <div className="hero-buttons">
            <Link to="/analyze" className="btn btn-primary">
              Analyze Now
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/demo" className="btn btn-outline">
              See Demo
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/walmart.png" alt="SentimentX Dashboard Preview" />
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <span className="section-subtitle">Why Choose SentimentX</span>
          <h2 className="section-title">Unlock Powerful Insights</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
              </svg>
            </div>
            <h3 className="feature-title">Sentiment Analysis</h3>
            <p className="feature-description">
              Automatically detect emotions and categorize feedback into positive, negative, and neutral sentiments with 95% accuracy
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="feature-title">Trend Analytics</h3>
            <p className="feature-description">
              Track sentiment trends over time with interactive dashboards and customizable reports
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-14.536-1.586z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="feature-title">AI Recommendations</h3>
            <p className="feature-description">
              Get actionable suggestions for improving customer satisfaction based on feedback patterns
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <span className="section-subtitle">Simple Integration</span>
          <h2 className="section-title">How It Works</h2>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="step-title">Upload Data</h3>
            <p className="step-description">Connect your review sources or upload CSV files</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="step-title">AI Processing</h3>
            <p className="step-description">Our algorithms analyze sentiment and extract key themes</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
            </div>
            <h3 className="step-title">Get Insights</h3>
            <p className="step-description">View comprehensive reports and actionable recommendations</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-header">
          <span className="section-subtitle">Trusted by Businesses</span>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              "SentimentX transformed how we understand customer feedback. The insights helped us improve our NPS score by 20 points in just 3 months."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <div className="author-name">Jane Doe</div>
                <div className="author-title">CX Director, RetailCo</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              "The AI recommendations are spot-on. We implemented suggested changes and saw a 15% increase in positive reviews within weeks."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <div className="author-name">John Smith</div>
                <div className="author-title">Product Manager, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Customer Experience?</h2>
          <p className="cta-description">
            Join hundreds of businesses using SentimentX to make data-driven decisions
          </p>
          <div className="cta-buttons">
            <Link to="/analyze" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/demo" className="btn btn-outline">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;