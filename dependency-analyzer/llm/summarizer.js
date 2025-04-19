// import { OpenAI } from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// function createP
// rompt(funcCode, imports = []) {
//   return `
// You're a senior developer. Summarize this function:

// Function Code:
// ${funcCode}

// Imports:
// ${imports.join(', ')}

// Instructions:
// - What does the function do?
// - Important parameters
// - Dependencies if any
// `;
// }

// export async function summarizeFunction(funcCode, imports = []) {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [{ role: "user", content: createPrompt(funcCode, imports) }],
//     temperature: 0.3,
//   });
//   return response.choices[0].message.content;
// }
