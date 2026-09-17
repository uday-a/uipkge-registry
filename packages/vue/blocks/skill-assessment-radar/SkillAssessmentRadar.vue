<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  Award,
  CheckCircle2,
  Code2,
  Compass,
  Eye,
  FileDown,
  GraduationCap,
  Layers,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

interface DomainBenchmark {
  id: string
  title: string
  score: number
  percentile: string
  percentileLabel: string
  benchmarkScore: number
  delta: string
  description: string
  icon: typeof Layers
  accentColor: string
}

interface CompetencyMetric {
  id: string
  name: string
  description: string
  userScore: number
  benchmarkScore: number
  masteryLevel: 'Expert' | 'Advanced' | 'Proficient'
  masteryVariant: 'success' | 'default' | 'secondary'
  deltaLabel: string
  percentile: string
}

interface LearningCourse {
  id: string
  gapTarget: string
  currentScore: string
  targetScore: string
  title: string
  provider: string
  duration: string
  priority: 'High' | 'Medium' | 'Refinement'
  priorityVariant: 'warning' | 'default' | 'secondary'
  syllabus: string[]
  buttonText: string
}

interface RadarAxis {
  label: string
  shortLabel: string
  userScore: number
  benchmarkScore: number
}

const domainBenchmarks: DomainBenchmark[] = [
  {
    id: 'frontend-architecture',
    title: 'Frontend Architecture',
    score: 92,
    percentile: 'Top 5% percentile',
    percentileLabel: '95th Percentile',
    benchmarkScore: 74,
    delta: '+18% vs Benchmark',
    description: 'Component decoupling, polymorphic primitives, headless state machines, and micro-frontend isolation.',
    icon: Layers,
    accentColor: 'text-emerald-500',
  },
  {
    id: 'typescript-typing',
    title: 'TypeScript & Typing',
    score: 88,
    percentile: 'Top 8% percentile',
    percentileLabel: '92nd Percentile',
    benchmarkScore: 68,
    delta: '+20% vs Benchmark',
    description:
      'Advanced mapped types, conditional generics, discriminated unions, and compile-time contract enforcement.',
    icon: Code2,
    accentColor: 'text-sky-500',
  },
  {
    id: 'accessibility-wcag',
    title: 'Web Accessibility & WCAG',
    score: 95,
    percentile: 'Top 2% percentile',
    percentileLabel: '98th Percentile',
    benchmarkScore: 61,
    delta: '+34% vs Benchmark',
    description: 'WCAG 2.2 AAA compliance, keyboard focus rings, ARIA live regions, and screen reader UX verification.',
    icon: Eye,
    accentColor: 'text-indigo-500',
  },
  {
    id: 'performance-vitals',
    title: 'Performance & Core Web Vitals',
    score: 82,
    percentile: 'Top 14% percentile',
    percentileLabel: '86th Percentile',
    benchmarkScore: 65,
    delta: '+17% vs Benchmark',
    description: 'Sub-50ms INP optimization, bundle treeshaking, zero-layout-shift rendering, and island hydration.',
    icon: Zap,
    accentColor: 'text-amber-500',
  },
]

const competencyBreakdown: CompetencyMetric[] = [
  {
    id: 'reka-primitives',
    name: 'Polymorphic Reka Primitives',
    description: 'Polymorphic asChild composition, headless accessibility, slot delegation, and forwardRef contracts.',
    userScore: 94,
    benchmarkScore: 70,
    masteryLevel: 'Expert',
    masteryVariant: 'success',
    deltaLabel: '+24% Lead',
    percentile: '96th percentile',
  },
  {
    id: 'oklch-tokens',
    name: 'OKLCH Token Systems',
    description: 'Perceptually uniform color spaces, light/dark contrast mapping, and dynamic theme token cascades.',
    userScore: 96,
    benchmarkScore: 64,
    masteryLevel: 'Expert',
    masteryVariant: 'success',
    deltaLabel: '+32% Lead',
    percentile: '99th percentile',
  },
  {
    id: 'ssr-hydration',
    name: 'SSR & Hydration Safety',
    description: 'Isomorphic DOM execution, hydration mismatch prevention, and cookie-aware theme providers.',
    userScore: 86,
    benchmarkScore: 68,
    masteryLevel: 'Advanced',
    masteryVariant: 'default',
    deltaLabel: '+18% Lead',
    percentile: '88th percentile',
  },
  {
    id: 'headless-state',
    name: 'Headless State Machines',
    description: 'Deterministic state transitions, keyboard navigation focus rings, and roving tabindex traps.',
    userScore: 90,
    benchmarkScore: 62,
    masteryLevel: 'Expert',
    masteryVariant: 'success',
    deltaLabel: '+28% Lead',
    percentile: '93rd percentile',
  },
  {
    id: 'design-governance',
    name: 'Design System Governance',
    description:
      'Component deprecation lifecycles, semantic token versioning, and zero-dependency registry boundaries.',
    userScore: 88,
    benchmarkScore: 72,
    masteryLevel: 'Advanced',
    masteryVariant: 'default',
    deltaLabel: '+16% Lead',
    percentile: '91st percentile',
  },
  {
    id: 'micro-frontends',
    name: 'Micro-Frontend Routing',
    description: 'Module federation, dynamic remote isolation, and zero-downtime micro-app orchestration.',
    userScore: 78,
    benchmarkScore: 66,
    masteryLevel: 'Proficient',
    masteryVariant: 'secondary',
    deltaLabel: '+12% Lead',
    percentile: '79th percentile',
  },
]

const radarAxes: RadarAxis[] = [
  { label: 'Frontend Architecture', shortLabel: 'Architecture', userScore: 92, benchmarkScore: 74 },
  { label: 'TypeScript & Typing', shortLabel: 'TypeScript', userScore: 88, benchmarkScore: 68 },
  { label: 'Web Accessibility & WCAG', shortLabel: 'Accessibility', userScore: 95, benchmarkScore: 61 },
  { label: 'Performance & Vitals', shortLabel: 'Performance', userScore: 82, benchmarkScore: 65 },
  { label: 'Headless State Machines', shortLabel: 'State Machines', userScore: 90, benchmarkScore: 62 },
  { label: 'Design System Governance', shortLabel: 'Governance', userScore: 88, benchmarkScore: 72 },
]

const learningCourses: LearningCourse[] = [
  {
    id: 'course-1',
    gapTarget: 'Micro-Frontend Routing',
    currentScore: '78%',
    targetScore: '95%',
    title: 'Enterprise Module Federation & Micro-App Orchestration',
    provider: 'UIPKGE Systems Architecture Guild',
    duration: '4.5 Hours · 6 Deep-Dive Labs',
    priority: 'High',
    priorityVariant: 'warning',
    syllabus: [
      'Bidirectional dependency sharing & version collision isolation',
      'Cross-micro-app state synchronization without global window leakage',
      'Canary deployment pipelines with zero-downtime remote rollbacks',
    ],
    buttonText: 'Enroll Pathway',
  },
  {
    id: 'course-2',
    gapTarget: 'Performance & Core Web Vitals',
    currentScore: '82%',
    targetScore: '96%',
    title: 'Sub-50ms Interaction to Next Paint (INP) & Chrome Profiling',
    provider: 'Web Performance & Engine Guild',
    duration: '3.0 Hours · 4 Profile Traces',
    priority: 'Medium',
    priorityVariant: 'default',
    syllabus: [
      'Main-thread cooperative yielding using scheduler.yield() primitives',
      'Compositor layer diagnostics & forced synchronous layout avoidance',
      'Fine-grained virtualized rendering and selective component reconciliation',
    ],
    buttonText: 'Start Module',
  },
  {
    id: 'course-3',
    gapTarget: 'SSR & Hydration Safety',
    currentScore: '86%',
    targetScore: '98%',
    title: 'Isomorphic State Engines & Streaming SSR Mechanics',
    provider: 'Modern Frontend Systems Lab',
    duration: '5.0 Hours · 8 Architecture Blueprints',
    priority: 'Refinement',
    priorityVariant: 'secondary',
    syllabus: [
      'Zero-mismatch server state serialization & client reconciliation',
      'Streaming HTML chunking & out-of-order Suspense boundaries',
      'Edge worker execution models and cookie-aware cache sharding',
    ],
    buttonText: 'Explore Syllabus',
  },
]

// Radar chart SVG geometry calculations
const radarCenter = { x: 180, y: 160 }
const radarRadius = 105
const totalAxes = radarAxes.length

function getPolygonPoint(index: number, score: number, maxScore = 100) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / totalAxes
  const ratio = Math.min(1, Math.max(0, score / maxScore))
  const r = radarRadius * ratio
  const x = radarCenter.x + r * Math.cos(angle)
  const y = radarCenter.y + r * Math.sin(angle)
  return { x, y }
}

function getPolygonPointsString(scores: number[]) {
  return scores
    .map((score, index) => {
      const pt = getPolygonPoint(index, score)
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    })
    .join(' ')
}

function getRingPolygonString(ringRatio: number) {
  return radarAxes
    .map((_, index) => {
      const pt = getPolygonPoint(index, ringRatio * 100)
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    })
    .join(' ')
}

const candidateScores = radarAxes.map((a) => a.userScore)
const benchmarkScores = radarAxes.map((a) => a.benchmarkScore)

const candidatePolygon = getPolygonPointsString(candidateScores)
const benchmarkPolygon = getPolygonPointsString(benchmarkScores)

const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0]

const axisLabels = [
  { index: 0, x: 180, y: 32, anchor: 'middle' },
  { index: 1, x: 286, y: 104, anchor: 'start' },
  { index: 2, x: 286, y: 224, anchor: 'start' },
  { index: 3, x: 180, y: 294, anchor: 'middle' },
  { index: 4, x: 74, y: 224, anchor: 'end' },
  { index: 5, x: 74, y: 104, anchor: 'end' },
]
</script>

<template>
  <div data-slot="skill-assessment-radar" :class="cn('w-full space-y-6', props.class)">
    <!-- Header: Profile Summary, Assessment Date, Overall Score & PDF Download -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <!-- Candidate Identity & Proctor Info -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar class="border-border size-16 shrink-0 border sm:size-20">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h2>
                <Badge variant="secondary" class="font-medium">Senior Frontend Engineer</Badge>
              </div>
              <p class="text-muted-foreground text-sm">
                Platform Architecture · Design Systems & Headless UI Specialization
              </p>
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <Badge variant="outline" class="gap-1.5 text-xs font-normal">
                  <ShieldCheck class="size-3.5 text-emerald-500" />
                  Verified on Aug 21, 2026
                </Badge>
                <Separator orientation="vertical" class="hidden h-3.5 sm:block" />
                <span class="text-muted-foreground text-xs">
                  Proctored Evaluation ID:
                  <strong class="text-foreground font-medium tabular-nums">#UIP-8849-FE</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Overall Proficiency Badge & PDF Download -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div class="flex flex-col items-start gap-1 lg:items-end">
              <Badge variant="success" class="gap-1.5 px-3.5 py-1.5 text-sm font-semibold shadow-xs">
                <Sparkles class="size-4 shrink-0 text-emerald-500" />
                <span>Level 4 - Expert · 88 / 100</span>
              </Badge>
              <span class="text-muted-foreground text-xs font-medium">
                Top 4% Global Engineering Percentile (n = 14,820)
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button aria-label="Download attachment" variant="outline" size="sm" class="gap-2 shadow-xs">
                <FileDown class="size-4" />
                <span>Download Skill Transcript PDF</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                class="text-muted-foreground hover:text-foreground size-8"
                aria-label="Share skill transcript verification link"
              >
                <Share2 class="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 4 Domain Benchmark Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="domain in domainBenchmarks"
        :key="domain.id"
        class="border-border bg-card flex flex-col justify-between shadow-xs"
      >
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <div
                class="bg-muted border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <component :is="domain.icon" :class="cn('size-4', domain.accentColor)" />
              </div>
              <CardTitle class="text-muted-foreground truncate text-xs font-medium">{{ domain.title }}</CardTitle>
            </div>
            <Badge variant="success" class="shrink-0 text-xs font-medium">
              {{ domain.percentile }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 pt-1">
          <div>
            <div class="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                  {{ domain.score }}%
                </span>
                <span class="text-muted-foreground text-xs font-normal">Proficiency</span>
              </div>
              <div class="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp class="size-3" />
                <span class="tabular-nums">{{ domain.delta }}</span>
              </div>
            </div>
            <Progress :model-value="domain.score" class="h-1.5 w-full" />
          </div>

          <div class="border-border/60 border-t pt-2.5 text-xs">
            <div class="text-muted-foreground flex items-center justify-between gap-x-2">
              <span>Senior Cohort Benchmark:</span>
              <span class="text-foreground font-semibold tabular-nums">{{ domain.benchmarkScore }}%</span>
            </div>
            <p class="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">{{ domain.description }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Skill Radar Chart & Telemetry Synthesis Strip -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Radar Spider Graphic Card (7 Cols) -->
      <Card class="border-border bg-card shadow-xs lg:col-span-7">
        <CardHeader class="pb-2">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle class="text-base font-semibold">Proficiency Radar Telemetry</CardTitle>
              <CardDescription class="text-xs">
                Multi-axis radial polygon comparing candidate proficiency against senior baseline across 6 dimensions.
              </CardDescription>
            </div>
            <Badge variant="outline" class="w-fit gap-1 text-xs font-normal">
              <Compass class="text-primary size-3" />
              <span>6 Axis Calibration</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-2">
          <!-- SVG Spider Radar Chart -->
          <div class="relative flex w-full items-center justify-center overflow-hidden py-2">
            <svg
              class="h-72 w-full max-w-md overflow-visible sm:h-80"
              viewBox="0 0 360 320"
              aria-label="Radar chart showing candidate scores vs industry benchmark across 6 competencies"
            >
              <defs>
                <!-- Candidate Gradient Fill -->
                <radialGradient id="candidate-grad-vue" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="var(--color-emerald-500, #10b981)" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="var(--color-emerald-500, #10b981)" stop-opacity="0.10" />
                </radialGradient>
              </defs>

              <!-- Concentric Background Grid Rings -->
              <polygon
                v-for="ring in gridRings"
                :key="ring"
                :points="getRingPolygonString(ring)"
                fill="none"
                stroke="currentColor"
                class="text-border/60"
                :stroke-width="ring === 1.0 ? '1.5' : '1'"
                :stroke-dasharray="ring === 1.0 ? 'none' : '3 3'"
              />

              <!-- Radial Spoke Lines -->
              <line
                v-for="(_, index) in radarAxes"
                :key="`spoke-${index}`"
                :x1="radarCenter.x"
                :y1="radarCenter.y"
                :x2="getPolygonPoint(index, 100).x"
                :y2="getPolygonPoint(index, 100).y"
                stroke="currentColor"
                class="text-border/60"
                stroke-width="1"
              />

              <!-- Ring Percentage Label (Vertical Center Axis) -->
              <text
                v-for="ring in [0.4, 0.8]"
                :key="`ring-text-${ring}`"
                :x="radarCenter.x + 4"
                :y="radarCenter.y - radarRadius * ring + 10"
                class="fill-muted-foreground text-xs tabular-nums"
              >
                {{ ring * 100 }}%
              </text>

              <!-- Industry Benchmark Polygon (Dashed Gray) -->
              <polygon
                :points="benchmarkPolygon"
                fill="currentColor"
                class="text-muted-foreground/10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              />

              <!-- Candidate Polygon (Emerald Filled) -->
              <polygon
                :points="candidatePolygon"
                fill="url(#candidate-grad-vue)"
                stroke="var(--color-emerald-500, #10b981)"
                stroke-width="2.5"
                stroke-linejoin="round"
              />

              <!-- Candidate Vertex Marker Points -->
              <circle
                v-for="(score, index) in candidateScores"
                :key="`vertex-${index}`"
                :cx="getPolygonPoint(index, score).x"
                :cy="getPolygonPoint(index, score).y"
                r="3.5"
                class="stroke-background fill-emerald-500"
                stroke-width="1.5"
              />

              <!-- Outer Axis Labels -->
              <text
                v-for="label in axisLabels"
                :key="`label-${label.index}`"
                :x="label.x"
                :y="label.y"
                :text-anchor="label.anchor"
                class="fill-foreground text-xs font-medium"
              >
                {{ radarAxes[label.index].shortLabel }}
                <tspan class="fill-emerald-600 font-semibold tabular-nums dark:fill-emerald-400">
                  ({{ radarAxes[label.index].userScore }}%)
                </tspan>
              </text>
            </svg>
          </div>

          <!-- Radar Chart Legend -->
          <div class="border-border/60 mt-3 flex flex-wrap items-center justify-center gap-6 border-t pt-3 text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <span class="size-3 rounded-full bg-emerald-500 shadow-xs" />
              <span class="text-foreground font-medium">Candidate Score: Elena Rostova (88.8% Avg)</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="border-muted-foreground/60 bg-muted size-3 rounded-full border border-dashed" />
              <span class="text-muted-foreground">Industry Senior Cohort Baseline (67.0% Avg)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Percentile & Assessment Calibration Summary (5 Cols) -->
      <Card class="border-border bg-card flex flex-col justify-between shadow-xs lg:col-span-5">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-x-2">
            <CardTitle class="text-base font-semibold">Percentile & Calibration Report</CardTitle>
            <Badge variant="outline" class="gap-1 text-xs font-normal">
              <Award class="size-3.5 text-emerald-500" />
              <span>Staff Ready</span>
            </Badge>
          </div>
          <CardDescription class="text-xs">
            Synthesized assessment diagnostic based on 12 proctored test suites and coding scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Summary Key Data Points -->
          <div class="space-y-2.5">
            <div
              class="bg-muted/40 border-border/80 flex items-center justify-between gap-x-2 rounded-lg border p-3 text-xs"
            >
              <div class="flex flex-wrap items-center gap-2">
                <Target class="text-primary size-4 shrink-0" />
                <span class="text-muted-foreground font-medium">Highest Skill Domain:</span>
              </div>
              <span class="text-foreground font-semibold">Web Accessibility (95%) · Top 2%</span>
            </div>

            <div
              class="bg-muted/40 border-border/80 flex items-center justify-between gap-x-2 rounded-lg border p-3 text-xs"
            >
              <div class="flex flex-wrap items-center gap-2">
                <Compass class="size-4 shrink-0 text-amber-500" />
                <span class="text-muted-foreground font-medium">Primary Growth Delta:</span>
              </div>
              <span class="text-foreground font-semibold">Micro-Frontends (78%) · Top 21%</span>
            </div>

            <div
              class="bg-muted/40 border-border/80 flex items-center justify-between gap-x-2 rounded-lg border p-3 text-xs"
            >
              <div class="flex flex-wrap items-center gap-2">
                <ShieldCheck class="size-4 shrink-0 text-emerald-500" />
                <span class="text-muted-foreground font-medium">Proctor Verification Integrity:</span>
              </div>
              <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">99.4% Full Trust</span>
            </div>
          </div>

          <!-- Percentile Distribution Meter -->
          <div class="border-border/60 space-y-2 border-t pt-3">
            <div class="flex items-center justify-between gap-x-2 text-xs">
              <span class="text-muted-foreground font-medium">Global Percentile Placement</span>
              <span class="text-foreground font-bold tabular-nums">96th Percentile</span>
            </div>
            <div class="bg-muted border-border/80 relative h-3 w-full overflow-hidden rounded-full border">
              <!-- Tier 1: Proficient (0-50%) -->
              <div class="bg-muted-foreground/15 absolute inset-y-0 left-0 w-1/2" />
              <!-- Tier 2: Advanced (50-80%) -->
              <div class="absolute inset-y-0 left-1/2 w-[30%] bg-sky-500/20" />
              <!-- Tier 3: Expert (80-100%) -->
              <div class="absolute inset-y-0 right-0 w-[20%] bg-emerald-500/30" />
              <!-- Marker for Elena (96%) -->
              <div
                class="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-emerald-500 shadow-xs ring-2 ring-emerald-500/40"
                style="left: 96%"
              />
            </div>
            <div class="text-muted-foreground flex items-center justify-between gap-x-2 text-xs tabular-nums">
              <span>50th (Mid)</span>
              <span>80th (Senior)</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">96th (Elena)</span>
              <span>99th (Staff)</span>
            </div>
          </div>

          <!-- Assessment Transcript Metadata -->
          <div class="bg-muted/30 border-border text-muted-foreground rounded-lg border p-3 text-xs leading-relaxed">
            Elena demonstrated outstanding mastery in accessibility tree construction, OKLCH theme token isolation, and
            deterministic state management. Enrolling in the Micro-Frontend pathway will bridge remaining Staff-level
            requirements.
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Competency Breakdown Multi-Bar Matrix -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Competency Breakdown Multi-Bar Matrix</CardTitle>
            <CardDescription class="text-xs">
              Direct comparison of candidate skill scores against industry senior baseline with mastery classifications.
            </CardDescription>
          </div>
          <Badge variant="outline" class="w-fit text-xs font-normal tabular-nums">
            6 Technical Competencies Evaluated
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Table for Desktop & Tablet, Structured Cards for Mobile -->
        <div class="border-border overflow-hidden rounded-lg border">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader class="bg-muted/50">
                <TableRow>
                  <TableHead class="text-xs">Competency & Technical Scope</TableHead>
                  <TableHead class="w-28 text-center text-xs">Mastery Level</TableHead>
                  <TableHead class="w-64 text-xs">Candidate vs Industry Benchmark</TableHead>
                  <TableHead class="w-28 text-right text-xs">Score Delta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="comp in competencyBreakdown" :key="comp.id">
                  <!-- Competency Name & Scope -->
                  <TableCell class="py-3.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-semibold">{{ comp.name }}</p>
                      <p class="text-muted-foreground line-clamp-1 text-xs">{{ comp.description }}</p>
                    </div>
                  </TableCell>

                  <!-- Mastery Badge -->
                  <TableCell class="py-3.5 text-center">
                    <Badge :variant="comp.masteryVariant" class="text-xs font-medium">
                      {{ comp.masteryLevel }}
                    </Badge>
                  </TableCell>

                  <!-- Dual Multi-Bar Progress -->
                  <TableCell class="py-3.5">
                    <div class="space-y-1.5">
                      <!-- Candidate Bar -->
                      <div class="space-y-1">
                        <div class="flex items-center justify-between gap-x-2 text-xs">
                          <span class="text-muted-foreground font-medium">Elena:</span>
                          <span class="text-foreground font-bold tabular-nums">{{ comp.userScore }}%</span>
                        </div>
                        <Progress
                          :model-value="comp.userScore"
                          class="h-1.5 w-full [&_[data-slot=progress-indicator]]:bg-emerald-500"
                        />
                      </div>

                      <!-- Industry Benchmark Bar -->
                      <div class="space-y-1">
                        <div class="flex items-center justify-between gap-x-2 text-xs">
                          <span class="text-muted-foreground">Benchmark:</span>
                          <span class="text-muted-foreground font-medium tabular-nums">{{ comp.benchmarkScore }}%</span>
                        </div>
                        <Progress
                          :model-value="comp.benchmarkScore"
                          class="bg-muted-foreground/15 [&_[data-slot=progress-indicator]]:bg-muted-foreground/60 h-1 w-full"
                        />
                      </div>
                    </div>
                  </TableCell>

                  <!-- Delta Lead Badge -->
                  <TableCell class="py-3.5 text-right">
                    <div class="flex flex-col items-end gap-0.5">
                      <Badge
                        variant="outline"
                        class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                      >
                        {{ comp.deltaLabel }}
                      </Badge>
                      <span class="text-muted-foreground text-xs tabular-nums">{{ comp.percentile }}</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Recommended Next Courses & Skill Gaps Card (3 targeted modules) -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <div class="flex flex-wrap items-center gap-2">
              <GraduationCap class="text-primary size-5" />
              <CardTitle class="text-base font-semibold">
                Recommended Next Courses & Personalized Learning Pathways
              </CardTitle>
            </div>
            <CardDescription class="text-xs">
              Targeted modules calibrated to close identified skill gaps and elevate proficiency into the Top 1% Staff
              Master tier.
            </CardDescription>
          </div>
          <Badge variant="secondary" class="w-fit text-xs font-normal"> 3 High-Impact Pathways </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            v-for="course in learningCourses"
            :key="course.id"
            class="bg-muted/30 border-border hover:border-border/80 flex flex-col justify-between space-y-4 rounded-lg border p-4.5 transition-colors"
          >
            <div class="space-y-3">
              <!-- Gap Identifier Strip -->
              <div class="flex items-center justify-between gap-2">
                <Badge
                  :variant="course.priorityVariant === 'warning' ? 'warning' : 'outline'"
                  class="text-xs font-normal"
                >
                  Gap Target: {{ course.gapTarget }}
                </Badge>
                <span class="text-muted-foreground text-xs font-medium tabular-nums">
                  {{ course.currentScore }} → <strong class="text-foreground">{{ course.targetScore }}</strong>
                </span>
              </div>

              <!-- Course Title & Meta -->
              <div class="space-y-1">
                <h3 class="text-foreground text-sm leading-snug font-semibold">{{ course.title }}</h3>
                <p class="text-muted-foreground text-xs">{{ course.provider }} · {{ course.duration }}</p>
              </div>

              <Separator />

              <!-- Actionable Syllabus Highlights -->
              <div class="space-y-2">
                <span class="text-muted-foreground text-xs font-medium">Core Learning Objectives:</span>
                <ul class="text-muted-foreground space-y-1.5 text-xs">
                  <li v-for="(item, idx) in course.syllabus" :key="idx" class="flex items-start gap-1.5">
                    <CheckCircle2 class="text-primary mt-0.5 size-3.5 shrink-0" />
                    <span class="leading-relaxed">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Enrollment Action Button -->
            <div class="border-border/60 border-t pt-3">
              <Button
                :variant="course.priorityVariant === 'warning' ? 'default' : 'outline'"
                size="sm"
                class="w-full gap-2 shadow-xs"
              >
                <Play class="size-3.5" />
                <span>{{ course.buttonText }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
