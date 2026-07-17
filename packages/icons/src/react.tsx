/**
 * @bidikit/icons - MirrorableIcon React component
 *
 * Wraps any icon component and auto-mirrors it in RTL if it is directional.
 */

"use client";

import { type CSSProperties, type ComponentType } from "react";
import { useRTL } from "@bidikit/react";
import { isDirectionalIcon, getMirrorTransform } from "@bidikit/core";

export interface MirrorableIconProps {
  /** The icon component to render */
  icon: ComponentType<{ width?: number; height?: number; style?: CSSProperties; className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  /** Name of the icon (used for auto-detection of mirroring) */
  name: string;
  /** Override: force mirroring or disable it */
  mirror?: boolean;
  /** Additional className */
  className?: string;
  /** Size in pixels */
  size?: number;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Direction-aware icon wrapper that automatically mirrors directional icons in RTL.
 *
 * Works with Lucide, Heroicons, Tabler, or any SVG component.
 *
 * @example
 * import { ArrowRight } from "lucide-react";
 * <MirrorableIcon icon={ArrowRight} name="arrow-right" size={24} />
 *
 * // In RTL: the arrow-right icon will be automatically mirrored to point left.
 */
export function MirrorableIcon({
  icon: IconComponent,
  name,
  mirror: forceMirror,
  size = 24,
  style,
  className,
}: MirrorableIconProps) {
  const isRTL = useRTL();

  const shouldMirror =
    forceMirror !== undefined ? forceMirror : isRTL && isDirectionalIcon(name);

  const iconStyle: CSSProperties = {
    transform: getMirrorTransform(shouldMirror),
    transition: "transform 0.2s ease",
    display: "inline-block",
    lineHeight: 1,
    ...style,
  };

  return (
    <IconComponent
      width={size}
      height={size}
      style={iconStyle}
      className={className}
      aria-hidden="true"
    />
  );
}

MirrorableIcon.displayName = "MirrorableIcon";
