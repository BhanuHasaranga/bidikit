"use client";

import { useTranslation, useLanguage, useDirection, Row, Container, Navbar, Button, Text, Stack, Column } from "@bidikit/react";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "العربية" },
  { code: "fr", label: "FR", name: "Français" },
];

const FEATURES = [
  { key: "direction", emoji: "🔄" },
  { key: "translation", emoji: "📝" },
  { key: "tailwind", emoji: "🎨" },
  { key: "components", emoji: "🧩" },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { direction, isRTL } = useDirection();

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Navbar */}
      <Navbar
        style={{
          background: "rgba(19,19,26,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Row style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Logo */}
          <Text as="span" style={{ fontWeight: 800, fontSize: "1.25rem", color: "#7c3aed", marginInlineEnd: "auto" }}>
            BidiKit
          </Text>

          {/* Nav links */}
          <Row gap={24} style={{ marginInlineEnd: "2rem" }}>
            {(["home", "about", "docs"] as const).map((key) => (
              <a key={key} href="#" style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", transition: "color 0.2s" }}>
                {t(`nav.${key}`)}
              </a>
            ))}
          </Row>

          {/* Language switcher */}
          <Row gap={8}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: language === lang.code ? "#7c3aed" : "var(--color-border)",
                  background: language === lang.code ? "rgba(124,58,237,0.15)" : "transparent",
                  color: language === lang.code ? "#7c3aed" : "var(--color-text-muted)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                title={lang.name}
              >
                {lang.label}
              </button>
            ))}
          </Row>
        </Row>
      </Navbar>

      {/* Hero */}
      <Container maxWidth={1200} style={{ padding: "0 1.5rem" }}>
        <Column align="center" style={{ paddingBlock: "6rem", textAlign: "center" }}>
          {/* Direction badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            borderRadius: "99px",
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.3)",
            fontSize: "0.8rem",
            color: "#06b6d4",
            marginBlockEnd: "2rem",
          }}>
            <span>{isRTL ? "RTL →" : "← LTR"}</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>{t("currentLanguage", { lang: language.toUpperCase() })}</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: 0,
            marginBlockEnd: "1.5rem",
            background: "linear-gradient(135deg, #fff 0%, #7c3aed 60%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {t("hero.title")}
          </h1>

          <p style={{
            fontSize: "1.2rem",
            color: "var(--color-text-muted)",
            maxWidth: "600px",
            lineHeight: 1.7,
            margin: "0 auto",
            marginBlockEnd: "3rem",
            textAlign: "center",
          }}>
            {t("hero.subtitle")}
          </p>

          <Row gap={16} justify="center" wrap>
            <Button
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white",
                border: "none",
                padding: "0.85rem 2rem",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
              }}
            >
              {t("hero.cta")} →
            </Button>
            <Button
              style={{
                background: "transparent",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                padding: "0.85rem 2rem",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              {t("hero.docs")}
            </Button>
          </Row>
        </Column>

        {/* Features Grid */}
        <Column style={{ paddingBlockEnd: "6rem" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBlockEnd: "3rem",
          }}>
            {t("features.title")}
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {FEATURES.map(({ key, emoji }) => (
              <div
                key={key}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
              >
                <div style={{ fontSize: "2rem", marginBlockEnd: "1rem" }}>{emoji}</div>
                <h3 style={{ fontWeight: 700, marginBlock: "0 0.5rem", fontSize: "1.1rem" }}>
                  {t(`features.${key}.title`)}
                </h3>
                <p style={{ color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0, fontSize: "0.95rem" }}>
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </Column>

        {/* Direction demo */}
        <div style={{
          padding: "2rem",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          marginBlockEnd: "6rem",
          textAlign: isRTL ? "right" : "left",
        }}>
          <Stack gap={12}>
            <Text as="div" style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontFamily: "monospace" }}>
              direction: {direction} | language: {language} | isRTL: {String(isRTL)}
            </Text>
            <Text as="p" style={{ margin: 0 }}>
              {t("tagline")}
            </Text>
          </Stack>
        </div>
      </Container>
    </main>
  );
}
