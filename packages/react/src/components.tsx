/**
 * @bidikit/react - Direction-aware Components
 *
 * Layout and UI primitives that automatically adapt to the current text direction.
 */

"use client";

import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { useDirection, useRTL } from "./hooks.js";

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

function mergeStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return Object.assign({}, ...styles);
}

// ─────────────────────────────────────────────
// Row - direction-aware horizontal flex container
// ─────────────────────────────────────────────

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  gap?: number | string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
}

/**
 * Direction-aware horizontal flex container.
 * Automatically reverses flex-direction in RTL.
 *
 * @example
 * <Row gap={8} align="center">...</Row>
 */
export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ children, gap, align = "center", justify = "flex-start", wrap = false, style, ...props }, ref) => {
    const { direction } = useDirection();
    return (
      <div
        ref={ref}
        style={mergeStyles(
          {
            display: "flex",
            flexDirection: direction === "rtl" ? "row-reverse" : "row",
            alignItems: align,
            justifyContent: justify,
            flexWrap: wrap ? "wrap" : "nowrap",
            gap: typeof gap === "number" ? `${gap}px` : gap,
          },
          style,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Row.displayName = "Row";

// ─────────────────────────────────────────────
// Column
// ─────────────────────────────────────────────

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  gap?: number | string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
}

/**
 * Vertical flex container.
 *
 * @example
 * <Column gap={16}>...</Column>
 */
export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ children, gap, align = "stretch", justify = "flex-start", style, ...props }, ref) => (
    <div
      ref={ref}
      style={mergeStyles(
        {
          display: "flex",
          flexDirection: "column",
          alignItems: align,
          justifyContent: justify,
          gap: typeof gap === "number" ? `${gap}px` : gap,
        },
        style,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Column.displayName = "Column";

// ─────────────────────────────────────────────
// Stack - auto direction-aware (Row on desktop, Column on mobile)
// ─────────────────────────────────────────────

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  direction?: "row" | "column";
  gap?: number | string;
}

/**
 * Direction-aware stack - defaults to row.
 *
 * @example
 * <Stack direction="row" gap={8}>...</Stack>
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ children, direction: stackDir = "row", gap, style, ...props }, ref) => {
    const { direction } = useDirection();
    const flexDir =
      stackDir === "row"
        ? direction === "rtl"
          ? "row-reverse"
          : "row"
        : "column";

    return (
      <div
        ref={ref}
        style={mergeStyles(
          {
            display: "flex",
            flexDirection: flexDir,
            gap: typeof gap === "number" ? `${gap}px` : gap,
          },
          style,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Stack.displayName = "Stack";

// ─────────────────────────────────────────────
// Spacer
// ─────────────────────────────────────────────

export interface SpacerProps {
  size?: number | string;
  axis?: "horizontal" | "vertical";
}

/**
 * Flexible spacer component.
 *
 * @example
 * <Spacer size={16} />
 */
export function Spacer({ size = "auto", axis = "horizontal" }: SpacerProps) {
  const style: CSSProperties =
    axis === "horizontal"
      ? { display: "inline-block", width: typeof size === "number" ? `${size}px` : size, flexShrink: 0 }
      : { display: "block", height: typeof size === "number" ? `${size}px` : size, flexShrink: 0 };

  return <span aria-hidden="true" style={style} />;
}

// ─────────────────────────────────────────────
// Container
// ─────────────────────────────────────────────

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  maxWidth?: number | string;
  center?: boolean;
}

/**
 * Direction-aware container with optional max width and centering.
 *
 * @example
 * <Container maxWidth={1200} center>...</Container>
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, maxWidth = "100%", center = true, style, ...props }, ref) => {
    const { direction } = useDirection();
    return (
      <div
        ref={ref}
        dir={direction}
        style={mergeStyles(
          {
            maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            width: "100%",
            marginInline: center ? "auto" : undefined,
          },
          style,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Container.displayName = "Container";

// ─────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padding?: number | string;
}

/**
 * Direction-aware card with logical property padding.
 *
 * @example
 * <Card padding={24}>...</Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, padding = 16, style, ...props }, ref) => {
    const { direction } = useDirection();
    const p = typeof padding === "number" ? `${padding}px` : padding;
    return (
      <div
        ref={ref}
        dir={direction}
        style={mergeStyles(
          {
            paddingInline: p,
            paddingBlock: p,
            borderRadius: "8px",
            boxSizing: "border-box",
          },
          style,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

// ─────────────────────────────────────────────
// Text
// ─────────────────────────────────────────────

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "label";
}

/**
 * Direction-aware text wrapper.
 *
 * @example
 * <Text as="p">{t("welcome")}</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  ({ children, as: Tag = "span", style, ...props }, ref) => {
    const { direction } = useDirection();
    return (
      <Tag
        ref={ref as never}
        dir={direction}
        style={mergeStyles({ textAlign: "start" }, style)}
        {...(props as HTMLAttributes<HTMLElement>)}
      >
        {children}
      </Tag>
    );
  },
);
Text.displayName = "Text";

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * Direction-aware button.
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>{t("auth.login.title")}</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", style, ...props }, ref) => {
    const { direction } = useDirection();
    return (
      <button
        ref={ref}
        dir={direction}
        data-variant={variant}
        style={mergeStyles(
          {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5em",
            paddingInline: "1em",
            paddingBlock: "0.5em",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "inherit",
          },
          style,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

// ─────────────────────────────────────────────
// Icon
// ─────────────────────────────────────────────

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Icon name used for auto-mirroring */
  name?: string;
  /** Force mirror regardless of auto-detection */
  mirror?: boolean;
  size?: number | string;
}

/**
 * Direction-aware icon wrapper with optional auto-mirroring.
 *
 * @example
 * <Icon name="arrow-right"><ArrowRightIcon /></Icon>
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ children, name, mirror: forceMirror, size, style, ...props }, ref) => {
    const isRTL = useRTL();
    const shouldMirrorResult =
      forceMirror !== undefined
        ? forceMirror
        : name
          ? isRTL
          : false;

    return (
      <span
        ref={ref}
        aria-hidden="true"
        style={mergeStyles(
          {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transform: shouldMirrorResult ? "scaleX(-1)" : "none",
            fontSize: typeof size === "number" ? `${size}px` : size,
            lineHeight: 1,
            flexShrink: 0,
          },
          style,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
Icon.displayName = "Icon";

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: number;
  initials?: string;
}

/**
 * Avatar component - shows image or initials.
 *
 * @example
 * <Avatar src="/avatar.jpg" alt="User" size={40} />
 * <Avatar initials="JD" size={40} />
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", size = 40, initials, style, ...props }, ref) => (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      style={mergeStyles(
        {
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: `${Math.round(size * 0.4)}px`,
          fontWeight: 600,
          textTransform: "uppercase",
        },
        style,
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  ),
);
Avatar.displayName = "Avatar";

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  height?: number | string;
}

/**
 * Direction-aware navigation bar.
 *
 * @example
 * <Navbar>
 *   <Logo />
 *   <NavLinks />
 * </Navbar>
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ children, height = 64, style, ...props }, ref) => {
    const { direction } = useDirection();
    return (
      <nav
        ref={ref}
        dir={direction}
        style={mergeStyles(
          {
            display: "flex",
            flexDirection: direction === "rtl" ? "row-reverse" : "row",
            alignItems: "center",
            height: typeof height === "number" ? `${height}px` : height,
            paddingInline: "1rem",
            boxSizing: "border-box",
            width: "100%",
          },
          style,
        )}
        {...props}
      >
        {children}
      </nav>
    );
  },
);
Navbar.displayName = "Navbar";

// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  position?: "start" | "end";
  width?: number | string;
}

/**
 * Direction-aware sidebar. Uses `position="start"` for the primary sidebar.
 * In LTR: start = left. In RTL: start = right.
 *
 * @example
 * <Sidebar position="start" width={256}>...</Sidebar>
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ children, position = "start", width = 256, style, ...props }, ref) => {
    const { direction } = useDirection();
    const isStart = position === "start";
    const isLeft = direction === "ltr" ? isStart : !isStart;

    return (
      <aside
        ref={ref as never}
        dir={direction}
        style={mergeStyles(
          {
            width: typeof width === "number" ? `${width}px` : width,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            paddingInline: "0.5rem",
            boxSizing: "border-box",
            order: isLeft ? -1 : 1,
          },
          style,
        )}
        {...(props as HTMLAttributes<HTMLElement>)}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

// ─────────────────────────────────────────────
// Image (with optional mirroring)
// ─────────────────────────────────────────────

export interface BidiImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** If true, mirrors the image in RTL */
  mirror?: boolean;
}

/**
 * Image component with optional RTL mirroring.
 *
 * @example
 * <BidiImage src="/diagram.svg" mirror />
 */
export const BidiImage = forwardRef<HTMLImageElement, BidiImageProps>(
  ({ mirror = false, style, ...props }, ref) => {
    const isRTL = useRTL();
    const shouldMirrorResult = mirror && isRTL;

    return (
      <img
        ref={ref}
        style={mergeStyles(
          {
            transform: shouldMirrorResult ? "scaleX(-1)" : "none",
            maxWidth: "100%",
          },
          style,
        )}
        {...props}
      />
    );
  },
);
BidiImage.displayName = "BidiImage";

// ─────────────────────────────────────────────
// LanguageSwitcherRoot - headless, for custom buttons
// ─────────────────────────────────────────────

import { useLanguage } from "./hooks.js";

export interface LanguageSwitcherRootProps {
  /**
   * Render prop - receives state and actions, returns your custom UI.
   *
   * @example
   * <LanguageSwitcherRoot>
   *   {({ language, languages, setLanguage }) => (
   *     <select value={language} onChange={e => setLanguage(e.target.value)}>
   *       {languages.map(l => <option key={l} value={l}>{l}</option>)}
   *     </select>
   *   )}
   * </LanguageSwitcherRoot>
   */
  children: (props: {
    language: string;
    languages: string[];
    setLanguage: (lang: string) => void;
    toggleLanguage: (pair?: [string, string]) => void;
    isRTL: boolean;
  }) => React.ReactNode;
}

/**
 * Headless language switcher - bring your own UI.
 * Wires up language state and gives you full control over rendering.
 *
 * @example
 * <LanguageSwitcherRoot>
 *   {({ language, languages, setLanguage }) => (
 *     <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
 *       {language === "en" ? "العربية" : "English"}
 *     </button>
 *   )}
 * </LanguageSwitcherRoot>
 */
export function LanguageSwitcherRoot({ children }: LanguageSwitcherRootProps) {
  const { language, supportedLanguages, setLanguage, toggleLanguage } = useLanguage();
  const isRTL = useRTL();
  return (
    <>
      {children({
        language,
        languages: supportedLanguages,
        setLanguage,
        toggleLanguage,
        isRTL,
      })}
    </>
  );
}
LanguageSwitcherRoot.displayName = "LanguageSwitcherRoot";

// ─────────────────────────────────────────────
// LanguageSwitcher - ready-to-use switcher component
// ─────────────────────────────────────────────

/** Display names for known language codes */
const LANGUAGE_NAMES: Record<string, { native: string; english: string; flag: string }> = {
  en: { native: "English",    english: "English",  flag: "🇬🇧" },
  ar: { native: "العربية",   english: "Arabic",   flag: "🇸🇦" },
  fr: { native: "Français",   english: "French",   flag: "🇫🇷" },
  de: { native: "Deutsch",    english: "German",   flag: "🇩🇪" },
  es: { native: "Español",    english: "Spanish",  flag: "🇪🇸" },
  he: { native: "עברית",     english: "Hebrew",   flag: "🇮🇱" },
  fa: { native: "فارسی",     english: "Persian",  flag: "🇮🇷" },
  ur: { native: "اردو",      english: "Urdu",     flag: "🇵🇰" },
  zh: { native: "中文",       english: "Chinese",  flag: "🇨🇳" },
  ja: { native: "日本語",     english: "Japanese", flag: "🇯🇵" },
  ko: { native: "한국어",     english: "Korean",   flag: "🇰🇷" },
  pt: { native: "Português",  english: "Portuguese", flag: "🇵🇹" },
  ru: { native: "Русский",   english: "Russian",  flag: "🇷🇺" },
  tr: { native: "Türkçe",    english: "Turkish",  flag: "🇹🇷" },
  nl: { native: "Nederlands", english: "Dutch",    flag: "🇳🇱" },
  it: { native: "Italiano",   english: "Italian",  flag: "🇮🇹" },
};

function getLangLabel(
  code: string,
  display: "native" | "english" | "code" | "flag" | "flag+native" | "flag+code",
): string {
  const info = LANGUAGE_NAMES[code];
  if (!info) return code.toUpperCase();
  switch (display) {
    case "native":       return info.native;
    case "english":      return info.english;
    case "code":         return code.toUpperCase();
    case "flag":         return info.flag;
    case "flag+native":  return `${info.flag} ${info.native}`;
    case "flag+code":    return `${info.flag} ${code.toUpperCase()}`;
  }
}

export type LanguageSwitcherVariant = "pill" | "dropdown" | "minimal";
export type LanguageSwitcherDisplay = "native" | "english" | "code" | "flag" | "flag+native" | "flag+code";

export interface LanguageSwitcherProps {
  /**
   * Visual style of the switcher.
   * - `pill`     - segmented pill buttons (default)
   * - `dropdown` - native <select> element
   * - `minimal`  - plain text button, just the current language
   */
  variant?: LanguageSwitcherVariant;
  /**
   * What label to show for each language.
   * - `native`      - "العربية", "English" (default)
   * - `english`     - always in English: "Arabic", "English"
   * - `code`        - "AR", "EN"
   * - `flag`        - "🇸🇦", "🇬🇧"
   * - `flag+native` - "🇸🇦 العربية"
   * - `flag+code`   - "🇸🇦 AR"
   */
  display?: LanguageSwitcherDisplay;
  /** Additional className */
  className?: string;
  /** Additional inline styles for the root element */
  style?: CSSProperties;
  /** Called after language is changed */
  onLanguageChange?: (language: string) => void;
}

/**
 * Pre-built language switcher component.
 * Drop it anywhere inside `<BidiProvider>` - no props required.
 *
 * @example
 * // Pill toggle (default)
 * <LanguageSwitcher />
 *
 * @example
 * // Dropdown with flag + native name
 * <LanguageSwitcher variant="dropdown" display="flag+native" />
 *
 * @example
 * // Minimal button cycling through languages
 * <LanguageSwitcher variant="minimal" display="flag+code" />
 */
export const LanguageSwitcher = forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  (
    {
      variant = "pill",
      display = "native",
      className,
      style,
      onLanguageChange,
    },
    ref,
  ) => {
    const { language, supportedLanguages, setLanguage, toggleLanguage } = useLanguage();

    const handleSet = (lang: string) => {
      setLanguage(lang);
      onLanguageChange?.(lang);
    };

    // ── Pill variant ──────────────────────────────────
    if (variant === "pill") {
      return (
        <div
          ref={ref}
          className={className}
          style={mergeStyles(
            {
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.12)",
            },
            style,
          )}
          role="group"
          aria-label="Language switcher"
        >
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleSet(lang)}
              aria-pressed={lang === language}
              aria-label={`Switch to ${LANGUAGE_NAMES[lang]?.english ?? lang}`}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1,
                transition: "all 0.2s ease",
                background: lang === language ? "var(--bidi-accent, #6366f1)" : "transparent",
                color: lang === language ? "#fff" : "inherit",
                opacity: lang === language ? 1 : 0.65,
              }}
            >
              {getLangLabel(lang, display)}
            </button>
          ))}
        </div>
      );
    }

    // ── Dropdown variant ──────────────────────────────
    if (variant === "dropdown") {
      return (
        <div ref={ref} className={className} style={style}>
          <select
            value={language}
            onChange={(e) => handleSet(e.target.value)}
            aria-label="Language switcher"
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.2)",
              background: "transparent",
              color: "inherit",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {getLangLabel(lang, display)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // ── Minimal variant ───────────────────────────────
    return (
      <div ref={ref} className={className} style={style}>
        <button
          type="button"
          onClick={() => toggleLanguage()}
          aria-label="Toggle language"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            color: "inherit",
            padding: "4px 8px",
            borderRadius: "6px",
            fontFamily: "inherit",
          }}
        >
          {getLangLabel(language, display)}
        </button>
      </div>
    );
  },
);
LanguageSwitcher.displayName = "LanguageSwitcher";

