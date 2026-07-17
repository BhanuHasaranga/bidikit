/**
 * @bidikit/next - BidiServerProvider
 *
 * Server-side wrapper that reads locale from headers and passes it
 * to the client BidiProvider for SSR-safe hydration.
 */

import type { ReactNode } from "react";
import { BidiProvider } from "@bidikit/react";
import { getServerLocale } from "./server.js";
import type { BidiConfig } from "@bidikit/core";

export interface BidiServerProviderProps {
  children: ReactNode;
  config: BidiConfig;
}

/**
 * Server-side BidiKit provider for Next.js App Router.
 *
 * Reads the locale from middleware headers and passes it
 * as `initialLanguage` to BidiProvider to prevent hydration mismatches.
 *
 * @example
 * // app/layout.tsx
 * export default async function RootLayout({ children }) {
 *   return (
 *     <BidiServerProvider config={bidiConfig}>
 *       {children}
 *     </BidiServerProvider>
 *   );
 * }
 */
export async function BidiServerProvider({ children, config }: BidiServerProviderProps) {
  const initialLanguage = await getServerLocale(config.defaultLanguage);

  return (
    <BidiProvider config={config} initialLanguage={initialLanguage}>
      {children}
    </BidiProvider>
  );
}
