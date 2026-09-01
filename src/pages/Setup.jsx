import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Play, ArrowLeft, Key } from 'lucide-react';
import './Setup.css';

export default function Setup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobRole: 'Software Developer',
    experience: 'Student / Fresher',
    interviewType: 'HR / Behavioral',
    difficulty: 'Intermediate'
  });

  // No longer loading apiKey from localStorage since we use .env
  useEffect(() => {
    // Load previously saved settings if they exist
    const savedSettings = JSON.parse(localStorage.getItem('interviewSettings') || '{}');
    if (savedSettings.jobRole) {
      setFormData(prev => ({ ...prev, ...savedSettings }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStart = (e) => {
    e.preventDefault();
    // Save settings to localStorage
    localStorage.setItem('interviewSettings', JSON.stringify(formData));
    navigate('/interview');
  };

  return (
    <div className="setup-container animate-fade-in">
      <nav className="top-nav">
        <button onClick={() => navigate(-1)} className="btn-icon" style={{ background: '#e5e7eb', color: '#111827', border: 'none' }}>
          <ArrowLeft size={20} color="#111827" />
        </button>
      </nav>

      <main className="setup-main">
        <div className="setup-card glass-panel">
          <div className="setup-header">
            <div className="icon-wrapper">
              <Settings size={24} className="text-gradient" />
            </div>
            <h2>Configure Your Interview</h2>
            <p>Customize the mock interview parameters to best match your upcoming real interview.</p>
          </div>

          <form onSubmit={handleStart} className="setup-form">
            <div className="input-group">
              <label className="input-label">Job Role</label>
              <select name="jobRole" className="input-field" value={formData.jobRole} onChange={handleChange}>
                <option>Software Developer</option>
                <option>Data Analyst</option>
                <option>Product Manager</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Other</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Experience Level</label>
              <select name="experience" className="input-field" value={formData.experience} onChange={handleChange}>
                <option>Student / Fresher</option>
                <option>0–2 years</option>
                <option>2–5 years</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Interview Type</label>
              <select name="interviewType" className="input-field" value={formData.interviewType} onChange={handleChange}>
                <option>HR / Behavioral</option>
                <option>Technical</option>
                <option>General</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Difficulty</label>
              <select name="difficulty" className="input-field" value={formData.difficulty} onChange={handleChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary w-full">
                <Play size={18} fill="currentColor" />
                Start Interview Now
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
