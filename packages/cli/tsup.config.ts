import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ["picocolors"],
  },
  {
    entry: { bin: "src/bin.ts" },
    format: ["esm"],
    clean: false,
    banner: {
      js: "#!/usr/bin/env node",
    },
    external: ["picocolors"],
  },
]);
