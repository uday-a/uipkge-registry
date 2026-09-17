'use client'

import * as React from 'react'
import {
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  DollarSign,
  Download,
  FileCheck,
  Kanban,
  Plus,
  Search,
  Sparkles,
  Table as TableIcon,
  Timer,
  TrendingUp,
  User,
  Video,
  Wand2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type PipelineStageId = 'discovery' | 'demo' | 'proposal' | 'negotiation'

export interface DealItem {
  id: string
  company: string
  companyInitials: string
  avatarBg: string
  dealName: string
  tier: 'Enterprise' | 'Mid-Market' | 'Growth'
  value: number
  valueFormatted: string
  stageId: PipelineStageId
  stageName: string
  stageProgress: number
  aiWinScore: number
  contactName: string
  contactRole: string
  ownerName: string
  ownerInitials: string
  closeDate: string
  daysToClose: string
  nextStep: string
  isWinReady?: boolean
  activityCount: number
}

export interface StageSummary {
  id: PipelineStageId
  name: string
  dealCountText: string
  totalValueText: string
  avgAiScoreText: string
  accentColor: string
  badgeVariant: string
  progressValue: number
  description: string
}

export interface MeetingInsight {
  id: string
  company: string
  companyInitials: string
  avatarBg: string
  dealName: string
  meetingTitle: string
  timeAgo: string
  duration: string
  platform: string
  attendees: string[]
  buyingIntentScore: number
  buyingIntentLabel: string
  sentimentScore: string
  keyTakeaways: string
  aiRecommendedAction: string
  primaryActionLabel: string
}

export interface AiCrmPipelineDashboardProps {
  className?: string
  initialViewMode?: 'kanban' | 'table'
  initialStageFilter?: 'all' | PipelineStageId
  initialSearch?: string
  showInsights?: boolean
}

const defaultStages: StageSummary[] = [
  {
    id: 'discovery',
    name: 'Discovery & Qualification',
    dealCountText: '6 deals',
    totalValueText: '$240k',
    avgAiScoreText: 'AI score 42%',
    accentColor: 'bg-sky-500',
    badgeVariant: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    progressValue: 25,
    description: 'Initial ICP qualification, technical scoping, and business fit discovery',
  },
  {
    id: 'demo',
    name: 'Technical Demo & Evaluation',
    dealCountText: '8 deals',
    totalValueText: '$480k',
    avgAiScoreText: 'AI score 68%',
    accentColor: 'bg-indigo-500',
    badgeVariant: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    progressValue: 50,
    description: 'Deep-dive sandbox environment, latency benchmarks, and API trials',
  },
  {
    id: 'proposal',
    name: 'Executive Proposal & Security',
    dealCountText: '6 deals',
    totalValueText: '$520k',
    avgAiScoreText: 'AI score 84%',
    accentColor: 'bg-amber-500',
    badgeVariant: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    progressValue: 75,
    description: 'Security & InfoSec clearance, CFO business case, and custom licensing',
  },
  {
    id: 'negotiation',
    name: 'Contract Negotiation & Closing',
    dealCountText: '4 deals',
    totalValueText: '$188k',
    avgAiScoreText: 'AI score 94%',
    accentColor: 'bg-emerald-500',
    badgeVariant: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    progressValue: 100,
    description: 'Master service agreement redlines, final DPA signoff, and onboarding kickoff',
  },
]

const defaultDeals: DealItem[] = [
  // Stage 1: Discovery & Qualification (6 deals total, 3 detailed inline)
  {
    id: 'deal-1',
    company: 'Acme Corp',
    companyInitials: 'AC',
    avatarBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    dealName: 'Acme Corp - Enterprise 500 Seats',
    tier: 'Enterprise',
    value: 120000,
    valueFormatted: '$120,000 ARR',
    stageId: 'discovery',
    stageName: 'Discovery & Qualification',
    stageProgress: 25,
    aiWinScore: 48,
    contactName: 'David Chen',
    contactRole: 'VP Eng',
    ownerName: 'Sarah Jenkins (AE)',
    ownerInitials: 'SJ',
    closeDate: 'Aug 28',
    daysToClose: '7 days',
    nextStep: 'Complete Security Questionnaire review',
    activityCount: 4,
  },
  {
    id: 'deal-2',
    company: 'HyperScale Cloud',
    companyInitials: 'HC',
    avatarBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    dealName: 'HyperScale Cloud - Infra Observability',
    tier: 'Growth',
    value: 75000,
    valueFormatted: '$75,000 ARR',
    stageId: 'discovery',
    stageName: 'Discovery & Qualification',
    stageProgress: 25,
    aiWinScore: 42,
    contactName: 'Elena Rostova',
    contactRole: 'Head of DevOps',
    ownerName: 'Michael Chang (AE)',
    ownerInitials: 'MC',
    closeDate: 'Sep 14',
    daysToClose: '24 days',
    nextStep: 'Deliver architectural scoping document',
    activityCount: 3,
  },
  {
    id: 'deal-3',
    company: 'Global Logistics Hub',
    companyInitials: 'GL',
    avatarBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    dealName: 'Global Logistics - Fleet Telematics',
    tier: 'Mid-Market',
    value: 45000,
    valueFormatted: '$45,000 ARR',
    stageId: 'discovery',
    stageName: 'Discovery & Qualification',
    stageProgress: 25,
    aiWinScore: 36,
    contactName: 'Marcus Brody',
    contactRole: 'Dir. Operations',
    ownerName: 'Jessica Wu (AE)',
    ownerInitials: 'JW',
    closeDate: 'Sep 22',
    daysToClose: '32 days',
    nextStep: 'Schedule technical discovery sync',
    activityCount: 2,
  },

  // Stage 2: Technical Demo & Evaluation (8 deals total, 3 detailed inline)
  {
    id: 'deal-4',
    company: 'QuantumPay',
    companyInitials: 'QP',
    avatarBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    dealName: 'QuantumPay - Core Banking Modernization',
    tier: 'Enterprise',
    value: 160000,
    valueFormatted: '$160,000 ARR',
    stageId: 'demo',
    stageName: 'Technical Demo & Evaluation',
    stageProgress: 50,
    aiWinScore: 74,
    contactName: 'Amina Al-Mansoor',
    contactRole: 'CTO',
    ownerName: 'Sarah Jenkins (AE)',
    ownerInitials: 'SJ',
    closeDate: 'Sep 08',
    daysToClose: '18 days',
    nextStep: 'VPC sandbox load testing & latency trial',
    activityCount: 6,
  },
  {
    id: 'deal-5',
    company: 'Orbit Data Systems',
    companyInitials: 'OD',
    avatarBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    dealName: 'Orbit Data - Analytics Fabric 2.0',
    tier: 'Enterprise',
    value: 135000,
    valueFormatted: '$135,000 ARR',
    stageId: 'demo',
    stageName: 'Technical Demo & Evaluation',
    stageProgress: 50,
    aiWinScore: 68,
    contactName: 'Liam O’Connor',
    contactRole: 'VP Data Systems',
    ownerName: 'Carlos Mendez (AE)',
    ownerInitials: 'CM',
    closeDate: 'Sep 18',
    daysToClose: '28 days',
    nextStep: 'Deliver custom throughput benchmark report',
    activityCount: 5,
  },
  {
    id: 'deal-6',
    company: 'CyberGuard Defense',
    companyInitials: 'CG',
    avatarBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    dealName: 'CyberGuard - SIEM Log Ingestion',
    tier: 'Enterprise',
    value: 185000,
    valueFormatted: '$185,000 ARR',
    stageId: 'demo',
    stageName: 'Technical Demo & Evaluation',
    stageProgress: 50,
    aiWinScore: 65,
    contactName: 'Rachel Vance',
    contactRole: 'CISO',
    ownerName: 'Michael Chang (AE)',
    ownerInitials: 'MC',
    closeDate: 'Sep 30',
    daysToClose: '40 days',
    nextStep: 'InfoSec team architecture deep-dive',
    activityCount: 4,
  },

  // Stage 3: Executive Proposal & Security (6 deals total, 3 detailed inline)
  {
    id: 'deal-7',
    company: 'Vertex Bio Labs',
    companyInitials: 'VB',
    avatarBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    dealName: 'Vertex Bio - C-Suite Platform Rollout',
    tier: 'Enterprise',
    value: 210000,
    valueFormatted: '$210,000 ARR',
    stageId: 'proposal',
    stageName: 'Executive Proposal & Security',
    stageProgress: 75,
    aiWinScore: 88,
    contactName: 'Dr. Julian Sterling',
    contactRole: 'Chief Sci Officer',
    ownerName: 'Emily Thorne (AE)',
    ownerInitials: 'ET',
    closeDate: 'Aug 30',
    daysToClose: '9 days',
    nextStep: 'Final CFO 2-year commitment signoff',
    activityCount: 8,
  },
  {
    id: 'deal-8',
    company: 'Horizon FinServ',
    companyInitials: 'HF',
    avatarBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    dealName: 'Horizon FinServ - Wealth Management Suite',
    tier: 'Enterprise',
    value: 190000,
    valueFormatted: '$190,000 ARR',
    stageId: 'proposal',
    stageName: 'Executive Proposal & Security',
    stageProgress: 75,
    aiWinScore: 84,
    contactName: 'Nathalie Dupont',
    contactRole: 'Managing Director',
    ownerName: 'Sarah Jenkins (AE)',
    ownerInitials: 'SJ',
    closeDate: 'Sep 04',
    daysToClose: '14 days',
    nextStep: 'Vendor risk committee formal approval',
    activityCount: 7,
  },
  {
    id: 'deal-9',
    company: 'Pulse Healthcare',
    companyInitials: 'PH',
    avatarBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    dealName: 'Pulse Health - Telehealth Core Engine',
    tier: 'Growth',
    value: 120000,
    valueFormatted: '$120,000 ARR',
    stageId: 'proposal',
    stageName: 'Executive Proposal & Security',
    stageProgress: 75,
    aiWinScore: 82,
    contactName: 'Dr. Alan Moore',
    contactRole: 'Chief Med Officer',
    ownerName: 'Carlos Mendez (AE)',
    ownerInitials: 'CM',
    closeDate: 'Sep 12',
    daysToClose: '22 days',
    nextStep: 'Execute HIPAA BAA & data privacy rider',
    activityCount: 5,
  },

  // Stage 4: Contract Negotiation & Closing (4 deals total, 2 detailed inline)
  {
    id: 'deal-10',
    company: 'Nova Fintech',
    companyInitials: 'NF',
    avatarBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    dealName: 'Nova Fintech - Multi-Region VPC Latency',
    tier: 'Enterprise',
    value: 98000,
    valueFormatted: '$98,000 ARR',
    stageId: 'negotiation',
    stageName: 'Contract Negotiation & Closing',
    stageProgress: 100,
    aiWinScore: 96,
    isWinReady: true,
    contactName: 'Samantha Ray',
    contactRole: 'Head of Procurement',
    ownerName: 'Emily Thorne (AE)',
    ownerInitials: 'ET',
    closeDate: 'Aug 24',
    daysToClose: '3 days',
    nextStep: 'DocuSign envelope awaiting CEO countersignature',
    activityCount: 11,
  },
  {
    id: 'deal-11',
    company: 'Apex AI Labs',
    companyInitials: 'AA',
    avatarBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
    dealName: 'Apex AI - Model Orchestration Cluster',
    tier: 'Growth',
    value: 90000,
    valueFormatted: '$90,000 ARR',
    stageId: 'negotiation',
    stageName: 'Contract Negotiation & Closing',
    stageProgress: 100,
    aiWinScore: 92,
    isWinReady: true,
    contactName: 'Vikram Patel',
    contactRole: 'VP Infrastructure',
    ownerName: 'Michael Chang (AE)',
    ownerInitials: 'MC',
    closeDate: 'Aug 26',
    daysToClose: '5 days',
    nextStep: 'Send customer onboarding package & kickoff invite',
    activityCount: 9,
  },
]

const defaultMeetingInsights: MeetingInsight[] = [
  {
    id: 'meet-1',
    company: 'Acme Corp',
    companyInitials: 'AC',
    avatarBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    dealName: 'Acme Corp - Enterprise 500 Seats',
    meetingTitle: 'Security & Legal Architecture Review',
    timeAgo: 'Today at 10:30 AM',
    duration: '45 mins',
    platform: 'Zoom Meeting',
    attendees: ['Sarah Jenkins (AE)', 'David Chen (VP Eng)', 'Sarah Lin (Legal Counsel)'],
    buyingIntentScore: 94,
    buyingIntentLabel: '94% High Buying Intent',
    sentimentScore: '+0.88 Positive',
    keyTakeaways:
      'SOC2 Type II cleared with zero exceptions. InfoSec approved AWS eu-central-1 data residency. Legal accepted master indemnity terms with 1 minor clarification on 99.95% uptime SLA credit.',
    aiRecommendedAction:
      'Dispatch updated Master Services Agreement (MSA) & DPA with revised 99.95% SLA clause before 4:00 PM today.',
    primaryActionLabel: 'Dispatch MSA & DPA',
  },
  {
    id: 'meet-2',
    company: 'Vertex Bio Labs',
    companyInitials: 'VB',
    avatarBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    dealName: 'Vertex Bio - C-Suite Platform Rollout',
    meetingTitle: 'CFO Business Case & ROI Alignment',
    timeAgo: 'Yesterday at 3:15 PM',
    duration: '30 mins',
    platform: 'Google Meet',
    attendees: ['Emily Thorne (AE)', 'Dr. Julian Sterling (CSO)', 'Mark Hansen (CFO)'],
    buyingIntentScore: 88,
    buyingIntentLabel: '88% Strong Buying Intent',
    sentimentScore: '+0.82 Positive',
    keyTakeaways:
      'CFO Mark Hansen confirmed budget authorization for 2-year enterprise commitment ($420k TCV). Requested expedited 14-day onboarding plan for 450 laboratory technicians across Cambridge and Basel campuses.',
    aiRecommendedAction:
      'Deliver 14-day technical migration blueprint & assign dedicated Customer Success Architect by 12:00 PM tomorrow.',
    primaryActionLabel: 'Send Onboarding Plan',
  },
  {
    id: 'meet-3',
    company: 'QuantumPay',
    companyInitials: 'QP',
    avatarBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    dealName: 'QuantumPay - Core Banking Modernization',
    meetingTitle: 'Technical Sandbox & Latency Benchmark Debrief',
    timeAgo: 'Aug 19 at 11:00 AM',
    duration: '60 mins',
    platform: 'In-Person Executive Sync',
    attendees: ['Sarah Jenkins (AE)', 'Amina Al-Mansoor (CTO)', '4 Principal Engineers'],
    buyingIntentScore: 78,
    buyingIntentLabel: '78% Moderate-High Intent',
    sentimentScore: '+0.74 Validated',
    keyTakeaways:
      'Completed live latency benchmark in us-east-1 and eu-central-1 sandbox with sustained 12,500 req/sec at 11.8ms p99 latency. CTO asked for tiered discount model if expanding to APAC in Q1 2027.',
    aiRecommendedAction:
      'Schedule executive sponsor call with VP Engineering and send multi-region Tier-1 SLA pricing options.',
    primaryActionLabel: 'Generate Tier-1 Quote',
  },
]

function getAiScoreClass(score: number) {
  if (score >= 85) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  }
  if (score >= 70) {
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  }
  if (score >= 50) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  }
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
}

export function AiCrmPipelineDashboard({
  className,
  initialViewMode = 'kanban',
  initialStageFilter = 'all',
  initialSearch = '',
  showInsights = true,
}: AiCrmPipelineDashboardProps) {
  const [viewMode, setViewMode] = React.useState<'kanban' | 'table'>(initialViewMode)
  const [stageFilter, setStageFilter] = React.useState<'all' | PipelineStageId>(initialStageFilter)
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [selectedDealId, setSelectedDealId] = React.useState<string | null>(null)

  const filteredDeals = React.useMemo(() => {
    return defaultDeals.filter((deal) => {
      const matchesStage = stageFilter === 'all' || deal.stageId === stageFilter
      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesStage

      const matchesSearch =
        deal.company.toLowerCase().includes(query) ||
        deal.dealName.toLowerCase().includes(query) ||
        deal.contactName.toLowerCase().includes(query) ||
        deal.ownerName.toLowerCase().includes(query) ||
        deal.nextStep.toLowerCase().includes(query)

      return matchesStage && matchesSearch
    })
  }, [stageFilter, searchQuery])

  const getStageDeals = React.useCallback(
    (stageId: PipelineStageId) => {
      return filteredDeals.filter((deal) => deal.stageId === stageId)
    },
    [filteredDeals],
  )

  const handleSelectDeal = (id: string) => {
    setSelectedDealId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      {/* Header Section */}
      <header className="border-border flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge wrap variant="outline" className="gap-1.5 text-xs font-medium">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              Enterprise Mid-Market Squad · 6 Account Executives
            </Badge>
            <Badge wrap variant="secondary" className="gap-1 text-xs">
              <Sparkles className="text-primary size-3" />
              Live AI Revenue Intelligence
            </Badge>
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Sales Pipeline & Revenue Velocity
          </h1>
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold tabular-nums">$1,428,500.00 Pipeline · 24 Deals</span>
            <span className="text-border mx-2">|</span>
            <span>Q3 Closed ARR Target: $1.20M (86% on-pace probability)</span>
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="border-border bg-muted/40 inline-flex rounded-lg border p-1">
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                viewMode === 'kanban'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="size-3.5" />
              Board View
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                viewMode === 'table'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setViewMode('table')}
            >
              <TableIcon className="size-3.5" />
              Table View
            </button>
          </div>

          <Button aria-label="Download attachment" variant="outline" size="sm" className="gap-1.5 shadow-xs">
            <Download className="size-4" />
            Export CRM CSV
          </Button>
          <Button size="sm" className="gap-1.5 shadow-xs">
            <Plus className="size-4" />
            New Deal
          </Button>
        </div>
      </header>

      {/* 4 CRM Health KPI Cards */}
      <section
        aria-label="Pipeline Health KPI Summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* KPI 1: Total Pipeline Value */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Total Pipeline Value
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">$1.43M</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Across 24 qualified deals</span>
              <Badge
                wrap
                variant="outline"
                className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <TrendingUp className="size-3" />
                +17.6% MoM
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              Weighted Forecast: <span className="text-foreground font-semibold tabular-nums">$976,500.00</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Win Probability Index */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Win Probability Index
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">68.4%</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">AI Win Probability</span>
              <Badge
                wrap
                variant="outline"
                className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <BrainCircuit className="size-3" />
                +5.8% shift
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              High Confidence:{' '}
              <span className="text-foreground font-semibold tabular-nums">14 deals (&gt;70% score)</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Avg Deal Size */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Avg Deal Size
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BarChart3 className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">$59,500.00</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ARR / deal average</span>
              <Badge
                wrap
                variant="outline"
                className="gap-1 border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
              >
                <TrendingUp className="size-3" />
                +$6.2k vs FY25
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              Median Deal Value: <span className="text-foreground font-semibold tabular-nums">$52,000.00 ARR</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Deal Velocity */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Deal Velocity
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">22 Days</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Avg sales cycle · -4d vs Q2</span>
              <Badge
                wrap
                variant="outline"
                className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Timer className="size-3" />
                15.4% faster
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              Fastest Velocity: <span className="text-foreground font-semibold tabular-nums">11d (Nova Fintech)</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Search & Stage Filtering Bar */}
      <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Filter deals, contacts, account executives..."
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full rounded-md border pr-3 pl-9 text-xs focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={cn(
              'focus-visible:ring-ring rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              stageFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
            onClick={() => setStageFilter('all')}
          >
            All Stages ({defaultDeals.length})
          </button>
          {defaultStages.map((stg) => (
            <button
              key={stg.id}
              type="button"
              className={cn(
                'focus-visible:ring-ring rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                stageFilter === stg.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              onClick={() => setStageFilter(stg.id)}
            >
              {stg.name.split(' ')[0]} ({stg.dealCountText.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* 4-Stage Kanban / Pipeline Board */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {defaultStages.map((stg, idx) => {
            const stageDeals = getStageDeals(stg.id)
            return (
              <div key={stg.id} className="border-border/80 bg-muted/30 flex flex-col gap-3 rounded-xl border p-3">
                {/* Stage Column Header */}
                <div className="border-border/60 bg-card space-y-2 rounded-lg border p-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn('size-2.5 rounded-full', stg.accentColor)} />
                      <h2 className="text-foreground line-clamp-1 text-xs font-semibold tracking-tight">{stg.name}</h2>
                    </div>
                    <Badge
                      wrap
                      variant="outline"
                      className={cn('text-xs font-semibold tabular-nums', stg.badgeVariant)}
                    >
                      {stg.dealCountText}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="text-foreground font-bold tabular-nums">{stg.totalValueText}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="size-3" />
                      {stg.avgAiScoreText}
                    </span>
                  </div>

                  {/* Stage Progress Meter */}
                  <div className="space-y-1 pt-1">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>Stage {idx + 1} of 4</span>
                      <span className="text-foreground font-medium tabular-nums">{stg.progressValue}%</span>
                    </div>
                    <Progress value={stg.progressValue} className="h-1.5" />
                  </div>
                </div>

                {/* Stage Deal Cards */}
                <div className="flex flex-col gap-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedDealId === deal.id}
                      className={cn(
                        'group border-border bg-card hover:border-primary/50 focus-visible:ring-ring relative flex cursor-pointer flex-col gap-3 rounded-lg border p-3.5 shadow-xs transition-all duration-150 hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none',
                        selectedDealId === deal.id && 'ring-primary border-primary ring-2',
                      )}
                      onClick={() => handleSelectDeal(deal.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelectDeal(deal.id)
                        }
                      }}
                    >
                      {/* Card Header: Avatar, Company, Tier & Action */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="border-border/50 size-8 rounded-lg border">
                            <AvatarFallback className={cn('rounded-lg text-xs font-bold', deal.avatarBg)}>
                              {deal.companyInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-foreground text-xs font-bold">{deal.company}</h3>
                            <p className="text-muted-foreground text-xs">{deal.tier}</p>
                          </div>
                        </div>

                        {/* AI Score or Emerald Win Badge */}
                        <div className="flex flex-col items-end gap-1">
                          {deal.isWinReady && (
                            <Badge
                              wrap
                              variant="outline"
                              className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                            >
                              <CheckCircle2 className="size-3 text-emerald-500" />
                              Win Ready
                            </Badge>
                          )}
                          <Badge
                            wrap
                            variant="outline"
                            className={cn('gap-1 text-xs font-semibold tabular-nums', getAiScoreClass(deal.aiWinScore))}
                          >
                            <Sparkles className="size-3" />
                            {deal.aiWinScore}% AI Score
                          </Badge>
                        </div>
                      </div>

                      {/* Deal Name & ARR Value */}
                      <div className="space-y-1">
                        <p className="text-foreground line-clamp-1 text-xs font-medium tracking-tight">
                          {deal.dealName}
                        </p>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                          <span className="text-foreground text-base font-bold tabular-nums">
                            {deal.valueFormatted}
                          </span>
                          <span className="text-muted-foreground text-xs tabular-nums">
                            Close: {deal.closeDate} ({deal.daysToClose})
                          </span>
                        </div>
                      </div>

                      {/* Stage Progress Bar */}
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <span>Momentum</span>
                          <span className="text-foreground font-medium tabular-nums">{deal.stageProgress}%</span>
                        </div>
                        <Progress value={deal.stageProgress} className="h-1.5" />
                      </div>

                      {/* Contact & Owner */}
                      <div className="text-muted-foreground border-border/60 flex items-center justify-between border-t pt-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <User className="text-muted-foreground size-3.5" />
                          <span className="max-w-[110px] truncate">
                            {deal.contactName} ({deal.contactRole})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="bg-muted text-foreground inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold">
                            {deal.ownerInitials}
                          </span>
                        </div>
                      </div>

                      {/* AI Recommended Next Step */}
                      <div className="border-border/60 bg-muted/40 text-muted-foreground rounded-md border p-2 text-xs">
                        <div className="flex items-start gap-1.5">
                          <Wand2 className="text-primary mt-0.5 size-3.5 shrink-0" />
                          <span className="line-clamp-2 leading-relaxed">
                            <strong className="text-foreground font-semibold">AI Next Action:</strong> {deal.nextStep}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center text-xs">
                      <p>No matching deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View Mode */
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[240px]">Account & Deal</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">ARR Value</TableHead>
                  <TableHead>AI Win Score</TableHead>
                  <TableHead className="min-w-[180px]">Key Contact</TableHead>
                  <TableHead>AE Owner</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead className="min-w-[240px]">AI Next Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map((deal) => (
                  <TableRow
                    key={deal.id}
                    tabIndex={0}
                    className="hover:bg-muted/40 focus-visible:ring-ring cursor-pointer transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => handleSelectDeal(deal.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectDeal(deal.id)
                      }
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="border-border/50 size-8 rounded-lg border">
                          <AvatarFallback className={cn('rounded-lg text-xs font-bold', deal.avatarBg)}>
                            {deal.companyInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-xs font-semibold">{deal.company}</span>
                            <Badge wrap variant="secondary" className="px-1.5 py-0 text-xs">
                              {deal.tier}
                            </Badge>
                            {deal.isWinReady && (
                              <Badge
                                wrap
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                              >
                                Win Ready
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs">{deal.dealName}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-foreground text-xs font-medium">{deal.stageName}</span>
                        <Progress value={deal.stageProgress} className="h-1.5 w-24" />
                      </div>
                    </TableCell>

                    <TableCell className="text-foreground text-right text-xs font-bold tabular-nums">
                      {deal.valueFormatted}
                    </TableCell>

                    <TableCell>
                      <Badge
                        wrap
                        variant="outline"
                        className={cn('gap-1 text-xs font-semibold tabular-nums', getAiScoreClass(deal.aiWinScore))}
                      >
                        <Sparkles className="size-3" />
                        {deal.aiWinScore}%
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <p className="text-foreground font-medium">{deal.contactName}</p>
                        <p className="text-muted-foreground">{deal.contactRole}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-foreground text-xs font-medium">{deal.ownerName}</span>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs tabular-nums">
                        <p className="text-foreground font-medium">{deal.closeDate}</p>
                        <p className="text-muted-foreground">{deal.daysToClose}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Wand2 className="text-primary size-3.5 shrink-0" />
                        <span className="max-w-[220px] truncate">{deal.nextStep}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-border text-muted-foreground flex items-center justify-between border-t p-3 text-xs">
            <span>
              Showing <strong className="text-foreground">{filteredDeals.length}</strong> of {defaultDeals.length} deals
            </span>
            <span>
              Pipeline Velocity Index: <strong className="text-foreground">68.4% AI Score Average</strong>
            </span>
          </div>
        </div>
      )}

      {/* Recent Deal Activities & AI Meeting Insights Card */}
      {showInsights && (
        <section aria-label="AI Meeting Insights & Deal Activities" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-border flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <BrainCircuit className="size-4" />
                  </div>
                  <CardTitle className="text-foreground text-base font-bold">
                    Recent Deal Activities & AI Meeting Insights
                  </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground text-xs">
                  Automated multi-speaker transcript intelligence, buyer sentiment scoring, and next-best actions
                </CardDescription>
              </div>
              <Badge
                wrap
                variant="outline"
                className="gap-1.5 self-start border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 sm:self-center dark:text-emerald-400"
              >
                <Sparkles className="size-3" />3 Executive Meetings Processed Today
              </Badge>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 pt-6 lg:grid-cols-3">
              {defaultMeetingInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="border-border bg-card hover:border-primary/40 flex flex-col justify-between space-y-4 rounded-xl border p-4 shadow-xs transition-colors"
                >
                  {/* Top meta: Company, Time, Buying Intent */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="border-border/60 size-9 rounded-lg border">
                          <AvatarFallback className={cn('rounded-lg text-xs font-bold', insight.avatarBg)}>
                            {insight.companyInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-foreground text-xs font-bold">{insight.company}</h4>
                          <p className="text-muted-foreground text-xs">
                            {insight.platform} · {insight.duration}
                          </p>
                        </div>
                      </div>

                      <Badge
                        wrap
                        variant="outline"
                        className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                      >
                        <Sparkles className="size-3 text-emerald-500" />
                        {insight.buyingIntentLabel}
                      </Badge>
                    </div>

                    {/* Meeting Title */}
                    <div>
                      <h5 className="text-foreground text-xs font-semibold tracking-tight">{insight.meetingTitle}</h5>
                      <p className="text-muted-foreground mt-0.5 text-xs">{insight.timeAgo}</p>
                    </div>

                    {/* Attendees Pill Group */}
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        Stakeholders & Reps
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {insight.attendees.map((att) => (
                          <span
                            key={att}
                            className="bg-muted/60 text-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs"
                          >
                            {att}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Key Takeaways */}
                    <div className="bg-muted/40 border-border/50 space-y-1.5 rounded-lg border p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground flex items-center gap-1.5 font-semibold">
                          <Bot className="text-primary size-3.5" />
                          AI Detected Sentiment
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {insight.sentimentScore}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">{insight.keyTakeaways}</p>
                    </div>

                    {/* Recommended Next Step */}
                    <div className="bg-primary/5 border-primary/20 space-y-1 rounded-lg border p-3">
                      <div className="text-primary flex items-center gap-1 text-xs font-semibold">
                        <Wand2 className="size-3.5" />
                        AI Next Recommendation
                      </div>
                      <p className="text-foreground text-xs leading-relaxed">{insight.aiRecommendedAction}</p>
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="border-border/60 flex items-center justify-between gap-2 border-t pt-2">
                    <Button size="sm" variant="default" className="min-w-0 flex-1 gap-1.5 text-xs font-medium">
                      <FileCheck className="size-3.5" />
                      {insight.primaryActionLabel}
                    </Button>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1 text-xs">
                      <Video className="size-3.5" />
                      Recording
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}

export default AiCrmPipelineDashboard
