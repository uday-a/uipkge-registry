'use client'

import * as React from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Code2,
  Copy,
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
} from 'lucide-react'
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
  className?: string
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

export function SeoAuditChecklist({
  url = 'https://uipkge.dev/vue/components',
  score = 94,
  lastAudited = 'Audit completed in 640ms · Cached 2m ago',
  titleTag = 'UIPKGE — Dual-Framework UI Registry for Vue & React',
  metaDescription = 'Explore high-quality, copy-paste Vue and React UI components and blocks built with Tailwind CSS v4, Reka UI, and Lucide icons. Unbundled registry with full source code ownership.',
  categories = defaultCategories,
  className,
}: SeoAuditChecklistProps) {
  const [currentUrl, setCurrentUrl] = React.useState(url)
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [copiedSchema, setCopiedSchema] = React.useState(false)
  const [copiedUrl, setCopiedUrl] = React.useState(false)
  const [reportDownloaded, setReportDownloaded] = React.useState(false)
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'mobile'>('desktop')
  const [activeStatusFilter, setActiveStatusFilter] = React.useState<'all' | 'pass' | 'warning'>('all')

  const allChecks = React.useMemo(() => categories.flatMap((cat) => cat.checks), [categories])
  const passCount = React.useMemo(() => allChecks.filter((c) => c.status === 'pass').length, [allChecks])
  const warningCount = React.useMemo(() => allChecks.filter((c) => c.status === 'warning').length, [allChecks])
  const totalCount = allChecks.length

  const filteredCategories = React.useMemo(() => {
    if (activeStatusFilter === 'all') return categories
    return categories
      .map((cat) => ({
        ...cat,
        checks: cat.checks.filter((check) => check.status === activeStatusFilter),
      }))
      .filter((cat) => cat.checks.length > 0)
  }, [categories, activeStatusFilter])

  const handleReaudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setIsAuditing(false)
    }, 500)
  }

  const handleCopySchema = () => {
    setCopiedSchema(true)
    setTimeout(() => {
      setCopiedSchema(false)
    }, 1800)
  }

  const handleCopyUrl = () => {
    setCopiedUrl(true)
    setTimeout(() => {
      setCopiedUrl(false)
    }, 1800)
  }

  const handleDownloadReport = () => {
    setReportDownloaded(true)
    setTimeout(() => {
      setReportDownloaded(false)
    }, 2000)
  }

  return (
    <div className={cn('w-full space-y-6', className)} data-slot="seo-audit-checklist">
      {/* Header & Audit Control Center */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Target URL & Score */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-mono tabular-nums">{score} / 100</span>
                  <span>·</span>
                  <span>Healthy Score</span>
                </div>
                <Badge wrap variant="outline" className="gap-1 text-xs font-normal">
                  <Globe className="text-muted-foreground size-3" />
                  HTTP 200 OK
                </Badge>
                <Badge wrap variant="outline" className="gap-1 text-xs font-normal">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  Indexable
                </Badge>
              </div>

              <div>
                <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                  On-Page SEO Analyzer & Snippet Simulator
                </h1>
                <p className="text-muted-foreground text-xs">{lastAudited}</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:self-start lg:self-center">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs shadow-xs"
                disabled={isAuditing}
                onClick={handleReaudit}
              >
                <RefreshCw className={cn('size-3.5', isAuditing && 'animate-spin')} />
                <span>Re-audit URL</span>
              </Button>

              <Button
                aria-label="Download attachment"
                size="sm"
                className="h-9 gap-1.5 text-xs font-medium shadow-xs"
                onClick={handleDownloadReport}
              >
                {!reportDownloaded ? (
                  <FileDown className="size-3.5" />
                ) : (
                  <Check className="size-3.5 text-emerald-400" />
                )}
                <span>{reportDownloaded ? 'Report Exported!' : 'Download SEO Report'}</span>
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* URL Input Strip */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="size-4" />
              </div>
              <Input
                type="url"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="https://yourdomain.com/path"
                className="h-9 w-full rounded-md pr-24 pl-9 font-mono text-xs shadow-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleReaudit()
                }}
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex min-h-6 items-center pr-3 text-xs transition-colors"
                onClick={handleCopyUrl}
              >
                {copiedUrl ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span className="ml-1 text-xs">{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="h-9 shrink-0 px-4 text-xs font-medium"
              disabled={isAuditing}
              onClick={handleReaudit}
            >
              <Sparkles className="text-primary mr-1.5 size-3.5" />
              Analyze Page
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 Core SEO Pillar Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pillar 1: Meta Tags & Snippet */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Meta Tags & Snippet</CardTitle>
            <div className="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <FileText className="size-3.5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">100% Pass</div>
              <Badge wrap variant="success" className="text-xs font-medium">
                Optimal
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Progress value={100} className="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
              <p className="text-muted-foreground text-xs">Title & description optimized</p>
            </div>
            <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs">
              <span>58 chars title</span>
              <span>·</span>
              <span>152 chars desc</span>
            </div>
          </CardContent>
        </Card>

        {/* Pillar 2: Core Web Vitals */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Core Web Vitals</CardTitle>
            <div className="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <Zap className="size-3.5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Good</div>
              <Badge wrap variant="success" className="text-xs font-medium">
                98/100
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Progress value={98} className="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
              <p className="text-muted-foreground text-xs">LCP 1.2s · FID 12ms · CLS 0.01</p>
            </div>
            <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs">
              <span>Chrome UX Report</span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-emerald-400">Passed</span>
            </div>
          </CardContent>
        </Card>

        {/* Pillar 3: Mobile Usability */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Mobile Usability</CardTitle>
            <div className="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <Smartphone className="size-3.5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">100% Pass</div>
              <Badge wrap variant="success" className="text-xs font-medium">
                Valid
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Progress value={100} className="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
              <p className="text-muted-foreground text-xs">Touch targets & viewport valid</p>
            </div>
            <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs">
              <span>48px tap targets</span>
              <span>·</span>
              <span>0 horizontal scroll</span>
            </div>
          </CardContent>
        </Card>

        {/* Pillar 4: Indexability & Crawl */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Indexability & Crawl</CardTitle>
            <div className="border-border/60 bg-muted/60 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <ShieldCheck className="size-3.5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Valid</div>
              <Badge wrap variant="success" className="text-xs font-medium">
                Indexed
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Progress value={95} className="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
              <p className="text-muted-foreground text-xs">Canonical URL present & sitemap verified</p>
            </div>
            <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2 font-mono text-xs">
              <span>robots.txt allowed</span>
              <span>·</span>
              <span>sitemap.xml</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Search Result Snippet Preview Simulator */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Google Search Result Snippet Preview</CardTitle>
              <Badge wrap variant="outline" className="gap-1 text-xs font-normal">
                <Search className="text-primary size-3" />
                Live SERP Simulator
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Simulate how your meta tags, title, and URL render in Google SERPs on desktop vs. mobile.
            </CardDescription>
          </div>

          {/* Desktop / Mobile View Switcher */}
          <div className="border-border bg-muted/50 flex items-center rounded-lg border p-0.5">
            <button
              type="button"
              className={cn(
                'flex min-h-6 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors',
                previewDevice === 'desktop'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor className="size-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              className={cn(
                'flex min-h-6 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors',
                previewDevice === 'mobile'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone className="size-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mock Google SERP Result Box */}
          <div
            className={cn(
              'border-border/80 bg-background mx-auto rounded-xl border p-4 shadow-xs transition-all duration-200 sm:p-5',
              previewDevice === 'mobile' ? 'border-border max-w-md' : 'w-full',
            )}
          >
            {/* Google Result Header / Breadcrumb */}
            <div className="flex items-center gap-2.5 pb-1.5">
              <div className="border-border bg-muted text-foreground flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                ⚡
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-foreground flex items-center gap-1.5 text-xs">
                  <span className="font-medium">uipkge.dev</span>
                  <span className="text-muted-foreground">›</span>
                  <span className="text-muted-foreground truncate">vue › components</span>
                </div>
                <p className="text-muted-foreground truncate font-mono text-xs">{url}</p>
              </div>
            </div>

            {/* Google SERP Title */}
            <div className="space-y-1 pt-1">
              <a
                href="#"
                className="block text-base leading-snug font-medium text-blue-600 hover:underline sm:text-lg dark:text-blue-400"
                onClick={(e) => e.preventDefault()}
              >
                {titleTag}
              </a>

              {/* Google Snippet Description with highlighted keywords */}
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <span className="text-muted-foreground/90 font-medium">Aug 20, 2026 — </span>
                Explore high-quality, copy-paste <strong className="text-foreground font-semibold">Vue</strong> and{' '}
                <strong className="text-foreground font-semibold">React</strong>{' '}
                <strong className="text-foreground font-semibold">UI components</strong> and blocks built with{' '}
                <strong className="text-foreground font-semibold">Tailwind CSS v4</strong>, Reka UI, and Lucide icons.
                Unbundled registry with full source code ownership.
              </p>
            </div>

            {/* Google Rich Snippet Badges */}
            <div className="border-border/40 mt-3 flex flex-wrap items-center gap-2 border-t pt-2.5">
              <Badge wrap variant="secondary" className="text-xs font-normal">
                ★ 4.9 · 1.4k GitHub Stars
              </Badge>
              <Badge wrap variant="outline" className="text-xs font-normal">
                Free & Open Source
              </Badge>
              <Badge wrap variant="outline" className="text-xs font-normal">
                Vue 3.5 + React 19
              </Badge>
            </div>
          </div>

          {/* Snippet Metrics Character / Pixel Budget Strip */}
          <div className="border-border/80 bg-muted/30 grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Title Tag Budget:</span>
                <span className="text-foreground font-mono font-semibold tabular-nums">58 / 60 chars</span>
              </div>
              <Progress value={(58 / 60) * 100} className="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Optimal (485px / 600px max SERP width)</p>
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Meta Description:</span>
                <span className="text-foreground font-mono font-semibold tabular-nums">152 / 160 chars</span>
              </div>
              <Progress value={(152 / 160) * 100} className="h-1.5 w-full bg-emerald-500/20 [&>div]:bg-emerald-500" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Optimal (890px / 960px max SERP width)</p>
            </div>

            <div className="flex flex-col justify-between space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Truncation Risk:</span>
                <Badge wrap variant="success" className="px-1.5 py-0 text-xs">
                  0% Truncation
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">Fully visible on both desktop & mobile Google viewports.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Recommendation Callout Banner */}
      <Card className="border-amber-500/30 bg-amber-500/10 shadow-xs">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-sm font-semibold">
                    Actionable Recommendation: Add Schema.org JSON-LD Structured Data
                  </h3>
                  <Badge wrap variant="warning" className="text-xs">
                    High Impact
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Adding{' '}
                  <code className="border-border bg-background/80 text-foreground rounded border px-1 py-0.5 font-mono text-xs">
                    SoftwareApplication
                  </code>{' '}
                  or{' '}
                  <code className="border-border bg-background/80 text-foreground rounded border px-1 py-0.5 font-mono text-xs">
                    TechArticle
                  </code>{' '}
                  structured data enables Google Rich Snippets, rating stars, and knowledge graph carousels.
                </p>

                {/* Inline Code Preview */}
                <div className="border-border/80 bg-background/90 text-foreground mt-2 rounded-md border p-3 font-mono text-xs">
                  <div className="text-muted-foreground flex items-center justify-between pb-1.5">
                    <span className="text-xs">Recommended JSON-LD Block</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1 text-xs transition-colors"
                      onClick={handleCopySchema}
                    >
                      {copiedSchema ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      <span>{copiedSchema ? 'Copied' : 'Copy JSON-LD'}</span>
                    </button>
                  </div>
                  <pre className="text-muted-foreground overflow-x-auto text-xs leading-snug">
                    <code>{`{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "UIPKGE",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-xs shadow-xs"
              onClick={handleCopySchema}
            >
              <Code2 className="size-3.5" />
              <span>Copy Schema Snippet</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Checklist Grouped Accordion Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">Detailed On-Page Audit Checklist</h2>
            <p className="text-muted-foreground text-xs">
              Complete verification of on-page meta tags, heading semantics, social cards, and technical crawlability.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2.5 text-xs',
                activeStatusFilter === 'all' ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground',
              )}
              onClick={() => setActiveStatusFilter('all')}
            >
              All Checks ({totalCount})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2.5 text-xs',
                activeStatusFilter === 'pass'
                  ? 'bg-muted font-medium text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground',
              )}
              onClick={() => setActiveStatusFilter('pass')}
            >
              Passed ({passCount})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2.5 text-xs',
                activeStatusFilter === 'warning'
                  ? 'bg-muted font-medium text-amber-600 dark:text-amber-400'
                  : 'text-muted-foreground',
              )}
              onClick={() => setActiveStatusFilter('warning')}
            >
              Warnings ({warningCount})
            </Button>
          </div>
        </div>

        {/* Accordion List */}
        <Accordion
          type="multiple"
          defaultValue={['meta-tags', 'headings', 'opengraph', 'technical']}
          className="space-y-3"
        >
          {filteredCategories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border-border bg-card overflow-hidden rounded-lg border shadow-xs"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex w-full flex-wrap items-center justify-between gap-3 pr-2 text-left">
                  <div className="flex items-center gap-3">
                    <div className="border-border/60 bg-muted/60 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md border">
                      {category.icon === 'meta' && <FileText className="size-4" />}
                      {category.icon === 'headings' && <Heading1 className="size-4" />}
                      {category.icon === 'opengraph' && <Share2 className="size-4" />}
                      {category.icon === 'technical' && <Lock className="size-4" />}
                    </div>
                    <div>
                      <span className="text-foreground text-sm font-semibold">{category.name}</span>
                      <p className="text-muted-foreground text-xs">
                        {category.checks.filter((c) => c.status === 'pass').length} of {category.checks.length} tests
                        passing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Badge
                      wrap
                      variant={category.score === 100 ? 'success' : 'warning'}
                      className="text-xs font-semibold tabular-nums"
                    >
                      {category.score}% Score
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pt-0 pb-5">
                <div className="divide-border/60 border-border/60 divide-y border-t">
                  {category.checks.map((check) => (
                    <div key={check.id} className="space-y-2 py-3.5 first:pt-4 last:pb-1">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            {check.status === 'pass' && <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />}
                            {check.status === 'warning' && <AlertTriangle className="size-4 shrink-0 text-amber-500" />}
                            {check.status === 'fail' && <AlertCircle className="size-4 shrink-0 text-rose-500" />}
                            <h4 className="text-foreground text-xs font-semibold sm:text-sm">{check.title}</h4>
                          </div>
                          <p className="text-muted-foreground pl-6 text-xs leading-relaxed">{check.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pl-6 sm:pl-0">
                          {check.tag && (
                            <Badge wrap variant="outline" className="font-mono text-xs font-normal">
                              {check.tag}
                            </Badge>
                          )}
                          <Badge
                            wrap
                            variant={
                              check.status === 'pass'
                                ? 'success'
                                : check.status === 'warning'
                                  ? 'warning'
                                  : 'destructive'
                            }
                            className="text-xs font-medium capitalize"
                          >
                            {check.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Code / Value Inspector Box */}
                      {check.value && (
                        <div className="border-border/70 bg-muted/40 text-foreground ml-6 rounded-md border px-3 py-2 font-mono text-xs">
                          <span className="text-xs break-all">{check.value}</span>
                        </div>
                      )}

                      {/* Recommendation Callout */}
                      {check.recommendation && (
                        <div className="ml-6 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:text-amber-200">
                          <Info className="size-4 shrink-0 text-amber-500" />
                          <p className="text-xs leading-relaxed">{check.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
