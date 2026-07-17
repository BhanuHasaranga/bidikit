/**
 * @bidikit/cli - init command
 *
 * Scaffolds BidiKit configuration and initial translation files.
 *
 * Usage: npx @bidikit/cli init
 */

import { join } from "path";
import { fileExists, writeFile, writeJSON, findProjectRoot } from "../utils/fs.js";
import { success, info, warn, header, step, colors } from "../utils/output.js";

const CONFIG_TEMPLATE = `import type { BidiConfig } from "@bidikit/core";

const config: BidiConfig = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "ar"],
  rtlLanguages: ["ar", "he", "fa", "ur"],
  storage: "localStorage",
  autoDetect: true,
  autoDirection: true,
  mirrorIcons: true,
  mirrorImages: false,
  animations: true,
};

export default config;
`;

const EN_TRANSLATIONS = {
  welcome: "Welcome",
  auth: {
    login: {
      title: "Sign In",
      button: "Sign in",
    },
    logout: "Sign Out",
  },
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
  },
};

const AR_TRANSLATIONS = {
  welcome: "مرحباً",
  auth: {
    login: {
      title: "تسجيل الدخول",
      button: "دخول",
    },
    logout: "تسجيل الخروج",
  },
  nav: {
    home: "الرئيسية",
    about: "حول",
    contact: "تواصل",
  },
};

export async function initCommand(_args: string[]): Promise<void> {
  header("BidiKit Init");

  const root = findProjectRoot();
  info(`Project root: ${colors.dim(root)}`);

  let created = 0;

  // 1. bidikit.config.ts
  const configPath = join(root, "bidikit.config.ts");
  if (fileExists(configPath)) {
    warn(`bidikit.config.ts already exists - skipping`);
  } else {
    writeFile(configPath, CONFIG_TEMPLATE);
    step(`Created ${colors.cyan("bidikit.config.ts")}`);
    created++;
  }

  // 2. Translation directory
  const translationsDir = join(root, "translations");

  // English
  const enPath = join(translationsDir, "en.json");
  if (fileExists(enPath)) {
    warn(`translations/en.json already exists - skipping`);
  } else {
    writeJSON(enPath, EN_TRANSLATIONS);
    step(`Created ${colors.cyan("translations/en.json")}`);
    created++;
  }

  // Arabic
  const arPath = join(translationsDir, "ar.json");
  if (fileExists(arPath)) {
    warn(`translations/ar.json already exists - skipping`);
  } else {
    writeJSON(arPath, AR_TRANSLATIONS);
    step(`Created ${colors.cyan("translations/ar.json")}`);
    created++;
  }

  console.log("");
  success(`BidiKit initialized! ${colors.dim(`(${created} files created)`)}`);
  console.log("");
  info("Next steps:");
  step(`Install packages: ${colors.cyan("npm install @bidikit/core @bidikit/react")}`);
  step(`Wrap your app with ${colors.cyan("<BidiProvider config={config}>")}`);
  step(`Use translations with ${colors.cyan('const { t } = useTranslation()')}`);
  console.log("");
}
