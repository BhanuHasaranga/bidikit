import type { Metadata } from "next";
import { BidiServerProvider } from "@bidikit/next";
import bidiConfig from "../bidikit.config";
import "./globals.css";

export const metadata: Metadata = {
  title: "BidiKit Demo - RTL/LTR Web App",
  description: "Demo application showcasing BidiKit's RTL/LTR capabilities",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <BidiServerProvider config={bidiConfig}>
          {children}
        </BidiServerProvider>
      </body>
    </html>
  );
}
