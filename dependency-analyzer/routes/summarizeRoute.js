// import { Router } from 'express';
// import { summarizeFunction } from '../llm/summarizer.js';

// const router = Router();

// router.post('/', async (req, res) => {
//   const { funcCode, imports } = req.body;
//   try {
//     const summary = await summarizeFunction(funcCode, imports);
//     res.json({ summary });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;
