import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, History, Trophy, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentInterview, setRecentInterview] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    if (history.length > 0) {
      setRecentInterview(history[0]);
    }
  }, []);

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div className="header-content flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/')} className="btn-icon" style={{ background: '#e5e7eb', color: '#111827', border: 'none' }} title="Back to Home">
              <ArrowLeft size={20} color="#111827" />
            </button>
            <div>
              <h1>Welcome back!</h1>
              <p className="subtitle">Ready for your next interview?</p>
            </div>
          </div>
          <button onClick={() => navigate('/setup')} className="btn-primary">
            <Plus size={20} />
            New Interview
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Quick Start Card */}
          <div className="dashboard-card primary-card glass-panel">
            <div className="card-icon">
              <Trophy size={28} className="text-gradient" />
            </div>
            <h2>Practice Makes Perfect</h2>
            <p>Your confidence score improved by 15% in your last session. Keep the momentum going!</p>
            <button onClick={() => navigate('/setup')} className="btn-primary mt-4">
              Practice Again
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card glass-panel">
            <div className="card-header flex-between">
              <h3 className="flex-center gap-2">
                <History size={20} className="text-accent" />
                Recent Interview
              </h3>
            </div>
            
            {recentInterview ? (
              <div className="recent-interview-details mt-4">
                <div className="detail-row flex-between">
                  <span className="label">Role</span>
                  <span className="value">{recentInterview.role}</span>
                </div>
                <div className="detail-row flex-between">
                  <span className="label">Type</span>
                  <span className="value">{recentInterview.type}</span>
                </div>
                <div className="detail-row flex-between">
                  <span className="label">Date</span>
                  <span className="value flex-center gap-1"><Clock size={14}/> {recentInterview.date}</span>
                </div>
                
                <div className="score-display mt-4">
                  <div className="score-value">{recentInterview.score}<span className="text-sm">/100</span></div>
                  <button onClick={() => navigate('/results')} className="btn-secondary btn-sm">
                    View Results
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-center flex-col mt-4" style={{ height: '100%', color: 'var(--text-secondary)' }}>
                <p>No recent interviews.</p>
                <p>Start your first session to see results!</p>
              </div>
            )}
          </div>
        </div>

        {/* Previous History list could go here for v2 */}
      </main>
    </div>
  );
}
