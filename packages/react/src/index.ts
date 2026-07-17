/**
 * @bidikit/react
 *
 * React hooks and components for BidiKit - RTL/LTR direction-aware UI.
 *
 * @packageDocumentation
 */

// Provider
export { BidiProvider } from "./provider.js";
export type { BidiProviderProps } from "./provider.js";

// Context
export { BidiContext, useBidiContext } from "./context.js";
export type { BidiContextValue } from "./context.js";

// Hooks
export {
  useLanguage,
  useDirection,
  useTranslation,
  useRTL,
  useLocale,
  useMirror,
  useT,
} from "./hooks.js";
export type {
  UseLanguageReturn,
  UseDirectionReturn,
  UseTranslationReturn,
  UseMirrorReturn,
} from "./hooks.js";

// Components
export {
  Row,
  Column,
  Stack,
  Spacer,
  Container,
  Card,
  Text,
  Button,
  Icon,
  Avatar,
  Navbar,
  Sidebar,
  BidiImage,
  // Language switcher - pre-built and headless variants
  LanguageSwitcher,
  LanguageSwitcherRoot,
} from "./components.js";
export type {
  RowProps,
  ColumnProps,
  StackProps,
  SpacerProps,
  ContainerProps,
  CardProps,
  TextProps,
  ButtonProps,
  IconProps,
  AvatarProps,
  NavbarProps,
  SidebarProps,
  BidiImageProps,
  LanguageSwitcherProps,
  LanguageSwitcherRootProps,
  LanguageSwitcherVariant,
  LanguageSwitcherDisplay,
} from "./components.js";

// Re-export core types that React consumers commonly need
export type {
  BidiConfig,
  Direction,
  LanguageCode,
  Locale,
  TranslationFunction,
  TranslationOptions,
  BidiState,
} from "@bidikit/core";
