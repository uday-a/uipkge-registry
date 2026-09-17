<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Eye,
  FileDown,
  FileText,
  Globe,
  Heading1,
  Info,
  Lock,
  Monitor,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'info'

export interface SeoCheckItem {
  id: string
  title: string
  description: string
  status: CheckStatus
  value?: string
  recommendation?: string
  tag?: string
}

export interface SeoCategory {
  id: string
  name: string
  icon: 'meta' | 'headings' | 'opengraph' | 'technical'
  score: number
  checks: SeoCheckItem[]
}

export interface CoreVitalMetric {
  name: string
  label: string
  value: string
  status: 'good' | 'needs-improvement' | 'poor'
  target: string
}

export interface SeoAuditChecklistProps {
  url?: string
  score?: number
  lastAudited?: string
  titleTag?: string
  metaDescription?: string
  h1Tag?: string
  ogImageUrl?: string
  categories?: SeoCategory[]
  vitals?: CoreVitalMetric[]
  class?: HTMLAttributes['class']
}

const defaultVitals: CoreVitalMetric[] = [
  { name: 'LCP', label: 'Largest Contentful Paint', value: '1.2s', status: 'good', target: '≤ 2.5s' },
  { name: 'FID', label: 'First Input Delay', value: '12ms', status: 'good', target: '≤ 100ms' },
  { name: 'CLS', label: 'Cumulative Layout Shift', value: '0.01', status: 'good', target: '≤ 0.1' },
]

const defaultCategories: SeoCategory[] = [
  {
    id: 'meta-tags',
    name: 'Title & Meta Description',
    icon: 'meta',
    score: 100,
    checks: [
      {
        id: 'title-length',
        title: 'Title Tag Length & Structure',
        description: 'Page title is 58 characters (optimal range: 50–60 characters). Fully visible in 98% of SERPs.',
        status: 'pass',
        value: 'UIPKGE — Dual-Framework UI Registry for Vue & React',
        tag: '58 / 60 chars',
      },
      {
        id: 'meta-desc',
        title: 'Meta Description Length',
        description:
          'Meta description is 152 characters (optimal range: 140–160 characters). Rich keyword density without truncation.',
        status: 'pass',
        value:
          'Explore high-quality, copy-paste Vue and React UI components and blocks built with Tailwind CSS v4, Reka UI, and Lucide icons.',
        tag: '152 / 160 chars',
      },
      {
        id: 'canonical-url',
        title: 'Canonical URL Tag',
        description: 'Self-referencing canonical URL tag prevents duplicate content indexing across query variants.',
        status: 'pass',
        value: '<link rel="canonical" href="https://uipkge.dev/vue/components" />',
        tag: 'Present',
      },
      {
        id: 'meta-robots',
        title: 'Meta Robots Directives',
        description: 'Directives instruct crawlers to index the document and follow embedded hyperlinks.',
        status: 'pass',
        value: 'index, follow, max-image-preview:large, max-snippet:-1',
        tag: 'Index, Follow',
      },
    ],
  },
  {
    id: 'headings',
    name: 'Heading Hierarchy & Structure',
    icon: 'headings',
    score: 100,
    checks: [
      {
        id: 'h1-presence',
        title: 'Single Primary H1 Tag',
        description: 'Exactly 1 H1 tag detected containing target search terms and establishing clear topic authority.',
        status: 'pass',
        value: '<h1>UIPKGE Component & Block Registry</h1>',
        tag: '1 H1 Tag',
      },
      {
        id: 'h2-distribution',
        title: 'H2 Section Organization',
        description: '6 H2 tags logically divide major categories (Primitives, Blocks, Forms, Marketing, Feedback).',
        status: 'pass',
        value: '6 H2 tags · 0 skipped levels',
        tag: '6 H2 Tags',
      },
      {
        id: 'h3-nesting',
        title: 'H3 Subsection Hierarchy',
        description: '12 H3 tags cleanly nested under parent H2 sections without skipping hierarchical levels.',
        status: 'pass',
        value: '12 H3 tags · Valid tree hierarchy',
        tag: '12 H3 Tags',
      },
      {
        id: 'content-depth',
        title: 'Content Word Count & Substance',
        description: '1,840 words detected with strong semantic depth for component discovery.',
        status: 'pass',
        value: '1,840 words · 4.2 min read',
        tag: 'Substantial',
      },
    ],
  },
  {
    id: 'opengraph',
    name: 'OpenGraph & Social Share Cards',
    icon: 'opengraph',
    score: 100,
    checks: [
      {
        id: 'og-title-desc',
        title: 'OpenGraph Title & Description',
        description: 'Social graph tags are present and optimized for display across Twitter/X, LinkedIn, and Discord.',
        status: 'pass',
        value: 'og:title, og:description, og:type, og:url configured',
        tag: 'Configured',
      },
      {
        id: 'og-image',
        title: 'OpenGraph Social Banner Image',
        description:
          '1200 × 630px high-resolution banner image detected with crisp aspect ratio (1.91:1) and fast CDN delivery.',
        status: 'pass',
        value: 'https://uipkge.dev/og/components.png (1200x630 · 84 KB)',
        tag: '1200x630 px',
      },
      {
        id: 'twitter-card',
        title: 'Twitter / X Card Format',
        description: 'Card format explicitly set to summary_large_image for maximal feed visibility.',
        status: 'pass',
        value: 'twitter:card = summary_large_image',
        tag: 'Large Image',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Performance, Images & Technical SEO',
    icon: 'technical',
    score: 85,
    checks: [
      {
        id: 'image-alt-tags',
        title: 'Image Alt Attributes',
        description:
          'All 24 embedded images contain meaningful, non-empty alt text attributes for accessibility and image search.',
        status: 'pass',
        value: '24 / 24 images with valid alt text (100%)',
        tag: '24 / 24 Pass',
      },
      {
        id: 'broken-links',
        title: 'Crawlable Hyperlinks & 404 Errors',
        description: 'Crawled 142 internal and external links. 0 broken links or redirect loops detected.',
        status: 'pass',
        value: '142 links verified · 0 errors',
        tag: '0 Broken',
      },
      {
        id: 'ssl-security',
        title: 'SSL / HTTPS & Security Headers',
        description: 'Valid TLS 1.3 certificate with HSTS header enabled and automatic HTTP-to-HTTPS redirect.',
        status: 'pass',
        value: 'TLS 1.3 · HSTS Active · HTTP/2 Supported',
        tag: 'Secure',
      },
      {
        id: 'schema-markup',
        title: 'Schema.org Structured Data',
        description:
          'No SoftwareApplication or Product JSON-LD schema detected. Structured data enables rich Google SERP snippet features.',
        status: 'warning',
        value: 'Missing schema.org/SoftwareApplication microdata',
        recommendation:
          'Add JSON-LD script tag with SoftwareApplication schema to qualify for rich snippet search results.',
        tag: 'Missing Schema',
      },
    ],
  },
]

const props = withDefaults(defineProps<SeoAuditChecklistProps>(), {
  url: 'https://uipkge.dev/vue/components',
  score: 94,
  lastAudited: 'Audit completed in 640ms · Cached 2m ago',
  titleTag: 'UIPKGE — Dual-Framework UI Registry for Vue & React',
  metaDescription:
    'Explore high-quality, copy-paste Vue and React UI components and blocks built with Tailwind CSS v4, Reka UI, and Lucide icons. Unbundled registry with full source code ownership.',
  h1Tag: 'UIPKGE Component & Block Registry',
  ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
})

const activeCategories = computed(() => props.categories ?? defaultCategories)
const activeVitals = computed(() => props.vitals ?? defaultVitals)

const currentUrl = ref(props.url)
const isAuditing = ref(false)
const copiedSchema = ref(false)
const copiedUrl = ref(false)
const reportDownloaded = ref(false)
const previewDevice = ref<'desktop' | 'mobile'>('desktop')
const activeStatusFilter = ref<'all' | 'pass' | 'warning'>('all')

const allChecks = computed(() => activeCategories.value.flatMap((cat) => cat.checks))
const passCount = computed(() => allChecks.value.filter((c) => c.status === 'pass').length)
const warningCount = computed(() => allChecks.value.filter((c) => c.status === 'warning').length)
const totalCount = computed(() => allChecks.value.length)

const filteredCategories = computed(() => {
  if (activeStatusFilter.value === 'all') return activeCategories.value
  return activeCategories.value
    .map((cat) => ({
      ...cat,
      checks: cat.checks.filter((check) => check.status === activeStatusFilter.value),
    }))
    .filter((cat) => cat.checks.length > 0)
})

function handleReaudit() {
  isAuditing.value = true
  setTimeout(() => {
    isAuditing.value = false
  }, 500)
}

function handleCopySchema() {
  copiedSchema.value = true
  setTimeout(() => {
    copiedSchema.value = false
  }, 1800)
}

function handleCopyUrl() {
  copiedUrl.value = true
  setTimeout(() => {
    copiedUrl.value = false
  }, 1800)
}

function handleDownloadReport() {
  reportDownloaded.value = true
  setTimeout(() => {
    reportDownloaded.value = false
  }, 2000)
}
</script>

<template>
  <div :class="cn('w-full space-y-6', props.class)" data-slot="seo-audit-checklist">
    <!-- Header & Audit Control Center -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-5 sm:p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left: Target URL & Score -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <div
                class="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <span class="relative flex size-2">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span class="font-mono tabular-nums">{{ props.score }} / 100</span>
                <span>·</span>
                <span>Healthy Score</span>
              </div>
              <Badge wrap variant="outline" class="gap-1 text-xs font-normal">
                <Globe class="text-muted-foreground size-3" />
                HTTP 200 OK
              </Badge>
              <Badge wrap variant="outline" class="gap-1 text-xs font-normal">
                <ShieldCheck class="size-3 text-emerald-500" />
                Indexable
              </Badge>
            </div>

            <div>
              <h1 class="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                On-Page SEO Analyzer & Snippet Simulator
              </h1>
              <p class="text-muted-foreground text-xs">
                {{ props.lastAudited }}
              </p>
            </div>
          </div>

          <!-- Right: Action Buttons -->
          <div class="flex flex-wrap items-center gap-2.5 sm:self-start lg:self-center">
            <Button
              variant="outline"
              size="sm"
              class="h-9 gap-1.5 text-xs shadow-xs"
              :disabled="isAuditing"
              @click="handleReaudit"
            >
              <RefreshCw :class="['size-3.5', isAuditing ? 'animate-spin' : '']" />
              <span>Re-audit URL</span>
            </Button>

            <Button
              aria-label="Download attachment"
              size="sm"
              class="h-9 gap-1.5 text-xs font-medium shadow-xs"
              @click="handleDownloadReport"
            >
              <FileDown v-if="!reportDownloaded" class="size-3.5" />
              <Check v-else class="size-3.5 text-emerald-400" />
              <span>{{ reportDownloaded ? 'Report Exported!' : 'Download SEO Report' }}</span>
            </Button>
          </div>
        </div>

        <Separator class="my-4" />

        <!-- URL Input Strip -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <div class="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search class="size-4" />
            </div>
            <Input
              v-model="currentUrl"
              type="url"
              placeholder="https://yourdomain.com/path"
              class="h-9 w-full rounded-md pr-24 pl-9 font-mono text-xs shadow-xs"
              @keydown.enter="handleReaudit"
            />
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex min-h-6 items-center pr-3 text-xs transition-colors"
              @click="handleCopyUrl"
            >
              <Check v-if="copiedUrl" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
              <span class="ml-1 text-xs">{{ copiedUrl ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>
          <Button
            size="sm"
            variant="secondary"
            class="h-9 shrink-0 px-4 text-xs font-medium"
            :disabled="isAuditing"
            @click="handleReaudit"
          >
            <Sparkles class="text-primary mr-1.5 size-3.5" />
            Analyze Page
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- 4 Core SEO Pillar Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Pillar 1: Meta Tags & Snippet -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Meta Tags & Snippet</CardTitle>
          <div
            class="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <FileText class="size-3.5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">100% Pass</div>
            <Badge wrap variant="success" class="text-xs font-medium">Optimal</Badge>
          </div>
          <div class="space-y-1.5">
            <Progress :model-value="100" class="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
            <p class="text-muted-foreground text-xs">Title & description optimized</p>
          </div>
          <div
            class="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs"
          >
            <span>58 chars title</span>
            <span>·</span>
            <span>152 chars desc</span>
          </div>
        </CardContent>
      </Card>

      <!-- Pillar 2: Core Web Vitals -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Core Web Vitals</CardTitle>
          <div
            class="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <Zap class="size-3.5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Good</div>
            <Badge wrap variant="success" class="text-xs font-medium">98/100</Badge>
          </div>
          <div class="space-y-1.5">
            <Progress :model-value="98" class="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
            <p class="text-muted-foreground text-xs">LCP 1.2s · FID 12ms · CLS 0.01</p>
          </div>
          <div
            class="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs"
          >
            <span>Chrome UX Report</span>
            <span>·</span>
            <span class="text-emerald-600 dark:text-emerald-400">Passed</span>
          </div>
        </CardContent>
      </Card>

      <!-- Pillar 3: Mobile Usability -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Mobile Usability</CardTitle>
          <div
            class="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <Smartphone class="size-3.5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">100% Pass</div>
            <Badge wrap variant="success" class="text-xs font-medium">Valid</Badge>
          </div>
          <div class="space-y-1.5">
            <Progress :model-value="100" class="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
            <p class="text-muted-foreground text-xs">Touch targets & viewport valid</p>
          </div>
          <div
            class="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs"
          >
            <span>48px tap targets</span>
            <span>·</span>
            <span>0 horizontal scroll</span>
          </div>
        </CardContent>
      </Card>

      <!-- Pillar 4: Indexability & Crawl -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Indexability & Crawl</CardTitle>
          <div
            class="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <ShieldCheck class="size-3.5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Valid</div>
            <Badge wrap variant="success" class="text-xs font-medium">Indexed</Badge>
          </div>
          <div class="space-y-1.5">
            <Progress :model-value="95" class="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
            <p class="text-muted-foreground text-xs">Canonical URL present & sitemap verified</p>
          </div>
          <div
            class="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs"
          >
            <span>robots.txt allowed</span>
            <span>·</span>
            <span>sitemap.xml</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Google Search Result Snippet Preview Simulator -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <CardTitle class="text-base font-semibold">Google Search Result Snippet Preview</CardTitle>
            <Badge wrap variant="outline" class="gap-1 text-xs font-normal">
              <Eye class="text-primary size-3" />
              Live SERP Simulator
            </Badge>
          </div>
          <CardDescription class="text-xs">
            Simulate how your meta tags, title, and URL render in Google SERPs on desktop vs. mobile.
          </CardDescription>
        </div>

        <!-- Desktop / Mobile View Switcher -->
        <div class="border-border bg-muted/50 flex items-center rounded-lg border p-0.5">
          <button
            type="button"
            :class="[
              'flex min-h-6 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors',
              previewDevice === 'desktop'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="previewDevice = 'desktop'"
          >
            <Monitor class="size-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            :class="[
              'flex min-h-6 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors',
              previewDevice === 'mobile'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            ]"
            @click="previewDevice = 'mobile'"
          >
            <Smartphone class="size-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Mock Google SERP Result Box -->
        <div
          :class="[
            'border-border/80 bg-background mx-auto rounded-xl border p-4 shadow-xs transition-all duration-200 sm:p-5',
            previewDevice === 'mobile' ? 'border-border max-w-md' : 'w-full',
          ]"
        >
          <!-- Google Result Header / Breadcrumb -->
          <div class="flex items-center gap-2.5 pb-1.5">
            <div
              class="border-border bg-muted text-foreground flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            >
              ⚡
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-foreground flex items-center gap-1.5 text-xs">
                <span class="font-medium">uipkge.dev</span>
                <span class="text-muted-foreground">›</span>
                <span class="text-muted-foreground truncate">vue › components</span>
              </div>
              <p class="text-muted-foreground truncate font-mono text-xs">{{ props.url }}</p>
            </div>
          </div>

          <!-- Google SERP Title -->
          <div class="space-y-1 pt-1">
            <a
              href="#"
              class="block text-base leading-snug font-medium text-blue-600 hover:underline sm:text-lg dark:text-blue-400"
              @click.prevent
            >
              {{ props.titleTag }}
            </a>

            <!-- Google Snippet Description with highlighted keywords -->
            <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              <span class="text-muted-foreground/90 font-medium">Aug 20, 2026 — </span>
              Explore high-quality, copy-paste
              <strong class="text-foreground font-semibold">Vue</strong> and
              <strong class="text-foreground font-semibold">React</strong>
              <strong class="text-foreground font-semibold">UI components</strong> and blocks built with
              <strong class="text-foreground font-semibold">Tailwind CSS v4</strong>, Reka UI, and Lucide icons.
              Unbundled registry with full source code ownership.
            </p>
          </div>

          <!-- Google Rich Snippet Badges -->
          <div class="border-border/40 mt-3 flex flex-wrap items-center gap-2 border-t pt-2.5">
            <Badge wrap variant="secondary" class="text-xs font-normal"> ★ 4.9 · 1.4k GitHub Stars </Badge>
            <Badge wrap variant="outline" class="text-xs font-normal"> Free & Open Source </Badge>
            <Badge wrap variant="outline" class="text-xs font-normal"> Vue 3.5 + React 19 </Badge>
          </div>
        </div>

        <!-- Snippet Metrics Character / Pixel Budget Strip -->
        <div class="border-border/80 bg-muted/30 grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-3">
          <div class="min-w-0 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Title Tag Budget:</span>
              <span class="text-foreground font-mono font-semibold tabular-nums">58 / 60 chars</span>
            </div>
            <Progress :model-value="(58 / 60) * 100" class="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
            <p class="text-xs text-emerald-600 dark:text-emerald-400">Optimal (485px / 600px max SERP width)</p>
          </div>

          <div class="min-w-0 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Meta Description:</span>
              <span class="text-foreground font-mono font-semibold tabular-nums">152 / 160 chars</span>
            </div>
            <Progress :model-value="(152 / 160) * 100" class="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
            <p class="text-xs text-emerald-600 dark:text-emerald-400">Optimal (890px / 960px max SERP width)</p>
          </div>

          <div class="flex flex-col justify-between space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Truncation Risk:</span>
              <Badge wrap variant="success" class="px-1.5 py-0 text-xs">0% Truncation</Badge>
            </div>
            <p class="text-muted-foreground text-xs">Fully visible on both desktop & mobile Google viewports.</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Actionable Recommendation Callout Banner -->
    <Card class="border-amber-500/30 bg-amber-500/10 shadow-xs">
      <CardContent class="p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex items-start gap-3">
            <div
              class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400"
            >
              <AlertTriangle class="size-4" />
            </div>
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-foreground text-sm font-semibold">
                  Actionable Recommendation: Add Schema.org JSON-LD Structured Data
                </h3>
                <Badge wrap variant="warning" class="text-xs">High Impact</Badge>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Adding
                <code
                  class="bg-background/80 text-foreground border-border rounded border px-1 py-0.5 font-mono text-xs"
                  >SoftwareApplication</code
                >
                or
                <code
                  class="bg-background/80 text-foreground border-border rounded border px-1 py-0.5 font-mono text-xs"
                  >TechArticle</code
                >
                structured data enables Google Rich Snippets, rating stars, and knowledge graph carousels.
              </p>

              <!-- Inline Code Preview -->
              <div
                class="border-border/80 bg-background/90 text-foreground mt-2 rounded-md border p-3 font-mono text-xs"
              >
                <div class="text-muted-foreground flex items-center justify-between pb-1.5">
                  <span class="text-xs">Recommended JSON-LD Block</span>
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1 text-xs transition-colors"
                    @click="handleCopySchema"
                  >
                    <Check v-if="copiedSchema" class="size-3 text-emerald-500" />
                    <Copy v-else class="size-3" />
                    <span>{{ copiedSchema ? 'Copied' : 'Copy JSON-LD' }}</span>
                  </button>
                </div>
                <pre class="text-muted-foreground overflow-x-auto text-xs leading-snug"><code>{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "UIPKGE",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}</code></pre>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" class="shrink-0 gap-1.5 text-xs shadow-xs" @click="handleCopySchema">
            <Code2 class="size-3.5" />
            <span>Copy Schema Snippet</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Audit Checklist Grouped Accordion Section -->
    <div class="space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-foreground text-sm font-semibold tracking-tight">Detailed On-Page Audit Checklist</h2>
          <p class="text-muted-foreground text-xs">
            Complete verification of on-page meta tags, heading semantics, social cards, and technical crawlability.
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-8 px-2.5 text-xs',
              activeStatusFilter === 'all' ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground',
            ]"
            @click="activeStatusFilter = 'all'"
          >
            All Checks ({{ totalCount }})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-8 px-2.5 text-xs',
              activeStatusFilter === 'pass'
                ? 'bg-muted font-medium text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground',
            ]"
            @click="activeStatusFilter = 'pass'"
          >
            Passed ({{ passCount }})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-8 px-2.5 text-xs',
              activeStatusFilter === 'warning'
                ? 'bg-muted font-medium text-amber-600 dark:text-amber-400'
                : 'text-muted-foreground',
            ]"
            @click="activeStatusFilter = 'warning'"
          >
            Warnings ({{ warningCount }})
          </Button>
        </div>
      </div>

      <!-- Accordion List -->
      <Accordion type="multiple" :default-value="['meta-tags', 'headings', 'opengraph', 'technical']" class="space-y-3">
        <AccordionItem
          v-for="category in filteredCategories"
          :key="category.id"
          :value="category.id"
          class="border-border bg-card overflow-hidden rounded-lg border shadow-xs"
        >
          <AccordionTrigger class="px-5 py-4 hover:no-underline">
            <div class="flex w-full flex-wrap items-center justify-between gap-3 pr-2 text-left">
              <div class="flex items-center gap-3">
                <div
                  class="border-border/60 bg-muted/60 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md border"
                >
                  <FileText v-if="category.icon === 'meta'" class="size-4" />
                  <Heading1 v-else-if="category.icon === 'headings'" class="size-4" />
                  <Share2 v-else-if="category.icon === 'opengraph'" class="size-4" />
                  <Lock v-else class="size-4" />
                </div>
                <div>
                  <span class="text-foreground text-sm font-semibold">{{ category.name }}</span>
                  <p class="text-muted-foreground text-xs">
                    {{ category.checks.filter((c) => c.status === 'pass').length }} of
                    {{ category.checks.length }} tests passing
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <Badge
                  :variant="category.score === 100 ? 'success' : 'warning'"
                  class="text-xs font-semibold whitespace-normal tabular-nums"
                >
                  {{ category.score }}% Score
                </Badge>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent class="px-5 pt-0 pb-5">
            <div class="divide-border/60 border-border/60 divide-y border-t">
              <div v-for="check in category.checks" :key="check.id" class="space-y-2 py-3.5 first:pt-4 last:pb-1">
                <div class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div class="min-w-0 space-y-1">
                    <div class="flex items-center gap-2">
                      <CheckCircle2 v-if="check.status === 'pass'" class="size-4 shrink-0 text-emerald-500" />
                      <AlertTriangle v-else-if="check.status === 'warning'" class="size-4 shrink-0 text-amber-500" />
                      <AlertCircle v-else class="size-4 shrink-0 text-rose-500" />
                      <h4 class="text-foreground text-xs font-semibold sm:text-sm">{{ check.title }}</h4>
                    </div>
                    <p class="text-muted-foreground pl-6 text-xs leading-relaxed">{{ check.description }}</p>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 pl-6 sm:pl-0">
                    <Badge wrap v-if="check.tag" variant="outline" class="font-mono text-xs font-normal">
                      {{ check.tag }}
                    </Badge>
                    <Badge
                      :variant="
                        check.status === 'pass' ? 'success' : check.status === 'warning' ? 'warning' : 'destructive'
                      "
                      class="text-xs font-medium whitespace-normal capitalize"
                    >
                      {{ check.status }}
                    </Badge>
                  </div>
                </div>

                <!-- Code / Value Inspector Box -->
                <div
                  v-if="check.value"
                  class="border-border/70 bg-muted/40 text-foreground ml-6 rounded-md border px-3 py-2 font-mono text-xs"
                >
                  <span class="text-xs break-all">{{ check.value }}</span>
                </div>

                <!-- Recommendation Callout -->
                <div
                  v-if="check.recommendation"
                  class="ml-6 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:text-amber-200"
                >
                  <Info class="size-4 shrink-0 text-amber-500" />
                  <p class="text-xs leading-relaxed">{{ check.recommendation }}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>
