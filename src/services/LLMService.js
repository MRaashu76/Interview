import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure environment is strictly typed/read
const getApiKey = () => {
  const savedSettings = JSON.parse(localStorage.getItem('interviewSettings') || '{}');
  const key = savedSettings.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error("GEMINI_API_KEY is not configured.");
    return null;
  }
  return key.trim();
};

const getModelName = () => {
  return import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-pro";
};

const generateScenario = (role, type) => {
  const scenarios = {
    "Software Developer": "You are interviewing for a Software Developer position at a technology company. Evaluate programming knowledge, projects, problem-solving, teamwork, and communication.",
    "Data Analyst": "You are interviewing for a Data Analyst position. Evaluate SQL, Excel, statistics, analytical thinking, data interpretation, and communication.",
    "Product Manager": "You are interviewing for a Product Manager position. Evaluate product sense, prioritization, analytical thinking, communication, and stakeholder management.",
    "HR / Behavioral": "You are interviewing for a professional role. Evaluate communication, teamwork, leadership, conflict resolution, adaptability, and behavioral decision-making.",
  };
  return scenarios[role] || scenarios["HR / Behavioral"];
};

export const generateNextQuestion = async (settings, transcript, isFirstQuestion = false) => {
  const scenario = generateScenario(settings.jobRole, settings.interviewType);
  const apiKey = getApiKey();
  const modelName = getModelName();
  
  if (!apiKey) {
    return {
      success: false,
      question: "The AI interviewer is temporarily unavailable (Missing API Key configuration). Please configure VITE_GEMINI_API_KEY and try again.",
      reasoning: "Missing configuration."
    };
  }

  const systemPrompt = `You are a professional AI interviewer conducting a realistic mock interview.
Your job is to evaluate the candidate for the selected role and scenario.
SCENARIO: ${scenario}
JOB ROLE: ${settings.jobRole}
INTERVIEW TYPE: ${settings.interviewType}
DIFFICULTY: ${settings.difficulty}

INSTRUCTIONS:
1. You must behave like a real interviewer.
2. Ask ONE question at a time. Do NOT provide a list of questions.
3. If this is the first question, ask a relevant opening question.
4. If this is a follow-up, listen to the candidate's previous answer and ask a contextual follow-up. Ask deeper questions for strong answers, or clarification for vague answers.
5. Do not blindly follow a predefined list.
6. Keep all questions relevant to the job role.
7. Maintain a professional, neutral, and encouraging tone.
8. Output your response ONLY as a JSON object with this exact structure (no markdown blocks, just raw JSON):
{
  "reasoning": "Brief internal explanation of why you chose this next question based on the candidate's previous answer and current evaluation competency.",
  "competency_being_tested": "e.g., Problem Solving, Technical Depth",
  "question": "The actual question the AI avatar will speak to the candidate."
}`;

  const conversationContext = transcript.map(t => `${t.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${t.text}`).join('\n');
  const userMessage = isFirstQuestion 
    ? "This is the start of the interview. Generate the very first question."
    : `Here is the interview transcript so far:\n\n${conversationContext}\n\nBased on the candidate's last answer, generate the next question.`;

  try {
    console.log("[Gemini] Initializing client");
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log(`[Gemini] Model: ${modelName}`);
    
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt
    });

    console.log(isFirstQuestion ? "[Gemini] Generating opening question" : "[Gemini] Generating follow-up question");

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    let resultText = result.response.text();
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(resultText);
    
    console.log(isFirstQuestion ? "[Gemini] Opening question generated successfully" : "[Gemini] Follow-up generated successfully");

    return {
      success: true,
      question: resultJson.question,
      reasoning: resultJson.reasoning
    };

  } catch (error) {
    console.error("[Gemini] Connection Error:", error);
    return {
      success: false,
      question: "The AI interviewer is temporarily unavailable. Please try again.",
      reasoning: "Fallback triggered due to AI integration failure."
    };
  }
};

export const evaluateInterview = async (settings, transcript) => {
  const scenario = generateScenario(settings.jobRole, settings.interviewType);
  const apiKey = getApiKey();
  const modelName = getModelName();
  
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const conversationContext = transcript.map(t => `${t.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${t.text}`).join('\n');

  const systemPrompt = `You are an expert technical recruiter and interviewer evaluator.
The interview has concluded. Evaluate the candidate's performance based on the transcript provided.

SCENARIO: ${scenario}
JOB ROLE: ${settings.jobRole}
DIFFICULTY: ${settings.difficulty}

INSTRUCTIONS:
1. Generate an evidence-based evaluation from the actual answers.
2. DO NOT hallucinate. Base your scores strictly on what was said.
3. Use a 0-100 scale for scores.
4. Output your response ONLY as a JSON object with this exact structure (no markdown blocks):
{
  "overallScore": 75,
  "categories": [
    { "name": "Communication", "score": 80 },
    { "name": "Role-Specific Competency", "score": 70 },
    { "name": "Clarity", "score": 75 },
    { "name": "Structure", "score": 65 },
    { "name": "Confidence", "score": 80 }
  ],
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "example": {
    "question": "The specific question asked in the interview where the candidate struggled most.",
    "yourAnswer": "The candidate's actual answer to that question.",
    "improvedAnswer": "A significantly stronger, well-structured answer (e.g., using STAR method) to demonstrate how they should have answered."
  }
}`;

  try {
    console.log("[Gemini] Initializing client for evaluation");
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log(`[Gemini] Generating evaluation using model: ${modelName}`);

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Here is the interview transcript:\n\n${conversationContext}\n\nGenerate the final evaluation.` }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    let resultText = result.response.text();
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    console.log("[Gemini] Evaluation generated successfully");
    
    return JSON.parse(resultText);

  } catch (error) {
    console.error("[Gemini] Evaluation Error:", error);
    throw error;
  }
};
