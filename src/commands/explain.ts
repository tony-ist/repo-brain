/**
 * Explain Command
 *
 * Generates an explanation for a given symbol or code concept
 */

import * as path from 'path';
import { logger } from '../utils/logger.js';
import { MemoryStore } from '../core/memory/store.js';
import { astParser } from '../core/ast/parser.js';
import { semanticSearch } from '../core/retrieval/semanticSearch.js';
import { evidenceBlender } from '../core/retrieval/evidenceBlender.js';
import { llmClient } from '../core/llm/client.js';
import { Evidence, EvidenceSource } from '../types.js';

export async function explainCommand(args: string[]): Promise<void> {
  if (args.length === 0) {
    logger.error('Usage: repo-brain explain <symbol>');
    process.exit(1);
  }

  const symbol = args.join(' ');
  const rootPath = process.cwd();
  const indexPath = path.join(rootPath, '.repo-brain');

  logger.info(`Explaining: ${symbol}`);

  // Initialize memory store
  const memoryStore = new MemoryStore(indexPath);
  await memoryStore.init();

  const facts = memoryStore.getFacts();

  if (!facts) {
    console.log(`\nNo index found. Please run 'repo-brain index' first.`);
    process.exit(1);
  }

  logger.info('Gathering evidence...');

  // Collect evidence from different sources
  const evidences: Evidence[] = [];

  // 1. Search AST for symbol definition
  logger.debug('Searching AST...');
  const symbolDef = await astParser.findSymbol(symbol, rootPath);
  if (symbolDef) {
    evidences.push({
      source: EvidenceSource.AST,
      content: `Symbol found: ${symbolDef.name} (${symbolDef.kind}) at ${symbolDef.filePath}:${symbolDef.line}`,
      relevance: 1.0,
      metadata: { symbol: symbolDef },
    });
  }

  // 2. Semantic search
  logger.debug('Performing semantic search...');
  const semanticResults = await semanticSearch.search(symbol, 5);
  evidences.push(...semanticResults);

  // 3. Memory store
  logger.debug('Checking memory store...');
  const memoryResults = memoryStore.getMemoryEvidence(symbol);
  evidences.push(...memoryResults);

  logger.info(`Found ${evidences.length} pieces of evidence`);

  // Blend evidence
  const context = evidenceBlender.buildContext(symbol, evidences);

  // Generate explanation
  logger.info('Generating explanation...');
  const response = await llmClient.explain(context);

  // Display result
  console.log(`\nExplanation for "${symbol}":`);
  console.log('─'.repeat(60));
  console.log(response.explanation);

  if (response.sources.length > 0) {
    console.log('\n' + '─'.repeat(60));
    console.log('Sources:');
    response.sources.forEach((source, i) => {
      console.log(`  ${i + 1}. [${source.source}] ${source.content.substring(0, 100)}...`);
    });
  }

  console.log('─'.repeat(60));
}
