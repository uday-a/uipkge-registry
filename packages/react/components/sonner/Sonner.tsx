"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

// Sonner cadence — UX_MICROINTERACTIONS.md research:
// 4000ms default, bottom-right position so swipe-right dismiss reads
// naturally, max 3 visible (older stack with scale offset), rich colors
// so success/error/info/warning each get distinct variants.
const Toaster = ({ ...props }: ToasterProps) => {
  // next-themes is the React registry theme stack (via init / use-theme bootstrap).
  // Falls back to 'system' when ThemeProvider is absent so the toaster still mounts.
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      data-uipkge=""
      data-slot="sonner"
      className="toaster group"
      position="bottom-right"
      duration={4000}
      visibleToasts={3}
      richColors
      closeButton={false}
      expand={false}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      icons={{
        success: <CircleCheckIcon className="size-4" aria-hidden="true" />,
        info: <InfoIcon className="size-4" aria-hidden="true" />,
        warning: <TriangleAlertIcon className="size-4" aria-hidden="true" />,
        error: <OctagonXIcon className="size-4" aria-hidden="true" />,
        loading: (
          <Loader2Icon
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
        ),
        close: <XIcon className="size-4" aria-hidden="true" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
