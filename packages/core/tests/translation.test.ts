import { describe, it, expect } from "vitest";
import { TranslationEngine, getNestedValue, interpolate, getPluralForm } from "../src/translation.js";

describe("getNestedValue", () => {
  it("resolves top-level key", () => {
    expect(getNestedValue({ welcome: "Hello" }, "welcome")).toBe("Hello");
  });

  it("resolves nested key with dot notation", () => {
    const dict = { auth: { login: { title: "Sign In" } } };
    expect(getNestedValue(dict as never, "auth.login.title")).toBe("Sign In");
  });

  it("returns undefined for missing key", () => {
    expect(getNestedValue({ a: "b" }, "missing")).toBeUndefined();
  });

  it("returns undefined for partial path", () => {
    expect(getNestedValue({ a: { b: "c" } } as never, "a.missing")).toBeUndefined();
  });
});

describe("interpolate", () => {
  it("replaces {{variable}} with value", () => {
    expect(interpolate("Hello, {{name}}!", { name: "World" })).toBe("Hello, World!");
  });

  it("replaces multiple variables", () => {
    expect(interpolate("{{greeting}}, {{name}}!", { greeting: "Hi", name: "Alice" })).toBe("Hi, Alice!");
  });

  it("replaces count variable", () => {
    expect(interpolate("{{count}} items", { count: 5 })).toBe("5 items");
  });

  it("leaves unreplaced variables when not provided", () => {
    expect(interpolate("Hello, {{name}}!", {})).toBe("Hello, {{name}}!");
  });

  it("returns template unchanged when no values", () => {
    expect(interpolate("Hello World")).toBe("Hello World");
  });
});

describe("getPluralForm", () => {
  it("returns zero for 0", () => {
    expect(getPluralForm(0)).toBe("zero");
  });

  it("returns one for 1", () => {
    expect(getPluralForm(1)).toBe("one");
  });

  it("returns two for 2", () => {
    expect(getPluralForm(2)).toBe("two");
  });

  it("returns other for 5", () => {
    expect(getPluralForm(5)).toBe("other");
  });

  it("returns other for 100", () => {
    expect(getPluralForm(100)).toBe("other");
  });
});

describe("TranslationEngine", () => {
  const translations = {
    en: {
      common: {
        welcome: "Welcome",
        "auth.login.title": "Sign In",
        items: { one: "{{count}} item", other: "{{count}} items", zero: "No items", two: "{{count}} items" },
      },
    },
    ar: {
      common: {
        welcome: "مرحباً",
      },
    },
  };

  it("resolves a simple key", () => {
    const engine = new TranslationEngine({
      language: "en",
      translations: translations as never,
    });
    const t = engine.createTranslationFunction();
    expect(t("welcome")).toBe("Welcome");
  });

  it("resolves a nested key", () => {
    const engine = new TranslationEngine({
      language: "en",
      translations: {
        en: { common: { auth: { login: { title: "Sign In" } } } },
      } as never,
    });
    const t = engine.createTranslationFunction();
    expect(t("auth.login.title")).toBe("Sign In");
  });

  it("falls back to fallback language", () => {
    const engine = new TranslationEngine({
      language: "ar",
      fallbackLanguage: "en",
      translations: translations as never,
    });
    const t = engine.createTranslationFunction();
    // ar has "welcome" but not "auth.login.title"
    expect(t("welcome")).toBe("مرحباً");
    expect(t("auth.login.title")).toBe("Sign In");
  });

  it("returns key when not found and no fallback", () => {
    const engine = new TranslationEngine({ language: "en" });
    const t = engine.createTranslationFunction();
    expect(t("missing.key")).toBe("missing.key");
  });

  it("returns defaultValue when key is missing", () => {
    const engine = new TranslationEngine({ language: "en" });
    const t = engine.createTranslationFunction();
    expect(t("missing", { defaultValue: "Default" })).toBe("Default");
  });

  it("applies interpolation", () => {
    const engine = new TranslationEngine({
      language: "en",
      translations: { en: { common: { greeting: "Hello, {{name}}!" } } } as never,
    });
    const t = engine.createTranslationFunction();
    expect(t("greeting", { name: "World" })).toBe("Hello, World!");
  });

  it("applies pluralization", () => {
    const engine = new TranslationEngine({
      language: "en",
      translations: translations as never,
    });
    const t = engine.createTranslationFunction();
    expect(t("items", { count: 0 })).toBe("No items");
    expect(t("items", { count: 1 })).toBe("1 item");
    expect(t("items", { count: 5 })).toBe("5 items");
  });

  it("addTranslations merges with existing", () => {
    const engine = new TranslationEngine({ language: "en" });
    engine.addTranslations("en", "common", { hello: "Hello" });
    engine.addTranslations("en", "common", { world: "World" });
    const t = engine.createTranslationFunction();
    expect(t("hello")).toBe("Hello");
    expect(t("world")).toBe("World");
  });
});
