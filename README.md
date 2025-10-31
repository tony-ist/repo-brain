# Repo Brain

AI-assisted developer tool for exploring, understanding, and reasoning about codebases over time.

## Overview

Repo Brain is designed to help engineers work with complex codebases by combining structural and semantic understanding. Unlike typical AI code assistants, Repo Brain emphasizes:

- **Context Persistence**: Maintains structured memory of repository facts and conventions
- **Multi-Source Intelligence**: Combines AST parsing, semantic search, and memory
- **Modular Architecture**: Clean separation of concerns for future expansion
- **Local-First**: Works on your machine, indexing and analyzing your code

## Architecture

Repo Brain follows a modular, layered architecture:

```
┌─────────────────────────────────────────────────┐
│              CLI Interface                       │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│          Intent Classifier/Planner               │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────────────┐         ┌─────────────────┐
│   Retrieval   │         │   Reasoning     │
│   Pipeline    │────────▶│   Layer (LLM)   │
└───────────────┘         └─────────────────┘
        │
   ┌────┴────┬────────┬────────┐
   │         │        │        │
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ AST  │ │Semantic│ │Memory│ │Evidence│
│Engine│ │ Search │ │Store │ │Blender│
└──────┘ └────────┘ └──────┘ └────────┘
```

### Core Modules

- **AST Parser** (`src/core/ast/`): Structural code analysis
- **Semantic Search** (`src/core/retrieval/`): Vector-based code search
- **Memory Store** (`src/core/memory/`): Persistent facts and conventions
- **LLM Client** (`src/core/llm/`): AI reasoning and explanation
- **Evidence Blender**: Combines and ranks information sources

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/repo-brain.git
cd repo-brain

# Install dependencies
npm install

# Build the project
npm run build

# Link for global usage (optional)
npm link
```

## Usage

### Index a Repository

Scan and index your codebase:

```bash
# Index current directory
repo-brain index

# Index specific directory
repo-brain index ./path/to/project
```

This creates a `.repo-brain` directory with indexed data.

### Explain Code

Get explanations for symbols or concepts:

```bash
# Explain a symbol
repo-brain explain MyClass

# Explain a concept
repo-brain explain "authentication flow"
```

### Development Mode

Run without building:

```bash
npm run dev index
npm run dev explain MyClass
```

## Current Status (MVP)

This is the initial MVP with placeholder implementations. The architecture and scaffolding are complete, ready for expansion:

### Implemented
- ✅ Project structure and TypeScript configuration
- ✅ CLI interface with command routing
- ✅ Module placeholders for all core components
- ✅ Basic index and explain commands
- ✅ Memory store with JSON persistence
- ✅ Evidence blending system
- ✅ Logging and file system utilities

### Placeholder (Ready for Implementation)
- ⏳ AST parsing (currently returns empty)
- ⏳ Semantic search with embeddings (currently returns empty)
- ⏳ LLM integration (currently returns placeholder text)
- ⏳ Symbol resolution and code navigation

## Roadmap

### Phase 1: Core Functionality
- [ ] Implement TypeScript AST parsing with TypeScript Compiler API
- [ ] Add basic symbol extraction (functions, classes, interfaces)
- [ ] Create symbol index and lookup

### Phase 2: Semantic Search
- [ ] Integrate vector embeddings (OpenAI, local models, etc.)
- [ ] Implement code chunking strategy
- [ ] Add vector store (FAISS, Chroma, etc.)

### Phase 3: AI Reasoning
- [ ] Integrate LLM provider (OpenAI, Anthropic, etc.)
- [ ] Design prompts for code explanation
- [ ] Add streaming responses

### Phase 4: Enhanced Features
- [ ] Support for multiple languages (Python, Go, etc.)
- [ ] Code change tracking and diffs
- [ ] Architectural pattern detection
- [ ] Interactive Q&A mode

## Project Structure

```
repo-brain/
├── src/
│   ├── cli.ts                 # CLI entry point
│   ├── types.ts               # Type definitions
│   ├── commands/              # CLI commands
│   │   ├── index.ts           # Index command
│   │   └── explain.ts         # Explain command
│   ├── core/
│   │   ├── ast/               # AST parsing
│   │   │   └── parser.ts
│   │   ├── retrieval/         # Search and retrieval
│   │   │   ├── semanticSearch.ts
│   │   │   └── evidenceBlender.ts
│   │   ├── memory/            # Persistent storage
│   │   │   └── store.ts
│   │   └── llm/               # LLM integration
│   │       └── client.ts
│   └── utils/
│       ├── logger.ts          # Logging utility
│       └── fileSystem.ts      # File operations
├── dist/                      # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with tsx
- `npm run watch` - Watch mode for development
- `npm start` - Run compiled version

### Design Principles

1. **Modularity**: Each component has a single responsibility
2. **Extensibility**: Easy to add new sources of evidence or reasoning
3. **Type Safety**: Comprehensive TypeScript types throughout
4. **Professional Standards**: Clean code, logging, error handling

## Contributing

This is a demonstration project showcasing:
- Clean architecture and separation of concerns
- Professional TypeScript development
- AI/ML integration patterns
- Developer tool design

## License

ISC

## Acknowledgments

Built as a foundation for exploring AI-powered code understanding and agentic tooling in realistic developer environments.
