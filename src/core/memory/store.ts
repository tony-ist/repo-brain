/**
 * Memory Store Module
 *
 * Persistent storage for repository facts, conventions, and user preferences.
 * Currently uses simple JSON file storage, can be upgraded to a database later.
 */

import * as path from 'path';
import { RepositoryFacts, Convention, Evidence, EvidenceSource } from '../../types.js';
import { logger } from '../../utils/logger.js';
import { readFileSafe, writeFileSafe, ensureDir } from '../../utils/fileSystem.js';

export class MemoryStore {
  private storePath: string;
  private facts: RepositoryFacts | null = null;

  constructor(indexPath: string) {
    this.storePath = path.join(indexPath, 'memory.json');
  }

  /**
   * Initialize memory store
   */
  async init(): Promise<void> {
    await ensureDir(path.dirname(this.storePath));
    await this.load();
  }

  /**
   * Load facts from disk
   */
  async load(): Promise<void> {
    const content = await readFileSafe(this.storePath);

    if (content) {
      try {
        this.facts = JSON.parse(content);
        logger.debug('Loaded repository facts from memory');
      } catch (error) {
        logger.error('Failed to parse memory store', error);
        this.facts = null;
      }
    }
  }

  /**
   * Save facts to disk
   */
  async save(): Promise<void> {
    if (!this.facts) return;

    const success = await writeFileSafe(
      this.storePath,
      JSON.stringify(this.facts, null, 2)
    );

    if (success) {
      logger.debug('Saved repository facts to memory');
    } else {
      logger.error('Failed to save memory store');
    }
  }

  /**
   * Update repository facts
   */
  async updateFacts(facts: Partial<RepositoryFacts>): Promise<void> {
    this.facts = {
      ...this.facts,
      ...facts,
    } as RepositoryFacts;

    await this.save();
  }

  /**
   * Get repository facts
   */
  getFacts(): RepositoryFacts | null {
    return this.facts;
  }

  /**
   * Add a convention
   */
  async addConvention(convention: Convention): Promise<void> {
    if (!this.facts) return;

    this.facts.conventions = this.facts.conventions || [];
    this.facts.conventions.push(convention);

    await this.save();
  }

  /**
   * Get evidence from memory store
   */
  getMemoryEvidence(query: string): Evidence[] {
    if (!this.facts) return [];

    // TODO: Implement more sophisticated memory retrieval
    // - Match query against conventions
    // - Return relevant facts

    const evidence: Evidence[] = [];

    // Simple keyword matching for conventions
    if (this.facts.conventions) {
      for (const convention of this.facts.conventions) {
        if (
          convention.description.toLowerCase().includes(query.toLowerCase()) ||
          convention.type.toLowerCase().includes(query.toLowerCase())
        ) {
          evidence.push({
            source: EvidenceSource.Memory,
            content: `Convention: ${convention.type} - ${convention.description}`,
            relevance: 0.7,
            metadata: { convention },
          });
        }
      }
    }

    return evidence;
  }
}
