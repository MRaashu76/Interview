import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, SkipForward, X, Volume2, Loader2 } from 'lucide-react';
import { SpeechService } from '../services/SpeechService';
import { generateNextQuestion, evaluateInterview } from '../services/LLMService';
import './Interview.css';

export default function Interview() {
  const navigate = useNavigate();
  
  // States
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(true); // AI is processing
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState("Preparing your interview scenario...");
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [settings, setSettings] = useState(null);

  const totalQuestions = 5;

  // Refs for services
  const speechServiceRef = useRef(null);

  // Initialize Component & Services
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('interviewSettings') || '{}');

    setSettings(savedSettings);

    // Initialize Speech Service
    speechServiceRef.current = new SpeechService(
      (final, interim) => setCurrentAnswer(prev => prev + " " + final),
      () => setIsRecording(false),
      (err) => { setIsRecording(false); console.error(err); }
    );

    // Generate Initial Question
    const startInterview = async () => {
      setIsThinking(true);
      const res = await generateNextQuestion(savedSettings, [], true);
      setIsThinking(false);
      
      if (!res.success) {
        setCurrentQuestionText(res.question);
        return; // Wait for user to retry or just display the error
      }

      const firstQ = res.question;
      setCurrentQuestionText(firstQ);
      setTranscriptHistory([{ role: 'ai', text: firstQ }]);
      speakText(firstQ);
    };

    startInterview();

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stopRecording();
        speechServiceRef.current.stopSpeaking();
      }
    };
  }, [navigate]);

  const speakText = (text) => {
    if (!speechServiceRef.current) return;
    setIsSpeaking(true);
    speechServiceRef.current.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview early?")) {
      finishInterview();
    }
  };

  const handleQuitInterview = () => {
    if (window.confirm("Are you sure you want to quit? Your progress will be lost.")) {
      navigate('/dashboard');
    }
  };

  const finishInterview = async () => {
    if (!settings || transcriptHistory.length === 0) return;
    setIsThinking(true);
    setCurrentQuestionText("Evaluating your interview...");
    
    try {
      const evaluation = await evaluateInterview(settings, transcriptHistory);
      localStorage.setItem('interviewResults', JSON.stringify(evaluation));
      
      // Save to history list
      const historyList = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
      historyList.unshift({
        role: settings.jobRole || "General",
        type: settings.interviewType || "Interview",
        score: evaluation.overallScore,
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem('interviewHistory', JSON.stringify(historyList));

      navigate('/results');
    } catch (err) {
      alert("Evaluation failed. The AI interviewer is temporarily unavailable.");
      setIsThinking(false);
    }
  };

  const submitAnswer = async (skipped = false) => {
    if (isRecording) toggleRecording();
    setIsThinking(true);
    
    const finalAnswer = skipped ? "[Candidate skipped the question]" : (currentAnswer || "[Candidate was silent]");
    const updatedHistory = [...transcriptHistory, { role: 'candidate', text: finalAnswer }];
    setTranscriptHistory(updatedHistory);
    setCurrentAnswer("");

    if (currentQuestionIndex >= totalQuestions - 1) {
      // End of interview
      const endText = "Thank you for your time today. That concludes our interview. I will now generate your feedback.";
      setCurrentQuestionText(endText);
      speakText(endText);
      setIsThinking(false);
      setTimeout(() => {
        finishInterview();
      }, 4000);
      return;
    }

    // Ask next contextual question
    const res = await generateNextQuestion(settings, updatedHistory, false);
    setIsThinking(false);
    
    if (!res.success) {
      // Temporarily revert history so they can retry submitting the same answer
      setTranscriptHistory(transcriptHistory); 
      setCurrentQuestionText(res.question); // Show the safe error message
      return;
    }

    const nextQ = res.question;
    setTranscriptHistory(prev => [...prev, { role: 'ai', text: nextQ }]);
    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentQuestionText(nextQ);
    speakText(nextQ);
  };

  const handleRetry = async () => {
    if (transcriptHistory.length === 0) {
      // Retry first question
      setIsThinking(true);
      const res = await generateNextQuestion(settings, [], true);
      setIsThinking(false);
      
      if (!res.success) {
        setCurrentQuestionText(res.question);
        return;
      }

      const firstQ = res.question;
      setCurrentQuestionText(firstQ);
      setTranscriptHistory([{ role: 'ai', text: firstQ }]);
      speakText(firstQ);
    } else {
      // Retry next question
      submitAnswer(); // Re-trigger the submission
    }
  };

  const handleNext = () => {
    submitAnswer(true); // Skip
  };

  const toggleRecording = () => {
    if (!speechServiceRef.current) return;
    
    if (isRecording) {
      speechServiceRef.current.stopRecording();
      setIsRecording(false);
      // Wait a moment before auto-submitting? 
      // For MVP, user manually clicks "Submit Answer" if they want, or we submit on stop.
      // Let's just stop recording. User must hit submit.
    } else {
      // Stop TTS if speaking
      if (isSpeaking) {
        speechServiceRef.current.stopSpeaking();
        setIsSpeaking(false);
      }
      speechServiceRef.current.startRecording();
      setIsRecording(true);
      setCurrentAnswer(""); // reset current answer for this take
    }
  };

  return (
    <div className="interview-container animate-fade-in">
      <header className="interview-header flex-between">
        <div className="interview-meta">
          <span className="meta-badge">{settings?.jobRole || "Role"}</span>
          <span className="meta-badge">{settings?.interviewType || "Type"}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleQuitInterview} className="btn-secondary" title="Quit Interview">
            Quit
          </button>
          <button onClick={handleEndInterview} className="btn-icon" style={{ background: '#e5e7eb', color: '#111827', border: 'none' }} title="End and Evaluate">
            <X size={20} color="#111827" />
          </button>
        </div>
      </header>

      <main className="interview-main">
        {/* Left Side: Avatar */}
        <div className="avatar-section">
          <div className={`avatar-container ${isSpeaking ? 'is-speaking' : ''}`}>
            <img src="/avatar.png" alt="AI Interviewer" className="avatar-image" />
            
            {/* Visual Indicator of Status */}
            <div className="status-indicator-wrapper">
              {isThinking ? (
                <div className="status-indicator ai-speaking glass-panel">
                  <Loader2 size={16} className="animate-spin" />
                  AI is thinking...
                </div>
              ) : isSpeaking ? (
                <div className="status-indicator ai-speaking glass-panel">
                  <Volume2 size={16} />
                  AI is speaking...
                </div>
              ) : isRecording ? (
                <div className="status-indicator recording glass-panel">
                  <Mic size={16} className="pulse-icon" />
                  Recording...
                </div>
              ) : (
                <div className="status-indicator waiting glass-panel">
                  Waiting for you to speak
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Information & Controls */}
        <div className="info-section glass-panel">
          <div className="progress-bar-container">
            <div className="progress-info flex-between">
              <span className="question-count">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="question-container">
            <h2 className="current-question">{currentQuestionText}</h2>
          </div>

          <div className="controls-container">
            {isRecording ? (
                <div className="transcript-area">
                  <p className="text-secondary mb-2">Your Answer:</p>
                  <div className="transcript-box glass-panel">{currentAnswer || "Listening..."}</div>
                  
                  <div className="recording-actions mt-4">
                    <button onClick={toggleRecording} className="btn-primary w-full">
                      <Square size={18} fill="currentColor" />
                      Done Speaking
                    </button>
                  </div>
                </div>
              ) : currentQuestionText.includes("temporarily unavailable") ? (
                <div className="recording-actions mt-4">
                  <button onClick={handleRetry} className="btn-primary w-full" disabled={isThinking}>
                    Retry Connection
                  </button>
                </div>
              ) : (
              <div className="ready-controls animate-fade-in">
                {currentAnswer ? (
                  <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
                    <div className="live-transcript" style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', maxHeight: '100px', overflowY: 'auto', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px'}}>
                      {currentAnswer}
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button onClick={toggleRecording} className="btn-secondary" style={{flex: 1}}>
                        Retake
                      </button>
                      <button onClick={() => submitAnswer(false)} className="btn-primary" style={{flex: 1}}>
                        Submit Answer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={toggleRecording} className="btn-start-record btn-primary" disabled={isThinking || isSpeaking}>
                      <Mic size={20} />
                      Start Answer
                    </button>
                    <div className="secondary-actions mt-4">
                      <button onClick={handleNext} className="btn-secondary" disabled={isThinking || isSpeaking}>
                        <SkipForward size={18} />
                        Skip Question
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
