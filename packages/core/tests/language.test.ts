import { describe, it, expect, beforeEach } from "vitest";
import { LanguageManager } from "../src/language.js";
import type { BidiConfig } from "../src/types.js";

const testConfig: BidiConfig = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "ar", "fr", "he"],
  rtlLanguages: ["ar", "he"],
  autoDetect: false,
  autoDirection: false,
  storage: undefined,
};

describe("LanguageManager", () => {
  let manager: LanguageManager;

  beforeEach(() => {
    manager = new LanguageManager({ config: testConfig });
  });

  it("starts with defaultLanguage", () => {
    expect(manager.language).toBe("en");
  });

  it("sets language correctly", () => {
    manager.setLanguage("ar");
    expect(manager.language).toBe("ar");
  });

  it("updates direction when switching to RTL language", () => {
    manager.setLanguage("ar");
    expect(manager.direction).toBe("rtl");
    expect(manager.isRTL).toBe(true);
    expect(manager.isLTR).toBe(false);
  });

  it("updates direction when switching to LTR language", () => {
    manager.setLanguage("ar");
    manager.setLanguage("en");
    expect(manager.direction).toBe("ltr");
    expect(manager.isRTL).toBe(false);
    expect(manager.isLTR).toBe(true);
  });

  it("throws for unsupported language", () => {
    expect(() => manager.setLanguage("jp")).toThrow();
  });

  it("does not emit event if language is the same", () => {
    let count = 0;
    manager.on("languageChange", () => { count++; });
    manager.setLanguage("en");
    expect(count).toBe(0);
  });

  it("emits languageChange event", () => {
    const events: string[] = [];
    manager.on("languageChange", (e) => events.push(e.language));
    manager.setLanguage("ar");
    manager.setLanguage("fr");
    expect(events).toEqual(["ar", "fr"]);
  });

  it("emits directionChange event only when direction changes", () => {
    const events: string[] = [];
    manager.on("directionChange", (e) => events.push(e.direction));
    manager.setLanguage("ar"); // ltr→rtl
    manager.setLanguage("he"); // rtl→rtl (no change)
    manager.setLanguage("en"); // rtl→ltr
    expect(events).toEqual(["rtl", "ltr"]);
  });

  it("toggleLanguage cycles through all supported languages", () => {
    manager.toggleLanguage();
    expect(manager.language).toBe("ar");
    manager.toggleLanguage();
    expect(manager.language).toBe("fr");
    manager.toggleLanguage();
    expect(manager.language).toBe("he");
    manager.toggleLanguage();
    expect(manager.language).toBe("en");
  });

  it("toggleLanguage between two languages", () => {
    manager.toggleLanguage(["en", "ar"]);
    expect(manager.language).toBe("ar");
    manager.toggleLanguage(["en", "ar"]);
    expect(manager.language).toBe("en");
  });

  it("unsubscribes from events", () => {
    let count = 0;
    const unsub = manager.on("languageChange", () => { count++; });
    manager.setLanguage("ar");
    unsub();
    manager.setLanguage("fr");
    expect(count).toBe(1);
  });

  it("returns correct locale object", () => {
    manager.setLanguage("ar");
    const locale = manager.locale;
    expect(locale.code).toBe("ar");
    expect(locale.direction).toBe("rtl");
  });

  it("returns all supported languages", () => {
    expect(manager.supportedLanguages).toEqual(["en", "ar", "fr", "he"]);
  });

  it("init applies defaultLanguage without autoDetect", async () => {
    await manager.init();
    expect(manager.language).toBe("en");
  });
});
