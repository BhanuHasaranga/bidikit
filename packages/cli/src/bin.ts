/**
 * @bidikit/cli - CLI Entry Point (bin)
 *
 * Executable: npx @bidikit/cli <command>
 */

import { run } from "./index.js";

run(process.argv.slice(2));
