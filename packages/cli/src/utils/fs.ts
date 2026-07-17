/**
 * @bidikit/cli - File system utilities
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

/**
 * Check if a file exists at the given path.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Read a JSON file and parse it.
 */
export function readJSON<T = unknown>(filePath: string): T | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Write content to a file, creating directories as needed.
 */
export function writeFile(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf-8");
}

/**
 * Write a JSON object to a file with pretty formatting.
 */
export function writeJSON(filePath: string, data: unknown): void {
  writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Find the project root by looking for package.json.
 */
export function findProjectRoot(startDir = process.cwd()): string {
  let dir = resolve(startDir);
  while (true) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}
