/**
 * Core type definitions for Repo Brain
 */

/**
 * Represents a symbol in the codebase (function, class, variable, etc.)
 */
export interface Symbol {
  name: string;
  kind: SymbolKind;
  filePath: string;
  line: number;
  column: number;
}

export enum SymbolKind {
  Function = 'function',
  Class = 'class',
  Interface = 'interface',
  Variable = 'variable',
  Type = 'type',
  Enum = 'enum',
  Method = 'method',
  Property = 'property',
}

/**
 * Represents structural information from AST parsing
 */
export interface ASTNode {
  type: string;
  name?: string;
  location: CodeLocation;
  children?: ASTNode[];
}

export interface CodeLocation {
  filePath: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}

/**
 * Represents a piece of evidence for retrieval
 */
export interface Evidence {
  source: EvidenceSource;
  content: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export enum EvidenceSource {
  AST = 'ast',
  Semantic = 'semantic',
  Memory = 'memory',
}

/**
 * Repository metadata and facts
 */
export interface RepositoryFacts {
  rootPath: string;
  language: string;
  conventions?: Convention[];
  lastIndexed?: Date;
  symbolCount?: number;
}

export interface Convention {
  type: string;
  description: string;
  examples?: string[];
}

/**
 * Configuration for Repo Brain
 */
export interface RepoBrainConfig {
  rootPath: string;
  indexPath: string;
  excludePatterns?: string[];
  language?: string;
}

/**
 * Reasoning context passed to LLM
 */
export interface ReasoningContext {
  query: string;
  evidence: Evidence[];
  repoFacts?: RepositoryFacts;
}

/**
 * Response from explanation or reasoning
 */
export interface ExplanationResponse {
  explanation: string;
  sources: Evidence[];
  confidence?: number;
}
