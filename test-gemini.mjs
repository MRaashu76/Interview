import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Simple .env parser for the test script
const envFile = fs.readFileSync(".env", "utf-8");
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#]+?)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const API_KEY = env.VITE_GEMINI_API_KEY;
const MODEL_NAME = env.VITE_GEMINI_MODEL || "gemini-1.5-pro";

async function runTest() {
    console.log("==================================================");
    console.log("GEMINI CONNECTION DIAGNOSTIC");
    console.log("==================================================");
    
    if (!API_KEY) {
        console.error("❌ ERROR: VITE_GEMINI_API_KEY is not configured in .env");
        process.exit(1);
    }

    console.log(`[Gemini] Initializing client...`);
    const genAI = new GoogleGenerativeAI(API_KEY);

    console.log(`[Gemini] Fetching available models for this API key...`);
    try {
        // Unfortunately, the JS SDK doesn't expose listModels directly easily, 
        // but we can test generation immediately on the configured model.
        console.log(`[Gemini] Model configured: ${MODEL_NAME}`);
        
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        console.log(`[Gemini] Testing generation connection...`);
        const result = await model.generateContent("Hello, are you receiving this?");
        const response = await result.response;
        
        console.log("✅ SUCCESS: Gemini API connection successful!");
        console.log("Response text:", response.text());
        console.log("==================================================");
    } catch (error) {
        console.error("❌ CONNECTION FAILED");
        console.error("Diagnostic Details:");
        console.error(error.message);
        if (error.message.includes("404")) {
            console.error(`\nHint: A 404 error usually means your API key does not have access to the model "${MODEL_NAME}".`);
            console.error(`Please try changing VITE_GEMINI_MODEL in your .env file to "gemini-1.5-flash" or "gemini-pro" and run this test again.`);
        } else if (error.message.includes("400") || error.message.includes("API key not valid")) {
            console.error(`\nHint: A 400 error means your API key is invalid or expired.`);
        }
    }
}

runTest();
