/**
 * Evidence Blender Module
 *
 * Combines evidence from multiple sources (AST, semantic search, memory)
 * and ranks them for reasoning.
 */

import { Evidence, ReasoningContext } from '../../types.js';
import { logger } from '../../utils/logger.js';

export class EvidenceBlender {
  /**
   * Blend evidence from multiple sources
   * Ranks and filters evidence for optimal reasoning context
   */
  blendEvidence(evidences: Evidence[], maxItems: number = 10): Evidence[] {
    logger.debug(`Blending ${evidences.length} pieces of evidence`);

    // Sort by relevance
    const sorted = [...evidences].sort((a, b) => b.relevance - a.relevance);

    // Take top N
    const top = sorted.slice(0, maxItems);

    // TODO: Implement more sophisticated blending
    // - Deduplicate similar evidence
    // - Balance sources (AST, semantic, memory)
    // - Consider recency and context

    return top;
  }

  /**
   * Build reasoning context from query and evidence
   */
  buildContext(query: string, evidences: Evidence[]): ReasoningContext {
    const blended = this.blendEvidence(evidences);

    return {
      query,
      evidence: blended,
    };
  }
}

export const evidenceBlender = new EvidenceBlender();
