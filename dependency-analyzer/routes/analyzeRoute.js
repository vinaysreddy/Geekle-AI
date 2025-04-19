import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { getAllFiles } from '../utils/fileScanner.js';
import { parseJSFiles } from '../parser/jsParser.js'; // ✅ custom parser for JS
import { buildDependencyGraph } from '../graph/graphBuilder.js';

const router = Router();

// 👇 CHANGE THIS LINE to your actual JS project path
// const JS_PROJECT_PATH = './your-js-project'; // ✅ put your folder here
const JS_PROJECT_PATH = './'; // root of the current project


router.get('/', (req, res) => {
  try {
    const files = getAllFiles(JS_PROJECT_PATH, '.js'); // 📁 collect all .js files
    const parsed = parseJSFiles(files);                // 🔍 parse imports
    const graph = buildDependencyGraph(parsed);        // 🌐 build dependency graph

    fs.writeFileSync('./output/graph.json', JSON.stringify(graph, null, 2));
    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
