import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Mic, Sparkles } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container animate-fade-in">
      <nav className="landing-nav flex-between">
        <div className="logo flex-center">
          <Bot size={28} className="text-gradient" />
          <span className="logo-text">InterviewAI</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Dashboard
        </button>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <div className="badge glass-panel">
            <Sparkles size={16} className="text-gradient" />
            <span>AI-Powered Interview Practice</span>
          </div>
          
          <h1 className="hero-title">
            Practice Interviews. <br />
            <span className="text-gradient">Build Confidence.</span>
          </h1>
          
          <p className="hero-subtitle">
            Face a realistic AI interviewer, practice your answers, and get personalized feedback after every interview. You're interacting with an advanced AI designed to help you succeed.
          </p>

          <div className="hero-actions">
            <button onClick={() => navigate('/setup')} className="btn-primary btn-large">
              Start Mock Interview
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card glass-panel">
              <div className="step-number">1</div>
              <h3>Choose Your Interview</h3>
              <p>Select your job role, experience level, and interview type.</p>
            </div>
            <div className="step-card glass-panel">
              <div className="step-number">2</div>
              <h3>Talk to Your AI Interviewer</h3>
              <p>Answer questions using your microphone in a realistic simulation.</p>
            </div>
            <div className="step-card glass-panel">
              <div className="step-number">3</div>
              <h3>Get Personalized Feedback</h3>
              <p>Receive actionable insights on how to improve your answers.</p>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="avatar-preview-container animate-pulse-glow">
            <img src="/avatar.png" alt="AI Interviewer" className="avatar-preview" />
            <div className="recording-indicator glass-panel">
              <Mic size={16} />
              Listening...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
