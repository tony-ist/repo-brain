/**
 * Index Command
 *
 * Scans the repository and builds an index of code structure and semantics
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { logger } from '../utils/logger.js';
import { findFiles } from '../utils/fileSystem.js';
import { MemoryStore } from '../core/memory/store.js';
import { astParser } from '../core/ast/parser.js';
import { semanticSearch } from '../core/retrieval/semanticSearch.js';

export async function indexCommand(args: string[]): Promise<void> {
  const targetPath = args[0] || process.cwd();
  const absolutePath = path.resolve(targetPath);

  logger.info(`Indexing repository at: ${absolutePath}`);

  // Verify path exists
  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      logger.error('Path must be a directory');
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Path does not exist: ${absolutePath}`);
    process.exit(1);
  }

  // Initialize memory store
  const indexPath = path.join(absolutePath, '.repo-brain');
  const memoryStore = new MemoryStore(indexPath);
  await memoryStore.init();

  logger.info('Scanning for TypeScript/JavaScript files...');

  // Find all relevant files
  const files = await findFiles(
    absolutePath,
    /\.(ts|tsx|js|jsx)$/,
    ['node_modules', 'dist', 'build', '.git', 'coverage']
  );

  logger.info(`Found ${files.length} files to index`);

  let symbolCount = 0;

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = path.relative(absolutePath, file);

    logger.debug(`[${i + 1}/${files.length}] Processing: ${relativePath}`);

    try {
      const content = await fs.readFile(file, 'utf-8');

      // Parse AST (placeholder for now)
      const symbols = await astParser.parseFile(file);
      symbolCount += symbols.length;

      // Index for semantic search (placeholder for now)
      await semanticSearch.indexCode(file, content);
    } catch (error) {
      logger.warn(`Failed to process ${relativePath}: ${error}`);
    }
  }

  // Update repository facts
  await memoryStore.updateFacts({
    rootPath: absolutePath,
    language: 'typescript',
    lastIndexed: new Date(),
    symbolCount,
  });

  logger.info('Indexing complete!');
  logger.info(`  Files processed: ${files.length}`);
  logger.info(`  Symbols found: ${symbolCount}`);
  logger.info(`  Index stored at: ${indexPath}`);

  console.log(`\nRepository indexed successfully!`);
  console.log(`You can now use 'repo-brain explain <symbol>' to explore your code.`);
}
