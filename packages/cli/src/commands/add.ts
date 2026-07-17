/**
 * @bidikit/cli - add command
 *
 * Add a new language to the project.
 *
 * Usage: npx @bidikit/cli add <language-code>
 */

import { join } from "path";
import { fileExists, readJSON, writeJSON, findProjectRoot } from "../utils/fs.js";
import { success, error, warn, header, step, info, colors } from "../utils/output.js";

const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur", "sd", "ku", "ps", "dv", "yi"]);

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ar: "العربية (Arabic)",
  fr: "Français (French)",
  es: "Español (Spanish)",
  de: "Deutsch (German)",
  he: "עברית (Hebrew)",
  fa: "فارسی (Persian)",
  ur: "اردو (Urdu)",
  zh: "中文 (Chinese)",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
  pt: "Português (Portuguese)",
  ru: "Русский (Russian)",
  tr: "Türkçe (Turkish)",
  it: "Italiano (Italian)",
  nl: "Nederlands (Dutch)",
  pl: "Polski (Polish)",
  sv: "Svenska (Swedish)",
};

export async function addCommand(args: string[]): Promise<void> {
  const language = args[0];

  if (!language) {
    error("Please provide a language code.");
    info(`Usage: ${colors.cyan("bidikit add <language-code>")}`);
    info(`Example: ${colors.cyan("bidikit add ar")}`);
    process.exit(1);
  }

  header(`BidiKit Add: ${language}`);

  const root = findProjectRoot();
  const translationsDir = join(root, "translations");
  const targetPath = join(translationsDir, `${language}.json`);
  const enPath = join(translationsDir, "en.json");

  // Check if already exists
  if (fileExists(targetPath)) {
    warn(`translations/${language}.json already exists - skipping`);
    return;
  }

  // Read English template as a base
  let template: Record<string, unknown> = { welcome: `[${language}] Welcome` };
  if (fileExists(enPath)) {
    const en = readJSON<Record<string, unknown>>(enPath);
    if (en) {
      template = stubTranslations(en, language);
    }
  }

  writeJSON(targetPath, template);

  const name = LANGUAGE_NAMES[language] ?? language;
  const dir = RTL_LANGUAGES.has(language) ? "RTL" : "LTR";

  step(`Created ${colors.cyan(`translations/${language}.json`)}`);
  step(`Language: ${colors.bold(name)}`);
  step(`Direction: ${dir === "RTL" ? colors.yellow("RTL") : colors.blue("LTR")}`);

  console.log("");
  success(`Language "${language}" added successfully!`);
  info(`Don't forget to add ${colors.cyan(`"${language}"`)} to your ${colors.cyan("bidikit.config.ts")} supportedLanguages.`);
  if (RTL_LANGUAGES.has(language)) {
    info(`Add ${colors.cyan(`"${language}"`)} to rtlLanguages in your config.`);
  }
  console.log("");
}

/**
 * Stub out translations for a new language based on a template.
 */
function stubTranslations(
  template: Record<string, unknown>,
  lang: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(template)) {
    if (typeof value === "string") {
      result[key] = `[${lang}] ${value}`;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = stubTranslations(value as Record<string, unknown>, lang);
    } else {
      result[key] = value;
    }
  }
  return result;
}
