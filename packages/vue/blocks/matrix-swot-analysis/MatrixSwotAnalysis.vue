<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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

interface Props {
  title?: string
  project?: string
  lastUpdated?: string
  initialStrengths?: SwotItem[]
  initialWeaknesses?: SwotItem[]
  initialOpportunities?: SwotItem[]
  initialThreats?: SwotItem[]
  initiatives?: StrategicInitiative[]
  readonly?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: 'SWOT Strategic Analysis Canvas',
  project: 'UIPKGE Unbundled UI Registry Strategy · Q3 2026',
  lastUpdated: 'Aug 21, 2026',
  readonly: false,
})

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

const strengths = ref<SwotItem[]>(props.initialStrengths ?? defaultStrengths)
const weaknesses = ref<SwotItem[]>(props.initialWeaknesses ?? defaultWeaknesses)
const opportunities = ref<SwotItem[]>(props.initialOpportunities ?? defaultOpportunities)
const threats = ref<SwotItem[]>(props.initialThreats ?? defaultThreats)
const strategicInitiatives = ref<StrategicInitiative[]>(props.initiatives ?? defaultInitiatives)

const inputStrength = ref('')
const inputWeakness = ref('')
const inputOpportunity = ref('')
const inputThreat = ref('')

const isCopied = ref(false)
const isExporting = ref(false)

function addStrength() {
  const text = inputStrength.value.trim()
  if (!text) return
  strengths.value.push({
    id: `s-${Date.now()}`,
    title: text,
    description: 'Custom strategic strength added during canvas session.',
    impact: 'high',
    tag: 'Internal Strategic Advantage',
  })
  inputStrength.value = ''
}

function removeStrength(id: string) {
  strengths.value = strengths.value.filter((item) => item.id !== id)
}

function addWeakness() {
  const text = inputWeakness.value.trim()
  if (!text) return
  weaknesses.value.push({
    id: `w-${Date.now()}`,
    title: text,
    description: 'Custom strategic vulnerability identified for remediation.',
    impact: 'medium',
    tag: 'Internal Remediation',
  })
  inputWeakness.value = ''
}

function removeWeakness(id: string) {
  weaknesses.value = weaknesses.value.filter((item) => item.id !== id)
}

function addOpportunity() {
  const text = inputOpportunity.value.trim()
  if (!text) return
  opportunities.value.push({
    id: `o-${Date.now()}`,
    title: text,
    description: 'External market dynamic or technological growth tailwind.',
    impact: 'high',
    tag: 'External Opportunity',
  })
  inputOpportunity.value = ''
}

function removeOpportunity(id: string) {
  opportunities.value = opportunities.value.filter((item) => item.id !== id)
}

function addThreat() {
  const text = inputThreat.value.trim()
  if (!text) return
  threats.value.push({
    id: `t-${Date.now()}`,
    title: text,
    description: 'External industry risk factor requiring proactive defensive mitigation.',
    impact: 'high',
    tag: 'External Threat',
  })
  inputThreat.value = ''
}

function removeThreat(id: string) {
  threats.value = threats.value.filter((item) => item.id !== id)
}

function handleShare() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}

function handleExportPdf() {
  isExporting.value = true
  setTimeout(() => {
    isExporting.value = false
  }, 1500)
}

const totalCards = computed(
  () => strengths.value.length + weaknesses.value.length + opportunities.value.length + threats.value.length,
)
</script>

<template>
  <div data-slot="matrix-swot-analysis" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Surface -->
    <div
      class="bg-card text-card-foreground flex flex-col gap-5 rounded-xl border p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-xl font-bold tracking-tight sm:text-2xl">{{ props.title }}</h2>
          <Badge wrap variant="outline" class="bg-primary/5 text-primary border-primary/20 text-xs font-medium">
            2×2 TOWS Matrix
          </Badge>
          <Badge wrap variant="secondary" class="text-xs font-normal"> {{ totalCards }} Strategic Factors </Badge>
        </div>

        <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
          <div class="flex items-center gap-1.5">
            <Layers class="size-3.5" />
            <span class="text-foreground font-medium">{{ props.project }}</span>
          </div>
          <span class="hidden sm:inline">·</span>
          <div class="flex items-center gap-1.5">
            <Calendar class="size-3.5" />
            <span>Updated {{ props.lastUpdated }}</span>
          </div>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="flex flex-wrap items-center gap-2.5">
        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="h-9 gap-2 text-xs shadow-xs"
          :disabled="isExporting"
          @click="handleExportPdf"
        >
          <Download v-if="!isExporting" class="size-3.5" />
          <Clock v-else class="size-3.5 animate-spin" />
          <span>{{ isExporting ? 'Generating PDF...' : 'Export Canvas PDF' }}</span>
        </Button>

        <Button variant="default" size="sm" class="h-9 gap-2 text-xs shadow-xs" @click="handleShare">
          <Check v-if="isCopied" class="size-3.5" />
          <Share2 v-else class="size-3.5" />
          <span>{{ isCopied ? 'Link Copied!' : 'Share Strategy' }}</span>
        </Button>
      </div>
    </div>

    <!-- 2x2 Matrix Axis Guide Legend -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs font-medium text-emerald-700 shadow-xs dark:text-emerald-300"
      >
        <div class="flex items-center gap-2">
          <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Internal Attributes</span>
        </div>
        <Badge wrap variant="outline" class="border-emerald-500/30 bg-emerald-500/10 text-xs">Helpful (+)</Badge>
      </div>

      <div
        class="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 px-3.5 py-2.5 text-xs font-medium text-rose-700 shadow-xs dark:text-rose-300"
      >
        <div class="flex items-center gap-2">
          <AlertTriangle class="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>Internal Attributes</span>
        </div>
        <Badge wrap variant="outline" class="border-rose-500/30 bg-rose-500/10 text-xs">Harmful (−)</Badge>
      </div>

      <div
        class="flex items-center justify-between rounded-lg border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-xs font-medium text-sky-700 shadow-xs dark:text-sky-300"
      >
        <div class="flex items-center gap-2">
          <TrendingUp class="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
          <span>External Dynamics</span>
        </div>
        <Badge wrap variant="outline" class="border-sky-500/30 bg-sky-500/10 text-xs">Helpful (+)</Badge>
      </div>

      <div
        class="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/5 px-3.5 py-2.5 text-xs font-medium text-purple-700 shadow-xs dark:text-purple-300"
      >
        <div class="flex items-center gap-2">
          <ShieldAlert class="size-4 shrink-0 text-purple-600 dark:text-purple-400" />
          <span>External Dynamics</span>
        </div>
        <Badge wrap variant="outline" class="border-purple-500/30 bg-purple-500/10 text-xs">Harmful (−)</Badge>
      </div>
    </div>

    <!-- 2x2 SWOT Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- QUADRANT 1: STRENGTHS (Internal / Positive) -->
      <Card class="flex flex-col justify-between border-emerald-500/30 shadow-xs dark:border-emerald-500/20">
        <CardHeader class="border-border/60 border-b bg-emerald-500/5 pb-4 dark:bg-emerald-950/15">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex size-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
              >
                <ShieldCheck class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <CardTitle class="text-base font-bold sm:text-lg">Strengths</CardTitle>
                  <Badge
                    wrap
                    class="border-emerald-500/20 bg-emerald-500/15 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    {{ strengths.length }}
                  </Badge>
                </div>
                <CardDescription class="text-xs">
                  Internal attributes &amp; distinct technical capabilities
                </CardDescription>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <Badge
                wrap
                variant="outline"
                class="hidden border-emerald-500/30 text-xs text-emerald-700 sm:inline-flex dark:text-emerald-300"
              >
                Internal
              </Badge>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300"
              >
                Positive
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="flex-1 space-y-3 p-4 sm:p-5">
          <div
            v-for="item in strengths"
            :key="item.id"
            class="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-emerald-500/40"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-foreground text-sm leading-snug font-semibold">{{ item.title }}</h4>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-700 dark:text-emerald-300"
                  >
                    {{ item.tag }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ item.description }}</p>
              </div>

              <Button
                v-if="!props.readonly"
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                aria-label="Remove strength item"
                @click="removeStrength(item.id)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </div>
          </div>

          <div
            v-if="strengths.length === 0"
            class="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs"
          >
            No strength items listed. Add a core advantage below.
          </div>
        </CardContent>

        <CardFooter v-if="!props.readonly" class="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
          <form class="flex w-full items-center gap-2" @submit.prevent="addStrength">
            <Input
              v-model="inputStrength"
              type="text"
              placeholder="Add key strength... (Press Enter)"
              class="h-8.5 text-xs shadow-xs"
            />
            <Button
              type="submit"
              size="sm"
              class="h-8.5 shrink-0 gap-1.5 bg-emerald-600 text-xs text-white shadow-xs hover:bg-emerald-700"
            >
              <Plus class="size-3.5" />
              <span>Add</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      <!-- QUADRANT 2: WEAKNESSES (Internal / Negative) -->
      <Card class="flex flex-col justify-between border-rose-500/30 shadow-xs dark:border-rose-500/20">
        <CardHeader class="border-border/60 border-b bg-rose-500/5 pb-4 dark:bg-rose-950/15">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex size-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 shadow-xs dark:text-rose-400"
              >
                <AlertTriangle class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <CardTitle class="text-base font-bold sm:text-lg">Weaknesses</CardTitle>
                  <Badge
                    wrap
                    class="border-rose-500/20 bg-rose-500/15 text-xs font-semibold text-rose-700 dark:text-rose-300"
                  >
                    {{ weaknesses.length }}
                  </Badge>
                </div>
                <CardDescription class="text-xs">
                  Internal limitations &amp; operational friction points
                </CardDescription>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <Badge
                wrap
                variant="outline"
                class="hidden border-rose-500/30 text-xs text-rose-700 sm:inline-flex dark:text-rose-300"
              >
                Internal
              </Badge>
              <Badge wrap variant="outline" class="border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
                Negative
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="flex-1 space-y-3 p-4 sm:p-5">
          <div
            v-for="item in weaknesses"
            :key="item.id"
            class="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-rose-500/40"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-foreground text-sm leading-snug font-semibold">{{ item.title }}</h4>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-rose-500/20 bg-rose-500/10 text-xs font-normal text-rose-700 dark:text-rose-300"
                  >
                    {{ item.tag }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ item.description }}</p>
              </div>

              <Button
                v-if="!props.readonly"
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                aria-label="Remove weakness item"
                @click="removeWeakness(item.id)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </div>
          </div>

          <div
            v-if="weaknesses.length === 0"
            class="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs"
          >
            No weakness items listed. Add an area for improvement below.
          </div>
        </CardContent>

        <CardFooter v-if="!props.readonly" class="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
          <form class="flex w-full items-center gap-2" @submit.prevent="addWeakness">
            <Input
              v-model="inputWeakness"
              type="text"
              placeholder="Add key weakness... (Press Enter)"
              class="h-8.5 text-xs shadow-xs"
            />
            <Button
              type="submit"
              size="sm"
              class="h-8.5 shrink-0 gap-1.5 bg-rose-600 text-xs text-white shadow-xs hover:bg-rose-700"
            >
              <Plus class="size-3.5" />
              <span>Add</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      <!-- QUADRANT 3: OPPORTUNITIES (External / Positive) -->
      <Card class="flex flex-col justify-between border-sky-500/30 shadow-xs dark:border-sky-500/20">
        <CardHeader class="border-border/60 border-b bg-sky-500/5 pb-4 dark:bg-sky-950/15">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex size-9 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 shadow-xs dark:text-sky-400"
              >
                <TrendingUp class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <CardTitle class="text-base font-bold sm:text-lg">Opportunities</CardTitle>
                  <Badge
                    wrap
                    class="border-sky-500/20 bg-sky-500/15 text-xs font-semibold text-sky-700 dark:text-sky-300"
                  >
                    {{ opportunities.length }}
                  </Badge>
                </div>
                <CardDescription class="text-xs">
                  External tailwinds &amp; strategic expansion opportunities
                </CardDescription>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <Badge
                wrap
                variant="outline"
                class="hidden border-sky-500/30 text-xs text-sky-700 sm:inline-flex dark:text-sky-300"
              >
                External
              </Badge>
              <Badge wrap variant="outline" class="border-sky-500/30 text-xs text-sky-700 dark:text-sky-300">
                Positive
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="flex-1 space-y-3 p-4 sm:p-5">
          <div
            v-for="item in opportunities"
            :key="item.id"
            class="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-sky-500/40"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-foreground text-sm leading-snug font-semibold">{{ item.title }}</h4>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-sky-500/20 bg-sky-500/10 text-xs font-normal text-sky-700 dark:text-sky-300"
                  >
                    {{ item.tag }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ item.description }}</p>
              </div>

              <Button
                v-if="!props.readonly"
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                aria-label="Remove opportunity item"
                @click="removeOpportunity(item.id)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </div>
          </div>

          <div
            v-if="opportunities.length === 0"
            class="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs"
          >
            No opportunity items listed. Add a market growth vector below.
          </div>
        </CardContent>

        <CardFooter v-if="!props.readonly" class="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
          <form class="flex w-full items-center gap-2" @submit.prevent="addOpportunity">
            <Input
              v-model="inputOpportunity"
              type="text"
              placeholder="Add key opportunity... (Press Enter)"
              class="h-8.5 text-xs shadow-xs"
            />
            <Button
              type="submit"
              size="sm"
              class="h-8.5 shrink-0 gap-1.5 bg-sky-600 text-xs text-white shadow-xs hover:bg-sky-700"
            >
              <Plus class="size-3.5" />
              <span>Add</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      <!-- QUADRANT 4: THREATS (External / Negative) -->
      <Card class="flex flex-col justify-between border-purple-500/30 shadow-xs dark:border-purple-500/20">
        <CardHeader class="border-border/60 border-b bg-purple-500/5 pb-4 dark:bg-purple-950/15">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex size-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-600 shadow-xs dark:text-purple-400"
              >
                <ShieldAlert class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <CardTitle class="text-base font-bold sm:text-lg">Threats</CardTitle>
                  <Badge
                    wrap
                    class="border-purple-500/20 bg-purple-500/15 text-xs font-semibold text-purple-700 dark:text-purple-300"
                  >
                    {{ threats.length }}
                  </Badge>
                </div>
                <CardDescription class="text-xs">
                  External risks, competitive forces &amp; ecosystem shifts
                </CardDescription>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <Badge
                wrap
                variant="outline"
                class="hidden border-purple-500/30 text-xs text-purple-700 sm:inline-flex dark:text-purple-300"
              >
                External
              </Badge>
              <Badge wrap variant="outline" class="border-purple-500/30 text-xs text-purple-700 dark:text-purple-300">
                Negative
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="flex-1 space-y-3 p-4 sm:p-5">
          <div
            v-for="item in threats"
            :key="item.id"
            class="group bg-card relative rounded-lg border p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-purple-500/40"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-foreground text-sm leading-snug font-semibold">{{ item.title }}</h4>
                  <Badge
                    wrap
                    variant="outline"
                    class="border-purple-500/20 bg-purple-500/10 text-xs font-normal text-purple-700 dark:text-purple-300"
                  >
                    {{ item.tag }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ item.description }}</p>
              </div>

              <Button
                v-if="!props.readonly"
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 size-7 shrink-0 p-0 opacity-80 transition-opacity group-hover:opacity-100"
                aria-label="Remove threat item"
                @click="removeThreat(item.id)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </div>
          </div>

          <div
            v-if="threats.length === 0"
            class="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-xs"
          >
            No threat items listed. Add an external risk factor below.
          </div>
        </CardContent>

        <CardFooter v-if="!props.readonly" class="border-border/60 bg-muted/20 border-t p-3 sm:p-4">
          <form class="flex w-full items-center gap-2" @submit.prevent="addThreat">
            <Input
              v-model="inputThreat"
              type="text"
              placeholder="Add key threat... (Press Enter)"
              class="h-8.5 text-xs shadow-xs"
            />
            <Button
              type="submit"
              size="sm"
              class="h-8.5 shrink-0 gap-1.5 bg-purple-600 text-xs text-white shadow-xs hover:bg-purple-700"
            >
              <Plus class="size-3.5" />
              <span>Add</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>

    <!-- Strategic Synthesis & Key Next Actions Card (TOWS Strategy) -->
    <Card class="shadow-xs">
      <CardHeader class="border-border/60 bg-muted/15 border-b pb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Zap class="text-primary size-4" />
              <CardTitle class="text-base font-bold sm:text-lg">Strategic Synthesis &amp; Key Next Actions</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Actionable strategic initiatives bridging internal capabilities with external market dynamics (TOWS matrix
              formulation).
            </CardDescription>
          </div>

          <Badge wrap variant="outline" class="w-fit text-xs font-medium"> 3 Active Initiatives </Badge>
        </div>
      </CardHeader>

      <CardContent class="p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            v-for="initiative in strategicInitiatives"
            :key="initiative.id"
            class="bg-muted/30 hover:border-primary/40 flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-[border-color,box-shadow]"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <Badge
                  wrap
                  variant="outline"
                  :class="
                    cn(
                      'text-xs font-semibold',
                      initiative.strategyType === 'SO' &&
                        'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                      initiative.strategyType === 'WO' &&
                        'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                      initiative.strategyType === 'ST' &&
                        'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
                      initiative.strategyType === 'WT' &&
                        'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
                    )
                  "
                >
                  {{ initiative.strategyType }} Strategy
                </Badge>

                <Badge
                  :variant="initiative.priority === 'Critical' ? 'destructive' : 'secondary'"
                  class="text-xs font-medium whitespace-normal"
                >
                  {{ initiative.priority }}
                </Badge>
              </div>

              <div class="space-y-1.5">
                <h4 class="text-foreground text-sm leading-snug font-semibold">{{ initiative.title }}</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ initiative.description }}</p>
              </div>
            </div>

            <div class="border-border/50 mt-4 flex items-center justify-between gap-2 border-t pt-3 text-xs">
              <div class="text-muted-foreground flex items-center gap-1.5">
                <Clock class="size-3.5" />
                <span>{{ initiative.timeframe }}</span>
              </div>
              <span class="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                {{ initiative.targetMetric }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
