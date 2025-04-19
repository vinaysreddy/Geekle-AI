import fs from 'fs';
import path from 'path';

const EXCLUDED_FOLDERS = ['node_modules', '.git', 'output'];

export function getAllFiles(dir, ext = '.js', fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_FOLDERS.includes(entry.name)) {
        getAllFiles(fullPath, ext, fileList);
      }
    } else if (entry.name.endsWith(ext)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}
