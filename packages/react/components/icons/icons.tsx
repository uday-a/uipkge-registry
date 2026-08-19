import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Universal Icon component supporting multiple icon libraries:
 * - Lucide (default, via children)
 * - Font Awesome (via className with fa-* classes)
 * - Material Design Icons (via className with mdi-* classes)
 * - Heroicons (via children)
 * - Custom SVG (via src prop)
 */
export interface IconProps {
  // Size
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inherit";
  // Color
  color?: string;
  // Custom class for icon libraries (fa-, mdi-, etc.)
  className?: string;
  // For img-based icons
  src?: string;
  alt?: string;
  // Rotation/flip
  rotation?: number | string;
  flip?: "horizontal" | "vertical" | "both";
  // A11y
  label?: string;
  ariaLabel?: string;
  // Style
  inline?: boolean;
  // Slot-based icon (Lucide, Heroicons, inline SVG)
  children?: React.ReactNode;
}

const sizeClasses: Record<NonNullable<IconProps["size"]>, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-12",
  inherit: "size-full",
};

function Icon({
  size = "md",
  color,
  className,
  src,
  alt,
  rotation,
  flip,
  label,
  ariaLabel,
  inline = true,
  children,
}: IconProps) {
  const rotationDeg = rotation
    ? typeof rotation === "string"
      ? parseInt(rotation)
      : rotation
    : undefined;
  const accessibleName = ariaLabel || label;

  const flipClasses =
    flip === "horizontal"
      ? "-scale-x-100"
      : flip === "vertical"
        ? "-scale-y-100"
        : flip === "both"
          ? "-scale-x-100 -scale-y-100"
          : "";

  // Image-based icon (Material Design, custom URLs, etc.)
  if (src) {
    return (
      <img
        data-uipkge=""
        data-slot="icon"
        src={src}
        alt={alt || label || ""}
        className={cn(
          "shrink-0 object-contain",
          inline ? "inline-block" : "block",
          size !== "inherit" ? sizeClasses[size] : "",
          flipClasses,
          className,
        )}
        style={{
          color,
          transform: rotationDeg ? `rotate(${rotationDeg}deg)` : undefined,
        }}
        aria-label={accessibleName || undefined}
        role="img"
      />
    );
  }

  // Slot-based icon (Lucide, Heroicons, inline SVG)
  return (
    <span
      data-uipkge=""
      data-slot="icon"
      className={cn(
        "shrink-0 items-center justify-center",
        inline ? "inline-flex" : "flex",
        size !== "inherit" ? sizeClasses[size] : "",
        flipClasses,
        className,
      )}
      style={{
        color,
        transform: rotationDeg ? `rotate(${rotationDeg}deg)` : undefined,
      }}
      aria-label={accessibleName || undefined}
      role={accessibleName ? "img" : undefined}
      aria-hidden={accessibleName ? undefined : true}
    >
      {children}
    </span>
  );
}

// Icon library class prefixes for reference:
// Font Awesome: 'fa-solid', 'fa-regular', 'fa-brands', 'fa-*'
// Material Design: 'mdi mdi-*'
// Heroicons: already SVG-based, use children

// Helper function to generate Font Awesome class
export function faClass(
  iconName: string,
  style: "solid" | "regular" | "brands" = "solid",
): string {
  const prefix = style === "brands" ? "fab" : style === "solid" ? "fas" : "far";
  return `${prefix} fa-${iconName}`;
}

// Helper function to generate Material Design class
export function mdiClass(iconName: string): string {
  return `mdi mdi-${iconName}`;
}

export { Icon };
