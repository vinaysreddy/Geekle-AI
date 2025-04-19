import { Router } from 'express';
import { generateGeminiResponse } from '../llm/gemini.js';

const router = Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const result = await generateGeminiResponse(prompt);
  res.json({ result });
});

export default router;
