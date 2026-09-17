<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Activity,
  Check,
  ChevronRight,
  Copy,
  Database,
  HardDrive,
  KeyRound,
  Layers,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export interface OutputPort {
  id: string
  name: string
  type: 'snowflake' | 'kafka' | 'graphql' | 's3' | 'postgres'
  typeLabel: string
  uri: string
  latency: string
  status: 'online' | 'degraded' | 'syncing'
}

export interface DataProductData {
  id: string
  name: string
  version: string
  domain: string
  tier: 'Gold Tier 1' | 'Silver Tier 2' | 'Bronze Tier 3'
  description: string
  slaCompliance: number
  freshness: string
  completenessPct: number
  activeConsumersCount: number
  owner: {
    name: string
    role: string
    team: string
    avatar?: string
    fallback: string
  }
  outputPorts: OutputPort[]
  tags: string[]
  certifiedCompliance: string
  lastUpdated: string
}

const DEFAULT_DATA_PRODUCT: DataProductData = {
  id: 'dp-cust-360',
  name: 'dp_customer_360_profile',
  version: 'v3.2.0',
  domain: 'Customer Intelligence & Growth',
  tier: 'Gold Tier 1',
  description:
    'Unified customer identity graph consolidating CRM accounts, Stripe transaction volumes, and behavioral product telemetry into clean semantic marts.',
  slaCompliance: 99.8,
  freshness: 'Updated 8m ago · Hourly sync',
  completenessPct: 99.4,
  activeConsumersCount: 14,
  owner: {
    name: 'Marcus Vance',
    role: 'Staff Data Architect',
    team: 'Data Platform Squad',
    fallback: 'MV',
  },
  outputPorts: [
    {
      id: 'port-snow',
      name: 'analytics.gold_customer_360',
      type: 'snowflake',
      typeLabel: 'Snowflake Table',
      uri: 'snowflake://analytics_prod.dw/analytics.gold_customer_360',
      latency: '< 1h Batch SLA',
      status: 'online',
    },
    {
      id: 'port-kafka',
      name: 'events.customer.updates.v2',
      type: 'kafka',
      typeLabel: 'Kafka Stream',
      uri: 'kafka://events.kafka.internal:9092/events.customer.updates.v2',
      latency: '< 100ms Event Time',
      status: 'online',
    },
    {
      id: 'port-gql',
      name: 'GraphQL Query Port',
      type: 'graphql',
      typeLabel: 'GraphQL API',
      uri: 'https://api.uipkge.dev/graphql?query=customer360',
      latency: '< 45ms p99',
      status: 'online',
    },
    {
      id: 'port-s3',
      name: 'Parquet Lake Export',
      type: 's3',
      typeLabel: 'Parquet S3 Lake',
      uri: 's3://lakehouse-gold/customer_360/snapshot_latest.parquet',
      latency: '24h Partitioned',
      status: 'online',
    },
  ],
  tags: ['#customer360', '#revenue', '#identity', '#gold_marts', '#dbt_certified'],
  certifiedCompliance: 'SOC2 Type II & GDPR Art. 15 Compliant',
  lastUpdated: 'Aug 21, 2026',
}

interface Props {
  product?: DataProductData
  variant?: 'full' | 'compact' | 'minimal'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'full',
})

const activeProduct = computed(() => props.product ?? DEFAULT_DATA_PRODUCT)
const copiedPortId = ref<string | null>(null)
const accessRequested = ref(false)
const isQueryingPort = ref(false)
const selectedPortId = ref<string>(DEFAULT_DATA_PRODUCT.outputPorts[0].id)

const selectedPort = computed(() => {
  return (
    activeProduct.value.outputPorts.find((p) => p.id === selectedPortId.value) ?? activeProduct.value.outputPorts[0]
  )
})

function copyUri(port: OutputPort) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(port.uri)
    copiedPortId.value = port.id
    setTimeout(() => {
      if (copiedPortId.value === port.id) {
        copiedPortId.value = null
      }
    }, 2000)
  }
}

function handleRequestAccess() {
  accessRequested.value = true
  setTimeout(() => {
    accessRequested.value = false
  }, 4000)
}

function handleQueryPort() {
  isQueryingPort.value = true
  setTimeout(() => {
    isQueryingPort.value = false
  }, 1200)
}
</script>

<template>
  <div data-slot="data-product-card" :class="cn('w-full', props.class)">
    <Card
      class="border-border bg-card text-card-foreground hover:border-primary/40 relative flex flex-col overflow-hidden shadow-xs transition-all duration-200 hover:shadow-sm"
    >
      <CardHeader class="space-y-3 p-5 pb-3">
        <!-- Badges & Governance Ribbon -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <!-- Domain Tag -->
            <Badge
              wrap
              variant="outline"
              class="border-border bg-muted/30 text-muted-foreground gap-1 text-xs font-normal"
            >
              <Layers class="text-primary size-3" aria-hidden="true" />
              <span>{{ activeProduct.domain }}</span>
            </Badge>

            <!-- Tier Tag -->
            <Badge
              wrap
              variant="secondary"
              class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles class="size-3" aria-hidden="true" />
              {{ activeProduct.tier }}
            </Badge>
          </div>

          <!-- Compliance Seal -->
          <div class="text-muted-foreground flex items-center gap-1 text-xs">
            <ShieldCheck class="size-3.5 text-emerald-500" aria-hidden="true" />
            <span class="hidden font-medium sm:inline">{{ activeProduct.certifiedCompliance }}</span>
            <span class="font-medium sm:hidden">SOC2 Certified</span>
          </div>
        </div>

        <!-- Title & Version Lockup -->
        <div class="space-y-1">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-baseline gap-2">
              <h3 class="text-foreground font-mono text-base font-bold tracking-tight break-all sm:text-lg">
                {{ activeProduct.name }}
              </h3>
              <span class="text-muted-foreground font-mono text-xs font-medium">
                {{ activeProduct.version }}
              </span>
            </div>

            <Badge wrap variant="outline" class="text-muted-foreground gap-1 text-xs font-normal">
              <Activity class="size-3 animate-pulse text-emerald-500" aria-hidden="true" />
              <span class="font-mono tabular-nums">{{ activeProduct.slaCompliance }}% SLA</span>
            </Badge>
          </div>

          <!-- Business Value Description -->
          <CardDescription class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
            {{ activeProduct.description }}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent class="flex-1 space-y-4 p-5 pt-0">
        <!-- 4 Key Telemetry Metrics Strip -->
        <div
          class="border-border/80 bg-muted/20 grid grid-cols-2 gap-2 rounded-lg border p-2.5 text-xs sm:grid-cols-4 sm:p-3"
        >
          <div class="space-y-0.5">
            <span class="text-muted-foreground block">SLA Compliance</span>
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-sm font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                {{ activeProduct.slaCompliance }}%
              </span>
              <span class="font-semibold text-emerald-500">✓</span>
            </div>
            <Progress :model-value="activeProduct.slaCompliance" class="bg-muted h-1.5" />
          </div>

          <div class="space-y-0.5">
            <span class="text-muted-foreground block">Data Freshness</span>
            <span
              class="text-foreground block truncate font-mono text-xs font-semibold"
              :title="activeProduct.freshness"
            >
              {{ activeProduct.freshness }}
            </span>
            <span class="text-muted-foreground text-xs">SLA: &lt; 1h Target</span>
          </div>

          <div class="space-y-0.5">
            <span class="text-muted-foreground block">Completeness</span>
            <span class="text-foreground block font-mono text-sm font-bold tabular-nums">
              {{ activeProduct.completenessPct }}%
            </span>
            <span class="text-muted-foreground text-xs">0.6% Max Nulls</span>
          </div>

          <div class="space-y-0.5">
            <span class="text-muted-foreground block">Active Consumers</span>
            <div class="flex items-center gap-1">
              <Users class="text-primary size-3.5" aria-hidden="true" />
              <span class="text-foreground font-mono text-sm font-bold tabular-nums">
                {{ activeProduct.activeConsumersCount }} Apps
              </span>
            </div>
            <span class="text-muted-foreground text-xs">Certified Live Ports</span>
          </div>
        </div>

        <!-- Multi-Modal Output Ports Selector -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-foreground text-xs font-semibold tracking-wide uppercase">
              Certified Multi-Modal Output Ports ({{ activeProduct.outputPorts.length }})
            </span>
            <span class="text-muted-foreground text-xs">Click port to inspect URI</span>
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              v-for="port in activeProduct.outputPorts"
              :key="port.id"
              type="button"
              :class="[
                'group flex items-start justify-between rounded-lg border p-2.5 text-left transition-all',
                selectedPortId === port.id
                  ? 'border-primary/50 bg-primary/5 ring-primary/30 ring-1'
                  : 'border-border bg-card/60 hover:border-primary/25 hover:bg-muted/40',
              ]"
              @click="selectedPortId = port.id"
            >
              <div class="flex min-w-0 items-start gap-2.5">
                <div
                  class="bg-muted text-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md"
                >
                  <Database v-if="port.type === 'snowflake'" class="size-3.5 text-sky-500" aria-hidden="true" />
                  <Radio v-else-if="port.type === 'kafka'" class="size-3.5 text-amber-500" aria-hidden="true" />
                  <Server v-else-if="port.type === 'graphql'" class="size-3.5 text-purple-500" aria-hidden="true" />
                  <HardDrive v-else class="size-3.5 text-emerald-500" aria-hidden="true" />
                </div>
                <div class="min-w-0 space-y-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-foreground truncate text-xs font-semibold">{{ port.typeLabel }}</span>
                    <span class="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                  </div>
                  <p class="text-muted-foreground truncate font-mono text-xs">{{ port.name }}</p>
                  <p class="text-muted-foreground text-xs font-normal">{{ port.latency }}</p>
                </div>
              </div>

              <div class="shrink-0 pt-0.5 pl-1">
                <span
                  v-if="selectedPortId === port.id"
                  class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-xs font-bold"
                >
                  ✓
                </span>
                <ChevronRight
                  v-else
                  class="text-muted-foreground/40 group-hover:text-foreground size-4"
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- Active Selected Port URI Inspector Box -->
        <div
          class="border-border bg-muted/40 flex flex-col gap-2 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0 space-y-0.5">
            <span class="text-muted-foreground text-xs font-medium">Selected Endpoint URI:</span>
            <p class="text-foreground truncate font-mono text-xs font-medium select-all">
              {{ selectedPort.uri }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-1.5 pt-1 sm:pt-0">
            <Button variant="outline" size="sm" class="h-7 gap-1 px-2 text-xs" @click="copyUri(selectedPort)">
              <Check v-if="copiedPortId === selectedPort.id" class="size-3 text-emerald-500" aria-hidden="true" />
              <Copy v-else class="size-3" aria-hidden="true" />
              <span>{{ copiedPortId === selectedPort.id ? 'Copied' : 'Copy URI' }}</span>
            </Button>
          </div>
        </div>

        <!-- Product Owner & Tags Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <!-- Owner Profile -->
          <div class="flex items-center gap-2">
            <Avatar class="border-border size-7 border">
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
                {{ activeProduct.owner.fallback }}
              </AvatarFallback>
            </Avatar>
            <div>
              <p class="text-foreground text-xs leading-none font-medium">
                {{ activeProduct.owner.name }}
              </p>
              <p class="text-muted-foreground text-xs">
                {{ activeProduct.owner.team }}
              </p>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap items-center gap-1">
            <Badge
              wrap
              v-for="tag in activeProduct.tags.slice(0, 3)"
              :key="tag"
              variant="outline"
              class="text-muted-foreground border-border/70 text-xs font-normal"
            >
              {{ tag }}
            </Badge>
          </div>
        </div>
      </CardContent>

      <Separator />

      <!-- Footer Action Controls -->
      <CardFooter class="flex flex-wrap items-center justify-between gap-2 p-4 sm:px-5">
        <div class="text-muted-foreground text-xs">
          Last contract verified: <span class="text-foreground font-medium">{{ activeProduct.lastUpdated }}</span>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            class="h-8 gap-1.5 text-xs font-medium"
            :disabled="isQueryingPort"
            @click="handleQueryPort"
          >
            <Zap v-if="!isQueryingPort" class="size-3.5 text-amber-500" aria-hidden="true" />
            <span v-if="isQueryingPort">Running Test Query...</span>
            <span v-else>Query Port</span>
          </Button>

          <Button
            size="sm"
            class="h-8 gap-1.5 text-xs font-semibold shadow-xs"
            :disabled="accessRequested"
            @click="handleRequestAccess"
          >
            <KeyRound class="size-3.5" aria-hidden="true" />
            <span>{{ accessRequested ? 'Access Requested ✓' : 'Request Access' }}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
