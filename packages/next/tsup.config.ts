import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ["next", "react", "react-dom", "@bidikit/core", "@bidikit/react"],
  },
  {
    entry: { middleware: "src/middleware.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    external: ["next", "react", "react-dom", "@bidikit/core", "@bidikit/react"],
  },
  {
    entry: { server: "src/server.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    external: ["next", "react", "react-dom", "@bidikit/core", "@bidikit/react"],
  },
]);
