<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  FileCode,
  FileCode2,
  FileJson,
  HardDrive,
  Key,
  Link2,
  Loader2,
  Lock,
  Play,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Table2,
  Tag,
  Terminal,
  Users,
  WrapText,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface SchemaField {
  name: string
  dataType: string
  format?: string
  nullable: boolean
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  foreignKeyRef?: string
  isPii?: boolean
  maskingStrategy?: string
  constraints?: string
  description: string
}

export interface LintTestRule {
  id: string
  name: string
  category: 'breaking' | 'compatibility' | 'compliance'
  categoryLabel: string
  status: 'pass' | 'warn' | 'fail'
  ruleDefinition: string
  assertionPath: string
  executionDuration: string
  evaluatedAt: string
}

export interface ConsumerService {
  id: string
  name: string
  team: string
  versionSubscribed: string
  versionStatus: 'current' | 'minor-lag' | 'major-lag'
  status: 'compliant' | 'warning' | 'deprecated'
  throughput: string
  latencyP99: string
  slaStatus: string
  compatibility: string
  lastEventReceived: string
  contact: string
}

export interface DataContractGovernanceProps {
  contractTitle?: string
  version?: string
  ownerTeam?: string
  producerService?: string
  destinationTopic?: string
  lakehouseTarget?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<DataContractGovernanceProps>(), {
  contractTitle: 'orders_placed_v3.contract.yaml',
  version: 'v3.2.0',
  ownerTeam: 'Checkout Core Engineering Squad',
  producerService: 'checkout-service-prod',
  destinationTopic: 'events.orders.placed',
  lakehouseTarget: 's3://lakehouse-analytics/tables/checkout/orders_placed_v3',
})

// --- Default Data ---
const rawYamlContract = `apiVersion: datacontract.com/v3.0.1
kind: DataContract
id: urn:datacontract:checkout:orders_placed
info:
  title: orders_placed
  version: 3.2.0
  status: enforced
  owner: Checkout Core Engineering Squad
  contact: #checkout-eng-alerts
  description: Canonical production data contract for completed checkout orders across global storefronts.

servers:
  production:
    type: kafka
    topic: events.orders.placed
    format: json_schema
    cluster: prd-us-east-kafka.internal:9092
  lakehouse:
    type: iceberg
    location: s3://lakehouse-analytics/tables/checkout/orders_placed_v3
    format: parquet

servicelevels:
  availability:
    percentage: 99.99%
    description: 30-day rolling cluster uptime
  latency:
    threshold: 100ms
    percentile: p99
  freshness:
    maxDelay: 5s
    source: cdc_debezium_postgres
  retention:
    period: 365d
    tier: hot_kafka_7d_warm_iceberg_365d

schema:
  type: object
  required:
    - order_id
    - customer_id
    - order_timestamp
    - total_amount_cents
    - currency_code
    - payment_method
    - customer_email_encrypted
    - shipping_country
    - line_items_count
  properties:
    order_id:
      type: string
      format: uuid
      nullable: false
      description: Unique primary transaction order UUID.
    customer_id:
      type: string
      format: uuid
      nullable: false
      description: Master verified customer identity reference.
    order_timestamp:
      type: string
      format: date-time
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$"
      nullable: false
      description: Event generation timestamp in UTC RFC-3339.
    total_amount_cents:
      type: integer
      minimum: 0
      maximum: 5000000
      nullable: false
      description: Gross order value denominated in lowest currency unit.
    currency_code:
      type: string
      enum: ["USD", "EUR", "GBP", "JPY", "CAD"]
      nullable: false
      description: ISO 4217 three-letter currency code.
    payment_method:
      type: string
      enum: ["credit_card", "apple_pay", "google_pay", "sepa_debit"]
      nullable: false
      description: Authorized payment gateway instrument type.
    customer_email_encrypted:
      type: string
      nullable: false
      pii: true
      masking: deterministic_sha256
      classification: restricted
      description: AES-GCM-256 encrypted customer email for fraud detection.
    shipping_country:
      type: string
      pattern: "^[A-Z]{2}$"
      nullable: false
      description: ISO 3166-1 alpha-2 destination country code.
    line_items_count:
      type: integer
      minimum: 1
      maximum: 100
      nullable: false
      description: Number of line items purchased in order.`

const schemaFields: SchemaField[] = [
  {
    name: 'order_id',
    dataType: 'string',
    format: 'uuid',
    nullable: false,
    isPrimaryKey: true,
    constraints: 'format: uuid (RFC-4122)',
    description: 'Unique primary transaction order identifier.',
  },
  {
    name: 'customer_id',
    dataType: 'string',
    format: 'uuid',
    nullable: false,
    isForeignKey: true,
    foreignKeyRef: 'customers.customer_id',
    constraints: 'format: uuid, not null',
    description: 'Master verified customer identity reference.',
  },
  {
    name: 'order_timestamp',
    dataType: 'string',
    format: 'date-time',
    nullable: false,
    constraints: 'pattern: RFC-3339 UTC',
    description: 'Event generation timestamp in strict ISO-8601 / RFC-3339 UTC.',
  },
  {
    name: 'total_amount_cents',
    dataType: 'integer',
    format: 'int64',
    nullable: false,
    constraints: '0 ≤ value ≤ 5,000,000',
    description: 'Gross order value denominated in lowest currency unit (cents).',
  },
  {
    name: 'currency_code',
    dataType: 'string',
    nullable: false,
    constraints: 'enum: [USD, EUR, GBP, JPY, CAD]',
    description: 'ISO-4217 three-letter currency code in which the charge occurred.',
  },
  {
    name: 'payment_method',
    dataType: 'string',
    nullable: false,
    constraints: 'enum: [credit_card, apple_pay, google_pay, sepa_debit]',
    description: 'Authorized payment gateway instrument method.',
  },
  {
    name: 'customer_email_encrypted',
    dataType: 'string',
    nullable: false,
    isPii: true,
    maskingStrategy: 'SHA-256 / AES-256-GCM',
    constraints: 'pii: true, restricted',
    description: 'Cryptographically enveloped customer email address.',
  },
  {
    name: 'shipping_country',
    dataType: 'string',
    nullable: false,
    constraints: 'pattern: ^[A-Z]{2}$ (ISO 3166-1)',
    description: 'Two-letter alpha-2 shipping destination country code.',
  },
  {
    name: 'line_items_count',
    dataType: 'integer',
    format: 'int32',
    nullable: false,
    constraints: '1 ≤ value ≤ 100',
    description: 'Total count of individual catalog items inside the basket.',
  },
]

const lintRules: LintTestRule[] = [
  {
    id: 'lint-1',
    name: "Field 'customer_id' remains required",
    category: 'breaking',
    categoryLabel: 'Requiredness Invariant',
    status: 'pass',
    ruleDefinition:
      'Required string UUID field cannot be made optional or omitted without a major semantic version bump (v4.0.0).',
    assertionPath: 'schema.properties.customer_id.nullable == false',
    executionDuration: '14ms',
    evaluatedAt: 'Just now',
  },
  {
    id: 'lint-2',
    name: "Field 'currency_code' enum compatibility",
    category: 'compatibility',
    categoryLabel: 'Enum Evolution',
    status: 'pass',
    ruleDefinition:
      'Allowed currency enum set [USD, EUR, GBP, JPY, CAD] is a strict superset of v3.1; no historical enum values were pruned.',
    assertionPath: 'schema.properties.currency_code.enum (5 items)',
    executionDuration: '22ms',
    evaluatedAt: 'Just now',
  },
  {
    id: 'lint-3',
    name: 'Timestamp ISO-8601 format compliance',
    category: 'compliance',
    categoryLabel: 'Format Strictness',
    status: 'pass',
    ruleDefinition:
      "Field 'order_timestamp' adheres to strict RFC 3339 / ISO-8601 UTC regex pattern with mandatory 'Z' zone identifier.",
    assertionPath: 'format: date-time (RFC-3339 UTC)',
    executionDuration: '18ms',
    evaluatedAt: 'Just now',
  },
  {
    id: 'lint-4',
    name: 'Backward compatibility for existing consumer v3.1',
    category: 'compatibility',
    categoryLabel: 'Consumer Simulation',
    status: 'pass',
    ruleDefinition:
      'Simulated payload deserialization passed across all 8 active consumer test vectors without JSON schema deserializer exceptions.',
    assertionPath: '8/8 consumer test vectors pass',
    executionDuration: '145ms',
    evaluatedAt: 'Just now',
  },
  {
    id: 'lint-5',
    name: "Field 'customer_email_encrypted' PII Masking Rule",
    category: 'compliance',
    categoryLabel: 'Security & PII',
    status: 'pass',
    ruleDefinition:
      'Customer email field enforces cryptographic ciphertext masking (AES-GCM-256 / SHA-256) prior to publishing onto Kafka broker.',
    assertionPath: 'pii: true · masking: deterministic_sha256',
    executionDuration: '31ms',
    evaluatedAt: 'Just now',
  },
  {
    id: 'lint-6',
    name: 'Schema type narrowing safety',
    category: 'breaking',
    categoryLabel: 'Type Evolution',
    status: 'pass',
    ruleDefinition:
      'No existing schema properties had primitive data types narrowed or widened in a breaking manner (e.g. integer to short).',
    assertionPath: '0 type narrowing violations detected',
    executionDuration: '19ms',
    evaluatedAt: 'Just now',
  },
]

const consumerServices: ConsumerService[] = [
  {
    id: 'svc-1',
    name: 'Fraud Detection Service',
    team: 'Security & Risk Squad',
    versionSubscribed: 'v3.2.0',
    versionStatus: 'current',
    status: 'compliant',
    throughput: '4,200 msg/s',
    latencyP99: '38ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: '100% Compatible',
    lastEventReceived: '1.2s ago',
    contact: '#fraud-eng',
  },
  {
    id: 'svc-2',
    name: 'Financial Ledger Mart',
    team: 'Finance Analytics Squad',
    versionSubscribed: 'v3.1.0',
    versionStatus: 'minor-lag',
    status: 'compliant',
    throughput: '1,850 msg/s',
    latencyP99: '52ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: 'Backward Compat Verified',
    lastEventReceived: '3.4s ago',
    contact: '#fin-ledger-team',
  },
  {
    id: 'svc-3',
    name: 'Email Notification Dispatcher',
    team: 'Customer Comms Team',
    versionSubscribed: 'v3.2.0',
    versionStatus: 'current',
    status: 'compliant',
    throughput: '850 msg/s',
    latencyP99: '24ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: '100% Compatible',
    lastEventReceived: '0.8s ago',
    contact: '#comms-alerts',
  },
  {
    id: 'svc-4',
    name: 'Inventory Fulfillment Pipeline',
    team: 'Supply Chain Engineering',
    versionSubscribed: 'v3.2.0',
    versionStatus: 'current',
    status: 'compliant',
    throughput: '2,100 msg/s',
    latencyP99: '34ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: '100% Compatible',
    lastEventReceived: '1.5s ago',
    contact: '#supply-chain-dev',
  },
  {
    id: 'svc-5',
    name: 'Customer Data Platform (CDP)',
    team: 'Growth & Marketing Tech',
    versionSubscribed: 'v3.0.4',
    versionStatus: 'minor-lag',
    status: 'compliant',
    throughput: '3,400 msg/s',
    latencyP99: '48ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: 'v3.0 Compat Mode',
    lastEventReceived: '2.1s ago',
    contact: '#growth-infra',
  },
  {
    id: 'svc-6',
    name: 'Realtime Order Tracking Gateway',
    team: 'Mobile & Web Edge Platform',
    versionSubscribed: 'v3.2.0',
    versionStatus: 'current',
    status: 'compliant',
    throughput: '5,600 msg/s',
    latencyP99: '19ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: '100% Compatible',
    lastEventReceived: '0.4s ago',
    contact: '#edge-team',
  },
  {
    id: 'svc-7',
    name: 'Audit Log & Compliance Vault',
    team: 'Infosec & Legal Systems',
    versionSubscribed: 'v3.2.0',
    versionStatus: 'current',
    status: 'compliant',
    throughput: '1,200 msg/s',
    latencyP99: '28ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: '100% Compatible',
    lastEventReceived: '4.2s ago',
    contact: '#infosec-ops',
  },
  {
    id: 'svc-8',
    name: 'Search & Recommendation Indexer',
    team: 'Discovery & ML Platform',
    versionSubscribed: 'v3.1.2',
    versionStatus: 'minor-lag',
    status: 'compliant',
    throughput: '980 msg/s',
    latencyP99: '31ms',
    slaStatus: 'SLA Compliant (p99 < 100ms)',
    compatibility: 'Backward Compat Verified',
    lastEventReceived: '1.9s ago',
    contact: '#discovery-ml',
  },
]

// --- State ---
const activeInspectorTab = ref<'yaml' | 'schema' | 'sla'>('yaml')
const selectedLinterFilter = ref<'all' | 'breaking' | 'compatibility' | 'compliance'>('all')
const consumerSearch = ref('')
const isValidatingYaml = ref(false)
const validationToast = ref<string | null>(null)
const isRunningLinter = ref(false)
const copiedYaml = ref(false)
const copiedSchema = ref(false)
const wrapYamlLines = ref(false)
const lastValidatedTimestamp = ref('Just now')

// --- Computed ---
const filteredLintRules = computed(() => {
  if (selectedLinterFilter.value === 'all') return lintRules
  return lintRules.filter((r) => r.category === selectedLinterFilter.value)
})

const filteredConsumers = computed(() => {
  const q = consumerSearch.value.trim().toLowerCase()
  if (!q) return consumerServices
  return consumerServices.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.team.toLowerCase().includes(q) ||
      c.versionSubscribed.toLowerCase().includes(q) ||
      c.compatibility.toLowerCase().includes(q),
  )
})

const passingRulesCount = computed(() => lintRules.filter((r) => r.status === 'pass').length)

// --- Actions ---
function handleValidateContract() {
  if (isValidatingYaml.value) return
  isValidatingYaml.value = true
  validationToast.value = 'Validating 6 linter invariants & 8 consumer vectors...'

  setTimeout(() => {
    isValidatingYaml.value = false
    lastValidatedTimestamp.value = 'Just now'
    validationToast.value = 'Contract Validated · 0 Breaking Changes · 100% Compatible'
    setTimeout(() => {
      validationToast.value = null
    }, 3500)
  }, 750)
}

function handleRunLinter() {
  if (isRunningLinter.value) return
  isRunningLinter.value = true

  setTimeout(() => {
    isRunningLinter.value = false
  }, 600)
}

function handleCopyYaml() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(rawYamlContract)
    copiedYaml.value = true
    setTimeout(() => {
      copiedYaml.value = false
    }, 2000)
  }
}

function handleCopyJsonSchema() {
  const jsonSchemaObj = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'orders_placed',
    description: 'Canonical production data contract for completed checkout orders across global storefronts.',
    type: 'object',
    required: schemaFields.filter((f) => !f.nullable).map((f) => f.name),
    properties: Object.fromEntries(
      schemaFields.map((f) => [
        f.name,
        {
          type: f.dataType,
          ...(f.format ? { format: f.format } : {}),
          description: f.description,
          ...(f.isPii ? { 'x-pii': true, 'x-masking': f.maskingStrategy } : {}),
        },
      ]),
    ),
  }

  const jsonStr = JSON.stringify(jsonSchemaObj, null, 2)
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(jsonStr)
    copiedSchema.value = true
    setTimeout(() => {
      copiedSchema.value = false
    }, 2000)
  }
}

function handleExportSchema() {
  const jsonSchemaObj = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    id: 'urn:datacontract:checkout:orders_placed',
    version: props.version,
    title: 'orders_placed',
    owner: props.ownerTeam,
    producer: props.producerService,
    topic: props.destinationTopic,
    exportedAt: new Date().toISOString(),
    servicelevels: {
      availability: '99.99%',
      latencyP99: '< 100ms',
      freshness: '< 5s CDC',
      retention: '365d',
    },
    schema: {
      type: 'object',
      required: schemaFields.filter((f) => !f.nullable).map((f) => f.name),
      properties: Object.fromEntries(
        schemaFields.map((f) => [
          f.name,
          {
            type: f.dataType,
            ...(f.format ? { format: f.format } : {}),
            description: f.description,
            constraints: f.constraints,
            ...(f.isPii ? { 'x-pii': true, 'x-masking': f.maskingStrategy } : {}),
          },
        ]),
      ),
    },
  }

  const blobData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonSchemaObj, null, 2))
  if (typeof document !== 'undefined') {
    const link = document.createElement('a')
    link.setAttribute('href', blobData)
    link.setAttribute('download', `${props.contractTitle.replace('.yaml', '')}.json`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}
</script>

<template>
  <div
    data-slot="data-contract-governance"
    :class="
      cn(
        'border-border bg-card text-foreground flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
        props.class,
      )
    "
  >
    <!-- TOP HEADER -->
    <header class="border-border/80 bg-muted/20 border-b p-4 sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <!-- Left: Contract Title, Version, Status Badges -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <div
              class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-lg border"
            >
              <FileCode2 class="size-4" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-mono text-base font-bold break-all sm:text-lg">
                  {{ contractTitle }}
                </h2>
                <Badge variant="secondary" class="gap-1 font-mono text-xs font-medium">
                  <Tag class="size-3 text-sky-500" />
                  {{ version }} · Semantic Versioned
                </Badge>
                <Badge
                  variant="outline"
                  class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <ShieldCheck class="size-3.5 text-emerald-500" />
                  Contract Enforced & Passing
                </Badge>
              </div>
            </div>
          </div>

          <!-- Metadata Badges & Ownership Strip -->
          <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs">
            <div class="flex items-center gap-1.5">
              <Users class="size-3 text-sky-500" />
              <span>Owner:</span>
              <span class="text-foreground font-medium">{{ ownerTeam }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Server class="size-3 text-violet-500" />
              <span>Producer:</span>
              <span class="text-foreground font-medium">{{ producerService }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Radio class="size-3 text-amber-500" />
              <span>Topic:</span>
              <span class="text-foreground font-medium">{{ destinationTopic }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Lock class="size-3 text-emerald-500" />
              <span>Classification:</span>
              <span class="text-foreground font-medium">PII Sensitive · Encrypted</span>
            </div>
          </div>
        </div>

        <!-- Right: Primary & Secondary Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs font-medium" @click="handleExportSchema">
            <Download class="size-3.5 text-sky-500" />
            <span>Export Schema (JSON Schema)</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            class="bg-primary text-primary-foreground hover:bg-primary/90 h-8 gap-1.5 text-xs font-semibold shadow-xs"
            :disabled="isValidatingYaml"
            @click="handleValidateContract"
          >
            <Loader2 v-if="isValidatingYaml" class="size-3.5 animate-spin" />
            <Play v-else class="size-3.5 fill-current" />
            <span>{{ isValidatingYaml ? 'Validating Contract...' : 'Validate Contract YAML' }}</span>
          </Button>
        </div>
      </div>

      <!-- Live Feedback Notification (if validating or completed) -->
      <div
        v-if="validationToast"
        class="border-border bg-background mt-3 flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
      >
        <div class="flex items-center gap-2">
          <ShieldCheck class="size-4 text-emerald-500" />
          <span class="text-foreground font-mono font-medium">{{ validationToast }}</span>
        </div>
        <span class="text-muted-foreground font-mono text-xs">{{ lastValidatedTimestamp }}</span>
      </div>
    </header>

    <!-- 4 DATA GOVERNANCE KPI CARDS -->
    <div class="border-border/70 bg-border grid grid-cols-1 gap-px border-b sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Registered Consumers -->
      <div class="bg-card p-4 sm:p-5">
        <div class="flex items-center justify-between pb-2">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase"> Registered Consumers </span>
          <div
            class="flex size-7 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
          >
            <Users class="size-3.5" />
          </div>
        </div>
        <div class="text-2xl font-bold tracking-tight">8 Services</div>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <Badge
            variant="outline"
            class="border-sky-500/30 bg-sky-500/10 text-xs font-normal text-sky-600 dark:text-sky-400"
          >
            8 Downstream Consumer Services
          </Badge>
          <span class="text-muted-foreground">across 3 domains</span>
        </div>
      </div>

      <!-- Card 2: Breaking Changes Detected -->
      <div class="bg-card p-4 sm:p-5">
        <div class="flex items-center justify-between pb-2">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase"> Breaking Changes </span>
          <div
            class="flex size-7 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck class="size-3.5" />
          </div>
        </div>
        <div class="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">0 Breaking</div>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <Badge
            variant="outline"
            class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            0 Breaking Changes
          </Badge>
          <span class="text-muted-foreground">100% backward compat</span>
        </div>
      </div>

      <!-- Card 3: Schema Freshness SLA -->
      <div class="bg-card p-4 sm:p-5">
        <div class="flex items-center justify-between pb-2">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase"> Freshness SLA </span>
          <div
            class="flex size-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <Activity class="size-3.5" />
          </div>
        </div>
        <div class="text-2xl font-bold tracking-tight">99.9% CDC</div>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <Badge
            variant="outline"
            class="border-amber-500/30 bg-amber-500/10 text-xs font-normal text-amber-600 dark:text-amber-400"
          >
            SLA: 99.9% · Real-time CDC
          </Badge>
          <span class="text-muted-foreground">p99 &lt; 85ms</span>
        </div>
      </div>

      <!-- Card 4: Quality Assertions Bound -->
      <div class="bg-card p-4 sm:p-5">
        <div class="flex items-center justify-between pb-2">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase"> Quality Assertions </span>
          <div
            class="flex size-7 items-center justify-center rounded-md border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400"
          >
            <CheckCircle2 class="size-3.5" />
          </div>
        </div>
        <div class="text-2xl font-bold tracking-tight">14 Active</div>
        <div class="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <Badge
            variant="outline"
            class="border-violet-500/30 bg-violet-500/10 text-xs font-normal text-violet-600 dark:text-violet-400"
          >
            14 Schema Constraints Active
          </Badge>
          <span class="text-muted-foreground">14/14 passing</span>
        </div>
      </div>
    </div>

    <!-- 2-COLUMN DATA CONTRACT STUDIO -->
    <div class="divide-border grid flex-1 grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
      <!-- LEFT COLUMN: CONTRACT SCHEMA & SLA INSPECTOR (45% -> lg:col-span-5) -->
      <section class="bg-muted/10 flex flex-col space-y-4 p-4 sm:p-5 lg:col-span-5">
        <!-- Section Header -->
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <Code2 class="text-primary size-4" />
              <h3 class="text-sm font-semibold">Contract Specification & SLA</h3>
            </div>
            <p class="text-muted-foreground text-xs">
              OpenDataContract v3.0 schema definitions and producer guarantees
            </p>
          </div>
        </div>

        <!-- Tabs Container -->
        <Tabs default-value="yaml" v-model="activeInspectorTab" class="w-full">
          <div class="flex items-center justify-between gap-2 pb-1">
            <TabsList variant="segmented" class="h-8">
              <TabsTrigger value="yaml" class="h-7 gap-1 px-2.5 text-xs">
                <FileCode class="size-3.5" />
                <span>YAML Spec</span>
              </TabsTrigger>
              <TabsTrigger value="schema" class="h-7 gap-1 px-2.5 text-xs">
                <Table2 class="size-3.5" />
                <span>Fields ({{ schemaFields.length }})</span>
              </TabsTrigger>
              <TabsTrigger value="sla" class="h-7 gap-1 px-2.5 text-xs">
                <Activity class="size-3.5" />
                <span>SLA Agreements</span>
              </TabsTrigger>
            </TabsList>

            <!-- Actions per tab -->
            <div class="flex items-center gap-1">
              <Button
                v-if="activeInspectorTab === 'yaml'"
                variant="ghost"
                size="sm"
                class="h-7 px-2 text-xs"
                :title="wrapYamlLines ? 'Disable line wrap' : 'Enable line wrap'"
                @click="wrapYamlLines = !wrapYamlLines"
              >
                <WrapText class="size-3.5" />
              </Button>

              <Button
                v-if="activeInspectorTab === 'yaml'"
                variant="ghost"
                size="sm"
                class="h-7 gap-1 px-2 text-xs"
                @click="handleCopyYaml"
              >
                <Check v-if="copiedYaml" class="size-3.5 text-emerald-500" />
                <Copy v-else class="size-3.5" />
                <span>{{ copiedYaml ? 'Copied' : 'Copy' }}</span>
              </Button>

              <Button
                v-if="activeInspectorTab === 'schema'"
                variant="ghost"
                size="sm"
                class="h-7 gap-1 px-2 text-xs"
                @click="handleCopyJsonSchema"
              >
                <Check v-if="copiedSchema" class="size-3.5 text-emerald-500" />
                <FileJson v-else class="size-3.5" />
                <span>{{ copiedSchema ? 'Copied JSON' : 'Copy JSON' }}</span>
              </Button>
            </div>
          </div>

          <!-- TAB 1: YAML SPECIFICATION -->
          <TabsContent value="yaml" class="mt-2 space-y-3 focus-visible:outline-hidden">
            <div
              class="border-border bg-muted/40 relative overflow-hidden rounded-lg border font-mono text-xs shadow-xs"
            >
              <!-- Code Header Bar -->
              <div class="border-border/80 bg-muted/70 flex items-center justify-between border-b px-3 py-1.5 text-xs">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-emerald-500" />
                  <span class="text-foreground font-semibold">orders_placed_v3.contract.yaml</span>
                </div>
                <div class="text-muted-foreground flex items-center gap-2">
                  <span>UTF-8</span>
                  <span>YAML 1.2</span>
                </div>
              </div>

              <!-- Monospace YAML Viewer -->
              <div
                class="max-h-[540px] overflow-auto p-3"
                :class="wrapYamlLines ? 'whitespace-pre-wrap' : 'whitespace-pre'"
              >
                <div
                  v-for="(line, idx) in rawYamlContract.split('\n')"
                  :key="idx"
                  class="hover:bg-muted/50 flex leading-5"
                >
                  <span class="text-muted-foreground/60 w-7 shrink-0 pr-3 text-right font-mono text-xs select-none">
                    {{ idx + 1 }}
                  </span>
                  <span
                    :class="[
                      line.startsWith('apiVersion:') || line.startsWith('kind:') || line.startsWith('id:')
                        ? 'font-semibold text-sky-600 dark:text-sky-400'
                        : line.startsWith('info:') ||
                            line.startsWith('servers:') ||
                            line.startsWith('servicelevels:') ||
                            line.startsWith('schema:')
                          ? 'font-semibold text-violet-600 dark:text-violet-400'
                          : line.includes('pii: true') || line.includes('masking:')
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : line.trim().startsWith('#')
                              ? 'text-muted-foreground/80 italic'
                              : 'text-foreground/90',
                    ]"
                    >{{ line }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Routing Details Strip -->
            <Card class="border-border bg-card p-3 shadow-none">
              <div class="grid grid-cols-2 gap-2 font-mono text-xs">
                <div class="space-y-0.5">
                  <span class="text-muted-foreground">Kafka Cluster</span>
                  <div class="text-foreground truncate font-medium">prd-us-east-kafka.internal</div>
                </div>
                <div class="space-y-0.5">
                  <span class="text-muted-foreground">Lakehouse Sync</span>
                  <div class="text-foreground truncate font-medium">Apache Iceberg (Parquet)</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <!-- TAB 2: SCHEMA FIELDS EXPLORER -->
          <TabsContent value="schema" class="mt-2 space-y-3 focus-visible:outline-hidden">
            <div class="border-border bg-card overflow-hidden rounded-lg border">
              <Table>
                <TableHeader class="bg-muted/40">
                  <TableRow class="hover:bg-transparent">
                    <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold">Field Name</TableHead>
                    <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold">Type</TableHead>
                    <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold">Nullability</TableHead>
                    <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold"
                      >Tags / Constraints</TableHead
                    >
                  </TableRow>
                </TableHeader>
                <TableBody class="font-mono text-xs">
                  <TableRow v-for="field in schemaFields" :key="field.name" class="hover:bg-muted/30">
                    <TableCell class="py-2.5 font-medium">
                      <div class="flex items-center gap-1.5">
                        <Key v-if="field.isPrimaryKey" class="size-3 text-amber-500" />
                        <Link2 v-else-if="field.isForeignKey" class="size-3 text-sky-500" />
                        <Lock v-else-if="field.isPii" class="size-3 text-emerald-500" />
                        <span class="text-foreground">{{ field.name }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="py-2.5">
                      <Badge variant="secondary" class="font-mono text-xs">
                        {{ field.dataType }}{{ field.format ? ` (${field.format})` : '' }}
                      </Badge>
                    </TableCell>
                    <TableCell class="py-2.5">
                      <Badge :variant="field.nullable ? 'outline' : 'default'" class="text-xs">
                        {{ field.nullable ? 'nullable' : 'required' }}
                      </Badge>
                    </TableCell>
                    <TableCell class="py-2.5">
                      <div class="flex flex-col gap-0.5">
                        <span v-if="field.isPii" class="font-semibold text-emerald-600 dark:text-emerald-400">
                          PII: {{ field.maskingStrategy }}
                        </span>
                        <span class="text-muted-foreground text-xs">{{ field.constraints }}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <!-- TAB 3: SLA SERVICE LEVEL AGREEMENTS -->
          <TabsContent value="sla" class="mt-2 space-y-3 focus-visible:outline-hidden">
            <div class="grid grid-cols-1 gap-3">
              <!-- SLA Item 1: Latency -->
              <Card class="border-border bg-card p-3.5 shadow-none">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5 text-xs font-semibold">
                      <Zap class="size-3.5 text-amber-500" />
                      <span>Event Latency (p99)</span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      End-to-end event publication latency from checkout commit to Kafka broker.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Target &lt; 100ms
                  </Badge>
                </div>
                <div
                  class="border-border/60 bg-muted/30 mt-3 flex items-center justify-between rounded-md border p-2 font-mono text-xs"
                >
                  <span class="text-muted-foreground">Observed 30-Day p99:</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400">42ms (Passing)</span>
                </div>
              </Card>

              <!-- SLA Item 2: Availability -->
              <Card class="border-border bg-card p-3.5 shadow-none">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5 text-xs font-semibold">
                      <ShieldCheck class="size-3.5 text-emerald-500" />
                      <span>Producer Availability</span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      Uptime commitment for producer event emission without message drops.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    99.99% Guaranteed
                  </Badge>
                </div>
                <div
                  class="border-border/60 bg-muted/30 mt-3 flex items-center justify-between rounded-md border p-2 font-mono text-xs"
                >
                  <span class="text-muted-foreground">Actual Rolling Uptime:</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400">99.995%</span>
                </div>
              </Card>

              <!-- SLA Item 3: Retention & Archival -->
              <Card class="border-border bg-card p-3.5 shadow-none">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5 text-xs font-semibold">
                      <HardDrive class="size-3.5 text-sky-500" />
                      <span>Data Retention & Tiering</span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      Hot retention on Apache Kafka broker topic with cold Iceberg archival.
                    </p>
                  </div>
                  <Badge variant="outline" class="font-mono text-xs"> 365 Days </Badge>
                </div>
                <div
                  class="border-border/60 bg-muted/30 mt-3 flex items-center justify-between rounded-md border p-2 font-mono text-xs"
                >
                  <span class="text-muted-foreground">Storage Tiers:</span>
                  <span class="text-foreground font-medium">Kafka 7d · Iceberg 365d</span>
                </div>
              </Card>

              <!-- SLA Item 4: Escalation Contacts -->
              <Card class="border-border bg-card p-3.5 shadow-none">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5 text-xs font-semibold">
                    <Users class="size-3.5 text-violet-500" />
                    <span>On-Call SLA Escalation</span>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Tier 1 Mission Critical Producer Squad: MTTA &lt; 5 mins, MTTR &lt; 15 mins.
                  </p>
                </div>
                <div
                  class="border-border/60 bg-muted/30 mt-2.5 flex items-center justify-between rounded-md border p-2 font-mono text-xs"
                >
                  <span class="text-muted-foreground">Slack & PagerDuty:</span>
                  <span class="text-primary font-medium">#checkout-eng-alerts</span>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <!-- RIGHT COLUMN: BREAKING CHANGE LINTER & VALIDATION ENGINE (55% -> lg:col-span-7) -->
      <section class="bg-card flex flex-col space-y-6 p-4 sm:p-5 lg:col-span-7">
        <!-- Linter Section Header -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <Sparkles class="text-primary size-4" />
              <h3 class="text-sm font-semibold">Breaking Change Linter & Validation Engine</h3>
            </div>
            <p class="text-muted-foreground text-xs">
              Automated schema drift detection and backward compatibility verification
            </p>
          </div>

          <!-- Linter Action Controls -->
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              class="h-7 gap-1.5 text-xs font-medium"
              :disabled="isRunningLinter"
              @click="handleRunLinter"
            >
              <RefreshCw class="size-3" :class="{ 'animate-spin': isRunningLinter }" />
              <span>{{ isRunningLinter ? 'Linting...' : 'Re-run Linter' }}</span>
            </Button>
          </div>
        </div>

        <!-- Linter Filters & Summary Bar -->
        <div
          class="border-border/70 bg-muted/20 flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex flex-wrap items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              :class="[
                'h-7 px-2.5 text-xs font-medium',
                selectedLinterFilter === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="selectedLinterFilter = 'all'"
            >
              All Rules ({{ lintRules.length }})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              :class="[
                'h-7 px-2.5 text-xs font-medium',
                selectedLinterFilter === 'breaking'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="selectedLinterFilter = 'breaking'"
            >
              Breaking Invariants (2)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              :class="[
                'h-7 px-2.5 text-xs font-medium',
                selectedLinterFilter === 'compatibility'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="selectedLinterFilter = 'compatibility'"
            >
              Compatibility (2)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              :class="[
                'h-7 px-2.5 text-xs font-medium',
                selectedLinterFilter === 'compliance'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="selectedLinterFilter = 'compliance'"
            >
              Compliance & PII (2)
            </Button>
          </div>

          <Badge
            variant="outline"
            class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            {{ passingRulesCount }}/{{ lintRules.length }} Passing (100%)
          </Badge>
        </div>

        <!-- LIVE BREAKING CHANGE TEST RUNNER CARDS -->
        <div class="space-y-2.5">
          <div
            v-for="rule in filteredLintRules"
            :key="rule.id"
            class="border-border bg-card/60 hover:bg-muted/20 rounded-lg border p-3 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-2.5">
                <div class="mt-0.5">
                  <CheckCircle2 v-if="rule.status === 'pass'" class="size-4 text-emerald-500" />
                  <AlertTriangle v-else-if="rule.status === 'warn'" class="size-4 text-amber-500" />
                  <AlertCircle v-else class="text-destructive size-4" />
                </div>
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-foreground font-mono text-xs font-bold">{{ rule.name }}</span>
                    <Badge variant="secondary" class="font-mono text-xs font-normal">
                      {{ rule.categoryLabel }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    {{ rule.ruleDefinition }}
                  </p>
                  <div
                    class="border-border/60 bg-muted/40 text-muted-foreground inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-xs"
                  >
                    <Terminal class="size-3 text-sky-500" />
                    <span>{{ rule.assertionPath }}</span>
                  </div>
                </div>
              </div>

              <div class="flex shrink-0 flex-col items-end gap-1">
                <Badge
                  :variant="rule.status === 'pass' ? 'outline' : 'destructive'"
                  class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400"
                >
                  PASS
                </Badge>
                <span class="text-muted-foreground font-mono text-xs">{{ rule.executionDuration }}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator class="my-2" />

        <!-- ACTIVE CONSUMERS LIST -->
        <div class="space-y-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Registered Downstream Consumers ({{ consumerServices.length }})
              </h4>
              <p class="text-muted-foreground text-xs">
                Active consumer services subscribing to topic
                <code class="text-foreground font-mono">{{ destinationTopic }}</code>
              </p>
            </div>

            <!-- Consumer Search Input -->
            <div class="relative w-full sm:w-56">
              <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input v-model="consumerSearch" placeholder="Filter consumers..." class="h-7 pl-8 font-mono text-xs" />
            </div>
          </div>

          <!-- Consumers Table -->
          <div class="border-border bg-card overflow-hidden rounded-lg border">
            <Table>
              <TableHeader class="bg-muted/40">
                <TableRow class="hover:bg-transparent">
                  <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold"
                    >Consumer Service</TableHead
                  >
                  <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold"
                    >Subscribed Ver</TableHead
                  >
                  <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold"
                    >Throughput & SLA</TableHead
                  >
                  <TableHead class="text-muted-foreground h-8 font-mono text-xs font-semibold">Compatibility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody class="font-mono text-xs">
                <TableRow v-for="consumer in filteredConsumers" :key="consumer.id" class="hover:bg-muted/30">
                  <TableCell class="py-2.5">
                    <div class="space-y-0.5">
                      <div class="text-foreground font-bold">{{ consumer.name }}</div>
                      <div class="text-muted-foreground text-xs">{{ consumer.team }} · {{ consumer.contact }}</div>
                    </div>
                  </TableCell>
                  <TableCell class="py-2.5">
                    <Badge
                      :variant="consumer.versionStatus === 'current' ? 'secondary' : 'outline'"
                      class="font-mono text-xs"
                    >
                      {{ consumer.versionSubscribed }}
                    </Badge>
                  </TableCell>
                  <TableCell class="py-2.5">
                    <div class="space-y-0.5">
                      <div class="text-foreground font-medium">{{ consumer.throughput }}</div>
                      <div class="text-xs text-emerald-600 dark:text-emerald-400">
                        p99: {{ consumer.latencyP99 }} (OK)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell class="py-2.5">
                    <Badge
                      variant="outline"
                      class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <Check class="size-3 text-emerald-500" />
                      {{ consumer.compatibility }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
