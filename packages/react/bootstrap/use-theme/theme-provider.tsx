"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wrap your root layout's <body> with this. next-themes injects a
 * blocking <script> that sets the `dark` class on <html> before first
 * paint, so the initial render matches the saved theme with no white
 * flash on reload — the React/Next equivalent of the Nuxt server plugin
 * in the Vue registry.
 *
 * Use `attribute="class"` + `defaultTheme="system"` to match the
 * `.dark` selector and the `@custom-variant dark` in tailwind.css.
 *
 *   <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *     {children}
 *   </ThemeProvider>
 *
 * `disableTransitionOnChange` defaults to true here: a theme flip changes
 * color, background, border and shadow on nearly every element at once, so
 * anything carrying `transition-colors` animates its own repaint and the
 * switch smears instead of snapping. next-themes suppresses transitions for
 * the swap — the same thing the Vue registry's useTheme does by hand. Pass
 * `disableTransitionOnChange={false}` if you deliberately want the crossfade.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  );
}
