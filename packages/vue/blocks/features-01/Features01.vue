<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Globe,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface FeatureModule {
  id: string
  title: string
  category: 'core' | 'dx' | 'security' | 'ai'
  badge: string
  description: string
  icon: any
  metrics: { label: string; value: string; trend: string }[]
  previewType: 'directory' | 'payroll' | 'performance' | 'compliance' | 'api' | 'copilot'
}

const activeCategory = ref<'all' | 'core' | 'dx' | 'security' | 'ai'>('all')
const selectedFeatureId = ref('directory')
const copied = ref(false)

// Directory simulation state
const searchQuery = ref('')
const selectedRole = ref('All Roles')
const employees = ref([
  {
    id: '1',
    name: 'Sophia Chen',
    role: 'Staff Design Engineer',
    team: 'Design Systems',
    status: 'Active',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Marcus Vance',
    role: 'Principal Distributed Systems',
    team: 'Core Infrastructure',
    status: 'Active',
    location: 'London, UK',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'Lead Security Architect',
    team: 'SecOps',
    status: 'In Review',
    location: 'Berlin, DE',
  },
  {
    id: '4',
    name: 'Devon Taylor',
    role: 'Head of Product',
    team: 'Enterprise Suite',
    status: 'Active',
    location: 'New York, NY',
  },
])

const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchQuery =
      emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRole = selectedRole.value === 'All Roles' || emp.team === selectedRole.value
    return matchQuery && matchRole
  })
})

// Payroll simulation state
const grossAmount = ref(184000)
const payrollTaxRate = ref(18.5)
const simulatedEmployeesCount = ref(42)
const estimatedDeductions = computed(() => grossAmount.value * (payrollTaxRate.value / 100))
const netPayout = computed(() => grossAmount.value - estimatedDeductions.value)

// Compliance simulation state
const controls = ref([
  { name: 'TLS 1.3 Strict Transport Security', framework: 'SOC 2 / ISO 27001', passed: true, score: '100%' },
  { name: 'Continuous Automated Evidence Sync', framework: 'HIPAA Security Rule', passed: true, score: '99.8%' },
  { name: 'Hardware Security Keys MFA Enforced', framework: 'Zero Trust Baseline', passed: true, score: '100%' },
  { name: 'Automated Ephemeral DB Credential TTL', framework: 'SOC 2 CC6.1', passed: true, score: '99.4%' },
])

// Copilot prompt simulation
const copilotPrompt = ref('Generate quarterly SOC2 compliance audit report with automated PR proof attachments.')
const copilotExecuting = ref(false)
const copilotOutput = ref(
  'Audit summary generated. 14 evidence logs compiled across 4 AWS & Cloudflare regions. Zero critical findings.',
)

function triggerCopilot() {
  copilotExecuting.value = true
  copilotOutput.value = 'Analyzing real-time event bus and compiling cryptographically signed evidence bundle...'
  setTimeout(() => {
    copilotOutput.value =
      '✓ SOC 2 Type II bundle validated. 142 controls verified at 100% adherence. Ready for auditor download.'
    copilotExecuting.value = false
  }, 900)
}

function copySnippet(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const features: FeatureModule[] = [
  {
    id: 'directory',
    title: 'Global Employee Directory',
    category: 'core',
    badge: 'Real-time Sync',
    description:
      'Single source of truth for global teams, reporting hierarchies, custom attributes, and automated SCIM provisioning.',
    icon: Users,
    metrics: [
      { label: 'Sync Latency', value: '<12ms', trend: 'P99 Edge' },
      { label: 'SCIM Connectors', value: '24+', trend: 'Okta/Google' },
      { label: 'Export Formats', value: 'JSON/CSV', trend: 'Bi-directional' },
    ],
    previewType: 'directory',
  },
  {
    id: 'payroll',
    title: 'Multi-Currency Global Payroll',
    category: 'core',
    badge: 'Automated Tax',
    description:
      'Instant payroll calculation across 140+ countries with automated localized tax withholding, statutory benefits, and direct FX routing.',
    icon: Wallet,
    metrics: [
      { label: 'Supported Currencies', value: '140+', trend: 'Live FX' },
      { label: 'Settlement Time', value: 'Instant', trend: 'SEPA/FedNow' },
      { label: 'Tax Accuracy', value: '100%', trend: 'Statutory Verified' },
    ],
    previewType: 'payroll',
  },
  {
    id: 'performance',
    title: 'OKR & Continuous Reviews',
    category: 'dx',
    badge: '360 Calibration',
    description:
      'Transparent objective tracking, real-time 1:1 syncs, and peer review cycles tied directly to engineering and business milestones.',
    icon: BarChart3,
    metrics: [
      { label: 'Cycle Completion', value: '98.4%', trend: '+14% vs avg' },
      { label: 'Review Latency', value: '2.1 days', trend: '-40% faster' },
      { label: 'Goal Alignment', value: '94%', trend: 'Company-wide' },
    ],
    previewType: 'performance',
  },
  {
    id: 'compliance',
    title: 'SOC 2 & Continuous Compliance',
    category: 'security',
    badge: 'Zero Trust',
    description:
      'Continuous automated evidence collection across AWS, GCP, Cloudflare, and GitHub with automated auditor-ready export bundles.',
    icon: ShieldCheck,
    metrics: [
      { label: 'Continuous Tests', value: '142 / 142', trend: '100% Pass' },
      { label: 'Evidence Collection', value: 'Automated', trend: 'Every 5m' },
      { label: 'Standards', value: 'SOC2 / HIPAA', trend: 'ISO 27001' },
    ],
    previewType: 'compliance',
  },
  {
    id: 'api',
    title: 'REST & GraphQL Developer APIs',
    category: 'dx',
    badge: 'Type-Safe SDKs',
    description:
      'Fully typed OpenAPI 3.1 & TypeScript SDKs with sub-millisecond edge response times, webhooks, and granular scoped API keys.',
    icon: Code2,
    metrics: [
      { label: 'API Median Latency', value: '18ms', trend: 'Global Edge' },
      { label: 'Webhook Delivery', value: '99.999%', trend: 'Automatic Retry' },
      { label: 'Rate Limit', value: '10k req/s', trend: 'Configurable' },
    ],
    previewType: 'api',
  },
  {
    id: 'copilot',
    title: 'Autonomous People Ops Copilot',
    category: 'ai',
    badge: 'Agentic AI',
    description:
      'Natural language queries over workforce data, intelligent anomaly detection in compensation bands, and automated policy drafts.',
    icon: Bot,
    metrics: [
      { label: 'Inference Speed', value: '94 tps', trend: 'Claude 3.5' },
      { label: 'Accuracy Score', value: '99.6%', trend: 'RAG Grounded' },
      { label: 'Task Automation', value: '78%', trend: 'Self-serve' },
    ],
    previewType: 'copilot',
  },
]

const filteredFeatures = computed(() => {
  if (activeCategory.value === 'all') return features
  return features.filter((f) => f.category === activeCategory.value)
})

const activeFeature = computed(() => {
  return features.find((f) => f.id === selectedFeatureId.value) ?? features[0]
})
</script>

<template>
  <section data-slot="features-01" class="bg-background border-border relative w-full border-y py-16 lg:py-24">
    <div class="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2">
            <Badge
              variant="outline"
              class="border-primary/30 text-primary bg-primary/5 gap-1.5 px-2.5 py-1 font-mono text-xs tracking-wide uppercase"
            >
              <Sparkles class="size-3.5" />
              Unified Architecture
            </Badge>
            <span class="text-muted-foreground font-mono text-xs">v4.2 Enterprise Release</span>
          </div>
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Engineered for High-Velocity Teams.
          </h2>
          <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Six modular, composable building blocks that directly interconnect without third-party glue code.
          </p>
        </div>

        <!-- Category Filters -->
        <div class="bg-muted/60 border-border flex flex-wrap items-center gap-1.5 rounded-lg border p-1">
          <button
            v-for="cat in [
              { id: 'all', label: 'All Modules' },
              { id: 'core', label: 'Core Platform' },
              { id: 'dx', label: 'Developer DX' },
              { id: 'security', label: 'Security' },
              { id: 'ai', label: 'Agentic AI' },
            ]"
            :key="cat.id"
            type="button"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            :class="
              activeCategory === cat.id
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="activeCategory = cat.id as any"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Main Interactive Workbench Layout -->
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <!-- Feature Cards Navigation (5 Cols) -->
        <div class="space-y-3 lg:col-span-5">
          <div
            v-for="item in filteredFeatures"
            :key="item.id"
            class="group cursor-pointer rounded-xl border p-4 transition-all duration-150"
            :class="
              selectedFeatureId === item.id
                ? 'bg-card border-primary/40 ring-primary/20 shadow-xs ring-1'
                : 'bg-card/40 border-border hover:bg-card/80 hover:border-border/80'
            "
            @click="selectedFeatureId = item.id"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div
                  class="flex size-9 items-center justify-center rounded-lg border transition-colors"
                  :class="
                    selectedFeatureId === item.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border group-hover:text-foreground'
                  "
                >
                  <component :is="item.icon" class="size-4.5" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-foreground text-sm font-semibold tracking-tight">{{ item.title }}</h3>
                    <Badge variant="secondary" class="px-1.5 py-0 text-xs font-normal">
                      {{ item.badge }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                    {{ item.description }}
                  </p>
                </div>
              </div>
              <ChevronRight
                class="text-muted-foreground size-4 shrink-0 transition-transform"
                :class="selectedFeatureId === item.id ? 'text-primary translate-x-0.5' : 'group-hover:translate-x-0.5'"
              />
            </div>

            <!-- Key metrics row in card -->
            <div
              v-if="selectedFeatureId === item.id"
              class="border-border/60 mt-4 grid grid-cols-3 gap-2 border-t pt-3"
            >
              <div v-for="m in item.metrics" :key="m.label" class="space-y-0.5">
                <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">{{ m.label }}</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-foreground text-xs font-semibold">{{ m.value }}</span>
                  <span class="font-mono text-xs text-emerald-600 dark:text-emerald-400">{{ m.trend }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Interactive Simulation Canvas (7 Cols) -->
        <div class="lg:col-span-7">
          <Card class="bg-card border-border sticky top-6 overflow-hidden shadow-sm">
            <!-- Workbench Header Bar -->
            <CardHeader
              class="border-border bg-muted/20 flex-row items-center justify-between space-y-0 border-b px-5 py-3.5"
            >
              <div class="flex items-center gap-2.5">
                <div class="flex size-2 animate-pulse rounded-full bg-emerald-500" />
                <span class="text-muted-foreground font-mono text-xs tracking-wider uppercase"
                  >Interactive Simulation</span
                >
                <Separator orientation="vertical" class="h-3.5" />
                <span class="text-foreground text-xs font-semibold">{{ activeFeature.title }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="h-7 gap-1.5 px-2.5 font-mono text-xs"
                  @click="copySnippet(JSON.stringify(activeFeature, null, 2))"
                >
                  <Check v-if="copied" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ copied ? 'Copied' : 'Schema JSON' }}</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent class="space-y-6 p-6">
              <!-- Simulation 1: Global Employee Directory -->
              <div v-if="activeFeature.previewType === 'directory'" class="space-y-4">
                <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div class="relative w-full sm:w-64">
                    <Search class="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
                    <Input
                      v-model="searchQuery"
                      placeholder="Search 1,420 employees..."
                      class="h-8 pl-8 font-sans text-xs"
                    />
                  </div>
                  <div class="flex items-center gap-2 self-end sm:self-auto">
                    <span class="text-muted-foreground font-mono text-xs">Filter Team:</span>
                    <select
                      v-model="selectedRole"
                      class="border-input bg-background text-foreground focus:ring-ring h-8 rounded-md border px-2 py-1 text-xs focus:ring-1 focus:outline-none"
                    >
                      <option value="All Roles">All Teams</option>
                      <option value="Design Systems">Design Systems</option>
                      <option value="Core Infrastructure">Core Infrastructure</option>
                      <option value="SecOps">SecOps</option>
                      <option value="Enterprise Suite">Enterprise Suite</option>
                    </select>
                  </div>
                </div>

                <div class="border-border divide-border bg-background divide-y overflow-hidden rounded-lg border">
                  <div
                    v-for="emp in filteredEmployees"
                    :key="emp.id"
                    class="hover:bg-muted/40 flex items-center justify-between p-3 text-xs transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-full border text-xs font-semibold"
                      >
                        {{
                          emp.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                        }}
                      </div>
                      <div>
                        <p class="text-foreground font-medium">{{ emp.name }}</p>
                        <p class="text-muted-foreground text-xs">{{ emp.role }} · {{ emp.team }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-muted-foreground hidden font-mono text-xs sm:inline-block">{{
                        emp.location
                      }}</span>
                      <Badge
                        variant="outline"
                        class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        {{ emp.status }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Simulation 2: Multi-Currency Global Payroll -->
              <div v-else-if="activeFeature.previewType === 'payroll'" class="space-y-5">
                <div class="grid grid-cols-3 gap-3">
                  <div class="border-border bg-muted/20 rounded-lg border p-3">
                    <p class="text-muted-foreground font-mono text-xs">Gross Run</p>
                    <p class="text-foreground mt-1 text-lg font-bold">${{ grossAmount.toLocaleString() }}</p>
                  </div>
                  <div class="border-border bg-muted/20 rounded-lg border p-3">
                    <p class="text-muted-foreground font-mono text-xs">Statutory Taxes</p>
                    <p class="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">
                      -${{ Math.round(estimatedDeductions).toLocaleString() }}
                    </p>
                  </div>
                  <div class="border-border rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <p class="font-mono text-xs text-emerald-700 dark:text-emerald-300">Net Settlement</p>
                    <p class="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ${{ Math.round(netPayout).toLocaleString() }}
                    </p>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between text-xs">
                    <span class="text-muted-foreground"
                      >Adjust Headcount (Employees: {{ simulatedEmployeesCount }})</span
                    >
                    <span class="text-foreground font-mono"
                      >${{ (grossAmount / simulatedEmployeesCount).toFixed(0) }}/mo avg</span
                    >
                  </div>
                  <input
                    v-model.number="simulatedEmployeesCount"
                    type="range"
                    min="10"
                    max="150"
                    class="bg-muted accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
                  />
                </div>

                <div
                  class="border-border bg-background flex items-center justify-between rounded-lg border p-3 text-xs"
                >
                  <div class="flex items-center gap-2">
                    <Globe class="text-primary size-4" />
                    <span>Cross-border SEPA & FedNow Instant Payout Batch: Ready</span>
                  </div>
                  <Badge variant="secondary" class="font-mono text-xs">Zero-FX Spread</Badge>
                </div>
              </div>

              <!-- Simulation 3: SOC 2 & Compliance -->
              <div v-else-if="activeFeature.previewType === 'compliance'" class="space-y-4">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-foreground font-semibold"
                    >Continuous Automated Compliance Check (142 Controls)</span
                  >
                  <Badge
                    variant="outline"
                    class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Audit Grade A+
                  </Badge>
                </div>

                <div class="space-y-2.5">
                  <div
                    v-for="ctrl in controls"
                    :key="ctrl.name"
                    class="border-border bg-background flex items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <div class="flex items-center gap-2.5">
                      <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
                      <div>
                        <p class="text-foreground font-medium">{{ ctrl.name }}</p>
                        <p class="text-muted-foreground font-mono text-xs">{{ ctrl.framework }}</p>
                      </div>
                    </div>
                    <span class="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">{{
                      ctrl.score
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Simulation 4: Developer APIs & SDKs -->
              <div v-else-if="activeFeature.previewType === 'api'" class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground font-mono text-xs"
                    >curl --request POST https://api.uipkge.dev/v1/workforce</span
                  >
                  <Badge variant="secondary" class="font-mono text-xs">TypeScript SDK</Badge>
                </div>
                <div
                  class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100"
                >
                  <span class="text-zinc-500">// Initialize client with zero-latency edge caching</span><br />
                  <span class="text-purple-400">import</span> { <span class="text-yellow-300">UipkgeClient</span> }
                  <span class="text-purple-400">from</span> <span class="text-emerald-400">'@uipkge/sdk'</span
                  ><br /><br />
                  <span class="text-purple-400">const</span> client = <span class="text-purple-400">new</span>
                  <span class="text-yellow-300">UipkgeClient</span>({ apiKey: process.env.<span class="text-cyan-300"
                    >UIPKGE_KEY</span
                  >
                  })<br /><br />
                  <span class="text-purple-400">const</span> { data } =
                  <span class="text-purple-400">await</span> client.directory.<span class="text-blue-400"
                    >syncOrgChart</span
                  >({<br />
                  &nbsp;&nbsp;autoProvision: <span class="text-emerald-400">true</span>,<br />
                  &nbsp;&nbsp;enforceMfa: <span class="text-emerald-400">true</span>,<br />
                  &nbsp;&nbsp;scimSyncInterval: <span class="text-amber-300">300</span>,<br />
                  })
                </div>
              </div>

              <!-- Simulation 5: AI Copilot & Agentic Ops -->
              <div v-else class="space-y-4">
                <div class="space-y-2">
                  <label class="text-foreground text-xs font-medium">Natural Language Workforce Assistant</label>
                  <div class="flex gap-2">
                    <Input
                      v-model="copilotPrompt"
                      class="h-9 text-xs"
                      placeholder="Ask copilot to run calculations or compliance checks..."
                    />
                    <Button
                      size="sm"
                      class="h-9 shrink-0 gap-1.5 px-4 text-xs font-semibold"
                      :disabled="copilotExecuting"
                      @click="triggerCopilot"
                    >
                      <RefreshCw v-if="copilotExecuting" class="size-3.5 animate-spin" />
                      <Bot v-else class="size-3.5" />
                      Run
                    </Button>
                  </div>
                </div>

                <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-4">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground font-mono text-xs">Copilot Real-time Synthesis</span>
                    <Badge variant="outline" class="font-mono text-xs">Claude 3.5 Sonnet</Badge>
                  </div>
                  <p
                    class="text-foreground bg-background border-border rounded-md border p-3 font-mono text-xs leading-relaxed"
                  >
                    {{ copilotOutput }}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter class="border-border bg-muted/10 flex items-center justify-between border-t px-5 py-3 text-xs">
              <span class="text-muted-foreground font-mono">Architecture SLA: 99.99% Multi-region Active-Active</span>
              <Button variant="link" size="sm" class="text-primary h-auto gap-1 p-0 text-xs">
                Explore Full Documentation
                <ArrowRight class="size-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
