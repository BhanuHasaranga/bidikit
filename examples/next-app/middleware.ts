import { createBidiMiddleware } from "@bidikit/next";

export const middleware = createBidiMiddleware({
  supportedLanguages: ["en", "ar", "fr"],
  defaultLanguage: "en",
  rtlLanguages: ["ar"],
});

export const config = {
  matcher: ["/((?!_next|api|favicon|images|icons).*)"],
};
