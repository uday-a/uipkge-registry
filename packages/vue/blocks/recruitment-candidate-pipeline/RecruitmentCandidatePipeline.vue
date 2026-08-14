<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileDown,
  FileSpreadsheet,
  FileText,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

export interface CandidateCompetency {
  name: string
  score: number
  benchmark: string
}

export interface InterviewFeedback {
  interviewer: string
  role: string
  score: number
  verdict: string
  feedback: string
}

export interface CompensationModel {
  targetBase: string
  equity: string
  signOn: string
  bonus: string
  totalYear1: string
  bandStatus: string
  noticePeriod: string
}

export interface Candidate {
  id: string
  name: string
  role: string
  currentCompany: string
  location: string
  avatar: string
  initials: string
  email: string
  appliedDate: string
  stageId: 'screening' | 'technical' | 'culture' | 'offer'
  stageName: string
  stageDuration: string
  aiMatchScore: number
  overallRating: number
  reviewCount: number
  decision: 'Strong Hire' | 'Hire' | 'Pending Offer' | 'Offer Extended'
  decisionVariant: 'success' | 'default' | 'secondary' | 'warning' | 'info'
  keySkills: string[]
  aiSummary: string
  competencies: CandidateCompetency[]
  aiHighlights: string[]
  growthAreas: string[]
  interviews: InterviewFeedback[]
  compensation: CompensationModel
}

export interface PipelineStage {
  id: 'screening' | 'technical' | 'culture' | 'offer'
  title: string
  stageMetric: string
  accentColor: string
  badgeVariant: 'info' | 'default' | 'warning' | 'success'
}

const stages: PipelineStage[] = [
  {
    id: 'screening',
    title: 'Screening & AI Review',
    stageMetric: 'AI match 94%',
    accentColor: 'border-t-sky-500',
    badgeVariant: 'info',
  },
  {
    id: 'technical',
    title: 'Technical Architecture Interview',
    stageMetric: 'Scorecard 4.8/5',
    accentColor: 'border-t-indigo-500',
    badgeVariant: 'default',
  },
  {
    id: 'culture',
    title: 'Executive & Team Culture Sync',
    stageMetric: 'Strong Hire',
    accentColor: 'border-t-amber-500',
    badgeVariant: 'warning',
  },
  {
    id: 'offer',
    title: 'Offer Extended',
    stageMetric: '$240k Base + Equity · Pending',
    accentColor: 'border-t-emerald-500',
    badgeVariant: 'success',
  },
]

const candidates = ref<Candidate[]>([
  {
    id: 'cand-1',
    name: 'Elena Rostova',
    role: 'Senior Staff Design Engineer',
    currentCompany: 'Former Staff at Vercel',
    location: 'San Francisco, CA (Remote)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'ER',
    email: 'elena.rostova@designcraft.io',
    appliedDate: 'Aug 14, 2026',
    stageId: 'screening',
    stageName: 'Screening & AI Review',
    stageDuration: 'In stage for 2d',
    aiMatchScore: 96,
    overallRating: 4.9,
    reviewCount: 4,
    decision: 'Strong Hire',
    decisionVariant: 'success',
    keySkills: ['Vue 3', 'React', 'OKLCH', 'Reka UI'],
    aiSummary:
      'Exceptional system architect with proven history leading unbundled design system registries, dual-framework component parity, and headless UI primitives.',
    competencies: [
      { name: 'Component Architecture & Modularity', score: 98, benchmark: 'Top 1% candidate pool' },
      { name: 'Cross-Framework Parity (Vue 3 & React)', score: 96, benchmark: 'Top 3% candidate pool' },
      { name: 'Design Tokens & OKLCH Color Systems', score: 95, benchmark: 'Top 5% candidate pool' },
      { name: 'Micro-interactions & Spring Physics', score: 92, benchmark: 'Top 8% candidate pool' },
      { name: 'RFC Authoring & Team Mentorship', score: 94, benchmark: 'Top 4% candidate pool' },
    ],
    aiHighlights: [
      'Pioneered copy-paste unbundled component architecture serving 50k+ daily package invocations.',
      'Deep contributor to Reka UI and Radix headless accessibility layers with zero layout shifts.',
      'Championed OKLCH perceptually uniform palettes with zero contrast regressions across light & dark themes.',
    ],
    growthAreas: [
      'Prefers structured async written documentation over high-frequency sync huddles (well-aligned with remote-first culture).',
    ],
    interviews: [
      {
        interviewer: 'Alex Rivera',
        role: 'VP of Engineering',
        score: 5.0,
        verdict: 'Strong Hire',
        feedback:
          'Stunning grasp of reactivity internals, SFC compilation boundaries, and developer ergonomics. Instant technical pillar for our platform team.',
      },
      {
        interviewer: 'Sarah Chen',
        role: 'Principal Product Designer',
        score: 4.9,
        verdict: 'Strong Hire',
        feedback:
          'Pixel-perfect intuition. Deep appreciation for sub-16ms layout transitions, optical alignment, and semantic token hierarchy.',
      },
      {
        interviewer: 'Devon Vance',
        role: 'Staff Frontend Lead',
        score: 4.8,
        verdict: 'Strong Hire',
        feedback:
          'Clean API design philosophy. Strongly advocates for zero runtime bloat, tree-shakeable composables, and strict CVA variant patterns.',
      },
    ],
    compensation: {
      targetBase: '$240,000',
      equity: '$85,000 / yr (0.15% equity, 4-yr vest)',
      signOn: '$25,000',
      bonus: '$36,000 (15% target)',
      totalYear1: '$386,000',
      bandStatus: 'Within Level 7 Band ($225k – $255k)',
      noticePeriod: '2 Weeks',
    },
  },
  {
    id: 'cand-2',
    name: 'Marcus Chen',
    role: 'Senior Frontend Architect',
    currentCompany: 'Former Architect at Stripe',
    location: 'Seattle, WA (Hybrid)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'MC',
    email: 'marcus.chen@fintechcore.dev',
    appliedDate: 'Aug 12, 2026',
    stageId: 'screening',
    stageName: 'Screening & AI Review',
    stageDuration: 'In stage for 3d',
    aiMatchScore: 92,
    overallRating: 4.7,
    reviewCount: 3,
    decision: 'Hire',
    decisionVariant: 'default',
    keySkills: ['TypeScript', 'Tailwind v4', 'Accessibility', 'Turborepo'],
    aiSummary:
      'Expert in enterprise monorepo governance, automated build tooling optimization, and WCAG AA accessibility test infrastructure.',
    competencies: [
      { name: 'Component Architecture & Modularity', score: 94, benchmark: 'Top 5% candidate pool' },
      { name: 'Cross-Framework Parity (Vue 3 & React)', score: 90, benchmark: 'Top 10% candidate pool' },
      { name: 'Design Tokens & OKLCH Color Systems', score: 91, benchmark: 'Top 9% candidate pool' },
      { name: 'Micro-interactions & Spring Physics', score: 88, benchmark: 'Top 12% candidate pool' },
      { name: 'RFC Authoring & Team Mentorship', score: 95, benchmark: 'Top 3% candidate pool' },
    ],
    aiHighlights: [
      'Decreased monorepo CI build times by 54% through caching and Turborepo remote pipeline execution.',
      'Built automated accessibility testing suite with 99.8% regression catch rate across payment checkout flows.',
    ],
    growthAreas: [
      'Has spent less time with Vue 3.5 SFC script setup macros recently, mostly focused on React and Next.js.',
    ],
    interviews: [
      {
        interviewer: 'Alex Rivera',
        role: 'VP of Engineering',
        score: 4.8,
        verdict: 'Hire',
        feedback:
          'Very strong fundamentals on build systems, packaging, and high-reliability data tables under heavy load.',
      },
      {
        interviewer: 'Devon Vance',
        role: 'Staff Frontend Lead',
        score: 4.6,
        verdict: 'Hire',
        feedback: 'Solid architecture chops, great understanding of semantic token resolution and bundle footprint.',
      },
    ],
    compensation: {
      targetBase: '$230,000',
      equity: '$70,000 / yr',
      signOn: '$20,000',
      bonus: '$34,500 (15% target)',
      totalYear1: '$354,500',
      bandStatus: 'Within Level 7 Band ($225k – $255k)',
      noticePeriod: '3 Weeks',
    },
  },
  {
    id: 'cand-3',
    name: 'Siddharth Mehta',
    role: 'Principal Systems Engineer',
    currentCompany: 'Former Principal at Figma',
    location: 'New York, NY (Remote)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'SM',
    email: 'siddharth.m@figma-alumni.net',
    appliedDate: 'Aug 10, 2026',
    stageId: 'technical',
    stageName: 'Technical Architecture Interview',
    stageDuration: 'In stage for 4d',
    aiMatchScore: 95,
    overallRating: 4.9,
    reviewCount: 5,
    decision: 'Strong Hire',
    decisionVariant: 'success',
    keySkills: ['Design Systems', 'Canvas/WebGL', 'Reka UI', 'Radix'],
    aiSummary:
      'Visionary in design token compilation engines, dual-engine canvas rendering, and cross-platform design-to-code pipelines.',
    competencies: [
      { name: 'Component Architecture & Modularity', score: 97, benchmark: 'Top 2% candidate pool' },
      { name: 'Cross-Framework Parity (Vue 3 & React)', score: 93, benchmark: 'Top 6% candidate pool' },
      { name: 'Design Tokens & OKLCH Color Systems', score: 98, benchmark: 'Top 1% candidate pool' },
      { name: 'Micro-interactions & Spring Physics', score: 95, benchmark: 'Top 3% candidate pool' },
      { name: 'RFC Authoring & Team Mentorship', score: 96, benchmark: 'Top 2% candidate pool' },
    ],
    aiHighlights: [
      'Designed token transformation schema syncing design primitives directly to 6 distinct production platforms.',
      'Spearheaded low-latency viewport virtualization rendering 10k+ nodes at a constant 120 FPS.',
    ],
    growthAreas: ['Prefers deep architecture sprint focus over rapid day-to-day experimental marketing product churn.'],
    interviews: [
      {
        interviewer: 'Sarah Chen',
        role: 'Principal Product Designer',
        score: 5.0,
        verdict: 'Strong Hire',
        feedback: 'World-class understanding of designer-developer handoff, sub-layer nesting, and token semantics.',
      },
      {
        interviewer: 'Devon Vance',
        role: 'Staff Frontend Lead',
        score: 4.8,
        verdict: 'Strong Hire',
        feedback: 'Masterful architectural whiteboard session on headless state machines and zero-lockin registries.',
      },
    ],
    compensation: {
      targetBase: '$245,000',
      equity: '$90,000 / yr',
      signOn: '$30,000',
      bonus: '$36,750 (15% target)',
      totalYear1: '$401,750',
      bandStatus: 'Top of Level 7 Band ($225k – $255k)',
      noticePeriod: '4 Weeks',
    },
  },
  {
    id: 'cand-4',
    name: 'Amara Okafor',
    role: 'Lead UI Engineer',
    currentCompany: 'Former Lead UI at Linear',
    location: 'Austin, TX (Remote)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initials: 'AO',
    email: 'amara.okafor@craftwork.io',
    appliedDate: 'Aug 08, 2026',
    stageId: 'technical',
    stageName: 'Technical Architecture Interview',
    stageDuration: 'In stage for 1d',
    aiMatchScore: 91,
    overallRating: 4.8,
    reviewCount: 4,
    decision: 'Strong Hire',
    decisionVariant: 'success',
    keySkills: ['Micro-interactions', 'Vue 3.5', 'Tailwind CSS', 'Performance'],
    aiSummary:
      'Specialist in sub-16ms keyboard-first workflows, fluid spring physics, and ultra-dense desktop data layouts.',
    competencies: [
      { name: 'Component Architecture & Modularity', score: 92, benchmark: 'Top 8% candidate pool' },
      { name: 'Cross-Framework Parity (Vue 3 & React)', score: 94, benchmark: 'Top 5% candidate pool' },
      { name: 'Design Tokens & OKLCH Color Systems', score: 93, benchmark: 'Top 7% candidate pool' },
      { name: 'Micro-interactions & Spring Physics', score: 99, benchmark: 'Top 1% candidate pool' },
      { name: 'RFC Authoring & Team Mentorship', score: 90, benchmark: 'Top 10% candidate pool' },
    ],
    aiHighlights: [
      'Built gesture & spring motion system with 0 runtime jank and native 120Hz responsiveness.',
      'Created command palette keyboard navigation engine benchmarked across 2M daily power-user queries.',
    ],
    growthAreas: ['Looking to broaden direct experience in large-scale compiler and AST code generation pipelines.'],
    interviews: [
      {
        interviewer: 'Alex Rivera',
        role: 'VP of Engineering',
        score: 4.8,
        verdict: 'Strong Hire',
        feedback: 'Exceptional craft and keyboard ergonomics. Perfect fit for our design engineering culture.',
      },
      {
        interviewer: 'Sarah Chen',
        role: 'Principal Product Designer',
        score: 4.9,
        verdict: 'Strong Hire',
        feedback: 'Delightful eye for interaction states, hover intents, and subtle spring tension calibrations.',
      },
    ],
    compensation: {
      targetBase: '$235,000',
      equity: '$80,000 / yr',
      signOn: '$20,000',
      bonus: '$35,250 (15% target)',
      totalYear1: '$370,250',
      bandStatus: 'Within Level 7 Band ($225k – $255k)',
      noticePeriod: '2 Weeks',
    },
  },
  {
    id: 'cand-5',
    name: 'Lucas Vance',
    role: 'Head of Design Technology',
    currentCompany: 'Former Head of Design Tech at Ramp',
    location: 'San Francisco, CA (On-site)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    initials: 'LV',
    email: 'lucas.vance@fintechcraft.co',
    appliedDate: 'Aug 05, 2026',
    stageId: 'culture',
    stageName: 'Executive & Team Culture Sync',
    stageDuration: 'In stage for 5d',
    aiMatchScore: 94,
    overallRating: 4.9,
    reviewCount: 6,
    decision: 'Strong Hire',
    decisionVariant: 'success',
    keySkills: ['OKLCH Tokens', 'Vue 3', 'Mentorship', 'API Design'],
    aiSummary:
      'Proven team multiplier who scaled design tech teams from 0 to 18 engineers with high trust, craft rigor, and speed.',
    competencies: [
      { name: 'Component Architecture & Modularity', score: 95, benchmark: 'Top 4% candidate pool' },
      { name: 'Cross-Framework Parity (Vue 3 & React)', score: 92, benchmark: 'Top 7% candidate pool' },
      { name: 'Design Tokens & OKLCH Color Systems', score: 97, benchmark: 'Top 2% candidate pool' },
      { name: 'Micro-interactions & Spring Physics', score: 91, benchmark: 'Top 9% candidate pool' },
      { name: 'RFC Authoring & Team Mentorship', score: 98, benchmark: 'Top 1% candidate pool' },
    ],
    aiHighlights: [
      'Established engineering mentorship tracks that accelerated senior promotion velocity by 40%.',
      'Co-authored foundational RFC for unified design tokens across web, iOS, and Android clients.',
    ],
    growthAreas: [
      'Best partnered with an experienced product manager for high-velocity customer roadmap prioritization.',
    ],
    interviews: [
      {
        interviewer: 'Alex Rivera',
        role: 'VP of Engineering',
        score: 5.0,
        verdict: 'Strong Hire',
        feedback: 'Incredible leader with high EQ and deep technical chops. Immediate culture and craft multiplier.',
      },
      {
        interviewer: 'Devon Vance',
        role: 'Staff Frontend Lead',
        score: 4.8,
        verdict: 'Strong Hire',
        feedback: 'Inspiring communicator with razor-sharp code review standards and pragmatic architectural empathy.',
      },
    ],
    compensation: {
      targetBase: '$240,000',
      equity: '$85,000 / yr',
      signOn: '$25,000',
      bonus: '$36,000 (15% target)',
      totalYear1: '$386,000',
      bandStatus: 'Within Level 7 Band ($225k – $255k)',
      noticePeriod: 'Immediate',
    },
  },
  {
    id: 'cand-6',
    name: 'Sofia Lindqvist',
    role: 'Staff Design Technologist',
    currentCompany: 'Former Staff at Spotify',
    location: 'Stockholm / Remote US',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initials: 'SL',
    email: 'sofia.lindqvist@audiocraft.dev',
    appliedDate: 'Aug 01, 2026',
    stageId: 'offer',
    stageName: 'Offer Extended',
    stageDuration: 'In stage for 2d (Offer valid 5d)',
    aiMatchScore: 97,
    overallRating: 5.0,
    reviewCount: 7,
    decision: 'Offer Extended',
    decisionVariant: 'success',
    keySkills: ['Vue 3', 'React', 'Design Systems', 'Craft & Motion'],
    aiSummary:
      'Flawless all-around engineering craft leader with unanimous consensus Strong Hire across 7 cross-functional panels.',
    competencies: [
      { name: 'Component Architecture & Modularity', score: 99, benchmark: 'Top 1% candidate pool' },
      { name: 'Cross-Framework Parity (Vue 3 & React)', score: 97, benchmark: 'Top 2% candidate pool' },
      { name: 'Design Tokens & OKLCH Color Systems', score: 98, benchmark: 'Top 1% candidate pool' },
      { name: 'Micro-interactions & Spring Physics', score: 96, benchmark: 'Top 2% candidate pool' },
      { name: 'RFC Authoring & Team Mentorship', score: 97, benchmark: 'Top 2% candidate pool' },
    ],
    aiHighlights: [
      'Unanimous 5.0 consensus from all 7 hiring committee and executive interviewers.',
      'Architected component registry ecosystem servicing 600M monthly active music listeners.',
    ],
    growthAreas: ['Requires CET / US-East overlap working agreement for synchronous core team design reviews.'],
    interviews: [
      {
        interviewer: 'Alex Rivera',
        role: 'VP of Engineering',
        score: 5.0,
        verdict: 'Offer Extended',
        feedback: 'One of the finest design engineering candidates we have ever evaluated. Flawless technical review.',
      },
      {
        interviewer: 'Sarah Chen',
        role: 'Principal Product Designer',
        score: 5.0,
        verdict: 'Offer Extended',
        feedback:
          'Phenomenal partner for design teams. Completely dissolves the barrier between Figma and production code.',
      },
    ],
    compensation: {
      targetBase: '$240,000',
      equity: '$85,000 / yr (4-yr vest)',
      signOn: '$25,000',
      bonus: '$36,000 (15% target)',
      totalYear1: '$386,000',
      bandStatus: 'Offer Extended ($240k Base + Equity)',
      noticePeriod: '2 Weeks',
    },
  },
])

const selectedCandidateId = ref<string>('cand-1')

const selectedCandidate = computed(() => {
  return candidates.value.find((c) => c.id === selectedCandidateId.value) ?? candidates.value[0]
})

function selectCandidate(id: string) {
  selectedCandidateId.value = id
}

function advanceCandidate(candidateId: string) {
  const c = candidates.value.find((item) => item.id === candidateId)
  if (!c) return

  if (c.stageId === 'screening') {
    c.stageId = 'technical'
    c.stageName = 'Technical Architecture Interview'
    c.stageDuration = 'Just advanced'
  } else if (c.stageId === 'technical') {
    c.stageId = 'culture'
    c.stageName = 'Executive & Team Culture Sync'
    c.stageDuration = 'Just advanced'
  } else if (c.stageId === 'culture') {
    c.stageId = 'offer'
    c.stageName = 'Offer Extended'
    c.stageDuration = 'Offer stage initiated'
  }
}

function getCandidatesForStage(stageId: PipelineStage['id']) {
  return candidates.value.filter((c) => c.stageId === stageId)
}
</script>

<template>
  <div :class="cn('w-full space-y-6 font-sans', props.class)">
    <!-- Header Section -->
    <div
      class="bg-card text-card-foreground border-border/80 flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center"
    >
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Senior Staff Design Engineer</h1>
          <Badge variant="secondary" class="gap-1 font-medium">
            <Building2 class="text-muted-foreground size-3" />
            Engineering & Product
          </Badge>
          <Badge
            variant="outline"
            class="gap-1 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
          >
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            1 Open Headcount
          </Badge>
          <Badge variant="outline" class="text-muted-foreground hidden sm:inline-flex"> Req: #ENG-2026-08 </Badge>
        </div>
        <p class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
          <span>AI Candidate Pipeline & Interactive Talent Scorecard</span>
          <span class="text-foreground font-medium tabular-nums">48 Total Applicants</span>
          <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">6 Active in Pipeline</span>
          <span>Hiring Lead: Alex Rivera</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button variant="outline" size="sm" class="gap-1.5 shadow-xs">
          <FileDown class="size-3.5" />
          <span>Export ATS CSV</span>
        </Button>
        <Button size="sm" class="gap-1.5 shadow-xs">
          <UserPlus class="size-3.5" />
          <span>Add Candidate</span>
        </Button>
      </div>
    </div>

    <!-- 4 Recruiting KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Applicants -->
      <Card class="border-border/80 shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Total Applicants</CardTitle>
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Users class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">48</div>
            <Badge
              variant="outline"
              class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
            >
              +28% WoW
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">+14 this week · 82% qualified threshold</p>
        </CardContent>
      </Card>

      <!-- AI Resume Match Rate -->
      <Card class="border-border/80 shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">AI Resume Match Rate</CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">88.4%</div>
            <Badge
              variant="outline"
              class="border-sky-500/30 bg-sky-500/10 text-xs font-medium text-sky-600 tabular-nums dark:text-sky-400"
            >
              Top Quartile
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">Avg match score · Claude 3.7 Sonnet analysis</p>
        </CardContent>
      </Card>

      <!-- Time to Hire Velocity -->
      <Card class="border-border/80 shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Time to Hire Velocity</CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          >
            <Timer class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">18 Days</div>
            <Badge
              variant="outline"
              class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
            >
              -6d vs Q2
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">Industry benchmark: 32d avg cycle</p>
        </CardContent>
      </Card>

      <!-- Offers Extended -->
      <Card class="border-border/80 shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Offers Extended</CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <Award class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">1 Pending</div>
            <Badge
              variant="outline"
              class="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 tabular-nums dark:text-amber-400"
            >
              95% Close Prob
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">$240k base + equity package under review</p>
        </CardContent>
      </Card>
    </div>

    <!-- 4-Stage Candidate Pipeline Board -->
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-x-2">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-foreground text-base font-semibold">Active Interview Pipeline</h2>
          <Badge variant="outline" class="text-xs tabular-nums"> 6 in Progress </Badge>
        </div>
        <p class="text-muted-foreground hidden text-xs sm:block">
          Select any candidate to load their detailed AI Scorecard below
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="border-border/80 bg-muted/20 flex flex-col gap-3 rounded-xl border p-3.5"
        >
          <!-- Stage Column Header -->
          <div class="border-border/70 border-b pb-2.5">
            <div class="flex items-center justify-between gap-1.5">
              <div class="flex min-w-0 items-center gap-2">
                <span
                  :class="
                    cn(
                      'size-2 shrink-0 rounded-full',
                      stage.id === 'screening'
                        ? 'bg-sky-500'
                        : stage.id === 'technical'
                          ? 'bg-indigo-500'
                          : stage.id === 'culture'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500',
                    )
                  "
                />
                <h3 class="text-foreground truncate text-xs font-semibold" :title="stage.title">
                  {{ stage.title }}
                </h3>
              </div>
              <Badge variant="secondary" class="shrink-0 px-1.5 py-0 text-xs tabular-nums">
                {{ getCandidatesForStage(stage.id).length }}
              </Badge>
            </div>
            <div class="text-muted-foreground mt-1 flex items-center justify-between gap-x-2 text-xs">
              <span class="truncate">{{ stage.stageMetric }}</span>
            </div>
          </div>

          <!-- Candidates list in Stage -->
          <div class="flex flex-col gap-3">
            <div
              v-for="cand in getCandidatesForStage(stage.id)"
              :key="cand.id"
              :class="
                cn(
                  'group bg-card relative flex cursor-pointer flex-col gap-3 rounded-lg border p-3.5 shadow-xs transition-all duration-200',
                  selectedCandidateId === cand.id
                    ? 'border-primary ring-primary/20 bg-card shadow-sm ring-2'
                    : 'border-border/80 hover:border-border hover:shadow-sm',
                )
              "
              @click="selectCandidate(cand.id)"
            >
              <!-- Candidate Top Row: Avatar + Name + AI Match Pill -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2.5">
                  <Avatar class="border-border/80 size-9 shrink-0 border">
                    <AvatarImage :src="cand.avatar" :alt="cand.name" />
                    <AvatarFallback class="text-xs font-semibold">{{ cand.initials }}</AvatarFallback>
                  </Avatar>
                  <div class="min-w-0">
                    <h4
                      class="text-foreground group-hover:text-primary truncate text-xs font-semibold transition-colors"
                    >
                      {{ cand.name }}
                    </h4>
                    <p class="text-muted-foreground truncate text-xs">
                      {{ cand.currentCompany }}
                    </p>
                  </div>
                </div>

                <!-- AI Resume Match pill -->
                <Badge
                  variant="outline"
                  class="shrink-0 gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                >
                  <Sparkles class="size-3 text-emerald-500" />
                  <span>{{ cand.aiMatchScore }}% Match</span>
                </Badge>
              </div>

              <!-- Candidate Rating & Stage Duration -->
              <div class="flex items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-1 font-medium text-amber-500 tabular-nums">
                  <Star class="size-3 fill-amber-500 text-amber-500" />
                  <span class="text-foreground font-semibold">{{ cand.overallRating.toFixed(1) }}</span>
                  <span class="text-muted-foreground font-normal">({{ cand.reviewCount }} interviewers)</span>
                </div>
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock class="text-muted-foreground/80 size-3 shrink-0" />
                  <span class="truncate">{{ cand.stageDuration }}</span>
                </div>
              </div>

              <!-- Key Skills badges -->
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="skill in cand.keySkills"
                  :key="skill"
                  variant="secondary"
                  class="px-1.5 py-0 text-xs font-normal"
                >
                  {{ skill }}
                </Badge>
              </div>

              <!-- Card Action Buttons -->
              <div class="border-border/60 flex flex-wrap items-center gap-2 border-t pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 flex-1 justify-start gap-1 px-2 text-xs"
                  @click.stop="selectCandidate(cand.id)"
                >
                  <FileText class="size-3" />
                  <span>View Scorecard</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  class="hover:bg-primary hover:text-primary-foreground hover:border-primary h-7 gap-1 px-2 text-xs transition-colors"
                  @click.stop="advanceCandidate(cand.id)"
                >
                  <span>Advance</span>
                  <ChevronRight class="size-3" />
                </Button>
              </div>
            </div>

            <!-- Empty stage placeholder if all candidates moved -->
            <div
              v-if="getCandidatesForStage(stage.id).length === 0"
              class="border-border/80 text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
            >
              <UserCheck class="text-muted-foreground/60 mb-1 size-5" />
              <p class="text-xs font-medium">No candidates in this stage</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Candidate Detailed AI Scorecard Card / Drawer Section -->
    <Card class="border-border/80 overflow-hidden shadow-sm">
      <!-- Top Scorecard Header Bar -->
      <div class="border-border bg-muted/30 border-b p-4 sm:p-5">
        <!-- Candidate Quick Selector Bar -->
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <Sparkles class="size-4 text-emerald-500" />
            <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Candidate AI Scorecard & Interview Matrix
            </span>
          </div>

          <!-- Switcher pills for all 6 candidates -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="c in candidates"
              :key="c.id"
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedCandidateId === c.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/70 border',
                )
              "
              @click="selectCandidate(c.id)"
            >
              <span>{{ c.name }}</span>
              <span
                :class="
                  cn(
                    'py-0.2 rounded-full px-1 text-xs font-semibold tabular-nums',
                    selectedCandidateId === c.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )
                "
              >
                {{ c.aiMatchScore }}%
              </span>
            </button>
          </div>
        </div>

        <!-- Selected Candidate Bio Header -->
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div class="flex items-start gap-3.5 sm:items-center">
            <Avatar class="border-background size-12 shrink-0 border-2 shadow-xs">
              <AvatarImage :src="selectedCandidate.avatar" :alt="selectedCandidate.name" />
              <AvatarFallback class="text-sm font-semibold">{{ selectedCandidate.initials }}</AvatarFallback>
            </Avatar>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-foreground text-lg font-bold">
                  {{ selectedCandidate.name }}
                </h3>
                <Badge
                  variant="outline"
                  class="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                >
                  <Sparkles class="size-3 text-emerald-500" />
                  {{ selectedCandidate.aiMatchScore }}% AI Fit
                </Badge>
                <Badge variant="default" class="text-xs font-medium">
                  {{ selectedCandidate.decision }}
                </Badge>
              </div>

              <div class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span class="flex items-center gap-1">
                  <Briefcase class="size-3" />
                  {{ selectedCandidate.currentCompany }}
                </span>
                <span class="flex items-center gap-1">
                  <MapPin class="size-3" />
                  {{ selectedCandidate.location }}
                </span>
                <span class="flex items-center gap-1">
                  <Mail class="size-3" />
                  {{ selectedCandidate.email }}
                </span>
                <span class="flex items-center gap-1">
                  <Calendar class="size-3" />
                  Applied {{ selectedCandidate.appliedDate }}
                </span>
              </div>
            </div>
          </div>

          <!-- Header Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs shadow-xs"
              @click="advanceCandidate(selectedCandidate.id)"
            >
              <span>Advance to Next Round</span>
              <ArrowRight class="size-3.5" />
            </Button>
            <Button size="sm" class="gap-1.5 text-xs shadow-xs">
              <CheckCircle2 class="size-3.5" />
              <span>Extend Offer Letter</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Scorecard Content: 3-Column Grid -->
      <CardContent class="space-y-6 p-5">
        <!-- AI Executive Summary Banner -->
        <div
          class="flex flex-col items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 sm:flex-row"
        >
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles class="size-4.5" />
          </div>
          <div class="space-y-1">
            <h4 class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
              <span>AI Synthesized Resume & Interview Consensus</span>
              <Badge
                variant="outline"
                class="border-emerald-500/30 py-0 text-xs text-emerald-600 dark:text-emerald-400"
              >
                High Confidence (98.2%)
              </Badge>
            </h4>
            <p class="text-muted-foreground text-xs leading-relaxed">
              {{ selectedCandidate.aiSummary }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Column 1: AI Competency & Skill Radar Breakdown -->
          <div class="border-border/80 bg-card space-y-4 rounded-xl border p-4">
            <div class="flex items-center justify-between gap-x-2">
              <div>
                <h4 class="text-foreground text-xs font-semibold">Competency Scorecard</h4>
                <p class="text-muted-foreground text-xs">AI parsed technical signals</p>
              </div>
              <Badge variant="secondary" class="text-xs tabular-nums">
                {{ selectedCandidate.competencies.length }} Pillars
              </Badge>
            </div>

            <div class="space-y-3.5">
              <div v-for="comp in selectedCandidate.competencies" :key="comp.name" class="space-y-1.5">
                <div class="flex items-center justify-between gap-x-2 text-xs">
                  <span class="text-foreground truncate pr-2 font-medium" :title="comp.name">
                    {{ comp.name }}
                  </span>
                  <span class="text-foreground shrink-0 font-bold tabular-nums"> {{ comp.score }}% </span>
                </div>
                <Progress :model-value="comp.score" class="h-1.5" />
                <div class="text-muted-foreground flex items-center justify-between gap-x-2 text-xs">
                  <span class="text-xs">{{ comp.benchmark }}</span>
                </div>
              </div>
            </div>

            <Separator class="my-3" />

            <!-- AI Highlights list -->
            <div class="space-y-2">
              <h5 class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Check class="size-3.5 text-emerald-500" />
                <span>Key AI Resume Signals</span>
              </h5>
              <ul class="text-muted-foreground space-y-1.5 text-xs">
                <li
                  v-for="(highlight, idx) in selectedCandidate.aiHighlights"
                  :key="idx"
                  class="flex items-start gap-1.5"
                >
                  <span class="font-bold text-emerald-500">•</span>
                  <span>{{ highlight }}</span>
                </li>
              </ul>
            </div>

            <!-- Growth Areas / Calibration -->
            <div class="bg-muted/40 border-border/60 space-y-1.5 rounded-lg border p-3 text-xs">
              <div class="text-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck class="size-3.5 text-indigo-500" />
                <span>Interviewer Calibration Note</span>
              </div>
              <p class="text-muted-foreground leading-relaxed">
                {{ selectedCandidate.growthAreas[0] }}
              </p>
            </div>
          </div>

          <!-- Column 2: Interviewer Scorecards & Qualitative Notes -->
          <div class="border-border/80 bg-card space-y-4 rounded-xl border p-4">
            <div class="flex items-center justify-between gap-x-2">
              <div>
                <h4 class="text-foreground text-xs font-semibold">Interviewer Scorecards</h4>
                <p class="text-muted-foreground text-xs">Direct debrief ratings & feedback</p>
              </div>
              <div class="flex items-center gap-1 text-xs font-bold text-amber-500 tabular-nums">
                <Star class="size-3.5 fill-amber-500 text-amber-500" />
                <span>{{ selectedCandidate.overallRating.toFixed(1) }} / 5.0</span>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="(review, index) in selectedCandidate.interviews"
                :key="index"
                class="border-border/70 bg-muted/20 space-y-2 rounded-lg border p-3"
              >
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="text-foreground text-xs font-semibold">{{ review.interviewer }}</p>
                    <p class="text-muted-foreground text-xs">{{ review.role }}</p>
                  </div>
                  <div class="flex shrink-0 items-center gap-1.5">
                    <Badge
                      variant="outline"
                      class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      {{ review.verdict }}
                    </Badge>
                    <Badge variant="secondary" class="text-xs font-bold tabular-nums">
                      {{ review.score.toFixed(1) }} ★
                    </Badge>
                  </div>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed italic">“{{ review.feedback }}”</p>
              </div>
            </div>

            <Separator class="my-3" />

            <!-- Debrief Consensus Banner -->
            <div
              class="flex items-center justify-between gap-x-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs"
            >
              <div class="flex flex-wrap items-center gap-2">
                <UserCheck class="size-4 text-emerald-600 dark:text-emerald-400" />
                <span class="text-foreground font-medium">Hiring Committee Consensus</span>
              </div>
              <Badge
                variant="outline"
                class="border-emerald-500/30 font-semibold text-emerald-600 dark:text-emerald-400"
              >
                Unanimous Strong Hire
              </Badge>
            </div>
          </div>

          <!-- Column 3: Compensation Package & Offer Structuring -->
          <div class="border-border/80 bg-card space-y-4 rounded-xl border p-4">
            <div class="flex items-center justify-between gap-x-2">
              <div>
                <h4 class="text-foreground text-xs font-semibold">Compensation & Package Model</h4>
                <p class="text-muted-foreground text-xs">Target offer & benchmarking</p>
              </div>
              <Badge
                variant="outline"
                class="border-indigo-500/30 bg-indigo-500/10 text-xs text-indigo-600 dark:text-indigo-400"
              >
                Level 7 Band
              </Badge>
            </div>

            <div class="border-border/70 overflow-hidden rounded-lg border">
              <div class="overflow-x-auto">
                <Table>
                  <TableBody>
                    <TableRow class="hover:bg-transparent">
                      <TableCell class="text-muted-foreground py-2.5 text-xs font-medium">Target Base Salary</TableCell>
                      <TableCell class="text-foreground py-2.5 text-right text-xs font-bold tabular-nums">
                        {{ selectedCandidate.compensation.targetBase }}
                      </TableCell>
                    </TableRow>
                    <TableRow class="hover:bg-transparent">
                      <TableCell class="text-muted-foreground py-2.5 text-xs font-medium"
                        >Equity (RSUs / Grant)</TableCell
                      >
                      <TableCell class="text-foreground py-2.5 text-right text-xs font-bold tabular-nums">
                        {{ selectedCandidate.compensation.equity }}
                      </TableCell>
                    </TableRow>
                    <TableRow class="hover:bg-transparent">
                      <TableCell class="text-muted-foreground py-2.5 text-xs font-medium"
                        >Target Annual Bonus</TableCell
                      >
                      <TableCell class="text-foreground py-2.5 text-right text-xs font-bold tabular-nums">
                        {{ selectedCandidate.compensation.bonus }}
                      </TableCell>
                    </TableRow>
                    <TableRow class="hover:bg-transparent">
                      <TableCell class="text-muted-foreground py-2.5 text-xs font-medium">Sign-on Incentive</TableCell>
                      <TableCell class="text-foreground py-2.5 text-right text-xs font-bold tabular-nums">
                        {{ selectedCandidate.compensation.signOn }}
                      </TableCell>
                    </TableRow>
                    <TableRow class="bg-muted/40 hover:bg-muted/40 font-semibold">
                      <TableCell class="text-foreground py-2.5 text-xs">Target Year 1 OTE</TableCell>
                      <TableCell
                        class="py-2.5 text-right text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
                      >
                        {{ selectedCandidate.compensation.totalYear1 }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between gap-x-2 text-xs">
                <span class="text-muted-foreground">Notice Period</span>
                <span class="text-foreground font-medium tabular-nums">{{
                  selectedCandidate.compensation.noticePeriod
                }}</span>
              </div>
              <div class="flex items-center justify-between gap-x-2 text-xs">
                <span class="text-muted-foreground">Band Status</span>
                <Badge variant="secondary" class="text-xs font-normal">
                  {{ selectedCandidate.compensation.bandStatus }}
                </Badge>
              </div>
            </div>

            <Separator class="my-3" />

            <div class="flex flex-col gap-2">
              <Button size="sm" class="w-full gap-1.5 text-xs shadow-xs">
                <FileSpreadsheet class="size-3.5" />
                <span>Generate Official Offer Doc</span>
              </Button>
              <Button variant="outline" size="sm" class="w-full gap-1.5 text-xs shadow-xs">
                <Calendar class="size-3.5" />
                <span>Schedule Executive Alignment</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
