<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Check, Copy, Download, Monitor, Moon, Palette, Pipette, RotateCcw, Shuffle, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from '@/composables/useTheme'

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

const { theme, setTheme } = useTheme()
const preset = ref<PresetKey>('neutral')
const customColor = ref<string>('#ec4899')
const font = ref<FontKey>('sans')
const tint = ref<TintKey>('pure')
const radius = ref(0.3)
const copied = ref(false)
const exported = ref(false)
const themeSearch = ref('')
const sheetOpen = ref(false)

const activeTheme = computed<ThemePreset | null>(() => {
  // Radius isn't part of the preset signature any more (it stays
  // user-controlled), so the match only checks the four token axes.
  return (
    THEMES.find(
      (t) => t.mode === theme.value && t.color === preset.value && t.tint === tint.value && t.font === font.value,
    ) ?? null
  )
})

const filteredThemes = computed(() => {
  const q = themeSearch.value.trim().toLowerCase()
  if (!q) return THEMES
  return THEMES.filter((t) => t.label.toLowerCase().includes(q) || t.key.includes(q))
})

const themesByCategory = computed<{ key: CategoryKey; label: string; items: ThemePreset[] }[]>(() => {
  const order: CategoryKey[] = ['featured', 'editorial', 'bold', 'cool', 'soft']
  return order
    .map((c) => ({
      key: c,
      label: CATEGORY_LABELS[c],
      items: filteredThemes.value.filter((t) => t.category === c),
    }))
    .filter((g) => g.items.length > 0)
})

const modes: { value: Mode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

function isDarkActive(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

function applyPreset(key: PresetKey) {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  if (key === 'custom') {
    root.style.setProperty('--primary', customColor.value)
    root.style.setProperty('--primary-foreground', isDarkActive() ? 'oklch(0.985 0 0)' : 'oklch(0.985 0 0)')
    root.style.setProperty('--ring', customColor.value)
    return
  }
  const found = PRESETS.find((p) => p.key === key)
  if (!found) return
  const tokens = isDarkActive() ? found.dark : found.light
  root.style.setProperty('--primary', tokens.primary)
  root.style.setProperty('--primary-foreground', tokens.primaryForeground)
  root.style.setProperty('--ring', tokens.ring)
}

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

function save() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        preset: preset.value,
        customColor: customColor.value,
        font: font.value,
        tint: tint.value,
        radius: radius.value,
      }),
    )
  } catch {
    // ignore
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (parsed.preset) preset.value = parsed.preset
    if (parsed.customColor) customColor.value = parsed.customColor
    if (parsed.font) font.value = parsed.font
    if (parsed.tint) tint.value = parsed.tint
    if (typeof parsed.radius === 'number') radius.value = parsed.radius
  } catch {
    // ignore
  }
}

function applyAll() {
  applyPreset(preset.value)
  applyTint(tint.value)
  applyFont(font.value)
  applyRadius(radius.value)
}

function applyTheme(t: ThemePreset) {
  // Themes drive mode / color / tint / font. Radius is treated as a
  // user-controlled value (default 0.3) and is not changed by presets.
  setTheme(t.mode)
  preset.value = t.color
  tint.value = t.tint
  font.value = t.font
}

function applyRandomTheme() {
  const candidates = THEMES.filter((t) => t.key !== activeTheme.value?.key)
  const pick = candidates[Math.floor(Math.random() * candidates.length)]
  if (pick) applyTheme(pick)
}

function reset() {
  preset.value = 'neutral'
  customColor.value = '#ec4899'
  font.value = 'sans'
  tint.value = 'pure'
  radius.value = 0.3
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
  const found = PRESETS.find((p) => p.key === preset.value) ?? PRESETS[0]
  const isCustom = preset.value === 'custom'
  const tokens = isDarkActive() ? found.dark : found.light
  const t = TINTS.find((x) => x.key === tint.value) ?? TINTS[0]
  const f = FONTS.find((x) => x.key === font.value) ?? FONTS[0]
  const primary = isCustom ? customColor.value : tokens.primary
  const primaryFg = isCustom ? 'oklch(0.985 0 0)' : tokens.primaryForeground
  const ring = isCustom ? customColor.value : tokens.ring
  return `:root {
  --background: ${isDarkActive() ? t.dark : t.light};
  --primary: ${primary};
  --primary-foreground: ${primaryFg};
  --ring: ${ring};
  --radius: ${radius.value}rem;
  --font-sans: ${f.stack};
}`
}

async function copyCss() {
  try {
    await navigator.clipboard.writeText(buildCss())
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // ignore
  }
}

function exportJson() {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          preset: preset.value,
          customColor: customColor.value,
          font: font.value,
          tint: tint.value,
          radius: radius.value,
          css: buildCss(),
        },
        null,
        2,
      ),
    ],
    { type: 'application/json' },
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'theme.json'
  a.click()
  URL.revokeObjectURL(url)
  exported.value = true
  setTimeout(() => (exported.value = false), 1600)
}

watch([preset, customColor], () => {
  applyPreset(preset.value)
  save()
})
watch(font, (k) => {
  applyFont(k)
  save()
})
watch(tint, (k) => {
  applyTint(k)
  save()
})
watch(radius, (r) => {
  applyRadius(r)
  save()
})

watch(theme, () => {
  setTimeout(() => {
    applyPreset(preset.value)
    applyTint(tint.value)
  }, 0)
})

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

watch([preset, customColor, font, tint, radius, theme], pulseTransition)

function onKeydown(e: KeyboardEvent) {
  // Cmd/Ctrl + J -> toggle the customizer
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
    e.preventDefault()
    sheetOpen.value = !sheetOpen.value
  }
}

onMounted(() => {
  load()
  applyAll()
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})

const sliderModel = computed({
  get: () => [radius.value],
  set: ([v]) => {
    radius.value = v
  },
})
</script>

<template>
  <Sheet data-slot="theme-customize" v-model:open="sheetOpen">
    <SheetTrigger as-child>
      <Button variant="outline" size="sm" class="gap-2">
        <Palette class="size-4" />
        <span class="hidden sm:inline">Customize</span>
        <kbd class="bg-muted text-muted-foreground hidden rounded px-1 py-0.5 text-xs font-medium sm:inline-block"
          >⌘J</kbd
        >
      </Button>
    </SheetTrigger>
    <SheetContent side="right" class="flex w-full flex-col gap-0 p-0 sm:max-w-md">
      <SheetHeader class="border-b px-6 py-4">
        <div class="flex items-center justify-between gap-3">
          <SheetTitle class="flex items-center gap-2 text-base"> <Palette class="size-4" /> Customize </SheetTitle>
          <!-- Active theme chip -->
          <span
            v-if="activeTheme"
            class="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            <span
              class="size-2 rounded-full shadow-2xs"
              :style="{ background: PRESETS.find((p) => p.key === activeTheme?.color)?.swatch }"
            />
            {{ activeTheme.label }}
          </span>
          <span v-else class="text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5 text-xs font-medium">
            Custom
          </span>
        </div>
        <SheetDescription class="text-xs">
          Live-edit tokens. Changes write to <code class="font-mono">:root</code> and persist locally.
        </SheetDescription>
        <!-- Quick actions -->
        <div class="mt-2 flex gap-2">
          <Button variant="outline" size="xs" class="gap-1.5" @click="applyRandomTheme">
            <Shuffle class="size-3" /> Surprise me
          </Button>
        </div>
      </SheetHeader>
      <div class="flex-1 overflow-y-auto px-6 py-5">
        <div class="space-y-6">
          <!-- Curated themes -->
          <div>
            <div class="mb-2 flex items-baseline justify-between">
              <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Themes</span>
              <span class="text-muted-foreground text-xs">
                {{ filteredThemes.length }}<span v-if="themeSearch"> / {{ THEMES.length }}</span> presets
              </span>
            </div>

            <!-- Search -->
            <div class="relative mb-3">
              <input
                v-model="themeSearch"
                type="search"
                placeholder="Search themes..."
                class="border-input bg-background focus-visible:ring-ring h-8 w-full rounded-md border pr-2 pl-7 text-xs outline-none focus-visible:ring-2"
              />
              <svg
                viewBox="0 0 24 24"
                class="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            <!-- Categorized groups -->
            <div class="space-y-4">
              <div v-for="group in themesByCategory" :key="group.key">
                <div class="text-muted-foreground/70 mb-1.5 text-xs font-medium tracking-wider uppercase">
                  {{ group.label }}
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="t in group.items"
                    :key="t.key"
                    type="button"
                    :title="`${t.mode} · ${t.color} · ${t.font} · r=${t.radius}`"
                    :aria-pressed="activeTheme?.key === t.key"
                    :class="[
                      'group relative flex flex-col overflow-hidden rounded-lg border text-left transition-all',
                      activeTheme?.key === t.key
                        ? 'ring-ring ring-offset-background border-transparent ring-2 ring-offset-2'
                        : 'hover:scale-[1.03] hover:shadow-md',
                    ]"
                    @click="applyTheme(t)"
                  >
                    <!-- Mini-preview window -->
                    <div
                      class="relative h-14 px-2 py-1.5"
                      :style="{
                        background: (TINTS.find((x) => x.key === t.tint) || {})[t.mode === 'dark' ? 'dark' : 'light'],
                        color: t.mode === 'dark' ? 'oklch(0.985 0 0)' : 'oklch(0.205 0 0)',
                      }"
                    >
                      <!-- Top row: dot + brand swatch dot -->
                      <div class="flex items-center justify-between">
                        <div class="flex gap-0.5">
                          <span class="size-1.5 rounded-full opacity-40" :style="{ background: 'currentColor' }" />
                          <span class="size-1.5 rounded-full opacity-25" :style="{ background: 'currentColor' }" />
                          <span class="size-1.5 rounded-full opacity-15" :style="{ background: 'currentColor' }" />
                        </div>
                        <span
                          class="size-2 rounded-full shadow-2xs"
                          :style="{ background: PRESETS.find((p) => p.key === t.color)?.swatch }"
                        />
                      </div>
                      <!-- Mini button + chip preview -->
                      <div class="mt-2 flex items-center gap-1">
                        <span
                          class="inline-block h-3 px-1.5 text-xs leading-3 font-semibold"
                          :style="{
                            background: PRESETS.find((p) => p.key === t.color)?.swatch,
                            color: 'oklch(0.985 0 0)',
                            borderRadius: `${Math.min(t.radius, 0.5)}rem`,
                            fontFamily: FONTS.find((f) => f.key === t.font)?.stack,
                          }"
                          >Aa</span
                        >
                        <span
                          class="block h-1 flex-1 rounded-full opacity-30"
                          :style="{ background: 'currentColor' }"
                        />
                      </div>
                      <!-- Lower text bar -->
                      <div class="mt-1.5 flex gap-1">
                        <span class="block h-0.5 w-3 rounded-full opacity-20" :style="{ background: 'currentColor' }" />
                        <span class="block h-0.5 w-5 rounded-full opacity-15" :style="{ background: 'currentColor' }" />
                      </div>
                    </div>
                    <!-- Label strip -->
                    <div class="bg-muted/40 flex items-center justify-between px-2 py-1">
                      <span class="text-xs leading-none font-medium">{{ t.label }}</span>
                      <Check v-if="activeTheme?.key === t.key" class="text-primary size-3" />
                    </div>
                  </button>
                </div>
              </div>
              <div v-if="filteredThemes.length === 0" class="text-muted-foreground py-6 text-center text-xs">
                No themes match "<span class="font-mono">{{ themeSearch }}</span
                >"
              </div>
            </div>
          </div>

          <!-- Mode -->
          <div>
            <div class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Mode</div>
            <div class="bg-muted/50 grid grid-cols-3 gap-1 rounded-md p-1">
              <button
                v-for="m in modes"
                :key="m.value"
                type="button"
                :aria-pressed="theme === m.value"
                :class="[
                  'flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors',
                  theme === m.value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="setTheme(m.value)"
              >
                <component :is="m.icon" class="size-3.5" />
                {{ m.label }}
              </button>
            </div>
          </div>

          <!-- Color -->
          <div>
            <div class="mb-2 flex items-baseline justify-between">
              <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Color</span>
              <span class="text-muted-foreground text-xs">{{ PRESETS.length }} options</span>
            </div>
            <div class="grid grid-cols-10 gap-1.5">
              <button
                v-for="p in PRESETS"
                :key="p.key"
                type="button"
                :aria-label="p.label"
                :aria-pressed="preset === p.key"
                :title="p.label"
                :class="[
                  'group ring-offset-background relative aspect-square rounded-md transition-all',
                  preset === p.key ? 'ring-ring ring-2 ring-offset-2' : 'hover:scale-110',
                ]"
                :style="{ background: p.swatch }"
                @click="preset = p.key"
              >
                <Check v-if="preset === p.key" class="absolute inset-0 m-auto size-3 text-white mix-blend-difference" />
              </button>

              <!-- Custom color slot -->
              <label
                :class="[
                  'relative flex aspect-square cursor-pointer items-center justify-center rounded-md border transition-all',
                  preset === 'custom'
                    ? 'ring-ring ring-offset-background border-transparent ring-2 ring-offset-2'
                    : 'border-dashed hover:scale-110',
                ]"
                :style="preset === 'custom' ? { background: customColor } : {}"
                :aria-label="'Custom color'"
                :title="'Custom color'"
              >
                <input type="color" v-model="customColor" class="sr-only" @input="preset = 'custom'" />
                <Pipette v-if="preset !== 'custom'" class="text-muted-foreground size-3" />
                <Check v-else class="size-3 text-white mix-blend-difference" />
              </label>
            </div>
          </div>

          <!-- Surface tint -->
          <div>
            <div class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Surface</div>
            <div class="bg-muted/50 grid grid-cols-3 gap-1 rounded-md p-1">
              <button
                v-for="t in TINTS"
                :key="t.key"
                type="button"
                :aria-pressed="tint === t.key"
                :class="[
                  'rounded px-2 py-1.5 text-xs font-medium transition-colors',
                  tint === t.key ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="tint = t.key"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <!-- Font -->
          <div>
            <div class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Font</div>
            <div class="bg-muted/50 grid grid-cols-3 gap-1 rounded-md p-1">
              <button
                v-for="f in FONTS"
                :key="f.key"
                type="button"
                :aria-pressed="font === f.key"
                :class="[
                  'rounded px-2 py-1.5 text-xs font-medium transition-colors',
                  font === f.key ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                ]"
                :style="{ fontFamily: f.stack }"
                @click="font = f.key"
              >
                {{ f.label }}
              </button>
            </div>
          </div>

          <!-- Radius -->
          <div>
            <div class="mb-2 flex items-baseline justify-between">
              <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Radius</span>
              <span class="text-muted-foreground font-mono text-xs">{{ radius.toFixed(2) }}rem</span>
            </div>
            <Slider v-model="sliderModel" :min="0" :max="1" :step="0.05" />
            <div class="text-muted-foreground mt-1 flex justify-between text-xs">
              <span>0</span>
              <span>0.5</span>
              <span>1</span>
            </div>
          </div>

          <!-- Live preview -->
          <div>
            <div class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Preview</div>
            <div class="bg-card space-y-2.5 rounded-lg border p-3">
              <div class="flex items-center gap-2">
                <Button size="sm" class="text-xs">Primary</Button>
                <Button size="sm" variant="outline" class="text-xs">Outline</Button>
                <span class="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">Badge</span>
              </div>
              <div
                class="ring-ring/40 bg-background border-input flex h-8 items-center rounded-md border px-2 text-xs focus-within:ring-2"
              >
                Input sample
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer actions (sticky bottom) -->
      <div class="bg-background/95 flex gap-2 border-t px-6 py-3 backdrop-blur">
        <Button variant="ghost" size="sm" class="flex-1 gap-1.5" @click="reset">
          <RotateCcw class="size-3.5" /> Reset
        </Button>
        <Button aria-label="Download attachment" variant="outline" size="sm" class="flex-1 gap-1.5" @click="exportJson">
          <Download class="size-3.5" />
          {{ exported ? 'Saved' : 'Export' }}
        </Button>
        <Button variant="default" size="sm" class="flex-1 gap-1.5" @click="copyCss">
          <Check v-if="copied" class="size-3.5" />
          <Copy v-else class="size-3.5" />
          {{ copied ? 'Copied' : 'Copy CSS' }}
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
