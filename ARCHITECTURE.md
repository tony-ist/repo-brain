# Architecture Design Document

## Overview

Repo Brain is designed as a modular, layered system that separates concerns between code analysis, information retrieval, and AI reasoning. This document explains the design decisions and component responsibilities.

## Design Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Extensibility**: Easy to add new data sources, search methods, or reasoning strategies
3. **Type Safety**: Comprehensive TypeScript types throughout the system
4. **Local-First**: Works offline, stores data locally, respects privacy
5. **Progressive Enhancement**: Works at basic level, improves with more implementation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Layer (cli.ts)                       │
│  - Command parsing and routing                               │
│  - User interaction                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                  Command Layer (commands/)                   │
│  - index.ts: Repository scanning and indexing                │
│  - explain.ts: Symbol explanation orchestration              │
└──────────────────────┬──────────────────────────────────────┘
                       │
      ┌────────────────┼────────────────┐
      │                │                │
┌─────▼─────┐   ┌─────▼──────┐   ┌────▼──────┐
│    AST    │   │ Retrieval  │   │  Memory   │
│  Engine   │   │  Pipeline  │   │   Store   │
└───────────┘   └─────┬──────┘   └───────────┘
                      │
              ┌───────┼───────┐
              │       │       │
         ┌────▼──┐ ┌─▼────┐ ┌▼─────┐
         │  AST  │ │Semantic│ │Memory│
         │Source │ │ Search │ │Query │
         └───────┘ └────────┘ └──────┘
                      │
              ┌───────▼────────┐
              │Evidence Blender│
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │  LLM Reasoning │
              └────────────────┘
```

## Core Components

### 1. CLI Layer (`src/cli.ts`)

**Responsibility**: User interface and command routing

**Key Features**:
- Command parsing from process.argv
- Help and version display
- Error handling and user feedback
- Command delegation

**Design**: Simple, focused on routing. No business logic.

### 2. Command Layer (`src/commands/`)

**Responsibility**: Orchestrate operations for each command

#### Index Command (`index.ts`)
- Scans file system for source files
- Coordinates AST parsing
- Manages semantic indexing
- Updates memory store with facts

**Flow**:
1. Validate target path
2. Initialize memory store
3. Find all relevant files
4. For each file:
   - Parse AST
   - Extract symbols
   - Generate embeddings
5. Save repository facts

#### Explain Command (`explain.ts`)
- Gathers evidence from multiple sources
- Blends evidence by relevance
- Invokes LLM for reasoning
- Presents results to user

**Flow**:
1. Load repository facts
2. Search AST for symbol
3. Perform semantic search
4. Query memory store
5. Blend evidence
6. Generate explanation via LLM
7. Display with sources

### 3. AST Engine (`src/core/ast/`)

**Responsibility**: Structural code analysis

**Current Status**: Placeholder returning empty results

**Future Implementation**:
- Use TypeScript Compiler API (`typescript` package)
- Parse source files to AST
- Extract symbols (functions, classes, interfaces, etc.)
- Build navigable symbol table
- Track symbol relationships (imports, inheritance, etc.)

**Data Structure**:
```typescript
{
  "symbols": [
    {
      "name": "MemoryStore",
      "kind": "class",
      "filePath": "src/core/memory/store.ts",
      "line": 12,
      "methods": ["init", "load", "save"],
      "properties": ["storePath", "facts"]
    }
  ]
}
```

### 4. Semantic Search (`src/core/retrieval/semanticSearch.ts`)

**Responsibility**: Vector-based code similarity search

**Current Status**: Placeholder returning empty results

**Future Implementation**:
- Chunk code into meaningful segments
- Generate embeddings (OpenAI, local models, etc.)
- Store in vector database (FAISS, Chroma, etc.)
- Perform similarity search
- Return ranked results with relevance scores

**Chunking Strategy**:
- Function-level: Each function is one chunk
- Class-level: Each class with its methods
- File-level: For small files
- Include docstrings and comments

**Storage**:
```
.repo-brain/
  vectors/
    embeddings.bin    # Vector data
    metadata.json     # Chunk metadata
```

### 5. Memory Store (`src/core/memory/store.ts`)

**Responsibility**: Persistent repository knowledge

**Current Implementation**: JSON file storage

**Stores**:
- Repository metadata (path, language, last indexed)
- Conventions (coding patterns, architectural decisions)
- Symbol counts and statistics
- User-added facts

**Design Decision**: Start with simple JSON, can upgrade to SQLite or other database later without changing interface.

### 6. Evidence Blender (`src/core/retrieval/evidenceBlender.ts`)

**Responsibility**: Combine and rank evidence from multiple sources

**Algorithm**:
1. Collect evidence from all sources
2. Sort by relevance score
3. Remove duplicates
4. Balance sources (don't overwhelm with one type)
5. Limit to top N items
6. Return ranked list

**Future Enhancements**:
- Source diversity scoring
- Temporal relevance (prefer recent changes)
- User feedback learning
- Context-aware ranking

### 7. LLM Client (`src/core/llm/client.ts`)

**Responsibility**: AI reasoning and explanation generation

**Current Status**: Returns placeholder text

**Future Implementation**:
- Provider abstraction (OpenAI, Anthropic, local models)
- Prompt engineering for code understanding
- Context formatting with evidence
- Streaming responses
- Token management

**Prompt Structure**:
```
System: You are an expert code assistant analyzing a repository.

Context:
- Repository: {rootPath}
- Language: {language}
- Conventions: {conventions}

Evidence:
1. [AST] Symbol definition: MemoryStore at src/core/memory/store.ts:12
2. [Semantic] Similar code in src/core/ast/parser.ts
3. [Memory] Convention: Use dependency injection

Question: Explain MemoryStore

Provide a clear, concise explanation.
```

## Data Flow

### Indexing Flow

```
User: repo-brain index
  ↓
CLI: Parse command
  ↓
Index Command: Start indexing
  ↓
File System: Scan for .ts/.js files
  ↓
For each file:
  ├→ AST Parser: Extract symbols
  ├→ Semantic Search: Generate embeddings
  └→ Memory Store: Save metadata
  ↓
Complete: Display summary
```

### Explanation Flow

```
User: repo-brain explain Symbol
  ↓
CLI: Parse command
  ↓
Explain Command: Start explanation
  ↓
Evidence Gathering:
  ├→ AST Engine: Find symbol definition
  ├→ Semantic Search: Find similar code
  └→ Memory Store: Retrieve relevant facts
  ↓
Evidence Blender: Rank and combine
  ↓
LLM Client: Generate explanation
  ↓
Display: Show result with sources
```

## Type System

Central type definitions in `src/types.ts`:

- **Symbol**: Represents code symbols (functions, classes, etc.)
- **Evidence**: Information from any source with relevance score
- **ReasoningContext**: Input to LLM for reasoning
- **RepositoryFacts**: Persistent knowledge about the repo

## Extension Points

The architecture supports easy extension:

1. **New Evidence Sources**: Implement Evidence interface
2. **New Commands**: Add to commands/ and register in CLI
3. **New Storage Backends**: Implement MemoryStore interface
4. **New LLM Providers**: Implement LLMClient interface

## Performance Considerations

- **Incremental Indexing**: Only re-index changed files
- **Lazy Loading**: Load data on-demand
- **Caching**: Cache frequently accessed data
- **Parallel Processing**: Index files in parallel

## Security & Privacy

- **Local-First**: All data stored locally
- **No External Calls**: Until LLM provider is configured
- **Configurable Exclusions**: Exclude sensitive files
- **API Key Management**: Environment variables, never committed

## Future Enhancements

1. **Watch Mode**: Auto-reindex on file changes
2. **Web UI**: Browser-based interface
3. **Multi-Language**: Python, Go, Java support
4. **Graph Analysis**: Call graphs, dependency analysis
5. **Diff Analysis**: Explain changes between commits
6. **Interactive Q&A**: Conversational interface

## Testing Strategy

(To be implemented)

1. **Unit Tests**: Each module independently
2. **Integration Tests**: Command flows end-to-end
3. **Fixture Tests**: Test with known codebases
4. **Performance Tests**: Measure indexing speed

## Deployment

- **NPM Package**: Installable via `npm install -g repo-brain`
- **Binary Distribution**: Standalone executables
- **Docker**: Containerized version
- **VS Code Extension**: IDE integration

---

This architecture provides a solid foundation for an AI-assisted code understanding tool, with clear separation of concerns and multiple extension points for future development.
