<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface Props {
  targetIso?: string
  statusUrl?: string
  productVersion?: string
}

const props = withDefaults(defineProps<Props>(), {
  targetIso: '',
  statusUrl: 'https://status.uipkge.dev',
  productVersion: 'v2.0 Beta',
})

function pad(value: number) {
  return String(value).padStart(2, '0')
}

interface Milestone {
  id: string
  title: string
  category: string
  status: 'completed' | 'in_progress' | 'scheduled'
  completionPercent: number
  date: string
}

const initialMilestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Dual-Framework Compiler & Monorepo Architecture',
    category: 'Core Infra',
    status: 'completed',
    completionPercent: 100,
    date: 'Aug 15, 2026',
  },
  {
    id: 'm2',
    title: 'Tailwind CSS v4 OKLCH Dynamic Theming Engine',
    category: 'Design System',
    status: 'completed',
    completionPercent: 100,
    date: 'Aug 18, 2026',
  },
  {
    id: 'm3',
    title: 'Zero-Lockin Code Distribution Registry & CLI',
    category: 'DX & Tooling',
    status: 'completed',
    completionPercent: 100,
    date: 'Aug 21, 2026',
  },
  {
    id: 'm4',
    title: 'Multi-Region Edge Registry Cache & Global SLA Testing',
    category: 'Infrastructure',
    status: 'in_progress',
    completionPercent: 88,
    date: 'Target: 3 Days',
  },
  {
    id: 'm5',
    title: 'Public V2.0 Global General Availability Rollout',
    category: 'Release',
    status: 'scheduled',
    completionPercent: 0,
    date: 'Target: 7 Days',
  },
]

interface FeatureTeaser {
  id: string
  badge: string
  title: string
  description: string
  icon: any
  statLabel: string
  statValue: string
  codeSnippet: string
}

const teasers: FeatureTeaser[] = [
  {
    id: 'agentic',
    badge: 'Flagship AI',
    title: 'Autonomous Multi-Agent Orchestrator',
    description: 'Decompose complex workflow DAGs into parallel subagent execution with real-time vector memory.',
    icon: Bot,
    statLabel: 'DAG Execution Speed',
    statValue: '120ms P99',
    codeSnippet: 'npx shadcn-vue@latest add @uipkge/ai-agent-orchestrator',
  },
  {
    id: 'design',
    badge: 'Design Engineering',
    title: 'Tailwind v4 OKLCH Fluid Theme Tokens',
    description: 'Perceptually uniform color spaces with automatic high-contrast dark mode switching & zero CSS bloat.',
    icon: Sparkles,
    statLabel: 'Bundle Size Overhead',
    statValue: '0.00 kB',
    codeSnippet: 'npx shadcn-vue@latest add @uipkge/theme-customize',
  },
  {
    id: 'edge',
    badge: 'Ultra Low Latency',
    title: 'Cloudflare Workers Multi-Region Cache',
    description: 'Global component manifest resolution with smart geo-routing and edge-cached JSON trees.',
    icon: Zap,
    statLabel: 'Global Median Latency',
    statValue: '8.4ms',
    codeSnippet: 'curl -s https://uipkge.dev/r/vue/init.json',
  },
]

const deadline = props.targetIso ? new Date(props.targetIso).getTime() : Date.now() + 7 * 24 * 60 * 60 * 1000

const days = ref('00')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
const activeTeaserIndex = ref(0)

// Waitlist form state
const email = ref('')
const role = ref<'frontend' | 'architect' | 'founder'>('frontend')
const submitted = ref(false)
const queuePosition = ref<number | null>(null)
const copiedReferral = ref(false)
const copiedCli = ref(false)

function tick() {
  const diff = Math.max(0, deadline - Date.now())
  days.value = pad(Math.floor(diff / 86_400_000))
  hours.value = pad(Math.floor((diff % 86_400_000) / 3_600_000))
  minutes.value = pad(Math.floor((diff % 3_600_000) / 60_000))
  seconds.value = pad(Math.floor((diff % 60_000) / 1000))
}

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function handleWaitlistSubmit() {
  if (!email.value) return
  const randomPos = Math.floor(Math.random() * 80) + 120
  queuePosition.value = randomPos
  submitted.value = true
}

function copyReferral() {
  navigator.clipboard.writeText(`https://uipkge.dev/invite?ref=queue_${queuePosition.value}`)
  copiedReferral.value = true
  setTimeout(() => (copiedReferral.value = false), 2000)
}

function copyTeaserSnippet(snippet: string) {
  navigator.clipboard.writeText(snippet)
  copiedCli.value = true
  setTimeout(() => (copiedCli.value = false), 2000)
}

const units = computed(() => [
  { label: 'Days', value: days.value },
  { label: 'Hours', value: hours.value },
  { label: 'Minutes', value: minutes.value },
  { label: 'Seconds', value: seconds.value },
])

const overallReadiness = computed(() =>
  Math.round(initialMilestones.reduce((acc, m) => acc + m.completionPercent, 0) / initialMilestones.length),
)
</script>

<template>
  <section
    data-slot="coming-soon"
    class="bg-background relative flex min-h-screen flex-col justify-between overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
  >
    <!-- Background Decorative Gradient Mesh -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="bg-primary/10 top-[-10%] left-1/2 size-[750px] -translate-x-1/2 rounded-full blur-3xl" />
    </div>

    <!-- Top Telemetry & Status Bar -->
    <div
      class="border-border/70 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-b pb-12 sm:flex-row"
    >
      <div class="flex items-center gap-3">
        <div
          class="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl font-bold shadow-xs"
        >
          <Rocket class="size-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-foreground text-sm font-semibold tracking-tight">UIPKGE Engine</span>
            <Badge variant="outline" class="border-primary/30 text-primary px-1.5 py-0.5 font-mono text-xs">
              {{ props.productVersion }}
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">Dual-framework registry & visual workbench suite</p>
        </div>
      </div>

      <!-- Global SLA Readiness Pill -->
      <div class="bg-muted/40 border-border flex items-center gap-3 rounded-full border px-3.5 py-1.5">
        <div class="flex size-2 animate-pulse rounded-full bg-emerald-500" />
        <span class="text-muted-foreground font-mono text-xs">
          Staging Infrastructure: <strong class="text-foreground font-semibold">99.99% Operational</strong>
        </span>
        <Separator orientation="vertical" class="h-3.5" />
        <a
          :href="props.statusUrl"
          target="_blank"
          rel="noreferrer"
          class="text-primary inline-flex items-center gap-1 font-mono text-xs hover:underline"
        >
          Live Status <ArrowUpRight class="size-3" />
        </a>
      </div>
    </div>

    <!-- Main Hero & Countdown Body -->
    <div class="mx-auto my-auto w-full max-w-6xl space-y-16 py-10">
      <!-- Headline & Subtitle -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Sparkles class="text-primary size-3.5" />
          V2.0 General Availability Launch Matrix
        </Badge>
        <h1 class="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Production-grade design engineering workbenches.
        </h1>
        <p class="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
          We are deploying 281+ production-grade primitives and composed workbenches with zero package dependencies. Own
          your source code with complete architectural freedom.
        </p>
      </div>

      <!-- High-Impact Digital Countdown Grid -->
      <div class="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
        <Card
          v-for="unit in units"
          :key="unit.label"
          class="border-border bg-card/70 group hover:border-primary/40 relative overflow-hidden p-5 text-center shadow-xs backdrop-blur-xs transition-colors"
        >
          <div class="text-foreground font-mono text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
            {{ unit.value }}
          </div>
          <div class="text-muted-foreground mt-2 font-mono text-xs font-medium tracking-widest uppercase">
            {{ unit.label }}
          </div>
          <div class="bg-primary/20 group-hover:bg-primary absolute right-0 bottom-0 left-0 h-0.5 transition-colors" />
        </Card>
      </div>

      <!-- Early Access & Queue Tracker Section -->
      <div class="mx-auto w-full max-w-xl">
        <Card class="border-border bg-card overflow-hidden shadow-sm">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center gap-2 text-base font-semibold">
                <ShieldCheck class="text-primary size-4" />
                Early Access Allocation
              </CardTitle>
              <Badge
                variant="outline"
                class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                Batch #2 Opening Soon
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Request priority invite access. Get instant sandbox access to all 281+ blocks before general public
              launch.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form v-if="!submitted" class="space-y-4" @submit.prevent="handleWaitlistSubmit">
              <!-- Role Selector Tabs -->
              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Your Primary Engineering Focus</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="r in [
                      { id: 'frontend', label: 'Frontend / UI' },
                      { id: 'architect', label: 'Tech Lead / Arch' },
                      { id: 'founder', label: 'CTO / Founder' },
                    ]"
                    :key="r.id"
                    type="button"
                    class="rounded-lg border px-2.5 py-1.5 text-center text-xs font-medium transition-all"
                    :class="
                      role === r.id
                        ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    "
                    @click="role = r.id as any"
                  >
                    {{ r.label }}
                  </button>
                </div>
              </div>

              <!-- Email Input & Submit -->
              <div class="flex flex-col gap-2 sm:flex-row">
                <div class="relative flex-1">
                  <Input
                    v-model="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    class="h-10 font-mono text-xs"
                  />
                </div>
                <Button type="submit" class="h-10 gap-1.5 px-5 text-xs font-semibold">
                  <span>Reserve Spot</span>
                  <ArrowRight class="size-3.5" />
                </Button>
              </div>
              <p class="text-muted-foreground text-center text-xs">
                No spam. You will only receive your single cryptographic invite token.
              </p>
            </form>

            <div v-else class="bg-muted/40 border-border space-y-4 rounded-xl border p-4 text-center">
              <div
                class="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
              >
                <Check class="size-5" />
              </div>
              <div class="space-y-1">
                <p class="text-foreground text-sm font-semibold">You are #{{ queuePosition }} in queue!</p>
                <p class="text-muted-foreground text-xs">
                  Invitation tokens for Batch #2 will be delivered to
                  <strong class="text-foreground font-mono">{{ email }}</strong
                  >.
                </p>
              </div>

              <div class="border-border flex flex-col items-center justify-between gap-3 border-t pt-2 sm:flex-row">
                <span class="text-muted-foreground font-mono text-xs">Move up 5 spots per teammate invite:</span>
                <Button variant="outline" size="sm" class="h-8 gap-1.5 font-mono text-xs" @click="copyReferral">
                  <Check v-if="copiedReferral" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ copiedReferral ? 'Copied Link' : 'Copy Invite Link' }}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Interactive Feature Sneak-Peek Carousel & Terminal Preview -->
      <div class="space-y-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Zap class="text-primary size-4" />
              Incoming Flagship Capabilities
            </h2>
            <p class="text-muted-foreground text-xs">Sneak peek preview of the upcoming architecture release</p>
          </div>

          <!-- Teaser Navigation Tabs -->
          <div class="bg-muted/40 border-border flex items-center gap-1.5 rounded-lg border p-1">
            <button
              v-for="(t, idx) in teasers"
              :key="t.id"
              type="button"
              class="rounded-md px-3 py-1 text-xs font-medium transition-all"
              :class="
                activeTeaserIndex === idx
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              "
              @click="activeTeaserIndex = idx"
            >
              {{ t.badge }}
            </button>
          </div>
        </div>

        <!-- Active Teaser Card -->
        <Card class="border-border bg-card overflow-hidden">
          <div class="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            <div class="space-y-4 p-6 sm:p-8 lg:col-span-7">
              <div class="flex items-center gap-2.5">
                <div class="bg-primary/10 text-primary rounded-lg p-2">
                  <component :is="teasers[activeTeaserIndex].icon" class="size-5" />
                </div>
                <Badge variant="secondary" class="font-mono text-xs">
                  {{ teasers[activeTeaserIndex].badge }}
                </Badge>
              </div>

              <h3 class="text-foreground text-xl font-bold tracking-tight">{{ teasers[activeTeaserIndex].title }}</h3>
              <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                {{ teasers[activeTeaserIndex].description }}
              </p>

              <div class="flex items-center gap-6 pt-2">
                <div>
                  <p class="text-muted-foreground font-mono text-xs">{{ teasers[activeTeaserIndex].statLabel }}</p>
                  <p class="text-foreground mt-0.5 font-mono text-xl font-bold">
                    {{ teasers[activeTeaserIndex].statValue }}
                  </p>
                </div>
                <Separator orientation="vertical" class="h-8" />
                <div>
                  <p class="text-muted-foreground font-mono text-xs">Framework Support</p>
                  <p class="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Vue 3.5 & React 19 Parity
                  </p>
                </div>
              </div>
            </div>

            <!-- Terminal Snippet Box -->
            <div class="bg-muted/20 flex flex-col justify-between space-y-4 p-6 lg:col-span-5">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs font-medium">
                    <Terminal class="size-3.5" /> Direct CLI Command
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 gap-1.5 px-2 font-mono text-xs"
                    @click="copyTeaserSnippet(teasers[activeTeaserIndex].codeSnippet)"
                  >
                    <Check v-if="copiedCli" class="size-3 text-emerald-500" />
                    <Copy v-else class="size-3" />
                    <span>{{ copiedCli ? 'Copied' : 'Copy' }}</span>
                  </Button>
                </div>
                <div
                  class="bg-background border-border text-foreground selection:bg-primary/20 overflow-x-auto rounded-lg border p-3 font-mono text-xs"
                >
                  <code>{{ teasers[activeTeaserIndex].codeSnippet }}</code>
                </div>
              </div>

              <div
                class="border-border/80 bg-background/50 text-muted-foreground flex items-center gap-2 rounded-lg border p-3 text-xs"
              >
                <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" />
                <span>Transitive dependencies, OKLCH styles & TS types included.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Launch Readiness Milestones Tracker -->
      <div class="border-border/70 space-y-6 border-t pt-4">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Activity class="text-primary size-4" />
              V2.0 Launch Milestones & Engineering Progress
            </h2>
            <p class="text-muted-foreground text-xs">Transparent real-time build and release status</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-foreground font-mono text-xs font-semibold"
              >Overall Readiness: {{ overallReadiness }}%</span
            >
            <Progress :model-value="overallReadiness" class="h-2 w-28" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="m in initialMilestones"
            :key="m.id"
            class="border-border bg-card hover:border-primary/30 flex flex-col justify-between space-y-3 rounded-xl border p-4 shadow-xs transition-colors"
          >
            <div class="flex items-start justify-between gap-2">
              <Badge
                variant="outline"
                class="px-2 py-0.5 font-mono text-xs"
                :class="[
                  m.status === 'completed' &&
                    'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  m.status === 'in_progress' &&
                    'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  m.status === 'scheduled' && 'bg-muted text-muted-foreground border-border',
                ]"
              >
                {{ m.status === 'completed' ? 'Completed' : m.status === 'in_progress' ? 'In Progress' : 'Scheduled' }}
              </Badge>
              <span class="text-muted-foreground font-mono text-xs">{{ m.date }}</span>
            </div>

            <div>
              <p class="text-foreground text-xs leading-snug font-semibold">{{ m.title }}</p>
              <p class="text-muted-foreground mt-1 font-mono text-xs">{{ m.category }}</p>
            </div>

            <div class="space-y-1 pt-1">
              <div class="text-muted-foreground flex justify-between font-mono text-xs">
                <span>Progress</span>
                <span>{{ m.completionPercent }}%</span>
              </div>
              <Progress :model-value="m.completionPercent" class="h-1.5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer
      class="border-border text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row"
    >
      <div class="flex items-center gap-2">
        <span>&copy; {{ new Date().getFullYear() }} UIPKGE. Open source under MIT License.</span>
      </div>
      <div class="flex items-center gap-4">
        <a
          href="https://github.com/uday-a/uipkge"
          target="_blank"
          rel="noreferrer"
          class="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <Separator orientation="vertical" class="h-3" />
        <a href="https://uipkge.dev" target="_blank" rel="noreferrer" class="hover:text-foreground transition-colors">
          Registry Docs
        </a>
        <Separator orientation="vertical" class="h-3" />
        <a :href="props.statusUrl" target="_blank" rel="noreferrer" class="hover:text-foreground transition-colors">
          Status Page
        </a>
      </div>
    </footer>
  </section>
</template>
