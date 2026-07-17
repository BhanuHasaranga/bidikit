#!/usr/bin/env node
/**
 * @bidikit/css - Simple CSS build script
 * Copies CSS files from src to dist.
 */

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "../src");
const distDir = join(__dirname, "../dist");

mkdirSync(distDir, { recursive: true });

const files = ["index.css", "reset.css", "utilities.css", "variables.css"];

for (const file of files) {
  copyFileSync(join(srcDir, file), join(distDir, file));
  console.log(`✓ Copied ${file}`);
}

console.log("✓ Build complete");
