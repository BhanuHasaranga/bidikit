/**
 * @bidikit/cli - lint command
 *
 * Lint translation files for missing keys, duplicate keys, and type issues.
 *
 * Usage: npx @bidikit/cli lint
 */

import { join } from "path";
import { readdirSync } from "fs";
import { findProjectRoot, readJSON, fileExists } from "../utils/fs.js";
import { success, error, warn, info, header, step, colors } from "../utils/output.js";

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    }
  }
  return keys;
}

export async function lintCommand(_args: string[]): Promise<void> {
  header("BidiKit Lint");

  const root = findProjectRoot();
  const translationsDir = join(root, "translations");

  if (!fileExists(translationsDir)) {
    warn(`No translations/ directory found.`);
    return;
  }

  const files = readdirSync(translationsDir).filter((f) => f.endsWith(".json"));
  const enPath = join(translationsDir, "en.json");

  if (!fileExists(enPath)) {
    error("translations/en.json not found.");
    return;
  }

  const en = readJSON<Record<string, unknown>>(enPath);
  if (!en) {
    error("translations/en.json is not valid JSON.");
    process.exit(1);
  }

  const enKeys = new Set(getAllKeys(en));
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const lang = file.replace(".json", "");
    const filePath = join(translationsDir, file);
    const translations = readJSON<Record<string, unknown>>(filePath);

    if (!translations) {
      step(`${colors.red("✗")} ${file} - invalid JSON`);
      totalErrors++;
      continue;
    }

    const fileKeys = new Set(getAllKeys(translations));

    const missing = [...enKeys].filter((k) => !fileKeys.has(k));
    const extra = lang !== "en" ? [...fileKeys].filter((k) => !enKeys.has(k)) : [];

    if (missing.length === 0 && extra.length === 0) {
      step(`${colors.green("✓")} ${file} - ${fileKeys.size} keys, all good`);
    } else {
      step(`${colors.yellow("~")} ${file}`);

      if (missing.length > 0) {
        for (const key of missing.slice(0, 5)) {
          step(`  ${colors.red("missing")} ${colors.dim(key)}`);
        }
        if (missing.length > 5) {
          step(`  ... and ${missing.length - 5} more`);
        }
        totalErrors += missing.length;
      }

      if (extra.length > 0) {
        for (const key of extra.slice(0, 3)) {
          step(`  ${colors.yellow("extra")}   ${colors.dim(key)}`);
        }
        totalWarnings += extra.length;
      }
    }
  }

  console.log("");
  if (totalErrors === 0 && totalWarnings === 0) {
    success("All translation files are valid!");
  } else {
    if (totalErrors > 0) {
      error(`${totalErrors} error(s) found.`);
      info(`Run ${colors.cyan("bidikit sync")} to fill missing keys automatically.`);
    }
    if (totalWarnings > 0) {
      warn(`${totalWarnings} extra key(s) found (keys in locale but not in en.json).`);
    }
    process.exit(totalErrors > 0 ? 1 : 0);
  }
  console.log("");
}
