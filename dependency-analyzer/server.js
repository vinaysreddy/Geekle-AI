import express from 'express';
import analyzeRoute from './routes/analyzeRoute.js';
import geminiRoute from './routes/geminiRoute.js';
import { generateGeminiResponse } from './llm/gemini.js';
import { generateFunctionDocs } from './llm/prompts.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/analyze', analyzeRoute);
app.use('/gemini', geminiRoute);

// Simple endpoint to test Gemini API directly
app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        const response = await generateGeminiResponse(prompt);
        res.json({ response });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint for function documentation generation
app.post('/api/analyze-function', async (req, res) => {
    try {
        const { functionData, projectContext } = req.body;

        if (!functionData || !functionData.sourceCode) {
            return res.status(400).json({ error: 'Missing or invalid function data' });
        }

        const documentation = await generateFunctionDocs(functionData, projectContext || {});
        res.json(documentation);
    } catch (error) {
        console.error('Error generating documentation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
