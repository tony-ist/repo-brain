#!/usr/bin/env node

/**
 * Repo Brain CLI Entry Point
 */

import { logger } from './utils/logger.js';
import { indexCommand } from './commands/index.js';
import { explainCommand } from './commands/explain.js';

const VERSION = '0.1.0';

interface Command {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[]) => Promise<void>;
}

const commands: Command[] = [
  {
    name: 'index',
    description: 'Scan and index the repository',
    usage: 'repo-brain index [path]',
    execute: indexCommand,
  },
  {
    name: 'explain',
    description: 'Explain a symbol or code concept',
    usage: 'repo-brain explain <symbol>',
    execute: explainCommand,
  },
];

function showHelp(): void {
  console.log(`
Repo Brain v${VERSION}
AI-assisted developer tool for exploring and understanding codebases

USAGE:
  repo-brain <command> [options]

COMMANDS:
${commands.map(cmd => `  ${cmd.name.padEnd(12)} ${cmd.description}`).join('\n')}

  help         Show this help message
  version      Show version information

EXAMPLES:
  repo-brain index
  repo-brain index ./my-project
  repo-brain explain MyClass

For more information, visit: https://github.com/yourusername/repo-brain
  `);
}

function showVersion(): void {
  console.log(`Repo Brain v${VERSION}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  if (args[0] === 'version' || args[0] === '--version' || args[0] === '-v') {
    showVersion();
    return;
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  const command = commands.find(cmd => cmd.name === commandName);

  if (!command) {
    logger.error(`Unknown command: ${commandName}`);
    console.log(`Run 'repo-brain help' for usage information.`);
    process.exit(1);
  }

  try {
    await command.execute(commandArgs);
  } catch (error) {
    logger.error(`Command failed: ${error}`);
    process.exit(1);
  }
}

main();
