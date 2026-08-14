import * as React from 'react'
import {
  AlertCircle,
  Award,
  FileDown,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface EmployeePulseSurveyResultsProps extends React.HTMLAttributes<HTMLDivElement> {}

interface PrimaryMetric {
  id: string
  title: string
  value: string
  unit?: string
  badgeText: string
  badgeVariant: 'success' | 'secondary' | 'default' | 'outline' | 'warning'
  detail: string
  subtext: string
  progress: number
  icon: React.ComponentType<{ className?: string }>
}

interface DepartmentRow {
  name: string
  responseCount: string
  participationRate: string
  cultureValues: number
  managementEffectiveness: number
  workLifeBalance: number
  compensationGrowth: number
  enps: number
  enpsFormatted: string
  enpsRank: string
}

interface DriverItem {
  id: string
  title: string
  score: string
  scoreValue: number
  tag: string
  impact: string
  description: string
  benchmarkDiff: string
}

interface OpportunityItem {
  id: string
  title: string
  score: string
  scoreValue: number
  statusBadge: string
  statusVariant: 'warning' | 'default' | 'secondary'
  owner: string
  targetDate: string
  actionSummary: string
}

const primaryMetrics: PrimaryMetric[] = [
  {
    id: 'enps-score',
    title: 'Employee Net Promoter Score',
    value: '+54',
    unit: 'eNPS',
    badgeText: '+22 vs tech benchmark',
    badgeVariant: 'success',
    detail: '64% Promoters · 26% Passives · 10% Detractors',
    subtext: 'Benchmark: +32 eNPS across peer tech scaleups',
    progress: 77,
    icon: Sparkles,
  },
  {
    id: 'engagement-index',
    title: 'Overall Engagement Index',
    value: '86%',
    unit: 'Favorable',
    badgeText: '+4% vs Q2',
    badgeVariant: 'success',
    detail: '86% Favorable · 10% Neutral · 4% Unfavorable',
    subtext: '4.3 / 5.0 mean agreement across all survey items',
    progress: 86,
    icon: HeartHandshake,
  },
  {
    id: 'participation-rate',
    title: 'Survey Participation Rate',
    value: '94%',
    unit: '139 / 148',
    badgeText: 'High Confidence',
    badgeVariant: 'secondary',
    detail: '94% across 5 active departments',
    subtext: 'Statistically significant sample size (p < 0.01)',
    progress: 94,
    icon: Users,
  },
  {
    id: 'retention-intent',
    title: 'Intent to Stay 2+ Years',
    value: '88%',
    unit: 'Retention',
    badgeText: '+6% vs Q2',
    badgeVariant: 'success',
    detail: '88% positive retention sentiment',
    subtext: 'Low voluntary flight risk across engineering & product',
    progress: 88,
    icon: ShieldCheck,
  },
]

const departments: DepartmentRow[] = [
  {
    name: 'Engineering',
    responseCount: '46 / 48 responses',
    participationRate: '96%',
    cultureValues: 92,
    managementEffectiveness: 88,
    workLifeBalance: 84,
    compensationGrowth: 74,
    enps: 62,
    enpsFormatted: '+62',
    enpsRank: 'Top Quartile',
  },
  {
    name: 'Product & Design',
    responseCount: '28 / 30 responses',
    participationRate: '93%',
    cultureValues: 94,
    managementEffectiveness: 91,
    workLifeBalance: 82,
    compensationGrowth: 76,
    enps: 58,
    enpsFormatted: '+58',
    enpsRank: 'Top Quartile',
  },
  {
    name: 'Marketing',
    responseCount: '22 / 24 responses',
    participationRate: '92%',
    cultureValues: 89,
    managementEffectiveness: 85,
    workLifeBalance: 86,
    compensationGrowth: 71,
    enps: 48,
    enpsFormatted: '+48',
    enpsRank: 'Above Average',
  },
  {
    name: 'Sales & GTM',
    responseCount: '25 / 26 responses',
    participationRate: '96%',
    cultureValues: 86,
    managementEffectiveness: 84,
    workLifeBalance: 78,
    compensationGrowth: 68,
    enps: 45,
    enpsFormatted: '+45',
    enpsRank: 'Above Average',
  },
  {
    name: 'Operations',
    responseCount: '18 / 20 responses',
    participationRate: '90%',
    cultureValues: 90,
    managementEffectiveness: 87,
    workLifeBalance: 88,
    compensationGrowth: 72,
    enps: 52,
    enpsFormatted: '+52',
    enpsRank: 'Top Quartile',
  },
]

const topDrivers: DriverItem[] = [
  {
    id: 'driver-1',
    title: 'Psychological safety & peer collaboration',
    score: '96% favorable',
    scoreValue: 96,
    tag: 'Highest Scored Driver',
    impact: 'Highest correlation with company eNPS (+0.74 r)',
    benchmarkDiff: '+14% vs tech benchmark',
    description:
      'Squads report high mutual trust, blameless incident reviews, and transparent pairing culture without fear of failure.',
  },
  {
    id: 'driver-2',
    title: 'Mission alignment & executive transparency',
    score: '92% favorable',
    scoreValue: 92,
    tag: 'Core Driver',
    impact: 'Strongest predictor of organizational retention',
    benchmarkDiff: '+11% vs tech benchmark',
    description:
      'Bi-weekly all-hands, transparent financials, and crisp quarterly OKRs provide unequivocal clarity on company trajectory.',
  },
  {
    id: 'driver-3',
    title: 'Manager trust & day-to-day autonomy',
    score: '90% favorable',
    scoreValue: 90,
    tag: 'Core Driver',
    impact: 'Key catalyst for execution velocity & morale',
    benchmarkDiff: '+9% vs tech benchmark',
    description:
      'Team members highlight minimal micromanagement, supportive weekly 1:1 coaching, and autonomy over technical decisions.',
  },
]

const opportunityAreas: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Clarity on promotion cycles and IC compensation bands',
    score: '68% favorable',
    scoreValue: 68,
    statusBadge: 'Action plan active',
    statusVariant: 'warning',
    owner: 'People Ops & Total Rewards',
    targetDate: 'Q4 2026 Rollout',
    actionSummary:
      'Publish transparent engineering & IC level matrices with defined salary bands, equity guidelines, and semi-annual calibration windows.',
  },
  {
    id: 'opp-2',
    title: 'Cross-functional roadmap visibility & tool sprawl',
    score: '71% favorable',
    scoreValue: 71,
    statusBadge: 'Action plan active',
    statusVariant: 'warning',
    owner: 'Product Ops & Platform Squad',
    targetDate: 'End of Q3',
    actionSummary:
      'Consolidate sprint tracking into unified Linear workspaces and establish bi-weekly cross-discipline demo showcases.',
  },
  {
    id: 'opp-3',
    title: 'Focus time & meeting cadence optimization',
    score: '73% favorable',
    scoreValue: 73,
    statusBadge: 'Action plan active',
    statusVariant: 'warning',
    owner: 'Engineering Leadership Council',
    targetDate: 'Active Trial',
    actionSummary:
      'Implement company-wide "No Meeting Wednesdays" and audit recurring status meetings in favor of asynchronous updates.',
  },
]

const getScoreBadgeClass = (score: number) => {
  if (score >= 80) {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  }
  if (score >= 70) {
    return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
  }
  return 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300'
}

export function EmployeePulseSurveyResults({ className, ...props }: EmployeePulseSurveyResultsProps) {
  return (
    <div
      data-uipkge=""
      data-slot="employee-pulse-survey-results"
      className={cn('w-full space-y-6', className)}
      {...props}
    >
      {/* Header Section */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Company Pulse &amp; eNPS Engagement Survey
                </h2>
                <Badge wrap variant="outline" className="font-mono text-xs">
                  Q3 2026
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Q3 2026 Pulse Survey · 94% Participation Rate · 139 / 148 Responses
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-emerald-800 shadow-xs dark:text-emerald-200">
                <Sparkles className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold tracking-tight tabular-nums">+54 eNPS · Excellent</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shadow-xs">
                <FileDown className="size-4" />
                <span>Export Executive Summary</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Primary Engagement KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.id} className="border-border bg-card hover:border-border/80 shadow-xs transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-xs font-medium">{{ ...metric }.title}</CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                      {metric.value}
                    </span>
                    {metric.unit && <span className="text-muted-foreground text-xs font-medium">{metric.unit}</span>}
                  </div>
                  <Badge wrap variant={metric.badgeVariant} className="text-xs font-medium tabular-nums">
                    {metric.badgeText}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <Progress value={metric.progress} className="h-1.5 w-full" />
                  <div className="space-y-0.5 pt-0.5">
                    <p className="text-foreground text-xs leading-normal font-medium">{metric.detail}</p>
                    <p className="text-muted-foreground text-xs leading-normal">{metric.subtext}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Department Sentiment Heatmap Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex min-w-0 items-center gap-2">
                <CardTitle className="text-base font-semibold">Department Sentiment Heatmap</CardTitle>
                <Badge wrap variant="outline" className="text-xs font-normal">
                  5 Departments · 139 Responses
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs">
                Culture Amp style multidimensional sentiment matrix mapped across key operational pillars.
              </CardDescription>
            </div>

            {/* Heatmap Legend */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:pt-0">
              <span className="text-muted-foreground font-medium">Sentiment Scale:</span>
              <div className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="font-medium">Favorable (≥80%)</span>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span className="font-medium">Moderate (70-79%)</span>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-rose-700 dark:text-rose-300">
                <span className="size-1.5 rounded-full bg-rose-500" />
                <span className="font-medium">Opportunity (&lt;70%)</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-border overflow-x-auto border-t">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-foreground w-60 text-xs font-semibold">
                    Department &amp; Participation
                  </TableHead>
                  <TableHead className="text-foreground text-center text-xs font-semibold">
                    Culture &amp; Values
                  </TableHead>
                  <TableHead className="text-foreground text-center text-xs font-semibold">
                    Management Effectiveness
                  </TableHead>
                  <TableHead className="text-foreground text-center text-xs font-semibold">Work-Life Balance</TableHead>
                  <TableHead className="text-foreground text-center text-xs font-semibold">
                    Compensation &amp; Growth
                  </TableHead>
                  <TableHead className="text-foreground text-right text-xs font-semibold">Overall eNPS Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.name} className="hover:bg-muted/30">
                    {/* Department Name & Sample */}
                    <TableCell className="py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-semibold">{dept.name}</p>
                        <p className="text-muted-foreground text-xs tabular-nums">
                          {dept.responseCount} ·{' '}
                          <span className="text-foreground font-medium">{dept.participationRate}</span>
                        </p>
                      </div>
                    </TableCell>

                    {/* Culture & Values */}
                    <TableCell className="py-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            'flex min-w-[72px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-bold tabular-nums shadow-xs',
                            getScoreBadgeClass(dept.cultureValues),
                          )}
                        >
                          {dept.cultureValues}%
                        </div>
                      </div>
                    </TableCell>

                    {/* Management Effectiveness */}
                    <TableCell className="py-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            'flex min-w-[72px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-bold tabular-nums shadow-xs',
                            getScoreBadgeClass(dept.managementEffectiveness),
                          )}
                        >
                          {dept.managementEffectiveness}%
                        </div>
                      </div>
                    </TableCell>

                    {/* Work-Life Balance */}
                    <TableCell className="py-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            'flex min-w-[72px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-bold tabular-nums shadow-xs',
                            getScoreBadgeClass(dept.workLifeBalance),
                          )}
                        >
                          {dept.workLifeBalance}%
                        </div>
                      </div>
                    </TableCell>

                    {/* Compensation & Growth */}
                    <TableCell className="py-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            'flex min-w-[72px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-bold tabular-nums shadow-xs',
                            getScoreBadgeClass(dept.compensationGrowth),
                          )}
                        >
                          {dept.compensationGrowth}%
                        </div>
                      </div>
                    </TableCell>

                    {/* Overall eNPS Score */}
                    <TableCell className="py-3.5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 tabular-nums dark:text-emerald-300">
                          <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{dept.enpsFormatted} eNPS</span>
                        </div>
                        <span className="text-muted-foreground text-xs font-normal">{dept.enpsRank}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Engagement Drivers & Action Items Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Top Engagement Drivers (Superpowers) */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex min-w-0 items-center gap-2">
                  <CardTitle className="text-base font-semibold">Top Engagement Drivers</CardTitle>
                  <Badge wrap variant="success" className="text-xs">
                    Organizational Strengths
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Highest scored sentiment drivers providing outsized positive impact on overall eNPS.
                </CardDescription>
              </div>
              <Award className="text-success size-5 shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {topDrivers.map((driver) => (
              <div key={driver.id} className="bg-muted/30 border-border/80 space-y-2.5 rounded-lg border p-4 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-foreground text-sm font-semibold">{driver.title}</h4>
                      <Badge wrap variant="outline" className="text-xs font-normal">
                        {driver.tag}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">{driver.impact}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 tabular-nums dark:text-emerald-300">
                    <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{driver.score}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">{driver.description}</p>

                <div className="border-border/60 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground">Peer Benchmark:</span>
                  <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {driver.benchmarkDiff}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column: Priority Opportunity Areas & Action Items */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex min-w-0 items-center gap-2">
                  <CardTitle className="text-base font-semibold">Priority Opportunity Areas</CardTitle>
                  <Badge wrap variant="warning" className="text-xs">
                    Active Remediation
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Key focus areas requiring leadership follow-through and documented action plans.
                </CardDescription>
              </div>
              <Lightbulb className="text-warning size-5 shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {opportunityAreas.map((opp) => (
              <div key={opp.id} className="bg-muted/30 border-border/80 space-y-2.5 rounded-lg border p-4 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="text-foreground text-sm font-semibold">{opp.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge wrap variant="warning" className="text-xs font-medium">
                        {opp.statusBadge}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        Target: <strong className="text-foreground font-medium">{opp.targetDate}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 tabular-nums dark:text-amber-300">
                    <AlertCircle className="size-3 text-amber-600 dark:text-amber-400" />
                    <span>{opp.score}</span>
                  </div>
                </div>

                <div className="bg-card/70 border-border/60 space-y-1 rounded-md border p-2.5">
                  <div className="text-foreground flex items-center gap-1 text-xs font-medium">
                    <Zap className="text-primary size-3 shrink-0" />
                    <span>Action Plan &amp; Deliverables</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{{ ...opp }.actionSummary}</p>
                </div>

                <div className="border-border/60 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground">Action Owner:</span>
                  <span className="text-foreground font-medium">{opp.owner}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
