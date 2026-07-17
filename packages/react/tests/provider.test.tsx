import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { BidiProvider } from "../src/provider.js";
import { useLanguage, useDirection, useRTL, useTranslation } from "../src/hooks.js";
import type { BidiConfig } from "@bidikit/core";

const config: BidiConfig = {
  defaultLanguage: "en",
  supportedLanguages: ["en", "ar", "fr"],
  rtlLanguages: ["ar"],
  autoDetect: false,
  autoDirection: false,
  storage: undefined,
  translations: {
    en: { common: { welcome: "Welcome", greeting: "Hello, {{name}}!" } },
    ar: { common: { welcome: "مرحباً" } },
  },
};

function LanguageDisplay() {
  const { language } = useLanguage();
  return <div data-testid="lang">{language}</div>;
}

function DirectionDisplay() {
  const { direction, isRTL, isLTR } = useDirection();
  return (
    <div>
      <span data-testid="dir">{direction}</span>
      <span data-testid="isRTL">{String(isRTL)}</span>
      <span data-testid="isLTR">{String(isLTR)}</span>
    </div>
  );
}

function ToggleButton() {
  const { setLanguage, language } = useLanguage();
  return (
    <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>toggle</button>
  );
}

function TranslationDisplay() {
  const { t } = useTranslation();
  return <div data-testid="t">{t("welcome")}</div>;
}

describe("BidiProvider", () => {
  it("renders children", () => {
    render(
      <BidiProvider config={config}>
        <div data-testid="child">hello</div>
      </BidiProvider>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("provides default language", async () => {
    render(
      <BidiProvider config={config}>
        <LanguageDisplay />
      </BidiProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("lang").textContent).toBe("en");
  });

  it("provides default direction as ltr", async () => {
    render(
      <BidiProvider config={config}>
        <DirectionDisplay />
      </BidiProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("dir").textContent).toBe("ltr");
    expect(screen.getByTestId("isRTL").textContent).toBe("false");
    expect(screen.getByTestId("isLTR").textContent).toBe("true");
  });

  it("updates language when setLanguage is called", async () => {
    render(
      <BidiProvider config={config}>
        <LanguageDisplay />
        <ToggleButton />
      </BidiProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("lang").textContent).toBe("en");
    await act(async () => {
      screen.getByRole("button").click();
    });
    expect(screen.getByTestId("lang").textContent).toBe("ar");
  });

  it("updates direction to rtl for Arabic", async () => {
    render(
      <BidiProvider config={config}>
        <DirectionDisplay />
        <ToggleButton />
      </BidiProvider>,
    );
    await act(async () => {});
    await act(async () => {
      screen.getByRole("button").click();
    });
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
    expect(screen.getByTestId("isRTL").textContent).toBe("true");
  });

  it("provides translation function", async () => {
    render(
      <BidiProvider config={config}>
        <TranslationDisplay />
      </BidiProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("t").textContent).toBe("Welcome");
  });

  it("throws when hooks used outside BidiProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<LanguageDisplay />)).toThrow();
    consoleError.mockRestore();
  });
});
