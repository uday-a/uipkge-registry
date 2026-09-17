'use client'

import * as React from 'react'
import {
  AlertCircle,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode2,
  HelpCircle,
  Info,
  Plus,
  RefreshCw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type FrameworkType = 'weighted-matrix' | 'rice'

export interface DecisionMatrixTableProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  defaultFramework?: FrameworkType
}

export interface CriterionDef {
  key: 'impact' | 'confidence' | 'effort' | 'dx' | 'maintenance'
  label: string
  shortLabel: string
  description: string
  defaultWeight: number
}

export interface MatrixOption {
  id: string
  name: string
  architecture: string
  summary: string
  keyRisk: string
  color: string
  pros: string[]
  cons: string[]
  scores: {
    impact: number // 1 to 5
    confidence: number // 1 to 5
    effort: number // 1 to 5 (simplicity / low effort)
    dx: number // 1 to 5 (dx ownership)
    maintenance: number // 1 to 5 (low maintenance overhead)
  }
  rice: {
    reach: number // 0 to 100 (% of engineers / services)
    impact: number // 1 to 5 multiplier
    confidence: number // 50 to 100 (%)
    effort: number // 1 to 5 person-sprints
  }
  isCustom?: boolean
}

const criteriaList: CriterionDef[] = [
  {
    key: 'impact',
    label: 'Engineering Impact',
    shortLabel: 'Impact',
    description: 'System modularity, bundle footprint reduction, and runtime performance gains.',
    defaultWeight: 25,
  },
  {
    key: 'confidence',
    label: 'Confidence / Feasibility',
    shortLabel: 'Confidence',
    description: 'Ecosystem support, library maturity, and developer team readiness.',
    defaultWeight: 25,
  },
  {
    key: 'effort',
    label: 'Simplicity (Low Effort)',
    shortLabel: 'Low Effort',
    description: 'Frictionless adoption curve, zero monolith refactors, fast time to market.',
    defaultWeight: 15,
  },
  {
    key: 'dx',
    label: 'DX & Consumer Ownership',
    shortLabel: 'DX Ownership',
    description: 'Full source access, effortless Tailwind styling customization, zero semver lock-in.',
    defaultWeight: 20,
  },
  {
    key: 'maintenance',
    label: 'Low Maintenance',
    shortLabel: 'Low Maint.',
    description: 'Decoupled component lifecycles, zero breaking upstream transitive dependency cascades.',
    defaultWeight: 15,
  },
]

const initialOptions: MatrixOption[] = [
  {
    id: 'opt-a',
    name: 'Option A: Unbundled Registry architecture',
    architecture: 'UIPKGE / shadcn Model',
    summary:
      'Components copy directly into consumer source tree. Zero semver locks, complete styling autonomy, and unconstrained design customization.',
    keyRisk: 'Downstream drift from upstream patches managed through automated registry diffing.',
    color: '#10b981',
    pros: [
      'Zero npm package version lock-in or dependency gridlock',
      'Immediate Tailwind class-level and DOM customization',
      '100% dead-code elimination and optimal bundle footprint',
    ],
    cons: ['Manual or CLI-assisted updates when upstream security patches land'],
    scores: {
      impact: 4.8,
      confidence: 4.7,
      effort: 4.5,
      dx: 5.0,
      maintenance: 4.4,
    },
    rice: {
      reach: 96,
      impact: 5.0,
      confidence: 95,
      effort: 1.8,
    },
  },
  {
    id: 'opt-b',
    name: 'Option B: Monolithic Multi-Framework NPM',
    architecture: 'Centralized Monorepo Package',
    summary:
      'Single heavy versioned library published to private registry. Standardized tokens but painful breaking version cascades across product suites.',
    keyRisk: 'High cross-team dependency coupling and blocked semver upgrades.',
    color: '#f59e0b',
    pros: [
      'Single point of governance for security and accessibility patches',
      'Familiar `npm install` workflow for junior developers',
    ],
    cons: [
      'Massive wrapper overhead and difficult Tailwind class overrides',
      'Breaking changes in one component delay releases for entire company',
      'Bloated runtime JS bundle containing unused component code',
    ],
    scores: {
      impact: 3.2,
      confidence: 4.1,
      effort: 3.8,
      dx: 2.3,
      maintenance: 2.6,
    },
    rice: {
      reach: 82,
      impact: 3.0,
      confidence: 85,
      effort: 3.6,
    },
  },
  {
    id: 'opt-c',
    name: 'Option C: Custom Web Components Wrapper',
    architecture: 'Custom Elements v1 & Shadow DOM',
    summary:
      'Framework-agnostic web components encapsulated in Shadow DOM. Cross-platform runtime interoperability, but major SSR hydration and styling friction.',
    keyRisk: 'SSR rendering latency and challenging CSS theme token propagation through shadow boundaries.',
    color: '#6366f1',
    pros: [
      'Universal encapsulation across Vue, React, Angular, and vanilla HTML',
      'Strict CSS isolation prevents accidental style collisions',
    ],
    cons: [
      'Complex SSR and Declarative Shadow DOM hydration mechanics',
      'Difficult theme token synchronization and slot styling gymnastics',
      'Suboptimal ergonomics with React synthetic event systems',
    ],
    scores: {
      impact: 3.7,
      confidence: 3.4,
      effort: 2.8,
      dx: 3.1,
      maintenance: 3.5,
    },
    rice: {
      reach: 90,
      impact: 3.5,
      confidence: 70,
      effort: 3.2,
    },
  },
  {
    id: 'opt-d',
    name: 'Option D: Micro-Frontend Module Federation',
    architecture: 'Webpack / Vite Runtime Federation',
    summary:
      'Dynamic runtime module stitching over HTTP. Independent team deployments, but vulnerable to CSS leakage, network latency, and orchestration failures.',
    keyRisk: 'Runtime script evaluation latency and version mismatch instability in production.',
    color: '#ef4444',
    pros: ['Fully decentralized team deployments without monorepo synchronization'],
    cons: [
      'High network overhead and cumulative layout shifts on initial load',
      'Complex local development sandbox and shared singleton debugging',
      'Runtime failures when remote hosts experience temporary downtime',
    ],
    scores: {
      impact: 3.0,
      confidence: 2.5,
      effort: 1.8,
      dx: 2.6,
      maintenance: 1.6,
    },
    rice: {
      reach: 58,
      impact: 3.0,
      confidence: 55,
      effort: 4.6,
    },
  },
]

export function DecisionMatrixTable({
  className,
  title = 'Architectural Decision Matrix (RICE / Weighted Scoring)',
  subtitle = 'Evaluate technical options against weighted business and engineering criteria.',
  defaultFramework = 'weighted-matrix',
  ...props
}: DecisionMatrixTableProps) {
  const [activeFramework, setActiveFramework] = React.useState<FrameworkType>(defaultFramework)
  const [showWeightEditor, setShowWeightEditor] = React.useState(false)
  const [showAddOptionForm, setShowAddOptionForm] = React.useState(false)
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>('opt-a')

  const [criterionWeights, setCriterionWeights] = React.useState<Record<string, number>>({
    impact: 25,
    confidence: 25,
    effort: 15,
    dx: 20,
    maintenance: 15,
  })

  const [options, setOptions] = React.useState<MatrixOption[]>(initialOptions)

  // Add custom option inputs
  const [newOptionName, setNewOptionName] = React.useState('')
  const [newOptionParadigm, setNewOptionParadigm] = React.useState('')
  const [newOptionSummary, setNewOptionSummary] = React.useState('')
  const [newOptionScores, setNewOptionScores] = React.useState({
    impact: 4.0,
    confidence: 4.0,
    effort: 3.5,
    dx: 4.0,
    maintenance: 3.5,
  })

  const totalWeight = React.useMemo(() => {
    return Object.values(criterionWeights).reduce((sum, w) => sum + (Number(w) || 0), 0)
  }, [criterionWeights])

  const resetWeights = () => {
    const fresh: Record<string, number> = {}
    criteriaList.forEach((c) => {
      fresh[c.key] = c.defaultWeight
    })
    setCriterionWeights(fresh)
  }

  const resetOptions = () => {
    setOptions(initialOptions)
    setSelectedOptionId('opt-a')
  }

  const handleAddOption = () => {
    if (!newOptionName.trim()) return

    const newId = `opt-custom-${Date.now()}`
    const created: MatrixOption = {
      id: newId,
      name: newOptionName.trim(),
      architecture: newOptionParadigm.trim() || 'Custom Technical Architecture',
      summary: newOptionSummary.trim() || 'Custom evaluated technical approach for this architectural decision.',
      keyRisk: 'Requires comprehensive proof-of-concept testing in staging environments.',
      color: '#06b6d4',
      pros: ['Tailored to immediate domain constraints', 'Custom architectural design'],
      cons: ['Needs dedicated long-term ownership and testing framework'],
      scores: { ...newOptionScores },
      rice: {
        reach: 75,
        impact: newOptionScores.impact,
        confidence: Number((newOptionScores.confidence * 20).toFixed(0)),
        effort: Number((6 - newOptionScores.effort).toFixed(1)),
      },
      isCustom: true,
    }

    setOptions((prev) => [...prev, created])
    setSelectedOptionId(newId)
    setNewOptionName('')
    setNewOptionParadigm('')
    setNewOptionSummary('')
    setShowAddOptionForm(false)
  }

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id))
    if (selectedOptionId === id) {
      setSelectedOptionId(options[0]?.id || '')
    }
  }

  // Scored Options Calculation
  const scoredOptions = React.useMemo(() => {
    const sumW = totalWeight || 100

    const calculated = options.map((opt) => {
      const weightedSum =
        opt.scores.impact * (criterionWeights.impact ?? 25) +
        opt.scores.confidence * (criterionWeights.confidence ?? 25) +
        opt.scores.effort * (criterionWeights.effort ?? 15) +
        opt.scores.dx * (criterionWeights.dx ?? 20) +
        opt.scores.maintenance * (criterionWeights.maintenance ?? 15)

      const weightedScore = Number(((weightedSum / (5 * sumW)) * 100).toFixed(1))

      const reachFactor = opt.rice.reach
      const impactFactor = opt.rice.impact
      const confidenceFactor = opt.rice.confidence / 100
      const effortFactor = Math.max(0.5, opt.rice.effort)
      const riceScore = Number(((reachFactor * impactFactor * confidenceFactor) / effortFactor).toFixed(1))

      return {
        ...opt,
        weightedScore,
        riceScore,
        rank: 0,
        verdict: 'Discarded' as const,
        verdictVariant: 'destructive' as const,
      }
    })

    calculated.sort((a, b) => {
      if (activeFramework === 'rice') {
        return b.riceScore - a.riceScore
      }
      return b.weightedScore - a.weightedScore
    })

    return calculated.map((item, index) => {
      const rank = index + 1
      let verdict: 'Recommended Winner' | 'Second Choice' | 'Alternative' | 'Discarded' = 'Discarded'
      let verdictVariant: 'success' | 'info' | 'warning' | 'destructive' = 'destructive'

      if (rank === 1) {
        verdict = 'Recommended Winner'
        verdictVariant = 'success'
      } else if (rank === 2) {
        verdict = 'Second Choice'
        verdictVariant = 'info'
      } else if (rank === 3) {
        verdict = 'Alternative'
        verdictVariant = 'warning'
      } else {
        verdict = 'Discarded'
        verdictVariant = 'destructive'
      }

      return {
        ...item,
        rank,
        verdict,
        verdictVariant,
      }
    })
  }, [options, totalWeight, criterionWeights, activeFramework])

  const winningOption = scoredOptions[0]
  const activeSelectedOption = scoredOptions.find((opt) => opt.id === selectedOptionId) ?? winningOption

  // Radar chart SVG geometry
  const radarCenter = { x: 170, y: 155 }
  const radarRadius = 95
  const radarAxesCount = 5

  const getRadarPoint = (axisIndex: number, scoreValue: number, maxVal = 5) => {
    const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / radarAxesCount
    const ratio = Math.min(1, Math.max(0, scoreValue / maxVal))
    const r = radarRadius * ratio
    const x = radarCenter.x + r * Math.cos(angle)
    const y = radarCenter.y + r * Math.sin(angle)
    return { x, y }
  }

  const getRadarPolygon = (scores: {
    impact: number
    confidence: number
    effort: number
    dx: number
    maintenance: number
  }) => {
    const values = [scores.impact, scores.confidence, scores.effort, scores.dx, scores.maintenance]
    return values
      .map((val, idx) => {
        const pt = getRadarPoint(idx, val)
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
      })
      .join(' ')
  }

  const getRingPolygon = (ratio: number) => {
    return Array.from({ length: radarAxesCount })
      .map((_, idx) => {
        const pt = getRadarPoint(idx, ratio * 5)
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
      })
      .join(' ')
  }

  const radarAxisLabels = [
    { index: 0, label: 'Impact', x: 170, y: 38, anchor: 'middle' as const },
    { index: 1, label: 'Confidence', x: 285, y: 115, anchor: 'start' as const },
    { index: 2, label: 'Simplicity', x: 245, y: 258, anchor: 'middle' as const },
    { index: 3, label: 'DX & Own', x: 95, y: 258, anchor: 'middle' as const },
    { index: 4, label: 'Low Maint', x: 55, y: 115, anchor: 'end' as const },
  ]

  const getScoreBadgeVariant = (score: number): 'success' | 'default' | 'secondary' | 'outline' => {
    if (score >= 4.5) return 'success'
    if (score >= 3.5) return 'default'
    if (score >= 2.5) return 'secondary'
    return 'outline'
  }

  return (
    <div
      data-slot="decision-matrix-table"
      className={cn('bg-background text-foreground w-full space-y-6', className)}
      {...props}
    >
      {/* Header Card: Controls and Metadata */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs font-semibold tracking-wide uppercase">
                  <Scale className="text-primary size-3.5" />
                  ADR-042 Evaluation
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Updated Aug 2026
                </Badge>
              </div>
              <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</CardTitle>
              <CardDescription className="text-sm">{subtitle}</CardDescription>
            </div>

            {/* Framework Switcher & Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-muted border-border inline-flex items-center rounded-lg border p-1">
                <button
                  type="button"
                  className={cn(
                    'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                    activeFramework === 'weighted-matrix'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActiveFramework('weighted-matrix')}
                >
                  Weighted Value-Risk Matrix
                </button>
                <button
                  type="button"
                  className={cn(
                    'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                    activeFramework === 'rice'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActiveFramework('rice')}
                >
                  RICE Framework
                </button>
              </div>

              {activeFramework === 'weighted-matrix' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setShowWeightEditor((v) => !v)}
                >
                  <SlidersHorizontal className="text-muted-foreground size-3.5" />
                  <span>Criterion Weights</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-0.5 px-1.5 py-0 text-xs tabular-nums',
                      totalWeight === 100 ? 'text-foreground' : 'bg-warning/20 text-warning font-semibold',
                    )}
                  >
                    {totalWeight}%
                  </Badge>
                  {!showWeightEditor ? (
                    <ChevronDown className="text-muted-foreground size-3" />
                  ) : (
                    <ChevronUp className="text-muted-foreground size-3" />
                  )}
                </Button>
              )}

              <Button size="sm" className="gap-1.5 text-xs font-medium" onClick={() => setShowAddOptionForm((v) => !v)}>
                <Plus className="size-3.5" />
                <span>Add Option</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Expandable Criterion Weights Adjuster */}
        {showWeightEditor && activeFramework === 'weighted-matrix' && (
          <div className="border-border bg-muted/20 border-t px-6 py-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-foreground text-sm font-semibold tracking-tight">
                    Calibrate Evaluation Criteria Weights
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    Adjust criteria percentages to reflect your organization's architectural priorities.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
                      totalWeight === 100
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-warning/15 text-warning font-bold',
                    )}
                  >
                    {totalWeight === 100 ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                    Total Weight: {totalWeight}%
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-muted-foreground gap-1 text-xs"
                    onClick={resetWeights}
                  >
                    <RefreshCw className="size-3" />
                    Reset Defaults
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {criteriaList.map((criterion) => (
                  <div
                    key={criterion.key}
                    className="border-border bg-card space-y-2.5 rounded-lg border p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-foreground truncate text-xs font-semibold" title={criterion.label}>
                        {criterion.label}
                      </span>
                      <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-bold tabular-nums">
                        {criterionWeights[criterion.key] ?? criterion.defaultWeight}%
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 h-8 text-xs leading-tight">
                      {criterion.description}
                    </p>
                    <div className="pt-1">
                      <Slider
                        value={[criterionWeights[criterion.key] ?? criterion.defaultWeight]}
                        min={0}
                        max={50}
                        step={5}
                        size="small"
                        onValueChange={(vals) =>
                          setCriterionWeights((prev) => ({
                            ...prev,
                            [criterion.key]: vals[0] ?? 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expandable Add Custom Proposal Form */}
        {showAddOptionForm && (
          <div className="border-border bg-muted/30 border-t px-6 py-5">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between gap-x-2">
                <h4 className="text-foreground flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                  <Sparkles className="text-primary size-4" />
                  Add Technical Architecture Option to Matrix
                </h4>
                <Button variant="ghost" size="xs" onClick={() => setShowAddOptionForm(false)}>
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-foreground text-xs font-medium">Option Proposal Name</label>
                  <Input
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="e.g. Option E: Shared UI Submodule"
                    size="small"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-foreground text-xs font-medium">Architectural architecture</label>
                  <Input
                    value={newOptionParadigm}
                    onChange={(e) => setNewOptionParadigm(e.target.value)}
                    placeholder="e.g. Git Submodule & Monorepo Link"
                    size="small"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-foreground text-xs font-medium">Executive Architectural Summary</label>
                <Input
                  value={newOptionSummary}
                  onChange={(e) => setNewOptionSummary(e.target.value)}
                  placeholder="Brief summary of distribution mechanics, bundle characteristics, and DX impact..."
                  size="small"
                />
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-xs font-medium">Initial Scores (1.0 to 5.0)</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {criteriaList.map((criterion) => (
                    <div key={criterion.key} className="border-border bg-card rounded-md border p-2 text-center">
                      <div className="text-muted-foreground truncate text-xs font-medium">{criterion.shortLabel}</div>
                      <div className="text-foreground mt-0.5 text-sm font-bold tabular-nums">
                        {newOptionScores[criterion.key]} / 5
                      </div>
                      <div className="pt-1.5">
                        <Slider
                          value={[newOptionScores[criterion.key]]}
                          min={1}
                          max={5}
                          step={0.5}
                          size="small"
                          onValueChange={(vals) =>
                            setNewOptionScores((prev) => ({
                              ...prev,
                              [criterion.key]: vals[0] ?? 3,
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddOptionForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" disabled={!newOptionName.trim()} onClick={handleAddOption}>
                  Add to Matrix
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Main Scoring Matrix Table */}
      <Card className="border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground w-[42px] px-3 text-center text-xs font-semibold">
                  Rank
                </TableHead>
                <TableHead className="text-foreground min-w-[240px] text-xs font-semibold">
                  Technical Option & architecture
                </TableHead>

                {activeFramework === 'weighted-matrix' ? (
                  <>
                    {criteriaList.map((criterion) => (
                      <TableHead
                        key={criterion.key}
                        className="text-foreground min-w-[130px] text-center text-xs font-semibold"
                      >
                        <div className="flex flex-col items-center">
                          <span>{criterion.shortLabel}</span>
                          <span className="text-muted-foreground text-xs font-normal tabular-nums">
                            {criterionWeights[criterion.key] ?? criterion.defaultWeight}% wt
                          </span>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-foreground min-w-[140px] text-center text-xs font-semibold">
                      Weighted Score
                    </TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="text-foreground min-w-[110px] text-center text-xs font-semibold">
                      <div className="flex flex-col items-center">
                        <span>Reach</span>
                        <span className="text-muted-foreground text-xs font-normal">Dev Scale %</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-foreground min-w-[110px] text-center text-xs font-semibold">
                      <div className="flex flex-col items-center">
                        <span>Impact</span>
                        <span className="text-muted-foreground text-xs font-normal">Multiplier (1-5)</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-foreground min-w-[110px] text-center text-xs font-semibold">
                      <div className="flex flex-col items-center">
                        <span>Confidence</span>
                        <span className="text-muted-foreground text-xs font-normal">% Certainty</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-foreground min-w-[110px] text-center text-xs font-semibold">
                      <div className="flex flex-col items-center">
                        <span>Effort</span>
                        <span className="text-muted-foreground text-xs font-normal">Sprints (1-5)</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-foreground min-w-[130px] text-center text-xs font-semibold">
                      RICE Score
                    </TableHead>
                  </>
                )}

                <TableHead className="text-foreground min-w-[160px] text-center text-xs font-semibold">
                  ADR Verdict
                </TableHead>
                <TableHead className="text-muted-foreground w-[80px] text-center text-xs font-semibold">
                  Inspect
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {scoredOptions.map((opt) => (
                <TableRow
                  key={opt.id}
                  className={cn(
                    'cursor-pointer transition-colors duration-150',
                    opt.id === selectedOptionId ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-muted/40',
                    opt.rank === 1 && 'font-medium',
                  )}
                  onClick={() => setSelectedOptionId(opt.id)}
                >
                  {/* Rank Column */}
                  <TableCell className="px-3 text-center">
                    <span
                      className={cn(
                        'inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                        opt.rank === 1
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : opt.rank === 2
                            ? 'bg-sky-500/15 font-semibold text-sky-600 dark:text-sky-400'
                            : 'bg-muted text-muted-foreground font-normal',
                      )}
                    >
                      {opt.rank}
                    </span>
                  </TableCell>

                  {/* Proposal Name & Summary */}
                  <TableCell>
                    <div className="space-y-1 py-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-foreground text-sm font-semibold tracking-tight">{opt.name}</span>
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: opt.color }}
                          title={opt.name}
                        />
                        {opt.isCustom && (
                          <Badge variant="outline" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs font-medium">{opt.architecture}</div>
                      <p className="text-muted-foreground/80 line-clamp-1 max-w-[220px] text-xs">{opt.summary}</p>
                    </div>
                  </TableCell>

                  {/* Matrix Criteria Columns */}
                  {activeFramework === 'weighted-matrix' ? (
                    <>
                      {criteriaList.map((criterion) => (
                        <TableCell key={criterion.key} className="text-center">
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <Badge
                              variant={getScoreBadgeVariant(opt.scores[criterion.key])}
                              className="px-2 py-0.5 text-xs font-semibold tabular-nums"
                            >
                              {opt.scores[criterion.key].toFixed(1)}
                            </Badge>
                            <div className="mt-1 flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((seg) => (
                                <span
                                  key={seg}
                                  className={cn(
                                    'size-1 rounded-full',
                                    seg <= Math.round(opt.scores[criterion.key])
                                      ? 'bg-primary'
                                      : 'bg-muted-foreground/20',
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      ))}

                      {/* Weighted Score */}
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span
                            className={cn(
                              'text-base font-semibold tracking-tight tabular-nums',
                              opt.rank === 1
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : opt.weightedScore >= 70
                                  ? 'text-foreground'
                                  : 'text-muted-foreground',
                            )}
                          >
                            {opt.weightedScore}
                            <span className="text-muted-foreground text-xs font-normal">/ 100</span>
                          </span>
                          <div className="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-300',
                                opt.rank === 1
                                  ? 'bg-emerald-500'
                                  : opt.weightedScore >= 70
                                    ? 'bg-sky-500'
                                    : opt.weightedScore >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-destructive',
                              )}
                              style={{ width: `${opt.weightedScore}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-center text-xs font-semibold tabular-nums">
                        {opt.rice.reach}%
                      </TableCell>
                      <TableCell className="text-center text-xs font-semibold tabular-nums">
                        {opt.rice.impact.toFixed(1)}x
                      </TableCell>
                      <TableCell className="text-center text-xs font-semibold tabular-nums">
                        {opt.rice.confidence}%
                      </TableCell>
                      <TableCell className="text-center text-xs font-semibold tabular-nums">
                        {opt.rice.effort.toFixed(1)} sprints
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-primary text-base font-semibold tabular-nums">{opt.riceScore}</span>
                          <span className="text-muted-foreground text-xs font-medium">RICE Pts</span>
                        </div>
                      </TableCell>
                    </>
                  )}

                  {/* Verdict Column */}
                  <TableCell className="text-center">
                    {opt.rank === 1 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Award className="size-3.5" />
                        Recommended Winner
                      </span>
                    ) : opt.rank === 2 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                        <CheckCircle2 className="size-3.5" />
                        Second Choice
                      </span>
                    ) : opt.rank === 3 ? (
                      <span className="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
                        <HelpCircle className="size-3.5" />
                        Alternative
                      </span>
                    ) : (
                      <span className="border-destructive/20 bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
                        <XCircle className="size-3.5" />
                        Discarded
                      </span>
                    )}
                  </TableCell>

                  {/* Action / Inspect */}
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    {opt.isCustom ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        title="Remove Custom Option"
                        onClick={() => removeOption(opt.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        title={`Inspect ${opt.name}`}
                        onClick={() => setSelectedOptionId(opt.id)}
                      >
                        <Info className="size-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <CardFooter className="border-border bg-muted/20 text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t px-6 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            <span>Scores normalize dynamically to a 0–100 scale based on active criteria weights.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="xs" className="text-muted-foreground gap-1 text-xs" onClick={resetOptions}>
              <RefreshCw className="size-3" />
              Reset Matrix Options
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Tradeoff Visualizer & ADR Recommendation Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Radar Chart: Multi-Option Criteria Comparison */}
        <Card className="border-border bg-card flex flex-col shadow-xs lg:col-span-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-x-2">
              <div className="space-y-0.5">
                <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <BarChart3 className="text-primary size-4" />
                  Decision Tradeoff Radar
                </CardTitle>
                <CardDescription className="text-xs">
                  Multi-dimensional polygon overlay comparing architectural options.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                5 Axes (1-5)
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col items-center justify-center p-4">
            {/* SVG Radar Canvas */}
            <div className="relative flex aspect-square w-full max-w-[340px] items-center justify-center">
              <svg viewBox="0 0 340 310" className="h-full w-full overflow-visible">
                {/* Background Concentric Grid Rings */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((ring) => (
                  <polygon
                    key={ring}
                    points={getRingPolygon(ring)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border/50"
                    strokeDasharray={ring === 1.0 ? 'none' : '2,2'}
                  />
                ))}

                {/* Radial Axes Lines */}
                {Array.from({ length: radarAxesCount }).map((_, idx) => (
                  <line
                    key={idx}
                    x1={radarCenter.x}
                    y1={radarCenter.y}
                    x2={getRadarPoint(idx, 5).x}
                    y2={getRadarPoint(idx, 5).y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border"
                  />
                ))}

                {/* Polygons for non-selected options */}
                {scoredOptions.map(
                  (opt) =>
                    opt.id !== activeSelectedOption.id && (
                      <polygon
                        key={opt.id}
                        points={getRadarPolygon(opt.scores)}
                        fill={opt.color}
                        fillOpacity="0.08"
                        stroke={opt.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.45"
                        className="cursor-pointer transition-all duration-300"
                        onClick={() => setSelectedOptionId(opt.id)}
                      />
                    ),
                )}

                {/* Polygon for Selected Option */}
                <polygon
                  points={getRadarPolygon(activeSelectedOption.scores)}
                  fill={activeSelectedOption.color}
                  fillOpacity="0.25"
                  stroke={activeSelectedOption.color}
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Vertex Dots for Selected Option */}
                {[
                  activeSelectedOption.scores.impact,
                  activeSelectedOption.scores.confidence,
                  activeSelectedOption.scores.effort,
                  activeSelectedOption.scores.dx,
                  activeSelectedOption.scores.maintenance,
                ].map((val, idx) => (
                  <circle
                    key={idx}
                    cx={getRadarPoint(idx, val).x}
                    cy={getRadarPoint(idx, val).y}
                    r="4"
                    fill={activeSelectedOption.color}
                    className="stroke-background stroke-2 transition-all duration-300"
                  />
                ))}

                {/* Axis Labels */}
                {radarAxisLabels.map((axis) => (
                  <text
                    key={axis.index}
                    x={axis.x}
                    y={axis.y}
                    textAnchor={axis.anchor}
                    className="fill-foreground text-xs font-semibold select-none"
                    style={{ fontSize: 11 }}
                  >
                    {axis.label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Radar Chart Legend */}
            <div className="border-border flex w-full flex-wrap items-center justify-center gap-3 border-t pt-3">
              {scoredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-all',
                    opt.id === activeSelectedOption.id
                      ? 'bg-muted text-foreground ring-border font-semibold ring-1'
                      : 'text-muted-foreground hover:text-foreground opacity-80',
                  )}
                  onClick={() => setSelectedOptionId(opt.id)}
                >
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: opt.color }} />
                  <span className="max-w-[120px] truncate">{opt.name.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Architectural Consensus & Tradeoff Detail Card */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-xs lg:col-span-6">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Selected Option Details
                  </Badge>
                  <Badge
                    variant={activeSelectedOption.verdictVariant === 'success' ? 'success' : 'secondary'}
                    className="text-xs font-semibold"
                  >
                    {activeSelectedOption.verdict}
                  </Badge>
                </div>
                <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
                  {activeSelectedOption.name}
                </CardTitle>
                <CardDescription className="text-primary text-xs font-medium">
                  {activeSelectedOption.architecture}
                </CardDescription>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-foreground text-2xl font-semibold tabular-nums">
                  {activeFramework === 'rice' ? activeSelectedOption.riceScore : activeSelectedOption.weightedScore}
                </div>
                <div className="text-muted-foreground text-xs">
                  {activeFramework === 'rice' ? 'RICE Score' : 'Weighted Total'}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            {/* Summary paragraph */}
            <p className="text-muted-foreground text-sm leading-relaxed">{activeSelectedOption.summary}</p>

            <Separator />

            {/* Pros & Cons Grid */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {/* Advantages */}
              <div className="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3.5" />
                  Strategic Advantages
                </span>
                <ul className="text-muted-foreground space-y-1.5">
                  {activeSelectedOption.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="mt-0.5 text-emerald-500">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Friction & Tradeoffs */}
              <div className="border-destructive/20 bg-destructive/5 space-y-2 rounded-lg border p-3">
                <span className="text-destructive flex items-center gap-1.5 text-xs font-semibold">
                  <AlertCircle className="size-3.5" />
                  Compromises & Friction
                </span>
                <ul className="text-muted-foreground space-y-1.5">
                  {activeSelectedOption.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-destructive mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Risk Mitigation */}
            <div className="border-border bg-muted/40 space-y-1 rounded-md border p-3">
              <span className="text-foreground flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="text-primary size-3.5" />
                Risk Mitigation & Governance Policy:
              </span>
              <p className="text-muted-foreground">{activeSelectedOption.keyRisk}</p>
            </div>
          </CardContent>

          <CardFooter className="border-border bg-muted/20 flex items-center justify-between gap-x-2 border-t px-6 py-3">
            <div className="flex items-center gap-2">
              <FileCode2 className="text-muted-foreground size-4" />
              <span className="text-muted-foreground text-xs font-medium">ADR Record Consensus: </span>
              <span className="text-foreground text-xs font-semibold">
                {winningOption.name.split(':')[1] || winningOption.name}
              </span>
            </div>
            <Badge variant="outline" className="gap-1 text-xs">
              <Award className="size-3 text-emerald-500" />
              Rank #{activeSelectedOption.rank}
            </Badge>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
