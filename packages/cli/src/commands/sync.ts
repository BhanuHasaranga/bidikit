/**
 * @bidikit/cli - sync command
 *
 * Sync missing translation keys across all locale files.
 *
 * Usage: npx @bidikit/cli sync
 */

import { join } from "path";
import { readdirSync } from "fs";
import { findProjectRoot, readJSON, writeJSON, fileExists } from "../utils/fs.js";
import { success, warn, info, header, step, colors } from "../utils/output.js";

function getMissingKeys(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  prefix = "",
): string[] {
  const missing: string[] = [];
  for (const [key, value] of Object.entries(source)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) {
      missing.push(fullKey);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      missing.push(...getMissingKeys(
        value as Record<string, unknown>,
        (target[key] ?? {}) as Record<string, unknown>,
        fullKey,
      ));
    }
  }
  return missing;
}

function fillMissing(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  lang: string,
): Record<string, unknown> {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (!(key in result)) {
      if (typeof value === "object" && value !== null) {
        result[key] = fillMissing(value as Record<string, unknown>, {}, lang);
      } else {
        result[key] = `[${lang}] ${String(value)}`;
      }
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = fillMissing(
        value as Record<string, unknown>,
        (result[key] ?? {}) as Record<string, unknown>,
        lang,
      );
    }
  }
  return result;
}

export async function syncCommand(_args: string[]): Promise<void> {
  header("BidiKit Sync");

  const root = findProjectRoot();
  const translationsDir = join(root, "translations");

  if (!fileExists(translationsDir)) {
    warn(`No translations/ directory found. Run ${colors.cyan("bidikit init")} first.`);
    return;
  }

  const files = readdirSync(translationsDir).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    warn("No JSON files found in translations/");
    return;
  }

  // Use English as the source of truth
  const enPath = join(translationsDir, "en.json");
  if (!fileExists(enPath)) {
    warn(`translations/en.json not found. This is used as the source of truth.`);
    return;
  }

  const en = readJSON<Record<string, unknown>>(enPath);
  if (!en) {
    warn("Could not parse translations/en.json");
    return;
  }

  let totalSynced = 0;

  for (const file of files) {
    if (file === "en.json") continue;

    const lang = file.replace(".json", "");
    const targetPath = join(translationsDir, file);
    const target = readJSON<Record<string, unknown>>(targetPath) ?? {};

    const missing = getMissingKeys(en, target);

    if (missing.length === 0) {
      step(`${colors.green("✓")} ${lang}.json - up to date`);
    } else {
      const filled = fillMissing(en, target, lang);
      writeJSON(targetPath, filled);
      step(`${colors.yellow("~")} ${lang}.json - added ${missing.length} missing keys`);
      totalSynced += missing.length;
    }
  }

  console.log("");
  if (totalSynced === 0) {
    success("All translations are in sync!");
  } else {
    success(`Synced ${totalSynced} missing keys across ${files.length - 1} language files.`);
    info(`Fill in the ${colors.cyan(`[lang] prefix`)} stubs with real translations.`);
  }
  console.log("");
}
