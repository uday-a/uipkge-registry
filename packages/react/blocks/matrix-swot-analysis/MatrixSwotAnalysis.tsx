'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Download,
  Layers,
  Plus,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export interface SwotItem {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  tag: string
}

export interface StrategicInitiative {
  id: string
  title: string
  description: string
  strategyType: 'SO' | 'WO' | 'ST' | 'WT'
  strategyLabel: string
  priority: 'Critical' | 'High' | 'Strategic'
  timeframe: string
  targetMetric: string
}

export interface MatrixSwotAnalysisProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  project?: string
  lastUpdated?: string
  initialStrengths?: SwotItem[]
  initialWeaknesses?: SwotItem[]
  initialOpportunities?: SwotItem[]
  initialThreats?: SwotItem[]
  initiatives?: StrategicInitiative[]
  readonly?: boolean
}

const defaultStrengths: SwotItem[] = [
  {
    id: 's-1',
    title: 'Zero npm dependency overhead',
    description:
      'Components are copied directly into consumer project codebases, eliminating semver dependency locks, version skew, and transitive package bloat.',
    impact: 'high',
    tag: 'Core Architecture',
  },
  {
    id: 's-2',
    title: '100% code ownership for consumers',
    description:
      'Engineering teams retain complete control over markup, styles, accessibility props, and internal behaviors with zero upstream constraints.',
    impact: 'high',
    tag: 'Developer Autonomy',
  },
  {
    id: 's-3',
    title: 'Dual-framework Vue & React parity',
    description:
      'Strict visual, token, and functional symmetry between Vue 3 (Reka UI) and React (Radix UI) enables cross-stack design system alignment.',
    impact: 'high',
    tag: 'Market Breadth',
  },
  {
    id: 's-4',
    title: 'Tailwind v4 OKLCH token architecture',
    description:
      'CSS-first theme configuration using semantic surface variables, calibrated dark-mode layering, and WCAG AA compliant contrast ratios.',
    impact: 'medium',
    tag: 'Design System',
  },
]

const defaultWeaknesses: SwotItem[] = [
  {
    id: 'w-1',
    title: 'Manual upgrade path without semver',
    description:
      'Consuming codebases must manually pull code diffs or re-execute CLI add commands when library enhancements or bug fixes are published.',
    impact: 'high',
    tag: 'Maintenance Model',
  },
  {
    id: 'w-2',
    title: 'Initial learning curve for monorepos',
    description:
      'Junior developers accustomed to single-command npm package installs may face an initial cognitive hurdle managing raw unbundled components.',
    impact: 'medium',
    tag: 'Developer DX',
  },
  {
    id: 'w-3',
    title: 'Build time for 1,300+ SSG pages',
    description:
      'Synthesizing static island previews, AST code extraction, and multi-format LLM documentation across dual registries requires high memory in CI.',
    impact: 'medium',
    tag: 'Tooling Scale',
  },
]

const defaultOpportunities: SwotItem[] = [
  {
    id: 'o-1',
    title: 'AI Copilot workflows demanding raw source code',
    description:
      'LLM coding assistants (Claude, Cursor, Copilot) perform substantially better when refactoring transparent local SFCs than navigating opaque compiled dependencies.',
    impact: 'high',
    tag: 'AI Ergonomics',
  },
  {
    id: 'o-2',
    title: 'Enterprise design system white-labeling',
    description:
      'B2B organizations seeking unbranded, custom-styled design systems can adopt UIPKGE as their modular, open-source architectural baseline.',
    impact: 'high',
    tag: 'Enterprise B2B',
  },
  {
    id: 'o-3',
    title: 'E-Commerce and Healthcare template verticals',
    description:
      'Surging industry appetite for pre-built reference architectures (HRMS, Hospital Management, Logistics tracking) powered by composable blocks.',
    impact: 'high',
    tag: 'Vertical Growth',
  },
  {
    id: 'o-4',
    title: 'Community contributions of domain blocks',
    description:
      'Open-source contributors can rapidly publish specialized workflow blocks (radar charts, KYC wizards, audit logs) without semver packaging bottlenecks.',
    impact: 'medium',
    tag: 'Community',
  },
]

const defaultThreats: SwotItem[] = [
  {
    id: 't-1',
    title: 'Official shadcn expanding into Vue ecosystem',
    description:
      'Potential first-party Vue support by upstream shadcn could consolidate developer attention away from independent unbundled registries.',
    impact: 'high',
    tag: 'Competitive Risk',
  },
  {
    id: 't-2',
    title: 'Upstream Reka UI headless breaking changes',
    description:
      'Substantial architectural shifts or breaking release cycles in upstream headless libraries require immediate parity synchronization.',
    impact: 'high',
    tag: 'Upstream Drift',
  },
  {
    id: 't-3',
    title: 'Browser CSS specification shifts',
    description:
      'Rapid evolution in CSS @scope, anchor positioning, and native light-dark() CSS functions may require recurring baseline refactoring.',
    impact: 'medium',
    tag: 'Web Standards',
  },
]

const defaultInitiatives: StrategicInitiative[] = [
  {
    id: 'init-1',
    title: 'Automate Upstream Sync & Breaking Change Detection',
    description:
      'Implement automated CI regression monitoring against Reka UI and upstream shadcn tokens to maintain 100% runtime compatibility without breaking consumer projects.',
    strategyType: 'SO',
    strategyLabel: 'SO Strategy (Strengths × Opportunities)',
    priority: 'Critical',
    timeframe: 'Q4 2026',
    targetMetric: '< 24h Upstream Parity Turnaround',
  },
  {
    id: 'init-2',
    title: 'AI-Native Context & CLI Smart Upgrade Engine',
    description:
      'Ship an intelligent CLI diff command and fine-tuned llms.txt vector context to let AI coding agents auto-patch and upgrade local consumer components directly.',
    strategyType: 'WO',
    strategyLabel: 'WO Strategy (Weaknesses × Opportunities)',
    priority: 'High',
    timeframe: 'Q4 2026',
    targetMetric: 'Zero-Friction AST Upgrade Patches',
  },
  {
    id: 'init-3',
    title: 'Curated Vertical Template Packs & Enterprise Baseline',
    description:
      'Deliver production-grade Nuxt 4 and Next.js vertical boilerplate templates (HRMS, HMS, Logistics) to eliminate monorepo onboarding friction for enterprise builders.',
    strategyType: 'ST',
    strategyLabel: 'ST Strategy (Strengths × Threats)',
    priority: 'Strategic',
    timeframe: 'Q1 2027',
    targetMetric: '4 Turnkey Vertical Reference Apps',
  },
]

export function MatrixSwotAnalysis({
  title = 'SWOT Strategic Analysis Canvas',
  project = 'UIPKGE Unbundled UI Registry Strategy · Q3 2026',
  lastUpdated = 'Aug 21, 2026',
  initialStrengths = defaultStrengths,
  initialWeaknesses = defaultWeaknesses,
  initialOpportunities = defaultOpportunities,
  initialThreats = defaultThreats,
  initiatives = defaultInitiatives,
  readonly = false,
  className,
  ...props
}: MatrixSwotAnalysisProps) {
  const [strengths, setStrengths] = React.useState<SwotItem[]>(initialStrengths)
  const [weaknesses, setWeaknesses] = React.useState<SwotItem[]>(initialWeaknesses)
  const [opportunities, setOpportunities] = React.useState<SwotItem[]>(initialOpportunities)
  const [threats, setThreats] = React.useState<SwotItem[]>(initialThreats)

  const [inputStrength, setInputStrength] = React.useState('')
  const [inputWeakness, setInputWeakness] = React.useState('')
  const [inputOpportunity, setInputOpportunity] = React.useState('')
  const [inputThreat, setInputThreat] = React.useState('')

  const [isCopied, setIsCopied] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)

  const totalCards = strengths.length + weaknesses.length + opportunities.length + threats.length

  function handleAddStrength(e: React.FormEvent) {
    e.preventDefault()
    const text = inputStrength.trim()
    if (!text) return
    setStrengths((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        title: text,
        description: 'Custom strategic strength added during canvas session.',
        impact: 'high',
        tag: 'Internal Strategic Advantage',
      },
    ])
    setInputStrength('')
  }

  function handleRemoveStrength(id: string) {
    setStrengths((prev) => prev.filter((item) => item.id !== id))
  }

  function handleAddWeakness(e: React.FormEvent) {
    e.preventDefault()
    const text = inputWeakness.trim()
    if (!text) return
    setWeaknesses((prev) => [
      ...prev,
      {
        id: `w-${Date.now()}`,
        title: text,
        description: 'Custom strategic vulnerability identified for remediation.',
        impact: 'medium',
        tag: 'Internal Remediation',
      },
    ])
    setInputWeakness('')
  }

  function handleRemoveWeakness(id: string) {
    setWeaknesses((prev) => prev.filter((item) => item.id !== id))
  }

  function handleAddOpportunity(e: React.FormEvent) {
    e.preventDefault()
    const text = inputOpportunity.trim()
    if (!text) return
    setOpportunities((prev) => [
      ...prev,
      {
        id: `o-${Date.now()}`,
        title: text,
        description: 'External market dynamic or technological growth tailwind.',
        impact: 'high',
        tag: 'External Opportunity',
      },
    ])
    setInputOpportunity('')
  }

  function handleRemoveOpportunity(id: string) {
    setOpportunities((prev) => prev.filter((item) => item.id !== id))
  }

  function handleAddThreat(e: React.FormEvent) {
    e.preventDefault()
    const text = inputThreat.trim()
    if (!text) return
    setThreats((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        title: text,
        description: 'External industry risk factor requiring proactive defensive mitigation.',
        impact: 'high',
        tag: 'External Threat',
      },
    ])
    setInputThreat('')
  }

  function handleRemoveThreat(id: string) {
    setThreats((prev) => prev.filter((item) => item.id !== id))
  }

  function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  function handleExportPdf() {
    setIsExporting(true)
    setTimeout(() => setIsExporting(false), 1500)
  }

  return (
    <div data-slot="matrix-swot-analysis" className={cn('w-full space-y-6', className)} {...props}>
      {/* Header Surface */}
      <div className="bg-card text-card-foreground flex flex-col gap-5 rounded-xl border p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
            <Badge wrap variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-medium">
              2×2 TOWS Matrix
            </Badge>
            <Badge wrap variant="secondary" className="text-xs font-normal">
              {totalCards} Strategic Factors
            </Badge>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5" />
              <span className="text-foreground font-medium">{project}</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>Updated {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-xs shadow-xs"
            disabled={isExporting}
            onClick={handleExportPdf}
          >
            {!isExporting ? <Download className="size-3.5" /> : <Clock className="size-3.5 animate-spin" />}
            <span>{isExporting ? 'Generating PDF...' : 'Export Canvas PDF'}</span>
          </Button>

          <Button variant="default" size="sm" className="h-9 gap-2 text-xs shadow-xs" onClick={handleShare}>
            {isCopied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            <span>{isCopied ? 'Link Copied!' : 'Share Strategy'}</span>
          </Button>
        </div>
      </div>

      {/* 2x2 Matrix Axis Guide Legend */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs font-medium text-emerald-700 shadow-xs dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Internal Attributes</span>
          </div>
          <Badge wrap variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-xs">
            Helpful (+)
          </Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 px-3.5 py-2.5 text-xs font-medium text-rose-700 shadow-xs dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>Internal Attributes</span>
          </div>
          <Badge wrap variant="outline" className="border-rose-500/30 bg-rose-500/10 text-xs">
            Harmful (−)
          </Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-xs font-medium text-sky-700 shadow-xs dark:text-sky-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <span>External Dynamics</span>
          </div>
          <Badge wrap variant="outline" className="border-sky-500/30 bg-sky-500/10 text-xs">
            Helpful (+)
          </Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/5 px-3.5 py-2.5 text-xs font-medium text-purple-700 shadow-xs dark:text-purple-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 shrink-0 text-purple-600 dark:text-purple-400" />
            <span>External Dynamics</span>
          </div>
          <Badge wrap variant="outline" className="border-purple-500/30 bg-purple-500/10 text-xs">
            Harmful (−)
          </Badge>
        </div>
      </div>

      {/* 2x2 SWOT Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* QUADRANT 1: STRENGTHS (Internal / Positive) */}
        <Card className="flex flex-col justify-between border-emerald-500/30 shadow-xs dark:border-emerald-500/20">
          <CardHeader className="border-border/60 border-b bg-emerald-500/5 pb-4 dark:bg-emerald-950/15">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold sm:text-lg">Strengths</CardTitle>
                    <Badge
                      wrap
                      className="border-emerald-500/20 bg-emerald-500/15 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                      {strengths.length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Internal attributes &amp; distinct technical capabilities
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge
                  wrap
                  variant="outline"
                  className="hidden border-emerald-500/30 text-xs text-emerald-700 sm:inline-flex dark:text-emerald-300"
                >
                  Internal
                </Badge>
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300"
                >
                  Positive
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3 p-4 sm:p-5">
            {strengths.map((item) => (
              <div
                key={item.id}
                className="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-emerald-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-foreground text-sm leading-snug font-semibold">{item.title}</h4>
                      <Badge
                        wrap
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-700 dark:text-emerald-300"
                      >
                        {item.tag}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                  </div>

                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                      aria-label="Remove strength item"
                      onClick={() => handleRemoveStrength(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {strengths.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs">
                No strength items listed. Add a core advantage below.
              </div>
            )}
          </CardContent>

          {!readonly && (
            <CardFooter className="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
              <form className="flex w-full items-center gap-2" onSubmit={handleAddStrength}>
                <Input
                  value={inputStrength}
                  type="text"
                  placeholder="Add key strength... (Press Enter)"
                  className="h-8.5 text-xs shadow-xs"
                  onChange={(e) => setInputStrength(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8.5 shrink-0 gap-1.5 bg-emerald-600 text-xs text-white shadow-xs hover:bg-emerald-700"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>

        {/* QUADRANT 2: WEAKNESSES (Internal / Negative) */}
        <Card className="flex flex-col justify-between border-rose-500/30 shadow-xs dark:border-rose-500/20">
          <CardHeader className="border-border/60 border-b bg-rose-500/5 pb-4 dark:bg-rose-950/15">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 shadow-xs dark:text-rose-400">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold sm:text-lg">Weaknesses</CardTitle>
                    <Badge
                      wrap
                      className="border-rose-500/20 bg-rose-500/15 text-xs font-semibold text-rose-700 dark:text-rose-300"
                    >
                      {weaknesses.length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Internal limitations &amp; operational friction points
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge
                  wrap
                  variant="outline"
                  className="hidden border-rose-500/30 text-xs text-rose-700 sm:inline-flex dark:text-rose-300"
                >
                  Internal
                </Badge>
                <Badge wrap variant="outline" className="border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
                  Negative
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3 p-4 sm:p-5">
            {weaknesses.map((item) => (
              <div
                key={item.id}
                className="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-rose-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-foreground text-sm leading-snug font-semibold">{item.title}</h4>
                      <Badge
                        wrap
                        variant="outline"
                        className="border-rose-500/20 bg-rose-500/10 text-xs font-normal text-rose-700 dark:text-rose-300"
                      >
                        {item.tag}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                  </div>

                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                      aria-label="Remove weakness item"
                      onClick={() => handleRemoveWeakness(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {weaknesses.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs">
                No weakness items listed. Add an area for improvement below.
              </div>
            )}
          </CardContent>

          {!readonly && (
            <CardFooter className="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
              <form className="flex w-full items-center gap-2" onSubmit={handleAddWeakness}>
                <Input
                  value={inputWeakness}
                  type="text"
                  placeholder="Add key weakness... (Press Enter)"
                  className="h-8.5 text-xs shadow-xs"
                  onChange={(e) => setInputWeakness(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8.5 shrink-0 gap-1.5 bg-rose-600 text-xs text-white shadow-xs hover:bg-rose-700"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>

        {/* QUADRANT 3: OPPORTUNITIES (External / Positive) */}
        <Card className="flex flex-col justify-between border-sky-500/30 shadow-xs dark:border-sky-500/20">
          <CardHeader className="border-border/60 border-b bg-sky-500/5 pb-4 dark:bg-sky-950/15">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 shadow-xs dark:text-sky-400">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold sm:text-lg">Opportunities</CardTitle>
                    <Badge
                      wrap
                      className="border-sky-500/20 bg-sky-500/15 text-xs font-semibold text-sky-700 dark:text-sky-300"
                    >
                      {opportunities.length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    External tailwinds &amp; strategic expansion opportunities
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge
                  wrap
                  variant="outline"
                  className="hidden border-sky-500/30 text-xs text-sky-700 sm:inline-flex dark:text-sky-300"
                >
                  External
                </Badge>
                <Badge wrap variant="outline" className="border-sky-500/30 text-xs text-sky-700 dark:text-sky-300">
                  Positive
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3 p-4 sm:p-5">
            {opportunities.map((item) => (
              <div
                key={item.id}
                className="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-sky-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-foreground text-sm leading-snug font-semibold">{item.title}</h4>
                      <Badge
                        wrap
                        variant="outline"
                        className="border-sky-500/20 bg-sky-500/10 text-xs font-normal text-sky-700 dark:text-sky-300"
                      >
                        {item.tag}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                  </div>

                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                      aria-label="Remove opportunity item"
                      onClick={() => handleRemoveOpportunity(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {opportunities.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs">
                No opportunity items listed. Add a market growth vector below.
              </div>
            )}
          </CardContent>

          {!readonly && (
            <CardFooter className="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
              <form className="flex w-full items-center gap-2" onSubmit={handleAddOpportunity}>
                <Input
                  value={inputOpportunity}
                  type="text"
                  placeholder="Add key opportunity... (Press Enter)"
                  className="h-8.5 text-xs shadow-xs"
                  onChange={(e) => setInputOpportunity(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8.5 shrink-0 gap-1.5 bg-sky-600 text-xs text-white shadow-xs hover:bg-sky-700"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>

        {/* QUADRANT 4: THREATS (External / Negative) */}
        <Card className="flex flex-col justify-between border-purple-500/30 shadow-xs dark:border-purple-500/20">
          <CardHeader className="border-border/60 border-b bg-purple-500/5 pb-4 dark:bg-purple-950/15">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-600 shadow-xs dark:text-purple-400">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold sm:text-lg">Threats</CardTitle>
                    <Badge
                      wrap
                      className="border-purple-500/20 bg-purple-500/15 text-xs font-semibold text-purple-700 dark:text-purple-300"
                    >
                      {threats.length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    External risks, competitive forces &amp; ecosystem shifts
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge
                  wrap
                  variant="outline"
                  className="hidden border-purple-500/30 text-xs text-purple-700 sm:inline-flex dark:text-purple-300"
                >
                  External
                </Badge>
                <Badge
                  wrap
                  variant="outline"
                  className="border-purple-500/30 text-xs text-purple-700 dark:text-purple-300"
                >
                  Negative
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3 p-4 sm:p-5">
            {threats.map((item) => (
              <div
                key={item.id}
                className="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-purple-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-foreground text-sm leading-snug font-semibold">{item.title}</h4>
                      <Badge
                        wrap
                        variant="outline"
                        className="border-purple-500/20 bg-purple-500/10 text-xs font-normal text-purple-700 dark:text-purple-300"
                      >
                        {item.tag}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                  </div>

                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                      aria-label="Remove threat item"
                      onClick={() => handleRemoveThreat(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {threats.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs">
                No threat items listed. Add an external risk factor below.
              </div>
            )}
          </CardContent>

          {!readonly && (
            <CardFooter className="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
              <form className="flex w-full items-center gap-2" onSubmit={handleAddThreat}>
                <Input
                  value={inputThreat}
                  type="text"
                  placeholder="Add key threat... (Press Enter)"
                  className="h-8.5 text-xs shadow-xs"
                  onChange={(e) => setInputThreat(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8.5 shrink-0 gap-1.5 bg-purple-600 text-xs text-white shadow-xs hover:bg-purple-700"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Strategic Synthesis & Key Next Actions Card (TOWS Strategy) */}
      <Card className="shadow-xs">
        <CardHeader className="border-border/60 bg-muted/15 border-b pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="text-primary size-4" />
                <CardTitle className="text-base font-bold sm:text-lg">
                  Strategic Synthesis &amp; Key Next Actions
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Actionable strategic initiatives bridging internal capabilities with external market dynamics (TOWS
                matrix formulation).
              </CardDescription>
            </div>

            <Badge wrap variant="outline" className="w-fit text-xs font-medium">
              {initiatives.length} Active Initiatives
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {initiatives.map((initiative) => (
              <div
                key={initiative.id}
                className="bg-muted/30 hover:border-primary/40 flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-[border-color,box-shadow]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-semibold',
                        initiative.strategyType === 'SO' &&
                          'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                        initiative.strategyType === 'WO' &&
                          'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                        initiative.strategyType === 'ST' &&
                          'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
                        initiative.strategyType === 'WT' &&
                          'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
                      )}
                    >
                      {initiative.strategyType} Strategy
                    </Badge>

                    <Badge
                      wrap
                      variant={initiative.priority === 'Critical' ? 'destructive' : 'secondary'}
                      className="text-xs font-medium"
                    >
                      {initiative.priority}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-foreground text-sm leading-snug font-semibold">{initiative.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{initiative.description}</p>
                  </div>
                </div>

                <div className="border-border/50 mt-4 flex items-center justify-between gap-2 border-t pt-3 text-xs">
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>{initiative.timeframe}</span>
                  </div>
                  <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                    {initiative.targetMetric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MatrixSwotAnalysis
