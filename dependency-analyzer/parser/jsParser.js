import fs from 'fs';

export function parseJSFiles(files) {
  const results = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    const importMatches = [...content.matchAll(/import\s+(?:[\w*\s{},]+)\s+from\s+['"](.+)['"]/g)];
    const exports = [...content.matchAll(/export\s+(function|const|class)\s+(\w+)/g)];

    const imports = importMatches.map(m => ({ from: m[1] }));
    const exportNames = exports.map(m => m[2]);

    results.push({
      file,
      imports,
      exports: exportNames,
    });
  }

  return results;
}
