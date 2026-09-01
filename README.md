# InterviewAI 🤖🎙️

InterviewAI is an intelligent mock interview platform powered by Google's Gemini AI. Practice realistic interviews tailored to your job role, get asked dynamic follow-up questions based on your answers, and receive a comprehensive performance evaluation to help you succeed in your next real interview!

## ✨ Features

- **Customized Mock Interviews**: Configure your interview by selecting your target job role (e.g., Software Developer, Product Manager), experience level, and interview type (Technical, HR/Behavioral, etc.).
- **Interactive AI Interviewer**: Engage in a realistic dialogue with an AI avatar.
- **Voice Answers**: Use your microphone to answer questions naturally with built-in Speech-to-Text capabilities.
- **Dynamic Contextual Questions**: The AI listens to your responses and generates intelligent follow-up questions, just like a real human interviewer.
- **Detailed Evaluation**: Get an instant, detailed assessment after your interview with an overall score, top strengths, areas for improvement, and actionable tips using the STAR method.
- **Beautiful Light Theme UI**: A clean, modern, and accessible user interface.

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MRaashu76/Interview.git
   cd Interview
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Environment:**
   Open the `.env` file in the root directory and add your [Google Gemini API Key](https://aistudio.google.com/):
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   VITE_GEMINI_MODEL=gemini-3.6-flash
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:5173` to start practicing!

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Modern Vanilla CSS with a customized light theme
- **AI Engine**: Google Generative AI (`@google/generative-ai`)
- **Icons**: Lucide React
- **Speech**: Web Speech API (SpeechRecognition)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is free to use and open for educational purposes.
