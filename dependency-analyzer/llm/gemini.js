import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Updated API URL to use the latest endpoint structure
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// Remove or comment out this debug line in production
// console.log(GEMINI_API_KEY);

export async function generateGeminiResponse(promptText) {
    const body = {
        contents: [{
            parts: [{ text: promptText }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
        }
    };

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error details:', JSON.stringify(errorData, null, 2));
            throw new Error(`API returned status ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log("Gemini API response received");
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } catch (err) {
        console.error('Gemini API error:', err);
        return 'Error calling Gemini API';
    }
}
