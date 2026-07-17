/**
 * @bidikit/cli - extract command
 *
 * Extract translation keys from source files by scanning for t() calls.
 *
 * Usage: npx @bidikit/cli extract
 */

import { join } from "path";
import { readdirSync, readFileSync, statSync } from "fs";
import { findProjectRoot, readJSON, writeJSON } from "../utils/fs.js";
import { success, info, warn, header, step, colors } from "../utils/output.js";

/** Pattern to match t("key") and t('key') */
const T_CALL_PATTERN = /\bt\(\s*["'`]([^"'`]+)["'`]/g;

function* walkFiles(dir: string, extensions: string[]): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && !entry.startsWith(".") && entry !== "node_modules" && entry !== "dist") {
      yield* walkFiles(fullPath, extensions);
    } else if (stat.isFile() && extensions.some((ext) => fullPath.endsWith(ext))) {
      yield fullPath;
    }
  }
}

function extractKeysFromFile(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const keys: string[] = [];
  let match: RegExpExecArray | null;
  const pattern = new RegExp(T_CALL_PATTERN.source, "g");
  while ((match = pattern.exec(content)) !== null) {
    if (match[1]) keys.push(match[1]);
  }
  return keys;
}

function setNestedKey(obj: Record<string, unknown>, key: string, value: string): void {
  const parts = key.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    if (!current[part] || typeof current[part] !== "object") {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  const lastPart = parts[parts.length - 1]!;
  if (!current[lastPart]) {
    current[lastPart] = value;
  }
}

export async function extractCommand(_args: string[]): Promise<void> {
  header("BidiKit Extract");

  const root = findProjectRoot();
  const extensions = [".ts", ".tsx", ".js", ".jsx"];
  const srcDirs = ["src", "app", "pages", "components"].map((d) => join(root, d));

  const allKeys = new Set<string>();

  for (const srcDir of srcDirs) {
    try {
      for (const file of walkFiles(srcDir, extensions)) {
        const keys = extractKeysFromFile(file);
        for (const key of keys) allKeys.add(key);
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }

  if (allKeys.size === 0) {
    warn("No translation keys found. Make sure you use t() in your components.");
    return;
  }

  step(`Found ${colors.bold(String(allKeys.size))} translation keys`);

  // Build object from keys
  const extracted: Record<string, unknown> = {};
  for (const key of allKeys) {
    setNestedKey(extracted, key, key);
  }

  // Merge with existing en.json
  const enPath = join(root, "translations", "en.json");
  const existing = readJSON<Record<string, unknown>>(enPath) ?? {};
  const merged = deepMerge(existing, extracted);
  writeJSON(enPath, merged);

  step(`Updated ${colors.cyan("translations/en.json")}`);
  console.log("");
  success(`Extracted ${allKeys.size} keys!`);
  info(`Run ${colors.cyan("bidikit sync")} to sync to other languages.`);
  console.log("");
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value) &&
        typeof target[key] === "object" && target[key] !== null) {
      result[key] = deepMerge(target[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else if (!(key in target)) {
      result[key] = value;
    }
  }
  return result;
}
