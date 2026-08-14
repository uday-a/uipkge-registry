'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

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
 */
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
