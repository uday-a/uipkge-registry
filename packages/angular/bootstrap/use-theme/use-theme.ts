import { Injectable, computed, inject, signal } from '@angular/core'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

/**
 * Angular counterpart of the React `useTheme` (next-themes) and Vue `useTheme`
 * composable: the active theme ('light' | 'dark' | 'system'), the resolved one,
 * and setTheme(). Applies the `dark` class + color-scheme to <html>, persists to
 * localStorage under `theme` (next-themes' default key), and follows the OS while
 * set to 'system'. SSR-safe: every DOM / storage touch is guarded.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly systemDark = signal(false)
  readonly theme = signal<Theme>('system')
  readonly systemTheme = computed<'light' | 'dark'>(() => (this.systemDark() ? 'dark' : 'light'))
  readonly resolvedTheme = computed<'light' | 'dark'>(() =>
    this.theme() === 'system' ? this.systemTheme() : (this.theme() as 'light' | 'dark'),
  )

  constructor() {
    if (typeof window === 'undefined') return
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark' || saved === 'system') this.theme.set(saved)
    } catch {
      /* storage blocked (private mode): keep 'system' */
    }
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (mql) {
      this.systemDark.set(mql.matches)
      mql.addEventListener('change', (e) => {
        this.systemDark.set(e.matches)
        this.apply()
      })
    }
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* storage blocked */
    }
    this.apply()
  }

  private apply(): void {
    if (typeof document === 'undefined') return
    const dark = this.resolvedTheme() === 'dark'
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }
}

/** React's `useTheme()`: `const { theme, setTheme } = injectTheme()`. */
export function injectTheme(): ThemeService {
  return inject(ThemeService)
}
