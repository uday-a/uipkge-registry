<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  ArrowRightLeft,
  BrainCircuit,
  CheckCircle2,
  Coins,
  Download,
  Gauge,
  Layers,
  Route,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const timeframe = ref('aug-2026')
const providerFilter = ref('all')

// Active optimization rule toggles
const promptCompressionEnabled = ref(true)
const smallModelRoutingEnabled = ref(true)
const semanticCachingEnabled = ref(true)
const circuitBreakerEnabled = ref(true)

interface ModelAllocation {
  id: string
  name: string
  provider: string
  providerTag: string
  sharePercent: number
  inputTokens: string
  outputTokens: string
  totalTokens: string
  totalCost: string
  reroutesHandled: number
  avgLatency: string
  role: string
  status: 'optimal' | 'active'
}

const models: ModelAllocation[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerTag: 'Anthropic Direct',
    sharePercent: 45,
    inputTokens: '24.2M',
    outputTokens: '4.1M',
    totalTokens: '28.3M',
    totalCost: '$1,824.20',
    reroutesHandled: 142,
    avgLatency: '680ms',
    role: 'Complex Reasoning & System Arch',
    status: 'optimal',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerTag: 'OpenAI Tier-5',
    sharePercent: 30,
    inputTokens: '12.5M',
    outputTokens: '2.6M',
    totalTokens: '15.1M',
    totalCost: '$1,080.50',
    reroutesHandled: 64,
    avgLatency: '540ms',
    role: 'Multi-Modal & Structured Schema',
    status: 'active',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    providerTag: 'Groq LPU Inference',
    sharePercent: 15,
    inputTokens: '4.1M',
    outputTokens: '1.2M',
    totalTokens: '5.3M',
    totalCost: '$195.40',
    reroutesHandled: 8,
    avgLatency: '190ms',
    role: 'High-Throughput Transformation',
    status: 'optimal',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    providerTag: 'OpenAI Direct',
    sharePercent: 10,
    inputTokens: '2.0M',
    outputTokens: '0.5M',
    totalTokens: '2.5M',
    totalCost: '$320.40',
    reroutesHandled: 12,
    avgLatency: '240ms',
    role: 'Intent Classification & Tagging',
    status: 'active',
  },
]

const filteredModels = computed(() => {
  if (providerFilter.value === 'all') return models
  return models.filter((m) => m.provider.toLowerCase().includes(providerFilter.value.toLowerCase()))
})

interface CacheSegment {
  name: string
  type: 'exact' | 'semantic' | 'origin'
  share: number
  requests: string
  tokensSpared: string
  costSaved: string
  latency: string
  color: string
  badgeVariant: 'success' | 'info' | 'outline'
  description: string
}

const cacheSegments: CacheSegment[] = [
  {
    name: 'Exact Cache',
    type: 'exact',
    share: 24.0,
    requests: '184.2K reqs (24.0%)',
    tokensSpared: '18.2M tokens',
    costSaved: '$2,136.00 saved',
    latency: '12ms p50',
    color: 'bg-emerald-500',
    badgeVariant: 'success',
    description: 'Deterministic SHA-256 hit on normalized system prompt and user parameters.',
  },
  {
    name: 'Semantic Vector Cache',
    type: 'semantic',
    share: 18.8,
    requests: '144.3K reqs (18.8%)',
    tokensSpared: '14.3M tokens',
    costSaved: '$1,676.00 saved',
    latency: '28ms p50',
    color: 'bg-sky-500',
    badgeVariant: 'info',
    description: 'Vector similarity cache match with cosine threshold ≥ 0.88 via Qdrant/Redis.',
  },
  {
    name: 'Origin Model Calls',
    type: 'origin',
    share: 57.2,
    requests: '439.0K reqs (57.2%)',
    tokensSpared: '0 (billed)',
    costSaved: '$3,420.50 spent',
    latency: '840ms p99',
    color: 'bg-muted-foreground/30 dark:bg-muted-foreground/20',
    badgeVariant: 'outline',
    description: 'Forwarded to upstream LLMs via smart model routing with fallback circuit protection.',
  },
]
</script>

<template>
  <div data-slot="model-token-cost-optimizer" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            AI Gateway & Token Cost Optimizer
          </h1>
          <Badge
            wrap
            variant="outline"
            class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Routing Active · 99.99% Availability</span>
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Helicone & Portkey style gateway telemetry, semantic caching hit rates, model routing savings, and latency
          metrics.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Select v-model="timeframe">
          <SelectTrigger class="w-full text-xs font-medium sm:w-52" aria-label="Select timeframe">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aug-2026">This Month · August 2026</SelectItem>
            <SelectItem value="jul-2026">Last Month · July 2026</SelectItem>
            <SelectItem value="q2-2026">Q2 2026 Summary</SelectItem>
            <SelectItem value="ytd-2026">Year to Date 2026</SelectItem>
          </SelectContent>
        </Select>

        <Button aria-label="Download attachment" variant="outline" size="sm" class="gap-1.5 text-xs">
          <Download class="text-muted-foreground size-3.5" />
          <span>Export Token Logs</span>
        </Button>

        <Button size="sm" class="gap-1.5 text-xs">
          <SlidersHorizontal class="size-3.5" />
          <span>Configure Routing Rules</span>
        </Button>
      </div>
    </div>

    <!-- 4 Gateway Performance KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- KPI 1: Total Token Spend -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Coins class="size-4" />
              </div>
              <CardTitle class="text-sm font-medium">Total Token Spend</CardTitle>
            </div>
            <Badge wrap variant="outline" class="text-xs font-normal tabular-nums"> vs $8,900.00 unoptimized </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$3,420.50</span>
            <span class="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
              -$5,479.50 (61.5%)
            </span>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Budget Utilization</span>
              <span class="text-foreground font-medium tabular-nums">38.4% of baseline</span>
            </div>
            <Progress :model-value="38.4" class="h-1.5" />
          </div>
          <p class="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
            767,500 total gateway inference requests
          </p>
        </CardContent>
      </Card>

      <!-- KPI 2: Cost Savings from Caching & Routing -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
                aria-hidden="true"
              >
                <TrendingDown class="size-4" />
              </div>
              <CardTitle class="text-sm font-medium">Cost Savings</CardTitle>
            </div>
            <Badge
              wrap
              variant="outline"
              class="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              61.5% Reduction
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span class="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">
              $5,479.50 Saved
            </span>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Semantic Cache Savings</span>
              <span class="text-foreground font-medium tabular-nums">$3,812.00</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Smart Model Routing</span>
              <span class="text-foreground font-medium tabular-nums">$1,667.50</span>
            </div>
          </div>
          <p class="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
            32.5M tokens prevented from origin billing
          </p>
        </CardContent>
      </Card>

      <!-- KPI 3: Semantic Cache Hit Rate -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 shadow-xs dark:text-sky-400"
                aria-hidden="true"
              >
                <Zap class="size-4" />
              </div>
              <CardTitle class="text-sm font-medium">Semantic Cache Hit Rate</CardTitle>
            </div>
            <Badge
              wrap
              variant="outline"
              class="border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-600 dark:text-sky-400"
            >
              &lt; 15ms response
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">42.8%</span>
            <span class="text-muted-foreground text-xs font-medium tabular-nums">328,500 hits</span>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Exact Match vs Vector</span>
              <span class="text-foreground font-medium tabular-nums">24.0% / 18.8%</span>
            </div>
            <Progress :model-value="42.8" class="h-1.5 [&_[data-slot=progress-indicator]]:bg-sky-500" />
          </div>
          <p class="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
            p50 exact: 12ms · p50 vector: 28ms
          </p>
        </CardContent>
      </Card>

      <!-- KPI 4: P99 Gateway Latency -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <div
                class="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Gauge class="size-4" />
              </div>
              <CardTitle class="text-sm font-medium">P99 Gateway Latency</CardTitle>
            </div>
            <Badge wrap variant="outline" class="text-xs font-normal"> 4.2x Faster </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">840ms</span>
            <span class="text-muted-foreground text-xs font-medium tabular-nums">p50: 180ms</span>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Smart Fallback SLA</span>
              <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">Zero 504 timeouts</span>
            </div>
            <Progress :model-value="28" class="h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
          </div>
          <p class="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
            Automatic reroute on &gt;1,500ms TTFT or 429
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Semantic Cache Savings Visualizer -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="flex min-w-0 items-center gap-2 text-base font-semibold">
              <Layers class="text-primary size-4" />
              <span>Semantic Cache Savings & Token Bypass Visualizer</span>
            </CardTitle>
            <CardDescription>
              Telemetry breakdown comparing deterministic exact hash matches, semantic vector cache hits, and origin LLM
              invocations.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="w-fit text-xs font-medium tabular-nums">
            767,500 Total Requests Analyzed
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Multi-segment progress visualizer bar -->
        <div class="space-y-2">
          <div
            class="border-border/60 bg-muted/40 flex h-4 w-full overflow-hidden rounded-md border p-0.5 shadow-inner"
          >
            <div
              class="h-full rounded-xs bg-emerald-500 transition-all duration-500"
              style="width: 24%"
              title="Exact Key Cache: 24.0%"
            />
            <div class="bg-background w-0.5" aria-hidden="true" />
            <div
              class="h-full rounded-xs bg-sky-500 transition-all duration-500"
              style="width: 18.8%"
              title="Semantic Vector Cache: 18.8%"
            />
            <div class="bg-background w-0.5" aria-hidden="true" />
            <div
              class="bg-muted-foreground/30 dark:bg-muted-foreground/20 h-full rounded-xs transition-all duration-500"
              style="width: 57.2%"
              title="Origin Model Calls: 57.2%"
            />
          </div>

          <!-- Visual Legend Header -->
          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span class="text-foreground font-medium">Exact Cache:</span>
              <span class="tabular-nums">24.0%</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="size-2.5 rounded-full bg-sky-500" aria-hidden="true" />
              <span class="text-foreground font-medium">Semantic Vector Cache:</span>
              <span class="tabular-nums">18.8%</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="bg-muted-foreground/40 size-2.5 rounded-full" aria-hidden="true" />
              <span class="text-foreground font-medium">Origin Model Calls:</span>
              <span class="tabular-nums">57.2%</span>
            </div>
          </div>
        </div>

        <!-- 3 Segment Metric Detail Cards -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div
            v-for="segment in cacheSegments"
            :key="segment.name"
            class="bg-muted/30 border-border/80 flex flex-col justify-between space-y-2.5 rounded-lg border p-3.5 shadow-xs"
          >
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2">
                  <span :class="cn('size-2 shrink-0 rounded-full', segment.color)" aria-hidden="true" />
                  <span class="text-foreground truncate text-xs font-semibold">{{ segment.name }}</span>
                </div>
                <Badge wrap :variant="segment.badgeVariant" class="shrink-0 text-xs font-medium tabular-nums">
                  {{ segment.latency }}
                </Badge>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                {{ segment.description }}
              </p>
            </div>

            <div class="border-border/60 space-y-1 border-t pt-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Volume Share</span>
                <span class="text-foreground font-medium tabular-nums">{{ segment.requests }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Token Impact</span>
                <span class="text-foreground font-medium tabular-nums">{{ segment.tokensSpared }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Financial Impact</span>
                <span
                  :class="
                    cn(
                      'font-semibold tabular-nums',
                      segment.type === 'origin' ? 'text-foreground' : 'text-emerald-600 dark:text-emerald-400',
                    )
                  "
                >
                  {{ segment.costSaved }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Model Routing & Cost Allocation Table -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <CardTitle class="flex min-w-0 items-center gap-2 text-base font-semibold">
              <Route class="text-primary size-4" />
              <span>Model Routing & Cost Allocation</span>
            </CardTitle>
            <CardDescription>
              Multi-provider connected models, request distribution, token volumes, total cost, and automated fallback
              retries.
            </CardDescription>
          </div>

          <div class="flex min-w-0 items-center gap-2">
            <Select v-model="providerFilter">
              <SelectTrigger class="w-full text-xs sm:w-40" aria-label="Filter by provider">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-0 sm:p-6 sm:pt-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="text-xs">Model & Provider</TableHead>
                <TableHead class="text-xs">Request Share</TableHead>
                <TableHead class="text-xs">Tokens (Input / Output)</TableHead>
                <TableHead class="text-right text-xs">Total Cost</TableHead>
                <TableHead class="text-right text-xs">Fallback Retries Handled</TableHead>
                <TableHead class="text-right text-xs">Assigned Routing Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="model in filteredModels" :key="model.id">
                <!-- Model Name & Provider -->
                <TableCell class="py-3 whitespace-nowrap">
                  <div class="flex min-w-0 items-center gap-2.5">
                    <div
                      class="bg-muted text-foreground border-border flex size-7 shrink-0 items-center justify-center rounded-md border shadow-xs"
                      aria-hidden="true"
                    >
                      <BrainCircuit class="size-3.5" />
                    </div>
                    <div class="space-y-0.5">
                      <div class="text-foreground text-xs font-semibold">{{ model.name }}</div>
                      <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <span>{{ model.provider }}</span>
                        <span class="tabular-nums">{{ model.avgLatency }}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <!-- Request Share % -->
                <TableCell class="py-3">
                  <div class="w-32 space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-foreground font-semibold tabular-nums">{{ model.sharePercent }}%</span>
                      <span class="text-muted-foreground text-xs">share</span>
                    </div>
                    <Progress :model-value="model.sharePercent" class="h-1.5" />
                  </div>
                </TableCell>

                <!-- Input & Output Tokens in tabular-nums -->
                <TableCell class="py-3 whitespace-nowrap">
                  <div class="space-y-0.5 text-xs">
                    <div class="text-foreground font-medium tabular-nums">
                      {{ model.inputTokens }} input · {{ model.outputTokens }} output
                    </div>
                    <div class="text-muted-foreground text-xs tabular-nums">
                      {{ model.totalTokens }} combined tokens
                    </div>
                  </div>
                </TableCell>

                <!-- Total Cost -->
                <TableCell class="py-3 text-right whitespace-nowrap">
                  <div class="text-foreground text-xs font-bold tabular-nums">
                    {{ model.totalCost }}
                  </div>
                  <div class="text-muted-foreground text-xs tabular-nums">
                    avg ${{
                      (
                        parseFloat(model.totalCost.replace('$', '').replace(',', '')) /
                        (model.sharePercent * 76.75)
                      ).toFixed(3)
                    }}
                    / 1k req
                  </div>
                </TableCell>

                <!-- Fallback & Rate-Limit Retries Handled -->
                <TableCell class="py-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center justify-end gap-1.5 text-xs">
                    <Badge wrap variant="outline" class="gap-1 text-xs font-medium tabular-nums">
                      <ArrowRightLeft class="text-muted-foreground size-3" />
                      <span>{{ model.reroutesHandled }} automatic reroutes</span>
                    </Badge>
                  </div>
                </TableCell>

                <!-- Assigned Routing Role -->
                <TableCell class="py-3 text-right whitespace-nowrap">
                  <Badge wrap variant="secondary" class="text-xs font-normal">
                    {{ model.role }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Table Summary / Footer Banner -->
        <div
          class="border-border/80 bg-muted/30 mt-4 flex flex-col gap-3 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex min-w-0 items-center gap-2">
            <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
            <span class="text-muted-foreground">
              Across all 4 models:
              <strong class="text-foreground font-semibold tabular-nums"
                >42.8M input · 8.4M output (51.2M total)</strong
              >
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs tabular-nums">
            <span class="text-muted-foreground">
              Total Reroutes Handled: <strong class="text-foreground font-semibold">226 incidents</strong>
            </span>
            <span class="text-muted-foreground">
              Net Origin Billed: <strong class="text-foreground font-semibold">$3,420.50</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Active Cost Optimization Rules Card -->
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <CardTitle class="flex min-w-0 items-center gap-2 text-base font-semibold">
              <Sparkles class="text-primary size-4" />
              <span>Active Cost Optimization & Gateway Rules</span>
            </CardTitle>
            <CardDescription>
              Autonomous gateway policies eliminating redundant token expenditure and enforcing fallback SLAs.
            </CardDescription>
          </div>
          <Badge
            wrap
            variant="outline"
            class="w-fit border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            4 / 4 Rules Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Rule 1: Prompt Compression -->
          <div class="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Prompt Compression & System Cache Priming</span>
                  <Badge wrap variant="success" class="text-xs">Active</Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Strips boilerplate whitespaces, trims markdown delimiters, and leverages provider system prompt prefix
                  caching to minimize input token weights.
                </p>
              </div>
              <Switch v-model="promptCompressionEnabled" aria-label="Toggle prompt compression" />
            </div>
            <div
              class="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
            >
              <span class="text-muted-foreground">Estimated Rule Savings</span>
              <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                ~$680.00 / mo (18% input token reduction)
              </span>
            </div>
          </div>

          <!-- Rule 2: Automatic small-model routing -->
          <div class="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Automatic Small-Model Routing</span>
                  <Badge wrap variant="success" class="text-xs">Active</Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Directs intent classification, sentiment analysis, entity extraction, and structured JSON parsing to
                  GPT-4o-mini and Llama 3.3 70B instead of frontier models.
                </p>
              </div>
              <Switch v-model="smallModelRoutingEnabled" aria-label="Toggle small-model routing" />
            </div>
            <div
              class="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
            >
              <span class="text-muted-foreground">Estimated Rule Savings</span>
              <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                ~$1,240.00 / mo (68K queries rerouted)
              </span>
            </div>
          </div>

          <!-- Rule 3: Semantic Vector Cache -->
          <div class="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Semantic Vector Caching</span>
                  <Badge wrap variant="success" class="text-xs">Active</Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Evaluates embedding cosine distance on incoming queries; returns sub-30ms cached responses when
                  similarity score exceeds 0.88 threshold.
                </p>
              </div>
              <Switch v-model="semanticCachingEnabled" aria-label="Toggle semantic caching" />
            </div>
            <div
              class="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
            >
              <span class="text-muted-foreground">Estimated Rule Savings</span>
              <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                ~$1,676.00 / mo (144.3K queries cached)
              </span>
            </div>
          </div>

          <!-- Rule 4: Fallback & Circuit Breaker Engine -->
          <div class="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Fallback & Circuit Breaker Engine</span>
                  <Badge wrap variant="success" class="text-xs">Active</Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Monitors upstream provider health; automatically reroutes degraded queries to secondary standby models
                  on HTTP 429 or &gt;1,500ms TTFT latency spikes.
                </p>
              </div>
              <Switch v-model="circuitBreakerEnabled" aria-label="Toggle circuit breaker engine" />
            </div>
            <div
              class="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
            >
              <span class="text-muted-foreground">SLA Protection</span>
              <span class="text-foreground font-semibold tabular-nums">
                99.99% effective uptime (226 incidents saved)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
