// SpeechService.js - Wraps Web Speech API

export class SpeechService {
  constructor(onResult, onEnd, onError) {
    this.recognition = null;
    this.synth = window.speechSynthesis;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (onResult) {
          onResult(finalTranscript, interimTranscript);
        }
      };

      this.recognition.onend = () => {
        if (onEnd) onEnd();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (onError) onError(event.error);
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }

  startRecording() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error("Recognition already started", e);
      }
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speak(text, onStart, onEnd) {
    if (!this.synth) return;
    
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good female/professional English voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha') || (v.lang === 'en-US' && v.name.includes('Female')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      if (onEnd) onEnd(); // Ensure UI state resets even on error
    };

    this.synth.speak(utterance);
  }
  
  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
