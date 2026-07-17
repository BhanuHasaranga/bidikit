/**
 * @bidikit/cli - doctor command
 *
 * Diagnose BidiKit configuration issues.
 *
 * Usage: npx @bidikit/cli doctor
 */

import { join } from "path";
import { fileExists, readJSON, findProjectRoot } from "../utils/fs.js";
import { success, error, warn, info, header, step, colors } from "../utils/output.js";

interface DiagnosticResult {
  passed: boolean;
  message: string;
  hint?: string;
}

export async function doctorCommand(_args: string[]): Promise<void> {
  header("BidiKit Doctor");

  const root = findProjectRoot();
  const results: DiagnosticResult[] = [];

  // ─── Check 1: package.json ───────────────────
  const pkgPath = join(root, "package.json");
  if (fileExists(pkgPath)) {
    const pkg = readJSON<{ dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>(pkgPath);
    const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };

    // Check @bidikit/core
    results.push({
      passed: Boolean(deps["@bidikit/core"] || deps["bidikit"]),
      message: "@bidikit/core is installed",
      hint: `Run: ${colors.cyan("npm install @bidikit/core")}`,
    });

    // Check React
    if (deps["react"]) {
      results.push({
        passed: Boolean(deps["@bidikit/react"]),
        message: "@bidikit/react is installed (React project detected)",
        hint: `Run: ${colors.cyan("npm install @bidikit/react")}`,
      });
    }

    // Check Next.js
    if (deps["next"]) {
      results.push({
        passed: Boolean(deps["@bidikit/next"]),
        message: "@bidikit/next is installed (Next.js project detected)",
        hint: `Run: ${colors.cyan("npm install @bidikit/next")}`,
      });
    }

    // Check Tailwind
    if (deps["tailwindcss"]) {
      results.push({
        passed: Boolean(deps["@bidikit/tailwind"]),
        message: "@bidikit/tailwind is installed (Tailwind project detected)",
        hint: `Run: ${colors.cyan("npm install @bidikit/tailwind")}`,
      });
    }
  }

  // ─── Check 2: bidikit.config.ts ─────────────
  results.push({
    passed: fileExists(join(root, "bidikit.config.ts")) || fileExists(join(root, "bidikit.config.js")),
    message: "bidikit.config.ts exists",
    hint: `Run: ${colors.cyan("bidikit init")} to create it`,
  });

  // ─── Check 3: Translations ───────────────────
  const translationsDir = join(root, "translations");
  const enExists = fileExists(join(translationsDir, "en.json"));
  results.push({
    passed: enExists,
    message: "translations/en.json exists",
    hint: `Run: ${colors.cyan("bidikit init")} to scaffold translations`,
  });

  // ─── Check 4: Validate translation keys ──────
  if (enExists) {
    const enTranslations = readJSON(join(translationsDir, "en.json"));
    results.push({
      passed: enTranslations !== null && typeof enTranslations === "object",
      message: "translations/en.json is valid JSON",
    });
  }

  // ─── Print results ───────────────────────────
  let passed = 0;
  let failed = 0;

  for (const result of results) {
    if (result.passed) {
      step(`${colors.green("✓")} ${result.message}`);
      passed++;
    } else {
      step(`${colors.red("✗")} ${result.message}`);
      if (result.hint) {
        step(`  ${colors.dim(result.hint)}`);
      }
      failed++;
    }
  }

  console.log("");
  if (failed === 0) {
    success(`All ${passed} checks passed!`);
  } else {
    warn(`${passed} passed, ${failed} failed.`);
    info(`Fix the issues above and run ${colors.cyan("bidikit doctor")} again.`);
  }
  console.log("");
}
