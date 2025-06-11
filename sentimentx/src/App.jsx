import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">SentimentX</Link>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/analyze" className={({isActive}) => isActive ? 'active' : ''}>Analyze</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About</NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Built by Om Avchar for Walmart Sparkathon 2025</p>
          <p className="mt-1">© 2025 SentimentX. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;