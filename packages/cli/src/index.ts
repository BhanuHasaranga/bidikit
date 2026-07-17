/**
 * @bidikit/cli - Main CLI entry point
 *
 * Routes command arguments to the appropriate command handler.
 */

import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { doctorCommand } from "./commands/doctor.js";
import { extractCommand } from "./commands/extract.js";
import { syncCommand } from "./commands/sync.js";
import { lintCommand } from "./commands/lint.js";
import { header, error, info, colors } from "./utils/output.js";

const VERSION = "1.0.0";

function printHelp(): void {
  header("BidiKit CLI");
  console.log("  The missing layer for RTL & LTR web applications.\n");
  console.log("  " + colors.bold("Usage:"));
  console.log("    bidikit <command> [options]\n");
  console.log("  " + colors.bold("Commands:"));
  console.log(`    ${colors.cyan("init")}              Initialize BidiKit in your project`);
  console.log(`    ${colors.cyan("add <lang>")}        Add a new language`);
  console.log(`    ${colors.cyan("doctor")}            Diagnose configuration issues`);
  console.log(`    ${colors.cyan("extract")}           Extract translation keys from source files`);
  console.log(`    ${colors.cyan("sync")}              Sync missing keys across locale files`);
  console.log(`    ${colors.cyan("lint")}              Lint translation files for errors`);
  console.log(`    ${colors.cyan("--version, -v")}     Show version`);
  console.log(`    ${colors.cyan("--help, -h")}        Show this help\n`);
  console.log("  " + colors.bold("Examples:"));
  console.log(`    ${colors.dim("$ bidikit init")}`);
  console.log(`    ${colors.dim("$ bidikit add ar")}`);
  console.log(`    ${colors.dim("$ bidikit sync")}\n`);
}

export async function run(args: string[]): Promise<void> {
  const [command, ...rest] = args;

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "--version" || command === "-v") {
    console.log(VERSION);
    return;
  }

  switch (command) {
    case "init":
      await initCommand(rest);
      break;
    case "add":
      await addCommand(rest);
      break;
    case "doctor":
      await doctorCommand(rest);
      break;
    case "extract":
      await extractCommand(rest);
      break;
    case "sync":
      await syncCommand(rest);
      break;
    case "lint":
      await lintCommand(rest);
      break;
    default:
      error(`Unknown command: ${colors.bold(command)}`);
      info(`Run ${colors.cyan("bidikit --help")} to see available commands.`);
      process.exit(1);
  }
}
