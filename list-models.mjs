import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const envFile = fs.readFileSync(".env", "utf-8");
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#]+?)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const API_KEY = env.VITE_GEMINI_API_KEY;

async function listModels() {
    console.log("Listing models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

listModels();
