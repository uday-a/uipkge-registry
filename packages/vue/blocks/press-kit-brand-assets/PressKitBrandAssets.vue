<script lang="ts">
export interface LogoAsset {
  id: string
  title: string
  category: string
  description: string
  dimensions: string
  bestFor: string
  theme: 'light' | 'dark' | 'adaptive'
  formats: { label: string; ext: string; size: string }[]
}

export interface BrandColor {
  id: string
  name: string
  hex: string
  oklch: string
  rgb: string
  role: string
  contrast: string
  usage: string
  bgClass: string
  textDark?: boolean
}

export interface Executive {
  id: string
  name: string
  role: string
  bio: string
  avatarUrl?: string
  initials: string
  fileSize: string
  dimensions: string
  topics: string[]
  socials: { platform: 'x' | 'linkedin' | 'github'; url: string }[]
}

export interface BrandGuidelineRule {
  type: 'do' | 'dont'
  text: string
}
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  FileCode,
  FileImage,
  FileText,
  Globe,
  Info,
  Layers,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const DEFAULT_LOGOS: LogoAsset[] = [
  {
    id: 'horizontal-primary',
    title: 'Primary Horizontal Logo',
    category: 'Full Wordmark',
    description: 'The standard lockup combining the faceted block logomark with horizontal typography and .dev badge.',
    dimensions: '3840 × 1080 px',
    bestFor: 'Light surfaces, navigation bars, marketing hero headers, and pitch decks.',
    theme: 'light',
    formats: [
      { label: 'Vector SVG', ext: 'svg', size: '14 KB' },
      { label: '4K PNG (Alpha)', ext: 'png', size: '280 KB' },
      { label: 'Modern WebP', ext: 'webp', size: '94 KB' },
    ],
  },
  {
    id: 'app-icon-mark',
    title: 'Square App Icon Mark',
    category: 'Logomark Symbol',
    description: 'Standalone geometric prism icon optimized for square aspect ratios and high-density icons.',
    dimensions: '1024 × 1024 px',
    bestFor: 'Favicons, desktop dock icons, app store assets, and square social avatars.',
    theme: 'adaptive',
    formats: [
      { label: 'Vector SVG', ext: 'svg', size: '8 KB' },
      { label: 'High-Res PNG', ext: 'png', size: '165 KB' },
      { label: 'Icon WebP', ext: 'webp', size: '62 KB' },
    ],
  },
  {
    id: 'monochrome-dark',
    title: 'Dark Mode Monochromatic Logo',
    category: 'Dark Backgrounds',
    description: 'Single-tone pure-white silhouette engineered for deep slate surfaces and obsidian backgrounds.',
    dimensions: '3840 × 1080 px',
    bestFor: 'Developer terminals, dark theme dashboards, midnight wallpapers, and video overlays.',
    theme: 'dark',
    formats: [
      { label: 'Vector SVG', ext: 'svg', size: '12 KB' },
      { label: '4K PNG (White)', ext: 'png', size: '240 KB' },
      { label: 'Dark WebP', ext: 'webp', size: '88 KB' },
    ],
  },
  {
    id: 'monochrome-light',
    title: 'Light Mode Inverted Logo',
    category: 'Print & Documents',
    description: 'High-density obsidian monochrome lockup for single-ink printing and high-contrast editorial media.',
    dimensions: '3840 × 1080 px',
    bestFor: 'Whitepapers, physical print collateral, invoices, PDF documents, and newsprint.',
    theme: 'light',
    formats: [
      { label: 'Vector SVG', ext: 'svg', size: '12 KB' },
      { label: '4K PNG (Black)', ext: 'png', size: '235 KB' },
      { label: 'Print WebP', ext: 'webp', size: '85 KB' },
    ],
  },
]

const DEFAULT_COLORS: BrandColor[] = [
  {
    id: 'primary-emerald',
    name: 'Primary Emerald',
    hex: '#10B981',
    oklch: 'oklch(0.696 0.170 162.48)',
    rgb: 'rgb(16, 185, 129)',
    role: 'Primary Interactive Brand Color',
    contrast: 'WCAG AAA 7.4:1',
    usage: 'Primary brand color for CTAs, active pills, key highlights, and success indicators.',
    bgClass: 'bg-[#10B981]',
    textDark: true,
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    hex: '#0F172A',
    oklch: 'oklch(0.208 0.042 265.75)',
    rgb: 'rgb(15, 23, 42)',
    role: 'Dark Neutral Surface Base',
    contrast: 'WCAG AAA 16.2:1',
    usage: 'Core neutral background and high-contrast dark surface foundations across dark layouts.',
    bgClass: 'bg-[#0F172A]',
    textDark: false,
  },
  {
    id: 'accent-blue',
    name: 'Accent Blue',
    hex: '#3B82F6',
    oklch: 'oklch(0.623 0.214 259.80)',
    rgb: 'rgb(59, 130, 246)',
    role: 'Secondary Interactive Accent',
    contrast: 'WCAG AA 4.8:1',
    usage: 'Secondary accent for active links, information badges, focus rings, and secondary metrics.',
    bgClass: 'bg-[#3B82F6]',
    textDark: true,
  },
  {
    id: 'background-base',
    name: 'Background Base',
    hex: '#F8FAFC',
    oklch: 'oklch(0.985 0.002 247.80)',
    rgb: 'rgb(248, 250, 252)',
    role: 'Light Neutral Surface Fills',
    contrast: 'WCAG AAA 19.5:1',
    usage: 'Clean ambient light surface foundation, card backgrounds, and elevated container fills.',
    bgClass: 'bg-[#F8FAFC]',
    textDark: true,
  },
  {
    id: 'amber-highlight',
    name: 'Amber Highlight',
    hex: '#F59E0B',
    oklch: 'oklch(0.769 0.188 70.08)',
    rgb: 'rgb(245, 158, 11)',
    role: 'Warning & Spotlight Accent',
    contrast: 'WCAG AAA 8.1:1',
    usage: 'Warm highlight for warnings, pro tier tags, system notices, and featured sponsor badges.',
    bgClass: 'bg-[#F59E0B]',
    textDark: true,
  },
]

const DEFAULT_EXECUTIVES: Executive[] = [
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Chief Executive Officer & Co-Founder',
    bio: 'Pioneered component registry architecture and headless design systems. Former principal architect at NextGen UI. Leading UIPKGE’s mission to make design-engineering frictionless for global software teams.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    initials: 'ER',
    fileSize: '12.4 MB',
    dimensions: '4000 × 5000 px · 300 DPI',
    topics: ['Component Architecture', 'Design Systems', 'Open-Source Sustainability', 'Developer Experience'],
    socials: [
      { platform: 'x', url: 'https://x.com/elenarostova' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/elenarostova' },
      { platform: 'github', url: 'https://github.com/elenarostova' },
    ],
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Chief Technology Officer & Co-Founder',
    bio: 'Specializes in multi-framework compiler tooling, zero-runtime tokens, and high-performance WebAssembly render pipelines. Previously led frontend infrastructure and UI performance engineering at CloudScale.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    initials: 'MV',
    fileSize: '11.8 MB',
    dimensions: '4000 × 5000 px · 300 DPI',
    topics: ['Web Performance', 'AST Tooling', 'Tailwind v4 Engine', 'Reka UI Headless Core'],
    socials: [
      { platform: 'x', url: 'https://x.com/marcusvance' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/marcusvance' },
      { platform: 'github', url: 'https://github.com/marcusvance' },
    ],
  },
]

const DEFAULT_GUIDELINES: BrandGuidelineRule[] = [
  { type: 'do', text: 'Maintain minimum clear space equal to 50% of the logomark height around all sides.' },
  { type: 'do', text: 'Use the official OKLCH and Hex values when reproducing brand swatches in digital media.' },
  { type: 'do', text: 'Use high-contrast monochromatic variants for single-color print, laser etching, or stamps.' },
  { type: 'dont', text: 'Do not stretch, distort, rotate, or alter the aspect ratio of official logo assets.' },
  { type: 'dont', text: 'Do not add drop shadows, outer glows, strokes, or unapproved gradients to the mark.' },
  { type: 'dont', text: 'Do not place the full-color primary mark on low-contrast or visually busy backgrounds.' },
]

const props = withDefaults(
  defineProps<{
    companyName?: string
    title?: string
    subtitle?: string
    version?: string
    lastUpdated?: string
    pressEmail?: string
    pressKitZipSize?: string
    pressKitZipUrl?: string
    factSheetPdfSize?: string
    boilerplateText?: string
    logos?: LogoAsset[]
    colors?: BrandColor[]
    executives?: Executive[]
    guidelines?: BrandGuidelineRule[]
    variant?: 'default' | 'compact'
    class?: HTMLAttributes['class']
  }>(),
  {
    companyName: 'UIPKGE',
    title: 'Brand Guidelines & Press Kit',
    subtitle: 'Official logos, brand colors, typography rules, and executive media assets.',
    version: 'v2.4',
    lastUpdated: 'August 2026',
    pressEmail: 'press@uipkge.dev',
    pressKitZipSize: '48 MB',
    pressKitZipUrl: '#',
    factSheetPdfSize: '2.4 MB',
    boilerplateText:
      'UIPKGE is an open-source dual-framework UI registry providing copy-paste accessible components for Vue 3 and React 19 with 100% code ownership. Headquartered in San Francisco with a distributed core maintainer team.',
    variant: 'default',
  },
)

const activeLogos = computed(() => props.logos ?? DEFAULT_LOGOS)
const activeColors = computed(() => props.colors ?? DEFAULT_COLORS)
const activeExecutives = computed(() => props.executives ?? DEFAULT_EXECUTIVES)
const activeGuidelines = computed(() => props.guidelines ?? DEFAULT_GUIDELINES)

const activeTab = ref<'all' | 'logos' | 'colors' | 'leadership' | 'press'>('all')
const copiedKey = ref<string | null>(null)
const downloadedKey = ref<string | null>(null)

async function copyToClipboard(key: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => {
      if (copiedKey.value === key) {
        copiedKey.value = null
      }
    }, 1800)
  } catch {
    // Fallback: noop
  }
}

function handleDownload(key: string, fileName: string) {
  downloadedKey.value = key
  // Simulated download feedback
  setTimeout(() => {
    if (downloadedKey.value === key) {
      downloadedKey.value = null
    }
  }, 2000)
}
</script>

<template>
  <div
    data-slot="press-kit-brand-assets"
    :class="cn('bg-background text-foreground w-full transition-colors', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <!-- Header Hero Section -->
      <div class="border-border bg-card relative overflow-hidden rounded-2xl border p-6 shadow-xs sm:p-10">
        <div
          class="bg-primary/5 pointer-events-none absolute -top-24 -right-24 size-96 shrink-0 rounded-full blur-3xl"
        />
        <div
          class="bg-accent/10 pointer-events-none absolute -bottom-20 -left-20 size-80 shrink-0 rounded-full blur-3xl"
        />

        <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-3xl space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="border-primary/30 bg-primary/10 text-primary gap-1.5 font-medium">
                <Sparkles class="size-3.5 shrink-0" />
                <span>Media & Brand Hub</span>
              </Badge>
              <Badge variant="secondary" class="font-mono text-xs">
                {{ version }}
              </Badge>
              <span class="text-muted-foreground text-xs">Updated {{ lastUpdated }}</span>
            </div>

            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {{ title }}
            </h1>

            <p class="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
              {{ subtitle }}
            </p>

            <div class="text-muted-foreground flex flex-wrap items-center gap-4 pt-1 text-xs">
              <div class="flex items-center gap-1.5">
                <ShieldCheck class="text-primary size-4 shrink-0" />
                <span>Editorial Use License (CC BY-NC 4.0)</span>
              </div>
              <Separator orientation="vertical" class="hidden h-3 sm:block" />
              <div class="flex items-center gap-1.5">
                <FileArchive class="text-muted-foreground size-4 shrink-0" />
                <span>24 Verified Brand Assets</span>
              </div>
              <Separator orientation="vertical" class="hidden h-3 sm:block" />
              <div class="flex items-center gap-1.5">
                <Globe class="text-muted-foreground size-4 shrink-0" />
                <span>Vector & 300 DPI Print Ready</span>
              </div>
            </div>
          </div>

          <!-- Primary Download Action Card -->
          <div class="flex flex-col gap-3 sm:min-w-[280px] lg:flex-col">
            <Button
              aria-label="Download attachment"
              size="lg"
              class="focus-visible:ring-ring h-auto min-h-10 w-full gap-2 py-2.5 text-center font-semibold whitespace-normal shadow-sm focus-visible:ring-2"
              @click="handleDownload('all-zip', 'uipkge-complete-press-kit.zip')"
            >
              <Check v-if="downloadedKey === 'all-zip'" class="size-4 shrink-0" />
              <Download v-else class="size-4 shrink-0" />
              <span>
                {{
                  downloadedKey === 'all-zip'
                    ? 'Press Kit Downloaded'
                    : `Download Complete Press Kit (.ZIP · ${pressKitZipSize})`
                }}
              </span>
            </Button>

            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                class="h-auto min-h-8 w-full gap-1.5 text-center text-xs whitespace-normal"
                @click="copyToClipboard('email-header', pressEmail)"
              >
                <Check v-if="copiedKey === 'email-header'" class="text-primary size-3.5 shrink-0" />
                <Mail v-else class="size-3.5 shrink-0" />
                <span>{{ copiedKey === 'email-header' ? 'Copied' : 'Press Desk' }}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="h-auto min-h-8 w-full gap-1.5 text-center text-xs whitespace-normal"
                @click="copyToClipboard('boilerplate-header', boilerplateText)"
              >
                <Check v-if="copiedKey === 'boilerplate-header'" class="text-primary size-3.5 shrink-0" />
                <Copy v-else class="size-3.5 shrink-0" />
                <span>{{ copiedKey === 'boilerplate-header' ? 'Copied' : 'Boilerplate' }}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Section Anchor Tabs (Default Variant) -->
      <div v-if="variant === 'default'" class="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          :variant="activeTab === 'all' ? 'default' : 'ghost'"
          size="sm"
          class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
          @click="activeTab = 'all'"
        >
          <Layers class="size-3.5 shrink-0" />
          <span>All Assets</span>
        </Button>
        <Button
          :variant="activeTab === 'logos' ? 'default' : 'ghost'"
          size="sm"
          class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
          @click="activeTab = 'logos'"
        >
          <FileImage class="size-3.5 shrink-0" />
          <span>Logos & Marks ({{ activeLogos.length }})</span>
        </Button>
        <Button
          :variant="activeTab === 'colors' ? 'default' : 'ghost'"
          size="sm"
          class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
          @click="activeTab = 'colors'"
        >
          <Palette class="size-3.5 shrink-0" />
          <span>Color Palette ({{ activeColors.length }})</span>
        </Button>
        <Button
          :variant="activeTab === 'leadership' ? 'default' : 'ghost'"
          size="sm"
          class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
          @click="activeTab = 'leadership'"
        >
          <User class="size-3.5 shrink-0" />
          <span>Leadership ({{ activeExecutives.length }})</span>
        </Button>
        <Button
          :variant="activeTab === 'press' ? 'default' : 'ghost'"
          size="sm"
          class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
          @click="activeTab = 'press'"
        >
          <Mail class="size-3.5 shrink-0" />
          <span>Press Contact</span>
        </Button>
      </div>

      <!-- SECTION 1: Official Logo Downloads -->
      <div v-if="activeTab === 'all' || activeTab === 'logos'" class="mt-12 space-y-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div class="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <FileImage class="size-4 shrink-0" />
              <span>Official Vectors & Assets</span>
            </div>
            <h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Official Logo Downloads</h2>
            <p class="text-muted-foreground mt-1 max-w-2xl text-sm">
              High-resolution vector assets for print and digital publishing. Please preserve minimum clear space.
            </p>
          </div>
          <Badge variant="outline" class="gap-1 self-start font-mono text-xs sm:self-auto">
            <span>4 Approved Variants</span>
          </Badge>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <Card
            v-for="logo in activeLogos"
            :key="logo.id"
            class="border-border hover:border-border/80 flex flex-col justify-between overflow-hidden border shadow-xs transition-colors"
          >
            <div>
              <!-- Logo Preview Surface with Checkered / Contrast Backdrop -->
              <div
                :class="
                  cn(
                    'relative flex min-h-[190px] items-center justify-center overflow-hidden p-4 text-center transition-colors sm:p-8',
                    logo.theme === 'dark'
                      ? 'bg-zinc-950 text-white'
                      : logo.theme === 'light' && logo.id === 'monochrome-light'
                        ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-200'
                        : 'bg-muted/40 text-foreground bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:12px_12px]',
                  )
                "
              >
                <!-- Rendered Vector Logo Preview -->
                <!-- Horizontal Logo -->
                <div v-if="logo.id === 'horizontal-primary'" class="flex items-center gap-3.5">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xs"
                  >
                    <svg viewBox="0 0 36 36" fill="none" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18 3V18L31 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18L5 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18V33"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.9"
                      />
                      <path d="M18 10.5L24.5 14.25V21.75L18 25.5L11.5 21.75V14.25L18 10.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div class="flex items-baseline gap-1.5">
                    <span class="font-sans text-2xl font-bold tracking-tight">uipkge</span>
                    <span
                      class="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      .dev
                    </span>
                  </div>
                </div>

                <!-- Square App Icon Mark -->
                <div v-else-if="logo.id === 'app-icon-mark'" class="flex items-center justify-center">
                  <div
                    class="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-4 text-emerald-400 shadow-md ring-1 ring-white/10"
                  >
                    <svg viewBox="0 0 36 36" fill="none" class="size-12 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18 3V18L31 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18L5 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18V33"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.9"
                      />
                      <path d="M18 10.5L24.5 14.25V21.75L18 25.5L11.5 21.75V14.25L18 10.5Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <!-- Dark Mode Monochromatic Logo -->
                <div v-else-if="logo.id === 'monochrome-dark'" class="flex items-center gap-3.5">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white"
                  >
                    <svg viewBox="0 0 36 36" fill="none" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18 3V18L31 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18L5 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18V33"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.9"
                      />
                      <path d="M18 10.5L24.5 14.25V21.75L18 25.5L11.5 21.75V14.25L18 10.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div class="flex items-baseline gap-1.5">
                    <span class="font-sans text-2xl font-bold tracking-tight text-white">uipkge</span>
                    <span class="rounded bg-white/15 px-1.5 py-0.5 text-xs font-semibold text-white/90">.dev</span>
                  </div>
                </div>

                <!-- Light Mode Inverted Logo -->
                <div v-else class="flex items-center gap-3.5">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-zinc-100">
                    <svg viewBox="0 0 36 36" fill="none" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18 3V18L31 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18L5 10.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.7"
                      />
                      <path
                        d="M18 18V33"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linejoin="round"
                        opacity="0.9"
                      />
                      <path d="M18 10.5L24.5 14.25V21.75L18 25.5L11.5 21.75V14.25L18 10.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div class="flex items-baseline gap-1.5">
                    <span class="font-sans text-2xl font-bold tracking-tight text-zinc-950">uipkge</span>
                    <span class="rounded bg-zinc-950/10 px-1.5 py-0.5 text-xs font-semibold text-zinc-950">.dev</span>
                  </div>
                </div>

                <!-- Specs Pill -->
                <div class="absolute right-2.5 bottom-2.5">
                  <span
                    class="bg-background/80 text-foreground border-border/50 rounded border px-2 py-0.5 font-mono text-xs backdrop-blur-sm"
                  >
                    {{ logo.dimensions }}
                  </span>
                </div>
              </div>

              <!-- Card Content Details -->
              <CardHeader class="p-5 pb-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle class="text-base font-semibold">{{ logo.title }}</CardTitle>
                  <Badge variant="secondary" class="text-xs">{{ logo.category }}</Badge>
                </div>
                <CardDescription class="mt-1 text-xs leading-relaxed">
                  {{ logo.description }}
                </CardDescription>
                <div class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                  <Info class="text-primary size-3.5 shrink-0" />
                  <span class="line-clamp-1"
                    ><strong class="text-foreground font-medium">Best for:</strong> {{ logo.bestFor }}</span
                  >
                </div>
              </CardHeader>
            </div>

            <!-- Card Footer Download Buttons -->
            <CardFooter class="p-5 pt-0">
              <div class="w-full space-y-2">
                <div class="text-muted-foreground flex items-center justify-between text-xs font-medium">
                  <span>Available Formats</span>
                  <span class="font-mono text-xs">Vector & Bitmaps</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <Button
                    aria-label="Download attachment"
                    v-for="fmt in logo.formats"
                    :key="fmt.ext"
                    variant="outline"
                    size="sm"
                    class="focus-visible:ring-ring h-auto min-h-8 w-full flex-col gap-0.5 px-1.5 py-2 text-center text-xs whitespace-normal focus-visible:ring-2"
                    @click="handleDownload(`${logo.id}-${fmt.ext}`, `${logo.id}.${fmt.ext}`)"
                  >
                    <div class="flex items-center gap-1 font-medium">
                      <Check v-if="downloadedKey === `${logo.id}-${fmt.ext}`" class="text-primary size-3 shrink-0" />
                      <Download v-else class="text-muted-foreground size-3 shrink-0" />
                      <span class="truncate">{{ fmt.label.split(' ')[0] }}</span>
                    </div>
                    <span class="text-muted-foreground font-mono text-xs">{{ fmt.size }}</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <!-- SECTION 2: Official Brand Palette & OKLCH Color Swatches -->
      <div v-if="activeTab === 'all' || activeTab === 'colors'" class="mt-16 space-y-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div class="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <Palette class="size-4 shrink-0" />
              <span>Token Palette & Swatches</span>
            </div>
            <h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Official Brand Palette & OKLCH</h2>
            <p class="text-muted-foreground mt-1 max-w-2xl text-sm">
              Perceptually uniform color tokens with high WCAG contrast ratings for both dark and light UI surfaces.
            </p>
          </div>
          <Badge variant="outline" class="gap-1 self-start font-mono text-xs sm:self-auto">
            <span>5 Core Swatches</span>
          </Badge>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card
            v-for="color in activeColors"
            :key="color.id"
            class="border-border flex flex-col justify-between overflow-hidden border shadow-xs"
          >
            <div>
              <!-- Swatch Visual Header -->
              <div
                :class="
                  cn('border-border/40 relative flex h-24 w-full flex-col justify-between border-b p-3', color.bgClass)
                "
              >
                <div class="flex items-center justify-between">
                  <span
                    :class="
                      cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-md',
                        color.textDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white',
                      )
                    "
                  >
                    {{ color.contrast }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span :class="cn('font-mono text-xs font-bold', color.textDark ? 'text-black' : 'text-white')">
                    {{ color.hex }}
                  </span>
                </div>
              </div>

              <!-- Color Details -->
              <div class="space-y-3 p-4">
                <div>
                  <h3 class="text-foreground text-sm font-semibold">{{ color.name }}</h3>
                  <p class="text-primary mt-0.5 text-xs font-medium">{{ color.role }}</p>
                </div>

                <p class="text-muted-foreground text-xs leading-relaxed">
                  {{ color.usage }}
                </p>

                <!-- Copy Value Blocks -->
                <div class="space-y-1.5 pt-1">
                  <div
                    class="bg-muted/60 border-border/40 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
                  >
                    <span class="text-muted-foreground truncate font-mono text-xs">{{ color.hex }}</span>
                    <button
                      type="button"
                      class="text-foreground hover:text-primary focus-visible:ring-ring flex min-h-6 items-center gap-1 rounded px-1 text-xs transition-colors focus-visible:ring-2"
                      :aria-label="`Copy ${color.name} HEX`"
                      @click="copyToClipboard(`hex-${color.id}`, color.hex)"
                    >
                      <Check v-if="copiedKey === `hex-${color.id}`" class="text-primary size-3 shrink-0" />
                      <Copy v-else class="size-3 shrink-0" />
                      <span class="text-xs">{{ copiedKey === `hex-${color.id}` ? 'Copied' : 'HEX' }}</span>
                    </button>
                  </div>

                  <div
                    class="bg-muted/60 border-border/40 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
                  >
                    <span class="text-muted-foreground truncate font-mono text-xs" :title="color.oklch">
                      {{ color.oklch.split('(')[1].replace(')', '') }}
                    </span>
                    <button
                      type="button"
                      class="text-foreground hover:text-primary focus-visible:ring-ring flex min-h-6 items-center gap-1 rounded px-1 text-xs transition-colors focus-visible:ring-2"
                      :aria-label="`Copy ${color.name} OKLCH`"
                      @click="copyToClipboard(`oklch-${color.id}`, color.oklch)"
                    >
                      <Check v-if="copiedKey === `oklch-${color.id}`" class="text-primary size-3 shrink-0" />
                      <Copy v-else class="size-3 shrink-0" />
                      <span class="text-xs">{{ copiedKey === `oklch-${color.id}` ? 'Copied' : 'OKLCH' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- SECTION 3: Executive Leadership Headshots & Bios -->
      <div v-if="activeTab === 'all' || activeTab === 'leadership'" class="mt-16 space-y-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div class="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <User class="size-4 shrink-0" />
              <span>Media Spokespersons</span>
            </div>
            <h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Executive Leadership & Bios</h2>
            <p class="text-muted-foreground mt-1 max-w-2xl text-sm">
              Official executive headshots and media blurbs for press releases, podcasts, and event keynotes.
            </p>
          </div>
          <Badge variant="outline" class="gap-1 self-start font-mono text-xs sm:self-auto">
            <span>300 DPI Studio Photography</span>
          </Badge>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <Card
            v-for="exec in activeExecutives"
            :key="exec.id"
            class="border-border flex flex-col justify-between overflow-hidden border shadow-xs"
          >
            <div class="space-y-5 p-6">
              <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Avatar class="border-border size-20 shrink-0 rounded-2xl border-2 shadow-sm">
                  <AvatarImage :src="exec.avatarUrl" :alt="exec.name" class="object-cover" />
                  <AvatarFallback class="bg-primary/10 text-primary rounded-2xl text-lg font-bold">
                    {{ exec.initials }}
                  </AvatarFallback>
                </Avatar>

                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-foreground text-lg font-bold">{{ exec.name }}</h3>
                    <Badge variant="secondary" class="text-xs font-normal">Executive</Badge>
                  </div>
                  <p class="text-primary text-xs font-medium">{{ exec.role }}</p>
                  <p class="text-muted-foreground font-mono text-xs">{{ exec.dimensions }}</p>
                </div>
              </div>

              <p class="text-muted-foreground text-xs leading-relaxed">
                {{ exec.bio }}
              </p>

              <div class="space-y-1.5">
                <span class="text-foreground text-xs font-medium">Speaking Topics & Focus Areas:</span>
                <div class="flex flex-wrap gap-1.5">
                  <Badge
                    v-for="topic in exec.topics"
                    :key="topic"
                    variant="outline"
                    class="bg-muted/40 text-xs font-normal"
                  >
                    {{ topic }}
                  </Badge>
                </div>
              </div>
            </div>

            <CardFooter
              class="border-border/40 bg-muted/20 mt-2 flex flex-col items-stretch justify-between gap-3 border-t p-6 pt-0 sm:flex-row sm:items-center"
            >
              <div class="text-muted-foreground flex items-center gap-1 text-xs">
                <FileImage class="text-primary size-3.5 shrink-0" />
                <span>{{ exec.fileSize }} RAW TIFF & JPG</span>
              </div>

              <Button
                aria-label="Download attachment"
                size="sm"
                variant="default"
                class="focus-visible:ring-ring h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal focus-visible:ring-2"
                @click="handleDownload(`headshot-${exec.id}`, `${exec.id}-headshot-300dpi.jpg`)"
              >
                <Check v-if="downloadedKey === `headshot-${exec.id}`" class="size-3.5 shrink-0" />
                <Download v-else class="size-3.5 shrink-0" />
                <span>{{
                  downloadedKey === `headshot-${exec.id}` ? 'Headshot Downloaded' : 'Download Headshot (300 DPI)'
                }}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <!-- SECTION 4: Press Hub & Media Contact + Brand Guidelines -->
      <div v-if="activeTab === 'all' || activeTab === 'press'" class="mt-16 grid gap-6 lg:grid-cols-2">
        <!-- Press Desk Contact Card -->
        <Card class="border-border flex flex-col justify-between border shadow-xs">
          <CardHeader class="p-6 pb-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Mail class="size-4 shrink-0" />
                <span>Press & Media Inquiries</span>
              </div>
              <Badge variant="outline" class="font-mono text-xs">{{ version }}</Badge>
            </div>
            <CardTitle class="mt-1 text-xl font-bold">Get in Touch with Media Relations</CardTitle>
            <CardDescription class="text-xs leading-relaxed">
              Direct access for accredited tech journalists, conference organizers, analysts, and podcast hosts.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4 p-6 pt-0">
            <!-- Email Box -->
            <div
              class="border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3.5"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-md">
                  <Mail class="size-4 shrink-0" />
                </div>
                <div>
                  <p class="text-foreground text-xs font-semibold">{{ pressEmail }}</p>
                  <p class="text-muted-foreground text-xs">Official Media & Inquiries Desk</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
                @click="copyToClipboard('press-email', pressEmail)"
              >
                <Check v-if="copiedKey === 'press-email'" class="text-primary size-3.5 shrink-0" />
                <Copy v-else class="size-3.5 shrink-0" />
                <span>{{ copiedKey === 'press-email' ? 'Copied' : 'Copy' }}</span>
              </Button>
            </div>

            <!-- Media SLA & Guidelines Grid -->
            <div class="grid grid-cols-2 gap-3 pt-1">
              <div class="border-border/60 bg-card space-y-1 rounded-lg border p-3">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <ShieldCheck class="text-primary size-3.5 shrink-0" />
                  <span>&lt; 24h Response</span>
                </div>
                <p class="text-muted-foreground text-xs">Prompt turnaround on verified interview and quote requests.</p>
              </div>

              <div class="border-border/60 bg-card space-y-1 rounded-lg border p-3">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Globe class="text-primary size-3.5 shrink-0" />
                  <span>Embargo Previews</span>
                </div>
                <p class="text-muted-foreground text-xs">Advance beta access and documentation under NDA/embargo.</p>
              </div>
            </div>
          </CardContent>

          <CardFooter class="border-border/40 bg-muted/10 mt-2 border-t p-6 pt-0">
            <div class="flex w-full flex-col items-stretch justify-between gap-3 pt-3 sm:flex-row sm:items-center">
              <span class="text-muted-foreground text-xs">Need company numbers & metrics?</span>
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                class="h-auto min-h-8 gap-1.5 text-center text-xs whitespace-normal"
                @click="handleDownload('factsheet-pdf', 'uipkge-company-factsheet.pdf')"
              >
                <Check v-if="downloadedKey === 'factsheet-pdf'" class="text-primary size-3.5 shrink-0" />
                <FileText v-else class="size-3.5 shrink-0" />
                <span>{{
                  downloadedKey === 'factsheet-pdf' ? 'Downloaded' : `Company Fact Sheet (.PDF · ${factSheetPdfSize})`
                }}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <!-- Company Boilerplate & Usage Rules -->
        <Card class="border-border flex flex-col justify-between border shadow-xs">
          <CardHeader class="p-6 pb-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <FileCode class="size-4 shrink-0" />
                <span>Brand Rules & Boilerplate</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                class="text-primary h-auto min-h-8 gap-1 text-center text-xs whitespace-normal"
                @click="copyToClipboard('boilerplate-text', boilerplateText)"
              >
                <Check v-if="copiedKey === 'boilerplate-text'" class="size-3 shrink-0" />
                <Copy v-else class="size-3 shrink-0" />
                <span>{{ copiedKey === 'boilerplate-text' ? 'Copied Boilerplate' : 'Copy Boilerplate' }}</span>
              </Button>
            </div>
            <CardTitle class="mt-1 text-xl font-bold">Official Company Boilerplate</CardTitle>
            <CardDescription class="text-xs leading-relaxed">
              Approved copy for standard "About the Company" sections in press releases and event booklets.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4 p-6 pt-0">
            <div
              class="border-border bg-muted/40 text-muted-foreground rounded-lg border p-3.5 text-xs leading-relaxed italic"
            >
              "{{ boilerplateText }}"
            </div>

            <!-- Quick Do's & Don'ts -->
            <div class="space-y-2">
              <span class="text-foreground text-xs font-semibold">Brand Usage Rules:</span>
              <div class="grid gap-2">
                <div
                  v-for="(rule, idx) in activeGuidelines.slice(0, 4)"
                  :key="idx"
                  class="text-muted-foreground flex items-start gap-2 text-xs"
                >
                  <CheckCircle2 v-if="rule.type === 'do'" class="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  <XCircle v-else class="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                  <span class="leading-normal">{{ rule.text }}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter class="border-border/40 bg-muted/10 mt-2 border-t p-6 pt-0">
            <div class="text-muted-foreground flex w-full items-center justify-between pt-3 text-xs">
              <span>Questions regarding brand trademark usage?</span>
              <a
                :href="`mailto:${pressEmail}?subject=Brand%20Guideline%20Inquiry`"
                class="text-primary inline-flex items-center gap-1 font-medium hover:underline"
              >
                Contact Legal Desk
                <ExternalLink class="size-3 shrink-0" />
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
