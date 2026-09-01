import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, RotateCcw, Home, Star } from 'lucide-react';
import './Results.css';

export default function Results() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('interviewResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmitFeedback = () => {
    alert("Thank you for your feedback!");
    navigate('/dashboard');
  };

  if (!results) {
    return <div className="results-container flex-center"><h2>Loading results...</h2></div>;
  }

  return (
    <div className="results-container animate-fade-in">
      <header className="results-header">
        <h1>Your Interview Results</h1>
        <p className="subtitle">AI-generated interview feedback based on your responses.</p>
      </header>

      <main className="results-main">
        {/* Score Overview */}
        <section className="score-section glass-panel">
          <div className="overall-score">
            <div className="score-circle">
              <span className="score-number">{results.overallScore}</span>
              <span className="score-total">/100</span>
            </div>
            <h3>Overall Score</h3>
          </div>
          
          <div className="category-scores">
            {results.categories.map((cat, idx) => (
              <div key={idx} className="category-row">
                <span className="category-name">{cat.name}</span>
                <div className="category-bar-bg">
                  <div 
                    className="category-bar-fill"
                    style={{ width: `${cat.score}%`, backgroundColor: cat.score >= 80 ? 'var(--success)' : cat.score >= 70 ? 'var(--warning)' : 'var(--error)' }}
                  ></div>
                </div>
                <span className="category-value">{cat.score}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths & Improvements */}
        <div className="feedback-grid">
          <section className="feedback-card glass-panel">
            <div className="card-header">
              <CheckCircle2 className="icon-success" />
              <h3>Top Strengths</h3>
            </div>
            <ul className="feedback-list">
              {results.strengths.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="feedback-card glass-panel">
            <div className="card-header">
              <AlertTriangle className="icon-warning" />
              <h3>Areas to Improve</h3>
            </div>
            <ul className="feedback-list">
              {results.improvements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <div className="actionable-tip">
              <strong>Tip:</strong> Try structuring behavioral answers using the STAR method: Situation → Task → Action → Result.
            </div>
          </section>
        </div>

        {/* Answer Improvement */}
        <section className="improvement-section glass-panel">
          <div className="card-header">
            <TrendingUp className="icon-accent" />
            <h3>Answer Improvement</h3>
          </div>
          <div className="example-block">
            <div className="question-box">
              <strong>Q: </strong>{results.example.question}
            </div>
            <div className="answers-comparison">
              <div className="answer-card your-answer">
                <h4>Your Answer</h4>
                <p>"{results.example.yourAnswer}"</p>
              </div>
              <div className="answer-card improved-answer">
                <h4>How You Could Improve It</h4>
                <p>"{results.example.improvedAnswer}"</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Validation */}
        <section className="validation-section glass-panel">
          <h3>How useful was this mock interview?</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                className={`star-btn ${rating >= star ? 'active' : ''}`}
                onClick={() => handleRating(star)}
              >
                <Star fill={rating >= star ? 'currentColor' : 'none'} size={32} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="feedback-form animate-fade-in">
              <textarea 
                placeholder="What would make this experience better?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="input-field textarea"
                rows={3}
              ></textarea>
              <button onClick={handleSubmitFeedback} className="btn-primary">
                Submit & Continue
              </button>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="actions-section">
          <button onClick={() => navigate('/setup')} className="btn-primary">
            <RotateCcw size={18} />
            Practice Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            <Home size={18} />
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
