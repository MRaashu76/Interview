// MockAIService.js - Simulates AI Interviewer Logic

export const generateMockQuestions = (role, experience, type, difficulty) => {
  // Simulate API call delay
  
  // Base template based on Software Developer
  const templates = [
    `Tell me about yourself and your background in ${role}.`,
    `Describe a complex project you worked on recently. What was your specific contribution?`,
    `Can you walk me through your process for debugging a difficult issue?`,
    `Tell me about a time you had a disagreement with a team member. How did you resolve it?`,
    `Why do you think you're a good fit for this ${experience} level position?`
  ];

  return templates.map((text, i) => ({
    id: i,
    text,
    isFollowUp: false
  }));
};

export const generateMockFollowUp = (transcript, previousQuestion) => {
  // Simulate AI generating a contextual follow-up based on the candidate's answer
  const followUps = [
    "That's interesting. Can you elaborate on the specific tools you used for that?",
    "What was the biggest challenge you faced in that scenario, and how did you overcome it?",
    "Could you provide a specific metric or result to quantify your impact there?",
    "How did your team react to that approach?"
  ];
  
  // Pick a random follow-up for the mock
  const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)];
  return randomFollowUp;
};

export const evaluateInterview = (transcriptHistory) => {
  // Mock evaluation based on transcripts
  
  // In a real app, we would send transcriptHistory to an LLM for structured grading.
  
  return {
    overallScore: Math.floor(Math.random() * 20) + 70, // 70-90
    categories: [
      { name: 'Communication', score: Math.floor(Math.random() * 20) + 75 },
      { name: 'Relevance', score: Math.floor(Math.random() * 20) + 70 },
      { name: 'Clarity', score: Math.floor(Math.random() * 20) + 75 },
      { name: 'Structure', score: Math.floor(Math.random() * 20) + 65 },
      { name: 'Confidence', score: Math.floor(Math.random() * 20) + 75 },
    ],
    strengths: [
      "Clear verbal communication style",
      "Good use of professional terminology",
      "Confident delivery"
    ],
    improvements: [
      "Answers could be more structured using the STAR method",
      "Include more specific metrics when describing past work",
      "Try to be more concise on behavioral questions"
    ],
    example: {
      question: transcriptHistory[0]?.question || "Tell me about a challenging project.",
      yourAnswer: transcriptHistory[0]?.answer || "I worked on a big project and it was hard but we finished it.",
      improvedAnswer: "I led the development of a microservice using Node.js that handled 10k requests/min. The main challenge was optimizing database queries, which I solved by implementing Redis caching, reducing latency by 40%."
    }
  };
};
