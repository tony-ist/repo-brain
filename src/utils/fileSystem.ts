/**
 * File system utilities for Repo Brain
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Recursively find all files matching a pattern
 */
export async function findFiles(
  rootDir: string,
  pattern: RegExp,
  excludePatterns: string[] = ['node_modules', 'dist', '.git']
): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Check if should exclude
      const shouldExclude = excludePatterns.some(pattern =>
        fullPath.includes(pattern)
      );

      if (shouldExclude) continue;

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results;
}

/**
 * Ensure directory exists, create if not
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Read file safely
 */
export async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Write file safely
 */
export async function writeFileSafe(filePath: string, content: string): Promise<boolean> {
  try {
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
}
