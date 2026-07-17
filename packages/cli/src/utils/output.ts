/**
 * @bidikit/cli - Colors and output formatting
 */

import pc from "picocolors";

export const colors = pc;

export function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

export function success(message: string): void {
  log(`${pc.green("✓")} ${message}`);
}

export function info(message: string): void {
  log(`${pc.blue("ℹ")} ${message}`);
}

export function warn(message: string): void {
  log(`${pc.yellow("⚠")} ${message}`);
}

export function error(message: string): void {
  log(`${pc.red("✗")} ${message}`);
}

export function header(title: string): void {
  log("");
  log(pc.bold(pc.cyan(`  ${title}`)));
  log("");
}

export function step(message: string): void {
  log(`  ${pc.dim("→")} ${message}`);
}

export function badge(text: string, color: "green" | "blue" | "yellow" | "red" = "blue"): string {
  const colorFn = pc[color];
  return pc.bold(colorFn(`[${text}]`));
}
