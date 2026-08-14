import * as React from 'react'
import {
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Coins,
  DollarSign,
  Download,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface CompensationBandBenchmarkingProps extends React.HTMLAttributes<HTMLDivElement> {
  initialRole?: string
}

interface LevelData {
  id: string
  code: string
  title: string
  roleTitle: string
  experience: string
  scope: string
  headcount: number
  p25Base: number
  p50Base: number
  p75Base: number
  p90Base: number
  equityMin: number
  equityMax: number
  equityP50: number
  totalMin: number
  totalMax: number
  totalP50: number
  compaRatio: number
  marketP50Base: number
  marketP50Equity: number
  marketP50Total: number
  equityPercent: number
  badgeVariant: 'default' | 'secondary' | 'outline' | 'info'
}

const levels: LevelData[] = [
  {
    id: 'ic3',
    code: 'IC3',
    title: 'Software Engineer',
    roleTitle: 'Software Engineer (IC3)',
    experience: '1–3 yrs experience',
    scope: 'Feature delivery, component unit tests, and production code execution.',
    headcount: 28,
    p25Base: 135000,
    p50Base: 150000,
    p75Base: 168000,
    p90Base: 185000,
    equityMin: 35000,
    equityMax: 60000,
    equityP50: 45000,
    totalMin: 170000,
    totalMax: 245000,
    totalP50: 195000,
    compaRatio: 101.2,
    marketP50Base: 148000,
    marketP50Equity: 44000,
    marketP50Total: 192000,
    equityPercent: 23.1,
    badgeVariant: 'outline',
  },
  {
    id: 'ic4',
    code: 'IC4',
    title: 'Senior Engineer',
    roleTitle: 'Senior Software Engineer (IC4)',
    experience: '3–6 yrs experience',
    scope: 'Autonomous service ownership, technical RFC design, and mentoring.',
    headcount: 42,
    p25Base: 170000,
    p50Base: 190000,
    p75Base: 210000,
    p90Base: 230000,
    equityMin: 70000,
    equityMax: 110000,
    equityP50: 90000,
    totalMin: 240000,
    totalMax: 340000,
    totalP50: 280000,
    compaRatio: 101.8,
    marketP50Base: 187000,
    marketP50Equity: 88000,
    marketP50Total: 275000,
    equityPercent: 32.1,
    badgeVariant: 'secondary',
  },
  {
    id: 'ic5',
    code: 'IC5',
    title: 'Staff Engineer',
    roleTitle: 'Staff Software Engineer (IC5)',
    experience: '6–10 yrs experience',
    scope: 'Cross-team architecture, platform reliability, and engineering standards.',
    headcount: 18,
    p25Base: 205000,
    p50Base: 225000,
    p75Base: 250000,
    p90Base: 275000,
    equityMin: 120000,
    equityMax: 180000,
    equityP50: 140000,
    totalMin: 325000,
    totalMax: 455000,
    totalP50: 365000,
    compaRatio: 102.4,
    marketP50Base: 220000,
    marketP50Equity: 136000,
    marketP50Total: 356000,
    equityPercent: 38.4,
    badgeVariant: 'default',
  },
  {
    id: 'ic6',
    code: 'IC6',
    title: 'Senior Staff Engineer',
    roleTitle: 'Senior Staff Software Engineer (IC6)',
    experience: '10–14 yrs experience',
    scope: 'Org-wide strategic tech vision, high-scale resilience, and executive partnership.',
    headcount: 9,
    p25Base: 240000,
    p50Base: 265000,
    p75Base: 295000,
    p90Base: 330000,
    equityMin: 180000,
    equityMax: 280000,
    equityP50: 225000,
    totalMin: 420000,
    totalMax: 610000,
    totalP50: 490000,
    compaRatio: 103.1,
    marketP50Base: 258000,
    marketP50Equity: 218000,
    marketP50Total: 476000,
    equityPercent: 45.9,
    badgeVariant: 'info',
  },
  {
    id: 'ic7',
    code: 'IC7',
    title: 'Principal Engineer',
    roleTitle: 'Principal Software Engineer (IC7)',
    experience: '14+ yrs experience',
    scope: 'Company-level technology roadmap, deep R&D, and industry IP leadership.',
    headcount: 4,
    p25Base: 280000,
    p50Base: 315000,
    p75Base: 355000,
    p90Base: 400000,
    equityMin: 280000,
    equityMax: 450000,
    equityP50: 360000,
    totalMin: 560000,
    totalMax: 850000,
    totalP50: 675000,
    compaRatio: 104.0,
    marketP50Base: 305000,
    marketP50Equity: 345000,
    marketP50Total: 650000,
    equityPercent: 53.3,
    badgeVariant: 'default',
  },
]

// Scale configuration for multi-bar percentiles ($100k to $420k)
const SCALE_MIN = 100000
const SCALE_MAX = 420000
const SCALE_RANGE = SCALE_MAX - SCALE_MIN

function getPercent(val: number): number {
  return Math.max(0, Math.min(100, ((val - SCALE_MIN) / SCALE_RANGE) * 100))
}

function fmtCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val)
}

function fmtK(val: number): string {
  return `$${Math.round(val / 1000)}k`
}

function exportCsv() {
  const headers = [
    'Level Code',
    'Level Title',
    'Experience Scope',
    'Headcount',
    'P25 Base Salary',
    'P50 Base Salary (Median)',
    'P75 Base Salary',
    'P90 Base Salary',
    'Equity Range Min',
    'Equity Range Max',
    'Median Annual Equity',
    'Total Comp Min',
    'Total Comp Max',
    'Target Total Comp (P50)',
    'Compa-Ratio (%)',
  ]

  const rows = levels.map((l) => [
    l.code,
    `"${l.title}"`,
    `"${l.experience}"`,
    l.headcount,
    l.p25Base,
    l.p50Base,
    l.p75Base,
    l.p90Base,
    l.equityMin,
    l.equityMax,
    l.equityP50,
    l.totalMin,
    l.totalMax,
    l.totalP50,
    l.compaRatio,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'engineering-compensation-bands-q3-2026.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function CompensationBandBenchmarking({
  className,
  initialRole = 'ic5',
  ...props
}: CompensationBandBenchmarkingProps) {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(initialRole)

  const activeLevel = React.useMemo(() => {
    return levels.find((l) => l.id === selectedRoleId) || levels[2]
  }, [selectedRoleId])

  return (
    <div data-slot="compensation-band-benchmarking" className={cn('w-full space-y-6', className)} {...props}>
      {/* Main Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Title, Source Badge & Subtitle */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Engineering Compensation Bands & Market Benchmarks
                </h2>
                <Badge wrap variant="success" className="gap-1 font-semibold shadow-xs">
                  <BadgeCheck className="size-3.5 text-emerald-500" />
                  <span>Q3 2026 Live Bands</span>
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Pave Market Data · SF Bay Area Tier 1 · Q3 2026 (Refreshed Aug 2026 · Sample n = 42,400 Tech ICs)
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Badge wrap variant="outline" className="gap-1.5 text-xs font-normal">
                  <Building2 className="text-primary size-3.5" />
                  <span>Benchmark Market: San Francisco Bay Area (Tier 1)</span>
                </Badge>
                <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
                <span className="text-muted-foreground text-xs">
                  Currency: <strong className="text-foreground font-medium">USD ($) · Annualized</strong>
                </span>
                <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
                <span className="text-muted-foreground text-xs">
                  Total Engineers Tracked:{' '}
                  <strong className="text-foreground font-medium tabular-nums">101 Headcount</strong>
                </span>
              </div>
            </div>

            {/* Controls: Role Selector & Export CSV Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-64">
                <label htmlFor="role-select" className="text-muted-foreground mb-1 block text-xs font-medium">
                  Focus Benchmark Level:
                </label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger id="role-select" className="bg-background h-9 w-full text-xs font-medium">
                    <SelectValue placeholder="Select engineering role" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((lvl) => (
                      <SelectItem key={lvl.id} value={lvl.id} className="text-xs">
                        {lvl.roleTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:self-end">
                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  className="h-9 w-full gap-2 shadow-xs sm:w-auto"
                  onClick={exportCsv}
                >
                  <Download className="size-4" />
                  <span>Export Bands CSV</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Compensation Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Median Base Salary */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <DollarSign className="text-primary size-4" />
                </div>
                <CardTitle className="text-muted-foreground truncate text-xs font-medium">Median Base Salary</CardTitle>
              </div>
              <Badge wrap variant="outline" className="shrink-0 text-xs font-medium tabular-nums">
                {activeLevel.code} · P50 Market
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    {fmtCurrency(activeLevel.p50Base)}
                  </span>
                  <span className="text-muted-foreground text-xs font-normal">/ yr</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3" />
                  <span className="tabular-nums">+2.3% Pave P50</span>
                </div>
              </div>
              <Progress value={getPercent(activeLevel.p50Base)} className="h-1.5 w-full" />
            </div>

            <div className="border-border/60 border-t pt-2.5 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Band Range (P25–P90):</span>
                <span className="text-foreground font-semibold tabular-nums">
                  {fmtK(activeLevel.p25Base)} – {fmtK(activeLevel.p90Base)}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                Market baseline for {activeLevel.title} with {activeLevel.experience}.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Median Annual Equity / RSU */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Coins className="size-4 text-sky-500" />
                </div>
                <CardTitle className="text-muted-foreground truncate text-xs font-medium">
                  Median Annual Equity / RSU
                </CardTitle>
              </div>
              <Badge wrap variant="secondary" className="shrink-0 text-xs font-medium tabular-nums">
                {activeLevel.equityPercent}% Total Comp
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    {fmtCurrency(activeLevel.equityP50)}
                  </span>
                  <span className="text-muted-foreground text-xs font-normal">/ yr</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                  <span className="tabular-nums">4-Yr Vesting</span>
                </div>
              </div>
              <Progress
                value={activeLevel.equityPercent}
                className="h-1.5 w-full [&_[data-slot=progress-indicator]]:bg-sky-500"
              />
            </div>

            <div className="border-border/60 border-t pt-2.5 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Annual Grant Band:</span>
                <span className="text-foreground font-semibold tabular-nums">
                  {fmtK(activeLevel.equityMin)} – {fmtK(activeLevel.equityMax)} / yr
                </span>
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                Liquid RSU allocation (4-year vest, 1-year standard cliff).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Target Total Compensation */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Sparkles className="size-4 text-indigo-500" />
                </div>
                <CardTitle className="text-muted-foreground truncate text-xs font-medium">
                  Target Total Compensation
                </CardTitle>
              </div>
              <Badge wrap variant="outline" className="shrink-0 text-xs font-medium">
                Base + Equity
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    {fmtCurrency(activeLevel.totalP50)}
                  </span>
                  <span className="text-muted-foreground text-xs font-normal">/ yr</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3" />
                  <span className="tabular-nums">+2.5% vs Mkt</span>
                </div>
              </div>
              <Progress
                value={getPercent(activeLevel.totalP50)}
                className="h-1.5 w-full [&_[data-slot=progress-indicator]]:bg-indigo-500"
              />
            </div>

            <div className="border-border/60 border-t pt-2.5 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Target Total Comp Range:</span>
                <span className="text-foreground font-semibold tabular-nums">
                  {fmtK(activeLevel.totalMin)} – {fmtK(activeLevel.totalMax)}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                Annualized total compensation at P50 target execution.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Internal Compa-Ratio */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Scale className="size-4 text-emerald-500" />
                </div>
                <CardTitle className="text-muted-foreground truncate text-xs font-medium">
                  Internal Compa-Ratio
                </CardTitle>
              </div>
              <Badge wrap variant="success" className="shrink-0 text-xs font-semibold">
                Market Competitive
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    {activeLevel.compaRatio}%
                  </span>
                  <span className="text-muted-foreground text-xs font-normal">Compa</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>Target Corridor</span>
                </div>
              </div>
              <Progress
                value={activeLevel.compaRatio - 50}
                className="h-1.5 w-full [&_[data-slot=progress-indicator]]:bg-emerald-500"
              />
            </div>

            <div className="border-border/60 border-t pt-2.5 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Target Standard:</span>
                <span className="text-foreground font-semibold tabular-nums">95.0% – 105.0%</span>
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                Pay positioning calibrated strictly inside safe competitive envelope.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progression Compensation Matrix (Multi-bar percentile chart / table) */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="text-primary size-5" />
                <CardTitle className="text-base font-semibold">Level Progression Compensation Matrix</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Multi-bar percentile bands (P25 → P50 → P75 → P90) and equity allocations across 5 engineering career
                levels.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge wrap variant="outline" className="text-xs font-normal tabular-nums">
                Scale: $100k → $420k Base
              </Badge>
              <Badge wrap variant="secondary" className="text-xs font-medium tabular-nums">
                5 Levels · 101 Engineers
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scale Ruler Legend for Base Salary Multi-bar */}
          <div className="bg-muted/40 border-border/80 hidden rounded-lg border p-3 md:block">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">Base Salary Percentile Scale Guide:</span>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="border-primary/40 bg-primary/20 size-2.5 rounded-sm border" />
                  <span className="text-muted-foreground">P25–P90 Band Corridor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500 ring-1 ring-emerald-500/50" />
                  <span className="text-foreground font-semibold">P50 Median Market Point</span>
                </div>
              </div>
            </div>
            <div className="border-border/60 relative mt-2.5 h-4 border-t pt-1">
              <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
                <span>$100k</span>
                <span>$150k</span>
                <span>$200k</span>
                <span>$250k</span>
                <span>$300k</span>
                <span>$350k</span>
                <span>$400k+</span>
              </div>
            </div>
          </div>

          {/* Table Container with Multi-Bar Visualizers */}
          <div className="border-border overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-48 text-xs font-medium">Level & Role Scope</TableHead>
                    <TableHead className="min-w-[280px] text-xs font-medium">
                      Base Salary Band (P25 → P50 → P75 → P90)
                    </TableHead>
                    <TableHead className="w-40 text-xs font-medium">Annual RSU Grant</TableHead>
                    <TableHead className="w-44 text-xs font-medium">Target Total Comp (TTC)</TableHead>
                    <TableHead className="w-36 text-right text-xs font-medium">Headcount & Compa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((lvl) => (
                    <TableRow
                      key={lvl.id}
                      className={cn(
                        'cursor-pointer transition-colors',
                        selectedRoleId === lvl.id && 'bg-primary/5 dark:bg-primary/10 font-medium',
                      )}
                      onClick={() => setSelectedRoleId(lvl.id)}
                    >
                      {/* Level Code & Title */}
                      <TableCell className="py-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge wrap variant={lvl.badgeVariant} className="font-bold tabular-nums">
                              {lvl.code}
                            </Badge>
                            <span className="text-foreground text-sm font-semibold">{lvl.title}</span>
                          </div>
                          <p className="text-muted-foreground text-xs">{lvl.experience}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{lvl.scope}</p>
                        </div>
                      </TableCell>

                      {/* Base Salary Band Multi-Bar Percentile Visualizer */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-2 py-1">
                          {/* Visual Band Track */}
                          <div className="bg-muted border-border/80 relative h-4 w-full overflow-hidden rounded-full border">
                            {/* P25 to P90 Range Shading */}
                            <div
                              className="bg-primary/25 border-primary/40 absolute inset-y-0 rounded-full border"
                              style={{
                                left: `${getPercent(lvl.p25Base)}%`,
                                width: `${getPercent(lvl.p90Base) - getPercent(lvl.p25Base)}%`,
                              }}
                            />

                            {/* P50 to P75 Interquartile Core */}
                            <div
                              className="bg-primary/30 absolute inset-y-0"
                              style={{
                                left: `${getPercent(lvl.p50Base)}%`,
                                width: `${getPercent(lvl.p75Base) - getPercent(lvl.p50Base)}%`,
                              }}
                            />

                            {/* P25 Marker Line */}
                            <div
                              className="bg-foreground/40 absolute top-0 bottom-0 w-0.5"
                              style={{ left: `${getPercent(lvl.p25Base)}%` }}
                              title="P25 Percentile"
                            />

                            {/* P50 Median Marker Dot */}
                            <div
                              className="border-background absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-emerald-500 shadow-xs ring-2 ring-emerald-500/40"
                              style={{ left: `${getPercent(lvl.p50Base)}%` }}
                              title="P50 Median"
                            />

                            {/* P75 Marker Line */}
                            <div
                              className="bg-foreground/40 absolute top-0 bottom-0 w-0.5"
                              style={{ left: `${getPercent(lvl.p75Base)}%` }}
                              title="P75 Percentile"
                            />

                            {/* P90 Marker Line */}
                            <div
                              className="bg-foreground/40 absolute top-0 bottom-0 w-0.5"
                              style={{ left: `${getPercent(lvl.p90Base)}%` }}
                              title="P90 Percentile"
                            />
                          </div>

                          {/* Percentile Numeric Labels */}
                          <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
                            <span>
                              P25: <strong className="text-foreground">{fmtK(lvl.p25Base)}</strong>
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              P50: {fmtK(lvl.p50Base)}
                            </span>
                            <span>
                              P75: <strong className="text-foreground">{fmtK(lvl.p75Base)}</strong>
                            </span>
                            <span>
                              P90: <strong className="text-foreground">{fmtK(lvl.p90Base)}</strong>
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Annual Equity (RSU) */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-0.5">
                          <p className="text-foreground text-sm font-semibold tabular-nums">
                            {fmtK(lvl.equityMin)} – {fmtK(lvl.equityMax)}
                          </p>
                          <p className="text-muted-foreground text-xs tabular-nums">
                            P50: {fmtCurrency(lvl.equityP50)} / yr
                          </p>
                        </div>
                      </TableCell>

                      {/* Target Total Comp (TTC) */}
                      <TableCell className="py-4 align-middle">
                        <div className="space-y-0.5">
                          <p className="text-foreground text-sm font-semibold tabular-nums">
                            {fmtK(lvl.totalMin)} – {fmtK(lvl.totalMax)}
                          </p>
                          <p className="text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                            Target P50: {fmtCurrency(lvl.totalP50)}
                          </p>
                        </div>
                      </TableCell>

                      {/* Headcount & Compa-Ratio */}
                      <TableCell className="py-4 text-right align-middle">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Users className="text-muted-foreground size-3.5" />
                            <span className="text-foreground font-medium tabular-nums">{lvl.headcount} engineers</span>
                          </div>
                          <Badge wrap variant="success" className="text-xs font-semibold tabular-nums">
                            {lvl.compaRatio}% Compa
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Equity & Fair Pay Audit Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-500" />
                <CardTitle className="text-base font-semibold">Pay Equity & Fair Pay Audit Certification</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Independent statistical regression analysis evaluating compensation equity across gender, demographics,
                and level cohorts.
              </CardDescription>
            </div>
            <Badge wrap variant="success" className="gap-1.5 px-3 py-1 text-xs font-semibold shadow-xs">
              <Award className="size-3.5 text-emerald-500" />
              <span>99.8% Parity Ratio · Certified Fair Pay</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 4 Audit Sub-Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-muted/40 border-border/80 space-y-1 rounded-lg border p-3.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Gender Pay Parity</span>
                <Badge wrap variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  100% Target
                </Badge>
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">99.8%</p>
              <p className="text-muted-foreground text-xs">
                Female-to-male comp ratio for equal job level and role scope.
              </p>
            </div>

            <div className="bg-muted/40 border-border/80 space-y-1 rounded-lg border p-3.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Demographic & URG Parity</span>
                <Badge wrap variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Parity Achieved
                </Badge>
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">100.1%</p>
              <p className="text-muted-foreground text-xs">
                Statistical comp ratio for underrepresented group cohorts.
              </p>
            </div>

            <div className="bg-muted/40 border-border/80 space-y-1 rounded-lg border p-3.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">In-Band Compliance</span>
                <Badge wrap variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  High Precision
                </Badge>
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">97.2%</p>
              <p className="text-muted-foreground text-xs">
                Employees placed strictly between approved P25 and P90 boundaries.
              </p>
            </div>

            <div className="bg-muted/40 border-border/80 space-y-1 rounded-lg border p-3.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Compression Gini Index</span>
                <Badge wrap variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Low Risk
                </Badge>
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">0.11</p>
              <p className="text-muted-foreground text-xs">
                Healthy inter-level step progression with zero pay overlap anomalies.
              </p>
            </div>
          </div>

          {/* Parity Safe-Harbor Distribution Meter */}
          <div className="bg-muted/30 border-border space-y-3 rounded-lg border p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-foreground text-xs font-semibold">
                Equal Pay Compliance Corridor (95.0% – 105.0%)
              </span>
              <span className="text-muted-foreground text-xs">
                Audit Status:{' '}
                <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Certified Safe Harbor (0.2% Variance)
                </strong>
              </span>
            </div>

            {/* Visual Corridor Meter */}
            <div className="bg-muted border-border/80 relative h-3.5 w-full overflow-hidden rounded-full border">
              {/* Disparity left zone (95-98%) */}
              <div className="absolute inset-y-0 left-0 w-[30%] bg-amber-500/20" />
              {/* Certified Equal Pay Zone (98-102%) */}
              <div className="absolute inset-y-0 left-[30%] w-[40%] bg-emerald-500/30" />
              {/* Premium right zone (102-105%) */}
              <div className="absolute inset-y-0 right-0 w-[30%] bg-amber-500/20" />
              {/* Exact Company Parity Pin (99.8% -> 48% of bar) */}
              <div
                className="border-background absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 bg-emerald-500 shadow-xs ring-2 ring-emerald-500/50"
                style={{ left: '48%' }}
                title="Current Company Parity: 99.8%"
              />
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
              <span>95.0% (Underpaid Threshold)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">99.8% (Current Company Parity)</span>
              <span>100.0% (True Parity)</span>
              <span>105.0% (Overpaid Threshold)</span>
            </div>
          </div>

          {/* Certification Footer Note */}
          <div className="border-border/60 flex flex-col gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              <span>
                Certified by Independent PayParity Institute · Audit ID:{' '}
                <strong className="text-foreground font-mono font-medium">#EQ-2026-SF-8841</strong>
              </span>
            </div>
            <span className="text-muted-foreground">
              Next Audit Recertification Scheduled: <strong className="text-foreground">July 2027</strong>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
