import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom", "@bidikit/core"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  async onSuccess() {
    // Prepend "use client" directive to dist files for Next.js App Router
    const { readFileSync, writeFileSync } = await import("fs");
    const files = ["dist/index.js", "dist/index.cjs"];
    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      if (!content.startsWith('"use client"')) {
        writeFileSync(file, `"use client";\n${content}`);
      }
    }
    console.log("✓ Prepended \"use client\" directive");
  },
});
