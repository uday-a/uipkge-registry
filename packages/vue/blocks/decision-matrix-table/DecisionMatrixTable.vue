<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type FrameworkType = 'weighted-matrix' | 'rice'

interface Props {
  class?: HTMLAttributes['class']
  title?: string
  subtitle?: string
  defaultFramework?: FrameworkType
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Architectural Decision Matrix (RICE / Weighted Scoring)',
  subtitle: 'Evaluate technical options against weighted business and engineering criteria.',
  defaultFramework: 'weighted-matrix',
})

export interface CriterionDef {
  key: 'impact' | 'confidence' | 'effort' | 'dx' | 'maintenance'
  label: string
  shortLabel: string
  description: string
  defaultWeight: number
  isInverted?: boolean
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
    impact: number // 1 to 5 (Engineering Impact)
    confidence: number // 1 to 5 (Confidence / Feasibility)
    effort: number // 1 to 5 (Implementation Simplicity / Low Effort)
    dx: number // 1 to 5 (DX & Consumer Ownership)
    maintenance: number // 1 to 5 (Low Maintenance Overhead)
  }
  rice: {
    reach: number // 0 to 100 (% of engineers / services)
    impact: number // 1 to 5 multiplier
    confidence: number // 50 to 100 (%)
    effort: number // 1 to 5 person-sprints
  }
  isCustom?: boolean
}

const activeFramework = ref<FrameworkType>(props.defaultFramework)
const showWeightEditor = ref(false)
const showAddOptionForm = ref(false)
const selectedOptionId = ref<string>('opt-a')

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

const criterionWeights = ref<Record<string, number>>({
  impact: 25,
  confidence: 25,
  effort: 15,
  dx: 20,
  maintenance: 15,
})

const defaultOptions: MatrixOption[] = [
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

const options = ref<MatrixOption[]>([...defaultOptions])

// Add option form state
const newOptionName = ref('')
const newOptionParadigm = ref('')
const newOptionSummary = ref('')
const newOptionScores = ref({
  impact: 4.0,
  confidence: 4.0,
  effort: 3.5,
  dx: 4.0,
  maintenance: 3.5,
})

const totalWeight = computed(() => {
  return Object.values(criterionWeights.value).reduce((sum, w) => sum + (Number(w) || 0), 0)
})

function resetWeights() {
  criteriaList.forEach((c) => {
    criterionWeights.value[c.key] = c.defaultWeight
  })
}

function resetOptions() {
  options.value = [...defaultOptions]
  selectedOptionId.value = 'opt-a'
}

function handleAddOption() {
  if (!newOptionName.value.trim()) return

  const newId = `opt-custom-${Date.now()}`
  const created: MatrixOption = {
    id: newId,
    name: newOptionName.value.trim(),
    architecture: newOptionParadigm.value.trim() || 'Custom Technical Architecture',
    summary: newOptionSummary.value.trim() || 'Custom evaluated technical approach for this architectural decision.',
    keyRisk: 'Requires comprehensive proof-of-concept testing in staging environments.',
    color: '#06b6d4',
    pros: ['Tailored to immediate domain constraints', 'Custom architectural design'],
    cons: ['Needs dedicated long-term ownership and testing framework'],
    scores: { ...newOptionScores.value },
    rice: {
      reach: 75,
      impact: newOptionScores.value.impact,
      confidence: Number((newOptionScores.value.confidence * 20).toFixed(0)),
      effort: Number((6 - newOptionScores.value.effort).toFixed(1)),
    },
    isCustom: true,
  }

  options.value.push(created)
  selectedOptionId.value = newId
  newOptionName.value = ''
  newOptionParadigm.value = ''
  newOptionSummary.value = ''
  showAddOptionForm.value = false
}

function removeOption(id: string) {
  options.value = options.value.filter((opt) => opt.id !== id)
  if (selectedOptionId.value === id) {
    selectedOptionId.value = options.value[0]?.id || ''
  }
}

// Calculations
interface ScoredOption extends MatrixOption {
  weightedScore: number
  riceScore: number
  rank: number
  verdict: 'Recommended Winner' | 'Second Choice' | 'Alternative' | 'Discarded'
  verdictVariant: 'success' | 'info' | 'warning' | 'destructive'
}

const scoredOptions = computed<ScoredOption[]>(() => {
  const sumW = totalWeight.value || 100

  // 1. Calculate raw scores
  const calculated = options.value.map((opt) => {
    // Weighted score out of 100
    const weightedSum =
      opt.scores.impact * criterionWeights.value.impact +
      opt.scores.confidence * criterionWeights.value.confidence +
      opt.scores.effort * criterionWeights.value.effort +
      opt.scores.dx * criterionWeights.value.dx +
      opt.scores.maintenance * criterionWeights.value.maintenance

    const weightedScore = Number(((weightedSum / (5 * sumW)) * 100).toFixed(1))

    // RICE calculation: (Reach * Impact * (Confidence / 100)) / Effort
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

  // 2. Sort depending on active framework
  calculated.sort((a, b) => {
    if (activeFramework.value === 'rice') {
      return b.riceScore - a.riceScore
    }
    return b.weightedScore - a.weightedScore
  })

  // 3. Assign ranks and verdicts
  return calculated.map((item, index) => {
    const rank = index + 1
    let verdict: ScoredOption['verdict'] = 'Discarded'
    let verdictVariant: ScoredOption['verdictVariant'] = 'destructive'

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
})

const winningOption = computed(() => {
  return scoredOptions.value[0] || options.value[0]
})

const activeSelectedOption = computed(() => {
  return scoredOptions.value.find((opt) => opt.id === selectedOptionId.value) || winningOption.value
})

// Radar chart SVG geometry
const radarCenter = { x: 170, y: 155 }
const radarRadius = 95
const radarAxesCount = 5

function getRadarPoint(axisIndex: number, scoreValue: number, maxVal = 5) {
  const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / radarAxesCount
  const ratio = Math.min(1, Math.max(0, scoreValue / maxVal))
  const r = radarRadius * ratio
  const x = radarCenter.x + r * Math.cos(angle)
  const y = radarCenter.y + r * Math.sin(angle)
  return { x, y }
}

function getRadarPolygon(scores: {
  impact: number
  confidence: number
  effort: number
  dx: number
  maintenance: number
}) {
  const values = [scores.impact, scores.confidence, scores.effort, scores.dx, scores.maintenance]
  return values
    .map((val, idx) => {
      const pt = getRadarPoint(idx, val)
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    })
    .join(' ')
}

function getRingPolygon(ratio: number) {
  return Array.from({ length: radarAxesCount })
    .map((_, idx) => {
      const pt = getRadarPoint(idx, ratio * 5)
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    })
    .join(' ')
}

const radarAxisLabels = [
  { index: 0, label: 'Impact', x: 170, y: 38, anchor: 'middle' },
  { index: 1, label: 'Confidence', x: 285, y: 115, anchor: 'start' },
  { index: 2, label: 'Simplicity', x: 245, y: 258, anchor: 'middle' },
  { index: 3, label: 'DX & Own', x: 95, y: 258, anchor: 'middle' },
  { index: 4, label: 'Low Maint', x: 55, y: 115, anchor: 'end' },
]

function getScoreBadgeVariant(score: number): 'success' | 'default' | 'secondary' | 'outline' {
  if (score >= 4.5) return 'success'
  if (score >= 3.5) return 'default'
  if (score >= 2.5) return 'secondary'
  return 'outline'
}
</script>

<template>
  <div data-slot="decision-matrix-table" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header: Title, Framework Selector & Action Toolbar -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="gap-1 text-xs font-semibold tracking-wide uppercase">
                <Scale class="text-primary size-3.5" />
                ADR-042 Evaluation
              </Badge>
              <Badge variant="secondary" class="text-xs"> Updated Aug 2026 </Badge>
            </div>
            <CardTitle class="text-xl font-semibold tracking-tight sm:text-2xl">
              {{ title }}
            </CardTitle>
            <CardDescription class="text-sm">
              {{ subtitle }}
            </CardDescription>
          </div>

          <!-- Framework Switcher & Quick Actions -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Framework Selector -->
            <div class="bg-muted border-border inline-flex items-center rounded-lg border p-1">
              <button
                type="button"
                :class="
                  cn(
                    'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                    activeFramework === 'weighted-matrix'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="activeFramework = 'weighted-matrix'"
              >
                Weighted Value-Risk Matrix
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                    activeFramework === 'rice'
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="activeFramework = 'rice'"
              >
                RICE Framework
              </button>
            </div>

            <!-- Weight Adjustment Toggle -->
            <Button
              v-if="activeFramework === 'weighted-matrix'"
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs"
              @click="showWeightEditor = !showWeightEditor"
            >
              <SlidersHorizontal class="text-muted-foreground size-3.5" />
              <span>Criterion Weights</span>
              <Badge
                variant="secondary"
                :class="
                  cn(
                    'ml-0.5 px-1.5 py-0 text-xs tabular-nums',
                    totalWeight === 100 ? 'text-foreground' : 'bg-warning/20 text-warning font-semibold',
                  )
                "
              >
                {{ totalWeight }}%
              </Badge>
              <ChevronDown v-if="!showWeightEditor" class="text-muted-foreground size-3" />
              <ChevronUp v-else class="text-muted-foreground size-3" />
            </Button>

            <!-- Add Option Button -->
            <Button size="sm" class="gap-1.5 text-xs font-medium" @click="showAddOptionForm = !showAddOptionForm">
              <Plus class="size-3.5" />
              <span>Add Option</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <!-- Expandable Criterion Weights Adjuster -->
      <div
        v-if="showWeightEditor && activeFramework === 'weighted-matrix'"
        class="border-border bg-muted/20 border-t px-6 py-5"
      >
        <div class="space-y-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 class="text-foreground text-sm font-semibold tracking-tight">
                Calibrate Evaluation Criteria Weights
              </h4>
              <p class="text-muted-foreground text-xs">
                Adjust criteria percentages to reflect your organization's architectural priorities.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="
                  cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
                    totalWeight === 100
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-warning/15 text-warning font-bold',
                  )
                "
              >
                <CheckCircle2 v-if="totalWeight === 100" class="size-3" />
                <AlertCircle v-else class="size-3" />
                Total Weight: {{ totalWeight }}%
              </span>
              <Button variant="ghost" size="xs" class="text-muted-foreground gap-1 text-xs" @click="resetWeights">
                <RefreshCw class="size-3" />
                Reset Defaults
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div
              v-for="criterion in criteriaList"
              :key="criterion.key"
              class="border-border bg-card space-y-2.5 rounded-lg border p-3.5 shadow-2xs"
            >
              <div class="flex items-center justify-between gap-1">
                <span class="text-foreground truncate text-xs font-semibold" :title="criterion.label">
                  {{ criterion.label }}
                </span>
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-bold tabular-nums">
                  {{ criterionWeights[criterion.key] }}%
                </span>
              </div>
              <p class="text-muted-foreground line-clamp-2 h-8 text-xs leading-tight">
                {{ criterion.description }}
              </p>
              <div class="pt-1">
                <Slider v-model="criterionWeights[criterion.key]" :min="0" :max="50" :step="5" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expandable Add Custom Proposal Form -->
      <div v-if="showAddOptionForm" class="border-border bg-muted/30 border-t px-6 py-5">
        <div class="max-w-3xl space-y-4">
          <div class="flex items-center justify-between gap-x-2">
            <h4 class="text-foreground flex items-center gap-1.5 text-sm font-semibold tracking-tight">
              <Sparkles class="text-primary size-4" />
              Add Technical Architecture Option to Matrix
            </h4>
            <Button variant="ghost" size="xs" @click="showAddOptionForm = false">Cancel</Button>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-foreground text-xs font-medium">Option Proposal Name</label>
              <Input v-model="newOptionName" placeholder="e.g. Option E: Shared UI Submodule" size="small" />
            </div>
            <div class="space-y-1">
              <label class="text-foreground text-xs font-medium">Architectural architecture</label>
              <Input v-model="newOptionParadigm" placeholder="e.g. Git Submodule & Monorepo Link" size="small" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-foreground text-xs font-medium">Executive Architectural Summary</label>
            <Input
              v-model="newOptionSummary"
              placeholder="Brief summary of distribution mechanics, bundle characteristics, and DX impact..."
              size="small"
            />
          </div>

          <div class="space-y-2">
            <label class="text-foreground text-xs font-medium">Initial Scores (1.0 to 5.0)</label>
            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              <div
                v-for="criterion in criteriaList"
                :key="criterion.key"
                class="border-border bg-card rounded-md border p-2 text-center"
              >
                <div class="text-muted-foreground truncate text-xs font-medium">{{ criterion.shortLabel }}</div>
                <div class="text-foreground mt-0.5 text-sm font-bold tabular-nums">
                  {{ newOptionScores[criterion.key] }} / 5
                </div>
                <div class="pt-1.5">
                  <Slider v-model="newOptionScores[criterion.key]" :min="1" :max="5" :step="0.5" size="small" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" @click="showAddOptionForm = false">Cancel</Button>
            <Button size="sm" :disabled="!newOptionName.trim()" @click="handleAddOption"> Add to Matrix </Button>
          </div>
        </div>
      </div>
    </Card>

    <!-- Main Scoring Matrix Table -->
    <Card class="border-border bg-card overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader class="bg-muted/50">
            <TableRow class="hover:bg-transparent">
              <TableHead class="text-muted-foreground w-[42px] px-3 text-center text-xs font-semibold">
                Rank
              </TableHead>
              <TableHead class="text-foreground min-w-[240px] text-xs font-semibold">
                Technical Option & architecture
              </TableHead>

              <!-- Dynamic Headers for Weighted Matrix vs RICE -->
              <template v-if="activeFramework === 'weighted-matrix'">
                <TableHead
                  v-for="criterion in criteriaList"
                  :key="criterion.key"
                  class="text-foreground min-w-[130px] text-center text-xs font-semibold"
                >
                  <div class="flex flex-col items-center">
                    <span>{{ criterion.shortLabel }}</span>
                    <span class="text-muted-foreground text-xs font-normal tabular-nums">
                      {{ criterionWeights[criterion.key] }}% wt
                    </span>
                  </div>
                </TableHead>
                <TableHead class="text-foreground min-w-[140px] text-center text-xs font-semibold">
                  Weighted Score
                </TableHead>
              </template>

              <template v-else>
                <TableHead class="text-foreground min-w-[110px] text-center text-xs font-semibold">
                  <div class="flex flex-col items-center">
                    <span>Reach</span>
                    <span class="text-muted-foreground text-xs font-normal">Dev Scale %</span>
                  </div>
                </TableHead>
                <TableHead class="text-foreground min-w-[110px] text-center text-xs font-semibold">
                  <div class="flex flex-col items-center">
                    <span>Impact</span>
                    <span class="text-muted-foreground text-xs font-normal">Multiplier (1-5)</span>
                  </div>
                </TableHead>
                <TableHead class="text-foreground min-w-[110px] text-center text-xs font-semibold">
                  <div class="flex flex-col items-center">
                    <span>Confidence</span>
                    <span class="text-muted-foreground text-xs font-normal">% Certainty</span>
                  </div>
                </TableHead>
                <TableHead class="text-foreground min-w-[110px] text-center text-xs font-semibold">
                  <div class="flex flex-col items-center">
                    <span>Effort</span>
                    <span class="text-muted-foreground text-xs font-normal">Sprints (1-5)</span>
                  </div>
                </TableHead>
                <TableHead class="text-foreground min-w-[130px] text-center text-xs font-semibold">
                  RICE Score
                </TableHead>
              </template>

              <TableHead class="text-foreground min-w-[160px] text-center text-xs font-semibold">
                ADR Verdict
              </TableHead>
              <TableHead class="text-muted-foreground w-[80px] text-center text-xs font-semibold"> Inspect </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="opt in scoredOptions"
              :key="opt.id"
              :class="
                cn(
                  'cursor-pointer transition-colors duration-150',
                  opt.id === selectedOptionId ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-muted/40',
                  opt.rank === 1 && 'font-medium',
                )
              "
              @click="selectedOptionId = opt.id"
            >
              <!-- Rank Column -->
              <TableCell class="px-3 text-center">
                <span
                  :class="
                    cn(
                      'inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                      opt.rank === 1
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : opt.rank === 2
                          ? 'bg-sky-500/15 font-semibold text-sky-600 dark:text-sky-400'
                          : 'bg-muted text-muted-foreground font-normal',
                    )
                  "
                >
                  {{ opt.rank }}
                </span>
              </TableCell>

              <!-- Proposal Name, architecture & Description -->
              <TableCell>
                <div class="space-y-1 py-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-foreground text-sm font-semibold tracking-tight">
                      {{ opt.name }}
                    </span>
                    <span
                      class="size-2 shrink-0 rounded-full"
                      :style="{ backgroundColor: opt.color }"
                      :title="opt.name"
                    />
                    <Badge v-if="opt.isCustom" variant="outline" class="text-xs">Custom</Badge>
                  </div>
                  <div class="text-muted-foreground text-xs font-medium">
                    {{ opt.architecture }}
                  </div>
                  <p class="text-muted-foreground/80 line-clamp-1 max-w-[220px] text-xs">
                    {{ opt.summary }}
                  </p>
                </div>
              </TableCell>

              <!-- Weighted Matrix Criteria Columns -->
              <template v-if="activeFramework === 'weighted-matrix'">
                <TableCell v-for="criterion in criteriaList" :key="criterion.key" class="text-center">
                  <div class="inline-flex flex-col items-center gap-0.5">
                    <Badge
                      :variant="getScoreBadgeVariant(opt.scores[criterion.key])"
                      class="px-2 py-0.5 text-xs font-semibold tabular-nums"
                    >
                      {{ opt.scores[criterion.key].toFixed(1) }}
                    </Badge>
                    <!-- Mini visual rating meter (5 segments) -->
                    <div class="mt-1 flex items-center gap-0.5">
                      <span
                        v-for="seg in 5"
                        :key="seg"
                        :class="
                          cn(
                            'size-1 rounded-full',
                            seg <= Math.round(opt.scores[criterion.key]) ? 'bg-primary' : 'bg-muted-foreground/20',
                          )
                        "
                      />
                    </div>
                  </div>
                </TableCell>

                <!-- Weighted Total Score Column -->
                <TableCell class="text-center">
                  <div class="inline-flex flex-col items-center gap-1">
                    <span
                      :class="
                        cn(
                          'text-base font-semibold tracking-tight tabular-nums',
                          opt.rank === 1
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : opt.weightedScore >= 70
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                        )
                      "
                    >
                      {{ opt.weightedScore }}
                      <span class="text-muted-foreground text-xs font-normal">/ 100</span>
                    </span>
                    <div class="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="
                          opt.rank === 1
                            ? 'bg-emerald-500'
                            : opt.weightedScore >= 70
                              ? 'bg-sky-500'
                              : opt.weightedScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-destructive'
                        "
                        :style="{ width: `${opt.weightedScore}%` }"
                      />
                    </div>
                  </div>
                </TableCell>
              </template>

              <!-- RICE Framework Columns -->
              <template v-else>
                <TableCell class="text-center text-xs font-semibold tabular-nums"> {{ opt.rice.reach }}% </TableCell>
                <TableCell class="text-center text-xs font-semibold tabular-nums">
                  {{ opt.rice.impact.toFixed(1) }}x
                </TableCell>
                <TableCell class="text-center text-xs font-semibold tabular-nums">
                  {{ opt.rice.confidence }}%
                </TableCell>
                <TableCell class="text-center text-xs font-semibold tabular-nums">
                  {{ opt.rice.effort.toFixed(1) }} sprints
                </TableCell>
                <TableCell class="text-center">
                  <div class="inline-flex flex-col items-center">
                    <span class="text-primary text-base font-semibold tabular-nums">
                      {{ opt.riceScore }}
                    </span>
                    <span class="text-muted-foreground text-xs font-medium">RICE Pts</span>
                  </div>
                </TableCell>
              </template>

              <!-- Verdict Column -->
              <TableCell class="text-center">
                <span
                  v-if="opt.rank === 1"
                  class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <Award class="size-3.5" />
                  Recommended Winner
                </span>
                <span
                  v-else-if="opt.rank === 2"
                  class="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400"
                >
                  <CheckCircle2 class="size-3.5" />
                  Second Choice
                </span>
                <span
                  v-else-if="opt.rank === 3"
                  class="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
                >
                  <HelpCircle class="size-3.5" />
                  Alternative
                </span>
                <span
                  v-else
                  class="border-destructive/20 bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
                >
                  <XCircle class="size-3.5" />
                  Discarded
                </span>
              </TableCell>

              <!-- Action / Remove Column -->
              <TableCell class="text-center" @click.stop>
                <Button
                  v-if="opt.isCustom"
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-destructive"
                  title="Remove Custom Option"
                  @click="removeOption(opt.id)"
                >
                  <Trash2 class="size-3.5" />
                </Button>
                <Button
                  v-else
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-foreground"
                  :title="`Inspect ${opt.name}`"
                  @click="selectedOptionId = opt.id"
                >
                  <Info class="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <CardFooter
        class="border-border bg-muted/20 text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t px-6 py-3 text-xs"
      >
        <div class="flex items-center gap-2">
          <span class="inline-block size-2 rounded-full bg-emerald-500" />
          <span>Scores normalize dynamically to a 0–100 scale based on active criteria weights.</span>
        </div>
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="xs" class="text-muted-foreground gap-1 text-xs" @click="resetOptions">
            <RefreshCw class="size-3" />
            Reset Matrix Options
          </Button>
        </div>
      </CardFooter>
    </Card>

    <!-- Tradeoff Visualizer & ADR Recommendation Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Radar Chart: Multi-Option Criteria Comparison -->
      <Card class="border-border bg-card flex flex-col shadow-xs lg:col-span-6">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-x-2">
            <div class="space-y-0.5">
              <CardTitle class="flex items-center gap-2 text-base font-semibold tracking-tight">
                <BarChart3 class="text-primary size-4" />
                Decision Tradeoff Radar
              </CardTitle>
              <CardDescription class="text-xs">
                Multi-dimensional polygon overlay comparing architectural options.
              </CardDescription>
            </div>
            <Badge variant="outline" class="text-xs font-normal">5 Axes (1-5)</Badge>
          </div>
        </CardHeader>

        <CardContent class="flex flex-1 flex-col items-center justify-center p-4">
          <!-- SVG Radar Canvas -->
          <div class="relative flex aspect-square w-full max-w-[340px] items-center justify-center">
            <svg viewBox="0 0 340 310" class="h-full w-full overflow-visible">
              <!-- Background Concentric Grid Rings -->
              <polygon
                v-for="ring in [0.2, 0.4, 0.6, 0.8, 1.0]"
                :key="ring"
                :points="getRingPolygon(ring)"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                class="text-border/50"
                :stroke-dasharray="ring === 1.0 ? 'none' : '2,2'"
              />

              <!-- Radial Axes Lines -->
              <line
                v-for="(_, idx) in Array.from({ length: radarAxesCount })"
                :key="idx"
                :x1="radarCenter.x"
                :y1="radarCenter.y"
                :x2="getRadarPoint(idx, 5).x"
                :y2="getRadarPoint(idx, 5).y"
                stroke="currentColor"
                stroke-width="1"
                class="text-border"
              />

              <!-- Polygons for Non-selected options (subtle) -->
              <template v-for="opt in scoredOptions" :key="opt.id">
                <polygon
                  v-if="opt.id !== activeSelectedOption.id"
                  :points="getRadarPolygon(opt.scores)"
                  :fill="opt.color"
                  fill-opacity="0.08"
                  :stroke="opt.color"
                  stroke-width="1.5"
                  stroke-opacity="0.45"
                  class="cursor-pointer transition-all duration-300"
                  @click="selectedOptionId = opt.id"
                />
              </template>

              <!-- Polygon for Selected Option (Prominent Highlight) -->
              <polygon
                :points="getRadarPolygon(activeSelectedOption.scores)"
                :fill="activeSelectedOption.color"
                fill-opacity="0.25"
                :stroke="activeSelectedOption.color"
                stroke-width="2.5"
                class="transition-all duration-300"
              />

              <!-- Vertex Dots for Selected Option -->
              <circle
                v-for="(val, idx) in [
                  activeSelectedOption.scores.impact,
                  activeSelectedOption.scores.confidence,
                  activeSelectedOption.scores.effort,
                  activeSelectedOption.scores.dx,
                  activeSelectedOption.scores.maintenance,
                ]"
                :key="idx"
                :cx="getRadarPoint(idx, val).x"
                :cy="getRadarPoint(idx, val).y"
                r="4"
                :fill="activeSelectedOption.color"
                class="stroke-background stroke-2 transition-all duration-300"
              />

              <!-- Axis Labels -->
              <text
                v-for="axis in radarAxisLabels"
                :key="axis.index"
                :x="axis.x"
                :y="axis.y"
                :text-anchor="axis.anchor"
                class="fill-foreground text-xs font-semibold select-none"
                style="font-size: 11px"
              >
                {{ axis.label }}
              </text>
            </svg>
          </div>

          <!-- Radar Chart Legend -->
          <div class="border-border flex w-full flex-wrap items-center justify-center gap-3 border-t pt-3">
            <button
              v-for="opt in scoredOptions"
              :key="opt.id"
              type="button"
              :class="
                cn(
                  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-all',
                  opt.id === activeSelectedOption.id
                    ? 'bg-muted text-foreground ring-border font-semibold ring-1'
                    : 'text-muted-foreground hover:text-foreground opacity-80',
                )
              "
              @click="selectedOptionId = opt.id"
            >
              <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: opt.color }" />
              <span class="max-w-[120px] truncate">{{ opt.name.split(':')[0] }}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Architectural Consensus & Tradeoff Detail Card -->
      <Card class="border-border bg-card flex flex-col justify-between shadow-xs lg:col-span-6">
        <CardHeader class="pb-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="outline" class="text-xs">Selected Option Details</Badge>
                <Badge
                  :variant="activeSelectedOption.verdictVariant === 'success' ? 'success' : 'secondary'"
                  class="text-xs font-semibold"
                >
                  {{ activeSelectedOption.verdict }}
                </Badge>
              </div>
              <CardTitle class="text-foreground text-lg font-semibold tracking-tight">
                {{ activeSelectedOption.name }}
              </CardTitle>
              <CardDescription class="text-primary text-xs font-medium">
                {{ activeSelectedOption.architecture }}
              </CardDescription>
            </div>
            <div class="shrink-0 text-right">
              <div class="text-foreground text-2xl font-semibold tabular-nums">
                {{ activeFramework === 'rice' ? activeSelectedOption.riceScore : activeSelectedOption.weightedScore }}
              </div>
              <div class="text-muted-foreground text-xs">
                {{ activeFramework === 'rice' ? 'RICE Score' : 'Weighted Total' }}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 text-xs">
          <!-- Summary paragraph -->
          <p class="text-muted-foreground text-sm leading-relaxed">
            {{ activeSelectedOption.summary }}
          </p>

          <Separator />

          <!-- Pros & Cons Grid -->
          <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <!-- Architectural Pros -->
            <div class="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <span class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check class="size-3.5" />
                Strategic Advantages
              </span>
              <ul class="text-muted-foreground space-y-1.5">
                <li v-for="(pro, idx) in activeSelectedOption.pros" :key="idx" class="flex items-start gap-1.5">
                  <span class="mt-0.5 text-emerald-500">•</span>
                  <span>{{ pro }}</span>
                </li>
              </ul>
            </div>

            <!-- Architectural Cons & Risks -->
            <div class="border-destructive/20 bg-destructive/5 space-y-2 rounded-lg border p-3">
              <span class="text-destructive flex items-center gap-1.5 text-xs font-semibold">
                <AlertCircle class="size-3.5" />
                Compromises & Friction
              </span>
              <ul class="text-muted-foreground space-y-1.5">
                <li v-for="(con, idx) in activeSelectedOption.cons" :key="idx" class="flex items-start gap-1.5">
                  <span class="text-destructive mt-0.5">•</span>
                  <span>{{ con }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Risk Mitigation -->
          <div class="border-border bg-muted/40 space-y-1 rounded-md border p-3">
            <span class="text-foreground flex items-center gap-1.5 font-semibold">
              <ShieldCheck class="text-primary size-3.5" />
              Risk Mitigation & Governance Policy:
            </span>
            <p class="text-muted-foreground">
              {{ activeSelectedOption.keyRisk }}
            </p>
          </div>
        </CardContent>

        <CardFooter class="border-border bg-muted/20 flex items-center justify-between gap-x-2 border-t px-6 py-3">
          <div class="flex items-center gap-2">
            <FileCode2 class="text-muted-foreground size-4" />
            <span class="text-muted-foreground text-xs font-medium">ADR Record Consensus: </span>
            <span class="text-foreground text-xs font-semibold">{{
              winningOption.name.split(':')[1] || winningOption.name
            }}</span>
          </div>
          <Badge variant="outline" class="gap-1 text-xs">
            <Award class="size-3 text-emerald-500" />
            Rank #{{ activeSelectedOption.rank }}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
