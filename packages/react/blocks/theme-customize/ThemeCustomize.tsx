'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import {
  Check,
  Copy,
  Download,
  Monitor,
  Moon,
  Palette,
  Pipette,
  RotateCcw,
  Shuffle,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

type Mode = 'light' | 'dark' | 'system'
type PresetKey =
  | 'neutral'
  | 'zinc'
  | 'slate'
  | 'stone'
  | 'rose'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'custom'
type ThemeKey =
  | 'newyear'
  | 'sunset'
  | 'cyberpunk'
  | 'forest'
  | 'ocean'
  | 'pastel'
  | 'mono'
  | 'brutalist'
  | 'notebook'
  | 'caffeine'
  | 'midnight'
  | 'mocha'
  | 'retro'
  | 'tangerine'
  | 'quartz'
  | 'cosmic'
  | 'sage'
  | 'marble'
  | 'ember'
  | 'amethyst'
  | 'rainfall'
  | 'peach'
  | 'tropical'
  | 'vintage'
type FontKey = 'sans' | 'serif' | 'mono'
type TintKey = 'pure' | 'cool' | 'warm'

interface Preset {
  key: PresetKey
  label: string
  swatch: string
  light: { primary: string; primaryForeground: string; ring: string }
  dark: { primary: string; primaryForeground: string; ring: string }
}

function mkPreset(key: PresetKey, label: string, hue: number, l = 0.6, c = 0.2, fg = 'oklch(0.985 0 0)'): Preset {
  const swatch = `oklch(${l} ${c} ${hue})`
  return {
    key,
    label,
    swatch,
    light: { primary: swatch, primaryForeground: fg, ring: swatch },
    dark: { primary: swatch, primaryForeground: fg, ring: swatch },
  }
}

const PRESETS: Preset[] = [
  // Greyscale family
  {
    key: 'neutral',
    label: 'Neutral',
    swatch: 'oklch(0.205 0 0)',
    light: { primary: 'oklch(0.205 0 0)', primaryForeground: 'oklch(0.985 0 0)', ring: 'oklch(0.708 0 0)' },
    dark: { primary: 'oklch(0.922 0 0)', primaryForeground: 'oklch(0.205 0 0)', ring: 'oklch(0.556 0 0)' },
  },
  {
    key: 'zinc',
    label: 'Zinc',
    swatch: 'oklch(0.21 0.006 285.885)',
    light: {
      primary: 'oklch(0.21 0.006 285.885)',
      primaryForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.705 0.015 286.067)',
    },
    dark: {
      primary: 'oklch(0.92 0.004 286.32)',
      primaryForeground: 'oklch(0.21 0.006 285.885)',
      ring: 'oklch(0.552 0.016 285.938)',
    },
  },
  {
    key: 'slate',
    label: 'Slate',
    swatch: 'oklch(0.21 0.034 264.665)',
    light: {
      primary: 'oklch(0.21 0.034 264.665)',
      primaryForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.554 0.046 257.417)',
    },
    dark: {
      primary: 'oklch(0.929 0.013 255.508)',
      primaryForeground: 'oklch(0.21 0.034 264.665)',
      ring: 'oklch(0.554 0.046 257.417)',
    },
  },
  {
    key: 'stone',
    label: 'Stone',
    swatch: 'oklch(0.216 0.006 56.043)',
    light: {
      primary: 'oklch(0.216 0.006 56.043)',
      primaryForeground: 'oklch(0.985 0.001 106.423)',
      ring: 'oklch(0.553 0.013 58.071)',
    },
    dark: {
      primary: 'oklch(0.923 0.003 48.717)',
      primaryForeground: 'oklch(0.216 0.006 56.043)',
      ring: 'oklch(0.553 0.013 58.071)',
    },
  },
  // Warm
  mkPreset('rose', 'Rose', 16.439, 0.645, 0.246),
  mkPreset('red', 'Red', 27.325, 0.637, 0.237),
  mkPreset('orange', 'Orange', 47.604, 0.705, 0.213),
  mkPreset('amber', 'Amber', 70.08, 0.769, 0.188),
  mkPreset('yellow', 'Yellow', 95.277, 0.795, 0.184, 'oklch(0.286 0.066 53.813)'),
  // Greens
  mkPreset('lime', 'Lime', 130.85, 0.768, 0.233, 'oklch(0.274 0.072 132.109)'),
  mkPreset('emerald', 'Emerald', 162.48, 0.696, 0.17),
  mkPreset('teal', 'Teal', 184.704, 0.704, 0.14, 'oklch(0.984 0.014 180.72)'),
  // Cool
  mkPreset('cyan', 'Cyan', 221.723, 0.715, 0.143, 'oklch(0.302 0.056 229.695)'),
  mkPreset('sky', 'Sky', 235.711, 0.685, 0.169),
  mkPreset('blue', 'Blue', 264.376, 0.546, 0.245),
  mkPreset('indigo', 'Indigo', 277.117, 0.511, 0.262),
  // Purples
  mkPreset('violet', 'Violet', 293.009, 0.541, 0.281),
  mkPreset('purple', 'Purple', 303.9, 0.558, 0.288),
  mkPreset('fuchsia', 'Fuchsia', 322.16, 0.667, 0.295),
  mkPreset('pink', 'Pink', 354.308, 0.656, 0.241),
]

type CategoryKey = 'featured' | 'editorial' | 'bold' | 'cool' | 'soft'

interface ThemePreset {
  key: ThemeKey
  label: string
  category: CategoryKey
  mode: Mode
  color: PresetKey
  tint: TintKey
  font: FontKey
  radius: number
}

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  featured: 'Featured',
  editorial: 'Editorial',
  bold: 'Bold',
  cool: 'Cool',
  soft: 'Soft',
}

const THEMES: ThemePreset[] = [
  {
    key: 'newyear',
    label: 'New Year',
    category: 'featured',
    mode: 'dark',
    color: 'amber',
    tint: 'warm',
    font: 'serif',
    radius: 0.75,
  },
  {
    key: 'sunset',
    label: 'Sunset',
    category: 'featured',
    mode: 'light',
    color: 'orange',
    tint: 'warm',
    font: 'sans',
    radius: 0.625,
  },
  {
    key: 'cyberpunk',
    label: 'Cyberpunk',
    category: 'featured',
    mode: 'dark',
    color: 'fuchsia',
    tint: 'cool',
    font: 'mono',
    radius: 0.125,
  },
  {
    key: 'forest',
    label: 'Forest',
    category: 'featured',
    mode: 'light',
    color: 'emerald',
    tint: 'warm',
    font: 'serif',
    radius: 0.5,
  },
  {
    key: 'ocean',
    label: 'Ocean',
    category: 'featured',
    mode: 'dark',
    color: 'cyan',
    tint: 'cool',
    font: 'sans',
    radius: 0.5,
  },
  {
    key: 'pastel',
    label: 'Pastel',
    category: 'featured',
    mode: 'light',
    color: 'rose',
    tint: 'pure',
    font: 'sans',
    radius: 0.875,
  },
  {
    key: 'mono',
    label: 'Mono',
    category: 'editorial',
    mode: 'light',
    color: 'neutral',
    tint: 'pure',
    font: 'mono',
    radius: 0,
  },
  {
    key: 'brutalist',
    label: 'Brutalist',
    category: 'editorial',
    mode: 'light',
    color: 'neutral',
    tint: 'pure',
    font: 'mono',
    radius: 0,
  },
  {
    key: 'notebook',
    label: 'Notebook',
    category: 'editorial',
    mode: 'light',
    color: 'stone',
    tint: 'warm',
    font: 'serif',
    radius: 0.25,
  },
  {
    key: 'vintage',
    label: 'Vintage',
    category: 'editorial',
    mode: 'light',
    color: 'amber',
    tint: 'warm',
    font: 'serif',
    radius: 0.375,
  },
  {
    key: 'caffeine',
    label: 'Caffeine',
    category: 'editorial',
    mode: 'light',
    color: 'orange',
    tint: 'warm',
    font: 'serif',
    radius: 0.5,
  },
  {
    key: 'marble',
    label: 'Marble',
    category: 'editorial',
    mode: 'light',
    color: 'stone',
    tint: 'pure',
    font: 'serif',
    radius: 0.25,
  },
  {
    key: 'retro',
    label: 'Retro',
    category: 'bold',
    mode: 'dark',
    color: 'lime',
    tint: 'cool',
    font: 'mono',
    radius: 0,
  },
  {
    key: 'tangerine',
    label: 'Tangerine',
    category: 'bold',
    mode: 'light',
    color: 'orange',
    tint: 'pure',
    font: 'sans',
    radius: 0.75,
  },
  {
    key: 'ember',
    label: 'Ember',
    category: 'bold',
    mode: 'dark',
    color: 'red',
    tint: 'warm',
    font: 'sans',
    radius: 0.375,
  },
  {
    key: 'tropical',
    label: 'Tropical',
    category: 'bold',
    mode: 'light',
    color: 'teal',
    tint: 'cool',
    font: 'sans',
    radius: 0.625,
  },
  {
    key: 'midnight',
    label: 'Midnight',
    category: 'cool',
    mode: 'dark',
    color: 'indigo',
    tint: 'cool',
    font: 'sans',
    radius: 0.5,
  },
  {
    key: 'cosmic',
    label: 'Cosmic',
    category: 'cool',
    mode: 'dark',
    color: 'violet',
    tint: 'cool',
    font: 'sans',
    radius: 0.625,
  },
  {
    key: 'rainfall',
    label: 'Rainfall',
    category: 'cool',
    mode: 'dark',
    color: 'sky',
    tint: 'cool',
    font: 'sans',
    radius: 0.5,
  },
  {
    key: 'amethyst',
    label: 'Amethyst',
    category: 'cool',
    mode: 'dark',
    color: 'purple',
    tint: 'cool',
    font: 'sans',
    radius: 0.625,
  },
  {
    key: 'sage',
    label: 'Sage',
    category: 'soft',
    mode: 'light',
    color: 'emerald',
    tint: 'warm',
    font: 'serif',
    radius: 0.75,
  },
  {
    key: 'peach',
    label: 'Peach',
    category: 'soft',
    mode: 'light',
    color: 'amber',
    tint: 'warm',
    font: 'sans',
    radius: 0.875,
  },
  {
    key: 'quartz',
    label: 'Quartz',
    category: 'soft',
    mode: 'light',
    color: 'violet',
    tint: 'cool',
    font: 'sans',
    radius: 0.875,
  },
  {
    key: 'mocha',
    label: 'Mocha',
    category: 'soft',
    mode: 'light',
    color: 'rose',
    tint: 'warm',
    font: 'serif',
    radius: 0.5,
  },
]

const FONTS: { key: FontKey; label: string; stack: string }[] = [
  { key: 'sans', label: 'Sans', stack: '"DM Sans", ui-sans-serif, system-ui, sans-serif' },
  { key: 'serif', label: 'Serif', stack: '"Source Serif Pro", ui-serif, Georgia, serif' },
  { key: 'mono', label: 'Mono', stack: '"JetBrains Mono", ui-monospace, monospace' },
]

const TINTS: { key: TintKey; label: string; light: string; dark: string }[] = [
  { key: 'pure', label: 'Pure', light: 'oklch(1 0 0)', dark: 'oklch(0.145 0 0)' },
  { key: 'cool', label: 'Cool', light: 'oklch(0.99 0.005 240)', dark: 'oklch(0.16 0.008 250)' },
  { key: 'warm', label: 'Warm', light: 'oklch(0.99 0.005 70)', dark: 'oklch(0.16 0.008 60)' },
]

const STORAGE_KEY = 'uipkge-theme-customize'

const modes: { value: Mode; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

function isDarkActive(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

export function ThemeCustomize() {
  const { theme, setTheme } = useTheme()
  const mode = (theme as Mode) ?? 'system'

  const [preset, setPreset] = React.useState<PresetKey>('neutral')
  const [customColor, setCustomColor] = React.useState<string>('#ec4899')
  const [font, setFont] = React.useState<FontKey>('sans')
  const [tint, setTint] = React.useState<TintKey>('pure')
  const [radius, setRadius] = React.useState(0.3)
  const [copied, setCopied] = React.useState(false)
  const [exported, setExported] = React.useState(false)
  const [themeSearch, setThemeSearch] = React.useState('')
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const activeTheme = React.useMemo<ThemePreset | null>(() => {
    // Radius isn't part of the preset signature any more (it stays
    // user-controlled), so the match only checks the four token axes.
    return THEMES.find((t) => t.mode === mode && t.color === preset && t.tint === tint && t.font === font) ?? null
  }, [mode, preset, tint, font])

  const filteredThemes = React.useMemo(() => {
    const q = themeSearch.trim().toLowerCase()
    if (!q) return THEMES
    return THEMES.filter((t) => t.label.toLowerCase().includes(q) || t.key.includes(q))
  }, [themeSearch])

  const themesByCategory = React.useMemo<{ key: CategoryKey; label: string; items: ThemePreset[] }[]>(() => {
    const order: CategoryKey[] = ['featured', 'editorial', 'bold', 'cool', 'soft']
    return order
      .map((c) => ({
        key: c,
        label: CATEGORY_LABELS[c],
        items: filteredThemes.filter((t) => t.category === c),
      }))
      .filter((g) => g.items.length > 0)
  }, [filteredThemes])

  const applyPreset = React.useCallback(
    (key: PresetKey) => {
      if (typeof window === 'undefined') return
      const root = document.documentElement
      if (key === 'custom') {
        root.style.setProperty('--primary', customColor)
        root.style.setProperty('--primary-foreground', isDarkActive() ? 'oklch(0.985 0 0)' : 'oklch(0.985 0 0)')
        root.style.setProperty('--ring', customColor)
        return
      }
      const found = PRESETS.find((p) => p.key === key)
      if (!found) return
      const tokens = isDarkActive() ? found.dark : found.light
      root.style.setProperty('--primary', tokens.primary)
      root.style.setProperty('--primary-foreground', tokens.primaryForeground)
      root.style.setProperty('--ring', tokens.ring)
    },
    [customColor],
  )

  function applyTint(key: TintKey) {
    if (typeof window === 'undefined') return
    const t = TINTS.find((x) => x.key === key)
    if (!t) return
    document.documentElement.style.setProperty('--background', isDarkActive() ? t.dark : t.light)
  }

  function applyFont(key: FontKey) {
    if (typeof window === 'undefined') return
    const f = FONTS.find((x) => x.key === key)
    if (!f) return
    document.documentElement.style.setProperty('--font-sans', f.stack)
  }

  function applyRadius(rem: number) {
    if (typeof window === 'undefined') return
    document.documentElement.style.setProperty('--radius', `${rem}rem`)
  }

  const save = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ preset, customColor, font, tint, radius }))
    } catch {
      // ignore
    }
  }, [preset, customColor, font, tint, radius])

  function applyTheme(t: ThemePreset) {
    // Themes drive mode / color / tint / font. Radius is treated as a
    // user-controlled value (default 0.3) and is not changed by presets.
    setTheme(t.mode)
    setPreset(t.color)
    setTint(t.tint)
    setFont(t.font)
  }

  function applyRandomTheme() {
    const candidates = THEMES.filter((t) => t.key !== activeTheme?.key)
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    if (pick) applyTheme(pick)
  }

  function reset() {
    setPreset('neutral')
    setCustomColor('#ec4899')
    setFont('sans')
    setTint('pure')
    setRadius(0.3)
    const root = document.documentElement
    ;['--primary', '--primary-foreground', '--ring', '--background', '--font-sans', '--radius'].forEach((p) =>
      root.style.removeProperty(p),
    )
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  function buildCss(): string {
    const found = PRESETS.find((p) => p.key === preset) ?? PRESETS[0]
    const isCustom = preset === 'custom'
    const tokens = isDarkActive() ? found.dark : found.light
    const t = TINTS.find((x) => x.key === tint) ?? TINTS[0]
    const f = FONTS.find((x) => x.key === font) ?? FONTS[0]
    const primary = isCustom ? customColor : tokens.primary
    const primaryFg = isCustom ? 'oklch(0.985 0 0)' : tokens.primaryForeground
    const ring = isCustom ? customColor : tokens.ring
    return `:root {
  --background: ${isDarkActive() ? t.dark : t.light};
  --primary: ${primary};
  --primary-foreground: ${primaryFg};
  --ring: ${ring};
  --radius: ${radius}rem;
  --font-sans: ${f.stack};
}`
  }

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(buildCss())
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ preset, customColor, font, tint, radius, css: buildCss() }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme.json'
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 1600)
  }

  // Smoothly fade color changes on the whole document. Toggled briefly
  // during apply* so users don't see a hard snap between themes.
  function pulseTransition() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.style.transition = 'background-color 240ms ease, color 240ms ease'
    window.setTimeout(() => {
      root.style.transition = ''
    }, 300)
  }

  // Load persisted state + apply on mount; wire the Cmd/Ctrl+J shortcut.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.preset) setPreset(parsed.preset)
        if (parsed.customColor) setCustomColor(parsed.customColor)
        if (parsed.font) setFont(parsed.font)
        if (parsed.tint) setTint(parsed.tint)
        if (typeof parsed.radius === 'number') setRadius(parsed.radius)
      }
    } catch {
      // ignore
    }

    function onKeydown(e: KeyboardEvent) {
      // Cmd/Ctrl + J -> toggle the customizer
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setSheetOpen((v) => !v)
      }
    }
    if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // watch([preset, customColor]) -> applyPreset + save
  React.useEffect(() => {
    applyPreset(preset)
    save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, customColor])

  // watch(font) -> applyFont + save
  React.useEffect(() => {
    applyFont(font)
    save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [font])

  // watch(tint) -> applyTint + save
  React.useEffect(() => {
    applyTint(tint)
    save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tint])

  // watch(radius) -> applyRadius + save
  React.useEffect(() => {
    applyRadius(radius)
    save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius])

  // watch(theme) -> re-apply preset + tint on next tick
  React.useEffect(() => {
    setTimeout(() => {
      applyPreset(preset)
      applyTint(tint)
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  // watch([preset, customColor, font, tint, radius, theme]) -> pulseTransition
  React.useEffect(() => {
    pulseTransition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, customColor, font, tint, radius, theme])

  return (
    <Sheet data-slot="theme-customize" open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="size-4" />
          <span className="hidden sm:inline">Customize</span>
          <kbd className="bg-muted text-muted-foreground hidden rounded px-1 py-0.5 text-xs font-medium sm:inline-block">
            ⌘J
          </kbd>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="flex items-center gap-2 text-base">
              {' '}
              <Palette className="size-4" /> Customize{' '}
            </SheetTitle>
            {/* Active theme chip */}
            {activeTheme ? (
              <span className="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
                <span
                  className="size-2 rounded-full shadow-2xs"
                  style={{ background: PRESETS.find((p) => p.key === activeTheme.color)?.swatch }}
                />
                {activeTheme.label}
              </span>
            ) : (
              <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5 text-xs font-medium">
                Custom
              </span>
            )}
          </div>
          <SheetDescription className="text-xs">
            Live-edit tokens. Changes write to <code className="font-mono">:root</code> and persist locally.
          </SheetDescription>
          {/* Quick actions */}
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="xs" className="gap-1.5" onClick={applyRandomTheme}>
              <Shuffle className="size-3" /> Surprise me
            </Button>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            {/* Curated themes */}
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Themes</span>
                <span className="text-muted-foreground text-xs">
                  {filteredThemes.length}
                  {themeSearch && <span> / {THEMES.length}</span>} presets
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <input
                  value={themeSearch}
                  onChange={(e) => setThemeSearch(e.target.value)}
                  type="search"
                  placeholder="Search themes..."
                  className="border-input bg-background focus-visible:ring-ring h-8 w-full rounded-md border pr-2 pl-7 text-xs outline-none focus-visible:ring-2"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              {/* Categorized groups */}
              <div className="space-y-4">
                {themesByCategory.map((group) => (
                  <div key={group.key}>
                    <div className="text-muted-foreground/70 mb-1.5 text-xs font-medium tracking-wider uppercase">
                      {group.label}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {group.items.map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          title={`${t.mode} · ${t.color} · ${t.font} · r=${t.radius}`}
                          aria-pressed={activeTheme?.key === t.key}
                          className={[
                            'group relative flex flex-col overflow-hidden rounded-lg border text-left transition-all',
                            activeTheme?.key === t.key
                              ? 'ring-ring ring-offset-background border-transparent ring-2 ring-offset-2'
                              : 'hover:scale-[1.03] hover:shadow-md',
                          ].join(' ')}
                          onClick={() => applyTheme(t)}
                        >
                          {/* Mini-preview window */}
                          <div
                            className="relative h-14 px-2 py-1.5"
                            style={{
                              background: (TINTS.find((x) => x.key === t.tint) || ({} as Record<string, string>))[
                                t.mode === 'dark' ? 'dark' : 'light'
                              ],
                              color: t.mode === 'dark' ? 'oklch(0.985 0 0)' : 'oklch(0.205 0 0)',
                            }}
                          >
                            {/* Top row: dot + brand emoji */}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-0.5">
                                <span
                                  className="size-1.5 rounded-full opacity-40"
                                  style={{ background: 'currentColor' }}
                                />
                                <span
                                  className="size-1.5 rounded-full opacity-25"
                                  style={{ background: 'currentColor' }}
                                />
                                <span
                                  className="size-1.5 rounded-full opacity-15"
                                  style={{ background: 'currentColor' }}
                                />
                              </div>
                              <span
                                className="size-2 rounded-full shadow-2xs"
                                style={{ background: PRESETS.find((p) => p.key === t.color)?.swatch }}
                              />
                            </div>
                            {/* Mini button + chip preview */}
                            <div className="mt-2 flex items-center gap-1">
                              <span
                                className="inline-block h-3 px-1.5 text-xs leading-3 font-semibold"
                                style={{
                                  background: PRESETS.find((p) => p.key === t.color)?.swatch,
                                  color: 'oklch(0.985 0 0)',
                                  borderRadius: `${Math.min(t.radius, 0.5)}rem`,
                                  fontFamily: FONTS.find((f) => f.key === t.font)?.stack,
                                }}
                              >
                                Aa
                              </span>
                              <span
                                className="block h-1 flex-1 rounded-full opacity-30"
                                style={{ background: 'currentColor' }}
                              />
                            </div>
                            {/* Lower text bar */}
                            <div className="mt-1.5 flex gap-1">
                              <span
                                className="block h-0.5 w-3 rounded-full opacity-20"
                                style={{ background: 'currentColor' }}
                              />
                              <span
                                className="block h-0.5 w-5 rounded-full opacity-15"
                                style={{ background: 'currentColor' }}
                              />
                            </div>
                          </div>
                          {/* Label strip */}
                          <div className="bg-muted/40 flex items-center justify-between px-2 py-1">
                            <span className="text-xs leading-none font-medium">{t.label}</span>
                            {activeTheme?.key === t.key && <Check className="text-primary size-3" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredThemes.length === 0 && (
                  <div className="text-muted-foreground py-6 text-center text-xs">
                    No themes match "<span className="font-mono">{themeSearch}</span>"
                  </div>
                )}
              </div>
            </div>

            {/* Mode */}
            <div>
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Mode</div>
              <div className="bg-muted/50 grid grid-cols-3 gap-1 rounded-md p-1">
                {modes.map((m) => {
                  const Icon = m.icon
                  return (
                    <button
                      key={m.value}
                      type="button"
                      aria-pressed={mode === m.value}
                      className={[
                        'flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors',
                        mode === m.value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                      ].join(' ')}
                      onClick={() => setTheme(m.value)}
                    >
                      <Icon className="size-3.5" />
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color */}
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Color</span>
                <span className="text-muted-foreground text-xs">{PRESETS.length} options</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    aria-label={p.label}
                    aria-pressed={preset === p.key}
                    title={p.label}
                    className={[
                      'group ring-offset-background relative aspect-square rounded-md transition-all',
                      preset === p.key ? 'ring-ring ring-2 ring-offset-2' : 'hover:scale-110',
                    ].join(' ')}
                    style={{ background: p.swatch }}
                    onClick={() => setPreset(p.key)}
                  >
                    {preset === p.key && (
                      <Check className="absolute inset-0 m-auto size-3 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}

                {/* Custom color slot */}
                <label
                  className={[
                    'relative flex aspect-square cursor-pointer items-center justify-center rounded-md border transition-all',
                    preset === 'custom'
                      ? 'ring-ring ring-offset-background border-transparent ring-2 ring-offset-2'
                      : 'border-dashed hover:scale-110',
                  ].join(' ')}
                  style={preset === 'custom' ? { background: customColor } : {}}
                  aria-label="Custom color"
                  title="Custom color"
                >
                  <input
                    type="color"
                    value={customColor}
                    className="sr-only"
                    onChange={(e) => {
                      setCustomColor(e.target.value)
                      setPreset('custom')
                    }}
                  />
                  {preset !== 'custom' ? (
                    <Pipette className="text-muted-foreground size-3" />
                  ) : (
                    <Check className="size-3 text-white mix-blend-difference" />
                  )}
                </label>
              </div>
            </div>

            {/* Surface tint */}
            <div>
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Surface</div>
              <div className="bg-muted/50 grid grid-cols-3 gap-1 rounded-md p-1">
                {TINTS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={tint === t.key}
                    className={[
                      'rounded px-2 py-1.5 text-xs font-medium transition-colors',
                      tint === t.key ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                    onClick={() => setTint(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Font</div>
              <div className="bg-muted/50 grid grid-cols-3 gap-1 rounded-md p-1">
                {FONTS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={font === f.key}
                    className={[
                      'rounded px-2 py-1.5 text-xs font-medium transition-colors',
                      font === f.key ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                    style={{ fontFamily: f.stack }}
                    onClick={() => setFont(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Radius</span>
                <span className="text-muted-foreground font-mono text-xs">{radius.toFixed(2)}rem</span>
              </div>
              <Slider value={[radius]} min={0} max={1} step={0.05} onValueChange={([v]) => setRadius(v)} />
              <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                <span>0</span>
                <span>0.5</span>
                <span>1</span>
              </div>
            </div>

            {/* Live preview */}
            <div>
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Preview</div>
              <div className="bg-card space-y-2.5 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Button size="sm" className="text-xs">
                    Primary
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Outline
                  </Button>
                  <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">Badge</span>
                </div>
                <div className="ring-ring/40 bg-background border-input flex h-8 items-center rounded-md border px-2 text-xs focus-within:ring-2">
                  Input sample
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer actions (sticky bottom) */}
        <div className="bg-background/95 flex gap-2 border-t px-6 py-3 backdrop-blur">
          <Button variant="ghost" size="sm" className="flex-1 gap-1.5" onClick={reset}>
            <RotateCcw className="size-3.5" /> Reset
          </Button>
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={exportJson}
          >
            <Download className="size-3.5" />
            {exported ? 'Saved' : 'Export'}
          </Button>
          <Button variant="default" size="sm" className="flex-1 gap-1.5" onClick={copyCss}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy CSS'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
