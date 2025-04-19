import { generateGeminiResponse } from './gemini.js';

/**
 * Templates for generating code documentation
 */
export const PROMPT_TEMPLATES = {
  // Function analysis prompt template
  FUNCTION_ANALYSIS: `You are a senior software architect analyzing code for documentation.

CONTEXT:
- File: {{filepath}}
- Module purpose: {{moduleRole}}
- Project purpose: {{projectPurpose}}

SOURCE CODE:
\`\`\`{{language}}
{{sourceCode}}
\`\`\`

DEPENDENCIES:
- Imports: {{imports}}
- Called by: {{calledBy}}
- Calls: {{calls}}

TASK:
1. Analyze what this function does at a high level
2. Identify parameters, return values, and side effects
3. Note any error handling or special cases
4. Understand how it connects to the broader system

Provide a structured documentation for this function with:
- Summary (one sentence)
- Description (2-3 sentences)
- Parameters and returns
- Examples of usage
- Dependencies and relationships`,

  // Module integration prompt template
  MODULE_INTEGRATION: `You are creating high-level documentation for related functions in a module.

You've analyzed these individual functions:
{{functionDocsList}}

They all belong to module: {{modulePath}}
Module purpose: {{moduleRole}}

Create a cohesive module-level documentation that:
1. Explains the overall purpose of this module
2. Shows how these functions work together
3. Highlights the main entry points and workflows
4. Identifies any architectural patterns used`
};

/**
 * Generates documentation for a function using LLM
 * @param {Object} functionData - Data about the function to analyze
 * @param {string} functionData.name - Function name
 * @param {string} functionData.sourceCode - Function source code
 * @param {string} functionData.filepath - Path to file containing function
 * @param {Object} functionData.dependencies - Function dependencies
 * @param {Object} projectContext - General project context
 * @returns {Promise<Object>} Generated documentation
 */
export async function generateFunctionDocs(functionData, projectContext) {
  const prompt = PROMPT_TEMPLATES.FUNCTION_ANALYSIS
    .replace('{{filepath}}', functionData.filepath)
    .replace('{{moduleRole}}', projectContext.moduleRole || 'Unknown')
    .replace('{{projectPurpose}}', projectContext.purpose || 'Code analysis project')
    .replace('{{language}}', getLanguageFromPath(functionData.filepath))
    .replace('{{sourceCode}}', functionData.sourceCode)
    .replace('{{imports}}', formatArray(functionData.dependencies.imports))
    .replace('{{calledBy}}', formatArray(functionData.dependencies.calledBy))
    .replace('{{calls}}', formatArray(functionData.dependencies.calls));

  const response = await generateGeminiResponse(prompt);
  return parseDocsResponse(response, functionData.name);
}

/**
 * Generates module-level documentation using LLM
 * @param {string} modulePath - Path to the module
 * @param {Array<Object>} functionDocs - Array of function documentation objects
 * @param {Object} projectContext - General project context
 * @returns {Promise<Object>} Generated module documentation
 */
export async function generateModuleDocs(modulePath, functionDocs, projectContext) {
  const functionsListText = functionDocs
    .map(doc => `- ${doc.entity}: ${doc.summary}`)
    .join('\n');

  const prompt = PROMPT_TEMPLATES.MODULE_INTEGRATION
    .replace('{{functionDocsList}}', functionsListText)
    .replace('{{modulePath}}', modulePath)
    .replace('{{moduleRole}}', projectContext.moduleRole || 'Unknown');

  const response = await generateGeminiResponse(prompt);
  return {
    modulePath,
    documentation: response,
    functions: functionDocs.map(doc => doc.entity)
  };
}

/**
 * Helper function to format arrays for template string
 * @param {Array} arr - Array to format
 * @returns {string} Formatted array as comma-separated string
 */
function formatArray(arr) {
  if (!arr || arr.length === 0) return 'None';
  return arr.join(', ');
}

/**
 * Determines programming language from file path
 * @param {string} filepath - Path to file
 * @returns {string} Programming language name
 */
function getLanguageFromPath(filepath) {
  const extension = filepath.split('.').pop().toLowerCase();
  const langMap = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'java': 'java',
    'rb': 'ruby',
    'php': 'php',
    'go': 'go'
    // Add more mappings as needed
  };
  
  return langMap[extension] || 'plaintext';
}

/**
 * Parse the LLM response into structured documentation
 * @param {string} response - Raw LLM response text
 * @param {string} entityName - Name of entity being documented
 * @returns {Object} Structured documentation object
 */
function parseDocsResponse(response, entityName) {
  // Simple implementation - in production you'd want more robust parsing
  // This is a placeholder that assumes somewhat structured response
  
  const sections = response.split('\n\n');
  
  // Extract summary (first paragraph)
  const summary = sections[0].replace('Summary:', '').trim();
  
  return {
    entity: entityName,
    summary: summary,
    description: extractSection(response, 'Description:') || '',
    parameters: extractSection(response, 'Parameters:') || '',
    returns: extractSection(response, 'Returns:') || '',
    usage: extractSection(response, 'Examples of usage:') || '',
    dependencies: extractSection(response, 'Dependencies:') || '',
    fullDocumentation: response
  };
}

/**
 * Extract a section from the response text
 * @param {string} text - Full response text
 * @param {string} sectionTitle - Title of section to extract
 * @returns {string|null} Extracted section or null if not found
 */
function extractSection(text, sectionTitle) {
  const regex = new RegExp(`${sectionTitle}([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}