<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import {
  BarChart3,
  Binary,
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  FileSpreadsheet,
  Info,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Table as TableIcon,
  Trash2,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type FieldDataType = 'name' | 'email' | 'credit_card' | 'gaussian_float' | 'date_range' | 'category_weights'

export interface SchemaField {
  id: string
  name: string
  label: string
  type: FieldDataType
  description?: string
  params: {
    mean?: number
    stdDev?: number
    currency?: string
    unit?: string
    categories?: string[]
    weights?: number[]
    domain?: string
    dateStart?: string
    dateEnd?: string
  }
}

interface TemplatePreset {
  id: string
  name: string
  description: string
  category: string
  fields: SchemaField[]
}

interface Props {
  class?: HTMLAttributes['class']
  initialTemplate?: string
  initialRowCount?: number
  initialEpsilon?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialTemplate: 'customer-transactions',
  initialRowCount: 1000,
  initialEpsilon: 1.2,
})

// --- TEMPLATE DEFINITIONS ---
const TEMPLATES: Record<string, TemplatePreset> = {
  'customer-transactions': {
    id: 'customer-transactions',
    name: 'Customer Transactions & Demographics Dataset',
    description:
      'High-dimensional e-commerce customer cohort, synthetic PII, spending distribution, and country codes.',
    category: 'E-Commerce & Retail',
    fields: [
      {
        id: 'f-id',
        name: 'cust_id',
        label: 'Customer ID',
        type: 'name',
        description: 'Salted pseudonymized primary key',
        params: {},
      },
      {
        id: 'f-name',
        name: 'full_name',
        label: 'Full Name',
        type: 'name',
        description: 'Synthetic person name generator',
        params: {},
      },
      {
        id: 'f-email',
        name: 'email_address',
        label: 'Synthetic Email',
        type: 'email',
        description: 'Faker email with domain isolation',
        params: { domain: 'syn-corp.io' },
      },
      {
        id: 'f-card',
        name: 'masked_card',
        label: 'Card PAN',
        type: 'credit_card',
        description: 'Luhn-compliant masked payment token',
        params: {},
      },
      {
        id: 'f-spend',
        name: 'spending_amount',
        label: 'Spending Amount',
        type: 'gaussian_float',
        description: 'Gaussian spending curve (μ=$342.50, σ=$85.20)',
        params: { mean: 342.5, stdDev: 85.2, currency: '$' },
      },
      {
        id: 'f-country',
        name: 'country_code',
        label: 'Country Region',
        type: 'category_weights',
        description: 'Categorical distribution [US, DE, GB, FR, JP]',
        params: {
          categories: ['US', 'DE', 'GB', 'FR', 'JP'],
          weights: [0.45, 0.2, 0.15, 0.1, 0.1],
        },
      },
      {
        id: 'f-created',
        name: 'created_at',
        label: 'Registration Date',
        type: 'date_range',
        description: 'ISO-8601 timestamp range (2024-2025)',
        params: { dateStart: '2024-01-01', dateEnd: '2025-08-20' },
      },
    ],
  },
  'healthcare-ehr': {
    id: 'healthcare-ehr',
    name: 'Healthcare Patient Clinical Records (EHR)',
    description: 'HIPAA-compliant patient cohort with biomarker telemetry, blood pressure, and triage severity tiers.',
    category: 'Healthcare & Life Sciences',
    fields: [
      {
        id: 'f-h-id',
        name: 'patient_id',
        label: 'Patient ID',
        type: 'name',
        description: 'Deterministic HIPAA salted identifier',
        params: {},
      },
      {
        id: 'f-h-name',
        name: 'patient_name',
        label: 'Patient Name',
        type: 'name',
        description: 'Synthetic medical record moniker',
        params: {},
      },
      {
        id: 'f-h-email',
        name: 'contact_email',
        label: 'Contact Email',
        type: 'email',
        description: 'Synthetic provider contact',
        params: { domain: 'med-synthetic.org' },
      },
      {
        id: 'f-h-glucose',
        name: 'blood_glucose',
        label: 'Glucose (mg/dL)',
        type: 'gaussian_float',
        description: 'Fast fasting blood glucose (μ=108.4, σ=22.1)',
        params: { mean: 108.4, stdDev: 22.1, unit: 'mg/dL' },
      },
      {
        id: 'f-h-bp',
        name: 'systolic_bp',
        label: 'Systolic BP',
        type: 'gaussian_float',
        description: 'Arterial blood pressure (μ=124.0, σ=15.5)',
        params: { mean: 124.0, stdDev: 15.5, unit: 'mmHg' },
      },
      {
        id: 'f-h-tier',
        name: 'triage_tier',
        label: 'Triage Severity',
        type: 'category_weights',
        description: 'Clinical priority classification',
        params: {
          categories: ['Routine', 'Elevated', 'Urgent', 'Critical'],
          weights: [0.52, 0.28, 0.14, 0.06],
        },
      },
      {
        id: 'f-h-date',
        name: 'admission_date',
        label: 'Admission Date',
        type: 'date_range',
        description: 'Encounter timestamps',
        params: { dateStart: '2024-06-01', dateEnd: '2025-08-20' },
      },
    ],
  },
  'fintech-fraud': {
    id: 'fintech-fraud',
    name: 'Fintech Fraud Detection & Risk Scoring',
    description: 'Transaction monitoring telemetry for anti-fraud classifiers with skewed anomalous patterns.',
    category: 'Fintech & Risk',
    fields: [
      {
        id: 'f-ff-id',
        name: 'tx_token',
        label: 'Transaction ID',
        type: 'name',
        description: 'Cryptographic ledger token',
        params: {},
      },
      {
        id: 'f-ff-name',
        name: 'merchant_name',
        label: 'Merchant Name',
        type: 'name',
        description: 'Synthetic counterparty vendor',
        params: {},
      },
      {
        id: 'f-ff-email',
        name: 'auth_email',
        label: 'Auth Email',
        type: 'email',
        description: 'Tokenized transaction origin email',
        params: { domain: 'syn-pay.net' },
      },
      {
        id: 'f-ff-card',
        name: 'card_pan',
        label: 'Card PAN',
        type: 'credit_card',
        description: 'Tokenized 16-digit card surrogate',
        params: {},
      },
      {
        id: 'f-ff-amt',
        name: 'settlement_usd',
        label: 'Settlement ($)',
        type: 'gaussian_float',
        description: 'Transaction gross volume (μ=$1420.00, σ=$480.00)',
        params: { mean: 1420.0, stdDev: 480.0, currency: '$' },
      },
      {
        id: 'f-ff-verdict',
        name: 'risk_verdict',
        label: 'Risk Verdict',
        type: 'category_weights',
        description: 'Ground truth classifier target',
        params: {
          categories: ['Legitimate', 'Suspicious', 'Flagged_Fraud'],
          weights: [0.89, 0.08, 0.03],
        },
      },
      {
        id: 'f-ff-ts',
        name: 'settled_at',
        label: 'Settlement Time',
        type: 'date_range',
        description: 'High-precision event timestamp',
        params: { dateStart: '2025-01-01', dateEnd: '2025-08-20' },
      },
    ],
  },
  'saas-telemetry': {
    id: 'saas-telemetry',
    name: 'SaaS Product Telemetry & Usage Metrics',
    description: 'B2B subscription telemetry with active seat distribution, recurring revenue, and subscription tiers.',
    category: 'Cloud Software & B2B',
    fields: [
      {
        id: 'f-st-id',
        name: 'org_uuid',
        label: 'Organization UUID',
        type: 'name',
        description: 'Tenant identifier',
        params: {},
      },
      {
        id: 'f-st-name',
        name: 'tenant_name',
        label: 'Tenant Name',
        type: 'name',
        description: 'Synthetic enterprise tenant moniker',
        params: {},
      },
      {
        id: 'f-st-email',
        name: 'admin_email',
        label: 'Admin Email',
        type: 'email',
        description: 'Primary owner email',
        params: { domain: 'syn-saas.io' },
      },
      {
        id: 'f-st-seats',
        name: 'active_seats',
        label: 'Active Seats',
        type: 'gaussian_float',
        description: 'Provisioned enterprise seats (μ=48.0, σ=18.0)',
        params: { mean: 48.0, stdDev: 18.0, unit: 'seats' },
      },
      {
        id: 'f-st-mrr',
        name: 'mrr_usd',
        label: 'Monthly Revenue',
        type: 'gaussian_float',
        description: 'MRR ledger (μ=$2850.00, σ=$950.00)',
        params: { mean: 2850.0, stdDev: 950.0, currency: '$' },
      },
      {
        id: 'f-st-plan',
        name: 'plan_tier',
        label: 'Plan Tier',
        type: 'category_weights',
        description: 'Subscription entitlement level',
        params: {
          categories: ['Starter', 'Growth', 'Enterprise'],
          weights: [0.48, 0.36, 0.16],
        },
      },
      {
        id: 'f-st-date',
        name: 'provisioned_at',
        label: 'Provisioned Date',
        type: 'date_range',
        description: 'Cohort subscription activation',
        params: { dateStart: '2024-01-01', dateEnd: '2025-08-20' },
      },
    ],
  },
}

// --- STATE ---
const selectedTemplateKey = ref<string>(props.initialTemplate)
const outputFormat = ref<'csv' | 'jsonl'>('csv')
const rowCount = ref<number>(props.initialRowCount)
const epsilon = ref<number>(props.initialEpsilon)
const kAnonymity = ref<boolean>(true)
const saltedHash = ref<boolean>(true)
const noiseMechanism = ref<boolean>(true)

const activeFields = ref<SchemaField[]>([])
const isGenerating = ref<boolean>(false)
const copied = ref<boolean>(false)
const downloadToast = ref<string | null>(null)
const previewTab = ref<'table' | 'json' | 'metrics'>('table')
const generationSeed = ref<number>(48291)

// Field addition form state
const showAddField = ref<boolean>(false)
const newFieldName = ref<string>('')
const newFieldType = ref<FieldDataType>('gaussian_float')

// Load template fields
function loadTemplate(key: string) {
  const tpl = TEMPLATES[key]
  if (tpl) {
    activeFields.value = JSON.parse(JSON.stringify(tpl.fields))
    triggerRegeneration()
  }
}

// Watch template changes
watch(selectedTemplateKey, (newKey) => {
  loadTemplate(newKey)
})

// Initialize fields
loadTemplate(selectedTemplateKey.value)

// --- MOCK SEED DATA POOLS ---
const FIRST_NAMES = [
  'Elena',
  'Malik',
  'Siddharth',
  'Claire',
  'Liam',
  'Amara',
  'Kenji',
  'Sofia',
  'Devon',
  'Maya',
  'Tobias',
  'Fatima',
  'Mateo',
  'Astrid',
  'Zara',
]

const LAST_NAMES = [
  'Rostova',
  'Al-Mansoor',
  'Patel',
  'Chen',
  "O'Connor",
  'Okafor',
  'Sato',
  'Alvarez',
  'Vance',
  'Lin',
  'Richter',
  'Zahra',
  'Silva',
  'Lindqvist',
  'Novak',
]

const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex']

// Box-Muller Gaussian random generator
function boxMullerRandom(mean: number, stdDev: number, seedOffset: number): number {
  const u1 = Math.max(1e-6, Math.abs(Math.sin(generationSeed.value + seedOffset * 17.3)))
  const u2 = Math.max(1e-6, Math.abs(Math.cos(generationSeed.value + seedOffset * 31.7)))
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)

  // Differential privacy noise inversely proportional to epsilon
  const dpNoiseScale = noiseMechanism.value ? stdDev / (Math.max(0.1, epsilon.value) * 12) : 0
  const dpNoise = Math.sin(generationSeed.value * 3.7 + seedOffset * 5.1) * dpNoiseScale

  return mean + z0 * stdDev + dpNoise
}

// --- DYNAMIC RECORD GENERATOR ---
interface GeneratedRecord {
  id: string
  [key: string]: string | number
}

const previewRecords = computed<GeneratedRecord[]>(() => {
  const rows: GeneratedRecord[] = []
  const count = 6 // Show first 6 realistic rows in preview

  for (let i = 0; i < count; i++) {
    const fn = FIRST_NAMES[(i * 3 + generationSeed.value) % FIRST_NAMES.length]
    const ln = LAST_NAMES[(i * 5 + generationSeed.value + 2) % LAST_NAMES.length]
    const fullName = `${fn} ${ln}`
    const baseSlug = `${fn.charAt(0).toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, '')}`

    const record: GeneratedRecord = {
      id: saltedHash.value
        ? `syn_${((generationSeed.value * 9301 + i * 49297) % 233280).toString(16).padStart(6, '0')}`
        : `usr_${1000 + i}`,
    }

    for (const field of activeFields.value) {
      if (field.name.includes('id') || field.name.includes('uuid') || field.name.includes('token')) {
        record[field.name] = record.id
        continue
      }

      switch (field.type) {
        case 'name':
          record[field.name] = fullName
          break

        case 'email': {
          const dom = field.params.domain || 'synthetic-vault.io'
          record[field.name] = `${baseSlug}@${dom}`
          break
        }

        case 'credit_card': {
          const last4 = (((generationSeed.value * 7 + i * 1337 + 1000) % 9000) + 1000).toString()
          const brand = CARD_BRANDS[i % CARD_BRANDS.length]
          record[field.name] = `${brand} •••• ${last4}`
          break
        }

        case 'gaussian_float': {
          const m = field.params.mean ?? 100
          const s = field.params.stdDev ?? 20
          const rawVal = boxMullerRandom(m, s, i)
          const val = Math.max(m * 0.1, rawVal)

          if (field.params.currency) {
            record[field.name] = `${field.params.currency}${val.toFixed(2)}`
          } else if (field.params.unit) {
            record[field.name] = `${val.toFixed(1)} ${field.params.unit}`
          } else {
            record[field.name] = parseFloat(val.toFixed(2))
          }
          break
        }

        case 'category_weights': {
          const cats = field.params.categories || ['Standard', 'Premium']
          const catIndex = (i + Math.floor(generationSeed.value / 100)) % cats.length
          record[field.name] = cats[catIndex]
          break
        }

        case 'date_range': {
          const day = ((10 + i * 4) % 28) + 1
          const month = (i % 8) + 1
          const dayStr = day.toString().padStart(2, '0')
          const monthStr = month.toString().padStart(2, '0')
          const hour = (8 + i * 3) % 24
          const hourStr = hour.toString().padStart(2, '0')
          record[field.name] = `2025-${monthStr}-${dayStr} ${hourStr}:24:18 UTC`
          break
        }

        default:
          record[field.name] = `value_${i}`
      }
    }

    rows.push(record)
  }

  return rows
})

// --- STATISTICAL FIDELITY & DP METRICS ---
const fidelityMetrics = computed(() => {
  const eps = epsilon.value
  // Higher epsilon -> higher similarity, lower privacy
  const rawSimilarity = Math.min(99.4, Math.max(82.0, 99.2 - ((5.0 - eps) / 4.9) * 9.6))
  const similarity = parseFloat(rawSimilarity.toFixed(1))

  // PII Leakage Risk is 0% when kAnonymity & Salted hash are enabled and eps <= 3.5
  const leakageRisk = kAnonymity.value && saltedHash.value && eps <= 3.5 ? 0.0 : Math.max(0, (eps - 3.5) * 0.04)
  const correlationRetention = parseFloat(Math.min(99.1, 98.6 - ((5.0 - eps) / 4.9) * 6.2).toFixed(1))
  const wassersteinDistance = parseFloat((0.032 + ((5.0 - eps) / 4.9) * 0.024).toFixed(3))
  const laplaceNoiseStd = (0.12 / Math.max(0.1, eps)).toFixed(3)

  let privacyTier = 'Balanced Privacy & Utility'
  let privacyBadgeColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'

  if (eps <= 0.5) {
    privacyTier = 'Maximum Privacy / High DP Noise'
    privacyBadgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  } else if (eps > 2.5) {
    privacyTier = 'High Statistical Utility / Minimal Noise'
    privacyBadgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
  }

  return {
    similarity,
    leakageRisk: leakageRisk.toFixed(2),
    correlationRetention,
    wassersteinDistance,
    laplaceNoiseStd,
    privacyTier,
    privacyBadgeColor,
  }
})

// Estimated file size calculation
const estimatedFileSize = computed(() => {
  const bytesPerRow = outputFormat.value === 'csv' ? 180 : 380
  const totalKb = (rowCount.value * bytesPerRow) / 1024
  if (totalKb < 1024) {
    return `~${totalKb.toFixed(1)} KB`
  }
  return `~${(totalKb / 1024).toFixed(2)} MB`
})

// --- ACTIONS ---
function triggerRegeneration() {
  isGenerating.value = true
  generationSeed.value = Math.floor(Math.random() * 90000) + 10000

  setTimeout(() => {
    isGenerating.value = false
  }, 450)
}

function handleAddCustomField() {
  if (!newFieldName.value.trim()) return

  const cleanName = newFieldName.value.trim().toLowerCase().replace(/\s+/g, '_')
  const newField: SchemaField = {
    id: `f-custom-${Date.now()}`,
    name: cleanName,
    label: newFieldName.value.trim(),
    type: newFieldType.value,
    description: `Custom ${newFieldType.value} schema column`,
    params:
      newFieldType.value === 'gaussian_float'
        ? { mean: 500, stdDev: 120, currency: '$' }
        : newFieldType.value === 'category_weights'
          ? { categories: ['Alpha', 'Beta', 'Gamma'], weights: [0.5, 0.3, 0.2] }
          : {},
  }

  activeFields.value.push(newField)
  newFieldName.value = ''
  showAddField.value = false
  triggerRegeneration()
}

function removeField(fieldId: string) {
  if (activeFields.value.length <= 2) return // Keep at least 2 fields
  activeFields.value = activeFields.value.filter((f) => f.id !== fieldId)
  triggerRegeneration()
}

async function copyJsonLines() {
  try {
    const jsonLinesText = previewRecords.value.map((r) => JSON.stringify(r)).join('\n')
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(jsonLinesText)
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
  }
}

function handleDownloadDataset() {
  const filename = `synthetic_${selectedTemplateKey.value}_${rowCount.value}_rows.${outputFormat.value === 'csv' ? 'csv' : 'jsonl'}`
  downloadToast.value = `Downloaded ${rowCount.value.toLocaleString()} synthetic records (${filename})`
  setTimeout(() => {
    downloadToast.value = null
  }, 3500)
}

// Watch row count / epsilon to retrigger subtle noise updates
watch([epsilon, kAnonymity, saltedHash, noiseMechanism], () => {
  // Update without full spinning state
})
</script>

<template>
  <div data-slot="synthetic-data-generator" :class="cn('mx-auto w-full max-w-7xl space-y-6', props.class)">
    <!-- TOP HEADER HERO -->
    <Card class="border-border overflow-hidden shadow-xs">
      <CardHeader class="border-border/60 bg-muted/20 border-b pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Cpu class="size-4.5" />
              </div>
              <CardTitle class="text-lg font-bold tracking-tight md:text-xl">
                Synthetic Dataset Generator &amp; Privacy Engine
              </CardTitle>
              <Badge variant="outline" class="gap-1 text-xs font-normal">
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Differential Privacy Enabled
              </Badge>
            </div>
            <CardDescription class="text-xs md:text-sm">
              Mathematical &amp; LLM-guided synthetic tabular dataset synthesizer with configurable (ε, δ)-DP noise
              injection.
            </CardDescription>
          </div>

          <!-- Header Right Quick Actions -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Format Selector Segmented Control -->
            <div class="bg-muted/60 border-border inline-flex items-center rounded-lg border p-0.5 text-xs">
              <button
                type="button"
                :class="
                  cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all',
                    outputFormat === 'csv'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="outputFormat = 'csv'"
              >
                <FileSpreadsheet class="size-3.5" />
                <span>Tabular CSV</span>
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all',
                    outputFormat === 'jsonl'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="outputFormat = 'jsonl'"
              >
                <Code2 class="size-3.5" />
                <span>JSON Lines</span>
              </button>
            </div>

            <!-- Download Button -->
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              class="h-9 gap-1.5 text-xs font-medium"
              @click="handleDownloadDataset"
            >
              <Download class="size-3.5" />
              <span>Download Dataset</span>
            </Button>

            <!-- Primary Generate Batch Button -->
            <Button
              variant="default"
              size="sm"
              :class="cn('h-9 gap-1.5 px-4 text-xs font-semibold shadow-xs transition-all active:scale-95')"
              :disabled="isGenerating"
              @click="triggerRegeneration"
            >
              <RefreshCw v-if="isGenerating" class="size-3.5 animate-spin" />
              <Sparkles v-else class="size-3.5" />
              <span>{{ isGenerating ? 'Synthesizing...' : 'Generate Synthetic Batch' }}</span>
            </Button>
          </div>
        </div>

        <!-- Template Selector Bar -->
        <div
          class="border-border/50 bg-background/50 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3.5 py-2"
        >
          <div class="flex items-center gap-2">
            <Layers class="text-muted-foreground size-4" />
            <span class="text-foreground text-xs font-semibold">Schema Template:</span>
          </div>

          <div class="w-full min-w-0 sm:max-w-md sm:flex-1">
            <Select v-model="selectedTemplateKey">
              <SelectTrigger class="bg-background h-8.5 w-full text-xs font-medium [&>span]:truncate [&>svg]:shrink-0">
                <SelectValue placeholder="Select Schema Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(tpl, key) in TEMPLATES" :key="key" :value="key" class="text-xs">
                  {{ tpl.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
            <Badge variant="secondary" class="px-2 py-0.5 text-xs font-normal">
              {{ TEMPLATES[selectedTemplateKey]?.category }}
            </Badge>
            <span>&bull;</span>
            <span class="font-mono tabular-nums">{{ activeFields.length }} fields configured</span>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- DOWNLOAD SUCCESS NOTIFICATION -->
    <div
      v-if="downloadToast"
      class="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-700 shadow-xs dark:text-emerald-300"
    >
      <div class="flex items-center gap-2">
        <Check class="size-4 stroke-[2.5]" />
        <span>{{ downloadToast }}</span>
      </div>
      <Badge variant="outline" class="border-emerald-500/40 font-mono text-xs">
        {{ estimatedFileSize }}
      </Badge>
    </div>

    <!-- 2-COLUMN STUDIO GENERATOR -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- LEFT COLUMN: SCHEMA & PRIVACY CONFIGURATION (40% / 5 Cols) -->
      <div class="space-y-6 lg:col-span-5">
        <!-- CARD 1: ROW COUNT & BATCH SCALE -->
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/50 border-b pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                  <Database class="size-3.5" />
                </div>
                <CardTitle class="text-sm font-semibold">Dataset Generation Volume</CardTitle>
              </div>
              <Badge variant="secondary" class="font-mono text-xs font-semibold tabular-nums">
                {{ rowCount.toLocaleString() }} rows
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-4">
            <!-- Row Slider -->
            <div class="space-y-2">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span>100 rows</span>
                <span class="text-foreground font-mono font-medium">Estimated: {{ estimatedFileSize }}</span>
                <span>50,000 rows</span>
              </div>

              <Slider
                :model-value="rowCount"
                :min="100"
                :max="50000"
                :step="100"
                class="w-full py-1"
                @update:model-value="(val) => (rowCount = Array.isArray(val) ? val[0] : val)"
              />
            </div>

            <!-- Quick Preset Chips -->
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <span class="text-muted-foreground mr-1 text-xs">Presets:</span>
              <button
                v-for="preset in [100, 1000, 5000, 10000, 50000]"
                :key="preset"
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                    rowCount === preset
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                  )
                "
                @click="rowCount = preset"
              >
                {{ preset >= 1000 ? `${preset / 1000}k` : preset }}
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- CARD 2: DIFFERENTIAL PRIVACY EPSILON (ε) CONTROLS -->
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/50 border-b pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <ShieldCheck class="size-3.5" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Differential Privacy Budget</CardTitle>
                  <CardDescription class="text-xs"> Laplace (ε, δ)-DP noise calibration </CardDescription>
                </div>
              </div>
              <Badge variant="outline" class="font-mono text-xs font-bold tabular-nums">
                &epsilon; = {{ epsilon.toFixed(1) }}
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-4">
            <!-- Epsilon Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-emerald-600 dark:text-emerald-400">&epsilon;=0.1 (High Privacy)</span>
                <span class="font-medium text-amber-600 dark:text-amber-400">&epsilon;=5.0 (High Fidelity)</span>
              </div>

              <Slider
                :model-value="epsilon"
                :min="0.1"
                :max="5.0"
                :step="0.1"
                class="w-full py-1"
                @update:model-value="(val) => (epsilon = Array.isArray(val) ? val[0] : val)"
              />
            </div>

            <!-- Epsilon Interpretation Banner -->
            <div
              :class="cn('flex items-start gap-2.5 rounded-lg border p-3 text-xs', fidelityMetrics.privacyBadgeColor)"
            >
              <Info class="mt-0.5 size-4 shrink-0" />
              <div class="space-y-1">
                <div class="font-semibold">{{ fidelityMetrics.privacyTier }}</div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Laplace noise scale:
                  <span class="text-foreground font-mono font-medium"
                    >&sigma;=&plusmn;{{ fidelityMetrics.laplaceNoiseStd }}</span
                  >
                  &bull; Delta: <span class="text-foreground font-mono font-medium">&delta;=10⁻⁵</span> &bull; Zero
                  memorization guarantee.
                </p>
              </div>
            </div>

            <!-- Quick Epsilon Presets -->
            <div class="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded-lg border p-2 text-center text-xs transition-all',
                    epsilon === 0.5
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted/40',
                  )
                "
                @click="epsilon = 0.5"
              >
                <div class="font-bold">&epsilon; = 0.5</div>
                <div class="text-muted-foreground text-xs">Healthcare</div>
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded-lg border p-2 text-center text-xs transition-all',
                    epsilon === 1.2
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted/40',
                  )
                "
                @click="epsilon = 1.2"
              >
                <div class="font-bold">&epsilon; = 1.2</div>
                <div class="text-muted-foreground text-xs">Standard</div>
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'cursor-pointer rounded-lg border p-2 text-center text-xs transition-all',
                    epsilon === 3.0
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted/40',
                  )
                "
                @click="epsilon = 3.0"
              >
                <div class="font-bold">&epsilon; = 3.0</div>
                <div class="text-muted-foreground text-xs">Analytics</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- CARD 3: FIELD SCHEMAS GENERATOR -->
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/50 border-b pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                  <Sliders class="size-3.5" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Schema Fields Generator</CardTitle>
                  <CardDescription class="text-xs">
                    {{ activeFields.length }} active synthesizer distributions
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-7.5 gap-1 px-2.5 text-xs"
                @click="showAddField = !showAddField"
              >
                <Plus class="size-3.5" />
                <span>{{ showAddField ? 'Cancel' : 'Add Field' }}</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 pt-4">
            <!-- Add Field Drawer / Form -->
            <div v-if="showAddField" class="border-border/80 bg-muted/30 space-y-3 rounded-lg border p-3.5 text-xs">
              <div class="text-foreground font-semibold">Configure New Synthetic Field</div>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div class="space-y-1">
                  <label class="text-muted-foreground text-xs">Field Identifier</label>
                  <Input v-model="newFieldName" placeholder="e.g. account_balance" class="h-8 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-muted-foreground text-xs">Data Distribution Type</label>
                  <Select v-model="newFieldType">
                    <SelectTrigger class="bg-background h-8 w-full min-w-0 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaussian_float" class="text-xs">Float Gaussian Distribution</SelectItem>
                      <SelectItem value="name" class="text-xs">Full Name Faker</SelectItem>
                      <SelectItem value="email" class="text-xs">Email Faker</SelectItem>
                      <SelectItem value="credit_card" class="text-xs">Credit Card Faker</SelectItem>
                      <SelectItem value="category_weights" class="text-xs">Category Weights</SelectItem>
                      <SelectItem value="date_range" class="text-xs">Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" class="h-7.5 text-xs" @click="showAddField = false"> Cancel </Button>
                <Button
                  variant="default"
                  size="sm"
                  class="h-7.5 text-xs"
                  :disabled="!newFieldName.trim()"
                  @click="handleAddCustomField"
                >
                  Add to Schema
                </Button>
              </div>
            </div>

            <!-- Fields List -->
            <div class="divide-border/60 max-h-[320px] space-y-2 overflow-y-auto pr-1">
              <div
                v-for="field in activeFields"
                :key="field.id"
                class="group border-border/70 bg-card hover:bg-muted/20 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
              >
                <div class="min-w-0 space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground font-mono text-xs font-semibold">{{ field.name }}</span>
                    <Badge
                      variant="outline"
                      :class="
                        cn(
                          'px-1.5 py-0 text-xs font-semibold tracking-wider uppercase',
                          field.type === 'gaussian_float' &&
                            'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400',
                          field.type === 'name' &&
                            'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                          field.type === 'email' &&
                            'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                          field.type === 'credit_card' &&
                            'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                          field.type === 'category_weights' &&
                            'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                          field.type === 'date_range' &&
                            'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400',
                        )
                      "
                    >
                      {{ field.type.replace('_', ' ') }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground truncate text-xs">
                    {{ field.description || 'Configured synthesizer parameter' }}
                  </p>
                </div>

                <Button
                  aria-label="Delete field"
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-destructive h-7 w-7 p-0 opacity-80 group-hover:opacity-100"
                  :disabled="activeFields.length <= 2"
                  @click="removeField(field.id)"
                >
                  <Trash2 class="size-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- CARD 4: PII ANONYMIZATION POLICY SWITCHES -->
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/50 border-b pb-3">
            <div class="flex items-center gap-2">
              <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                <Lock class="size-3.5" />
              </div>
              <div>
                <CardTitle class="text-sm font-semibold">PII Anonymization Policy</CardTitle>
                <CardDescription class="text-xs"> Zero linkage &amp; re-identification guarantees </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-4">
            <!-- K-Anonymity Switch -->
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-0.5">
                <div class="text-foreground text-xs font-semibold">K-Anonymity (k = 5 Cohort Enforcement)</div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Generalizes quasi-identifiers so each demographic bucket contains ≥ 5 records.
                </p>
              </div>
              <Switch :model-value="kAnonymity" @update:model-value="(v) => (kAnonymity = v)" />
            </div>

            <Separator />

            <!-- Salted Hash Switch -->
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-0.5">
                <div class="text-foreground text-xs font-semibold">Salted HMAC-SHA256 for Primary Keys</div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Deterministically pseudonymizes primary keys with ephemeral cryptographic salt.
                </p>
              </div>
              <Switch :model-value="saltedHash" @update:model-value="(v) => (saltedHash = v)" />
            </div>

            <Separator />

            <!-- Noise Injection Switch -->
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-0.5">
                <div class="text-foreground text-xs font-semibold">Differential Privacy Gaussian Noise</div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Injects calibrated noise calibrated to global sensitivity (Δf / ε).
                </p>
              </div>
              <Switch :model-value="noiseMechanism" @update:model-value="(v) => (noiseMechanism = v)" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- RIGHT COLUMN: LIVE GENERATED SYNTHETIC DATA PREVIEW (60% / 7 Cols) -->
      <div class="space-y-6 lg:col-span-7">
        <!-- TOP GAUGE BANNER: STATISTICAL FIDELITY VS PRIVACY -->
        <Card class="border-border overflow-hidden shadow-xs">
          <div class="border-border/60 border-b bg-emerald-500/10 px-4 py-3 dark:bg-emerald-950/20">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <ShieldCheck class="size-4.5 text-emerald-600 dark:text-emerald-400" />
                <span class="text-foreground font-mono text-sm font-bold tracking-tight">
                  {{ fidelityMetrics.similarity }}% Distribution Similarity &bull; {{ fidelityMetrics.leakageRisk }}%
                  PII Leakage Risk
                </span>
              </div>
              <Badge
                variant="outline"
                class="bg-background border-emerald-500/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                &epsilon;-DP Bound: &le; {{ epsilon.toFixed(1) }}
              </Badge>
            </div>
          </div>

          <CardContent class="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            <!-- Metric 1: Fidelity Score -->
            <div class="border-border/60 bg-muted/10 space-y-1.5 rounded-lg border p-3">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span>Fidelity Score</span>
                <Zap class="size-3.5 text-amber-500" />
              </div>
              <div class="text-foreground font-mono text-lg font-bold tabular-nums">
                {{ fidelityMetrics.similarity }}%
              </div>
              <Progress :model-value="fidelityMetrics.similarity" class="h-1.5" />
            </div>

            <!-- Metric 2: Correlation Preservation -->
            <div class="border-border/60 bg-muted/10 space-y-1.5 rounded-lg border p-3">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span>Covariance Retention</span>
                <BarChart3 class="size-3.5 text-sky-500" />
              </div>
              <div class="text-foreground font-mono text-lg font-bold tabular-nums">
                {{ fidelityMetrics.correlationRetention }}%
              </div>
              <Progress :model-value="fidelityMetrics.correlationRetention" class="h-1.5" />
            </div>

            <!-- Metric 3: Wasserstein Distance -->
            <div class="border-border/60 bg-muted/10 space-y-1.5 rounded-lg border p-3">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span>Wasserstein Distance</span>
                <Binary class="size-3.5 text-purple-500" />
              </div>
              <div class="text-foreground font-mono text-lg font-bold tabular-nums">
                {{ fidelityMetrics.wassersteinDistance }}
              </div>
              <div class="text-muted-foreground text-xs">Low error bound (&lt; 0.05)</div>
            </div>
          </CardContent>
        </Card>

        <!-- PREVIEW TABS CARD -->
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/50 border-b pb-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                  <TableIcon class="size-3.5" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Live Generated Synthetic Data Preview</CardTitle>
                  <CardDescription class="text-xs">
                    Real-time sampler showing first {{ previewRecords.length }} synthesized records
                  </CardDescription>
                </div>
              </div>

              <!-- View Switcher -->
              <Tabs v-model="previewTab" class="w-auto">
                <TabsList class="h-8">
                  <TabsTrigger value="table" class="h-7 px-2.5 text-xs">
                    <TableIcon class="mr-1 size-3" />
                    <span>Table</span>
                  </TabsTrigger>
                  <TabsTrigger value="json" class="h-7 px-2.5 text-xs">
                    <Code2 class="mr-1 size-3" />
                    <span>JSONL</span>
                  </TabsTrigger>
                  <TabsTrigger value="metrics" class="h-7 px-2.5 text-xs">
                    <BarChart3 class="mr-1 size-3" />
                    <span>Marginals</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent class="pt-4">
            <!-- TAB 1: TABULAR PREVIEW -->
            <div v-if="previewTab === 'table'" class="space-y-3">
              <div class="border-border overflow-hidden rounded-lg border">
                <div class="overflow-x-auto">
                  <Table class="min-w-full text-xs">
                    <TableHeader class="bg-muted/40">
                      <TableRow>
                        <TableHead
                          v-for="f in activeFields"
                          :key="f.id"
                          class="text-foreground font-mono text-xs font-semibold whitespace-nowrap"
                        >
                          {{ f.name }}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="(row, idx) in previewRecords"
                        :key="idx"
                        class="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell v-for="f in activeFields" :key="f.id" class="py-2.5 whitespace-nowrap">
                          <!-- Special cell styling based on data type -->
                          <template
                            v-if="
                              f.name === 'id' ||
                              f.name.includes('id') ||
                              f.name.includes('uuid') ||
                              f.name.includes('token')
                            "
                          >
                            <span class="text-muted-foreground font-mono font-medium">{{ row[f.name] }}</span>
                          </template>

                          <template v-else-if="f.type === 'category_weights'">
                            <Badge variant="secondary" class="font-mono text-xs font-medium">
                              {{ row[f.name] }}
                            </Badge>
                          </template>

                          <template v-else-if="f.type === 'gaussian_float'">
                            <span class="text-foreground font-mono font-semibold tabular-nums">
                              {{ row[f.name] }}
                            </span>
                          </template>

                          <template v-else-if="f.type === 'credit_card'">
                            <span class="text-foreground font-mono text-xs font-medium">
                              {{ row[f.name] }}
                            </span>
                          </template>

                          <template v-else-if="f.type === 'email'">
                            <span class="text-primary font-mono text-xs font-normal">
                              {{ row[f.name] }}
                            </span>
                          </template>

                          <template v-else>
                            <span class="text-foreground font-medium">{{ row[f.name] }}</span>
                          </template>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <span class="flex items-center gap-1.5 font-mono tabular-nums">
                  <span class="size-1.5 rounded-full bg-emerald-500" />
                  Showing {{ previewRecords.length }} sample records of {{ rowCount.toLocaleString() }} generated rows
                </span>
                <span class="text-muted-foreground font-mono text-xs">Seed: #{{ generationSeed }}</span>
              </div>
            </div>

            <!-- TAB 2: JSON LINES PREVIEW -->
            <div v-else-if="previewTab === 'json'" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-xs">Streaming JSON Lines formatted output:</span>
                <Button
                  variant="outline"
                  size="sm"
                  class="h-7.5 gap-1.5 px-2.5 text-xs font-medium"
                  @click="copyJsonLines"
                >
                  <Check v-if="copied" class="size-3 stroke-[2.5] text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ copied ? 'Copied JSONL' : 'Copy JSON Lines' }}</span>
                </Button>
              </div>

              <div
                class="border-border/80 bg-muted/40 max-h-[380px] overflow-x-auto overflow-y-auto rounded-lg border p-4 font-mono text-xs leading-relaxed"
              >
                <div
                  v-for="(rec, idx) in previewRecords"
                  :key="idx"
                  class="hover:bg-muted/60 rounded px-1.5 py-1 whitespace-pre transition-colors"
                >
                  <span class="text-muted-foreground select-none">{{ idx + 1 }}&nbsp;</span>
                  <span class="text-foreground">{ </span>
                  <template v-for="(val, key, kIdx) in rec" :key="key">
                    <span class="font-semibold text-sky-600 dark:text-sky-400">"{{ key }}"</span>
                    <span class="text-muted-foreground">: </span>
                    <span
                      :class="
                        typeof val === 'number'
                          ? 'font-medium text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      "
                    >
                      {{ typeof val === 'number' ? val : `"${val}"` }}
                    </span>
                    <span v-if="kIdx < Object.keys(rec).length - 1" class="text-muted-foreground">, </span>
                  </template>
                  <span class="text-foreground"> }</span>
                </div>
              </div>
            </div>

            <!-- TAB 3: MARGINALS & FIDELITY DENSITY -->
            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <!-- Density Gauge 1 -->
                <div class="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-foreground font-semibold">Gaussian Distribution Overlap</span>
                    <Badge variant="outline" class="font-mono text-xs">96.2%</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Kolmogorov-Smirnov distance between synthetic batch and continuous Gaussian ground truth.
                  </p>
                  <Progress :model-value="96.2" class="h-2" />
                </div>

                <!-- Density Gauge 2 -->
                <div class="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-foreground font-semibold">Categorical Frequency Prior</span>
                    <Badge variant="outline" class="font-mono text-xs">98.4%</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Total variation distance across categorical weight assignments.
                  </p>
                  <Progress :model-value="98.4" class="h-2" />
                </div>
              </div>

              <!-- Mathematical Guarantees Breakdown -->
              <div class="border-border/60 bg-muted/10 space-y-2.5 rounded-lg border p-4 text-xs">
                <div class="text-foreground flex items-center gap-1.5 font-semibold">
                  <Shield class="text-primary size-4" />
                  <span>Mathematical Privacy Guarantees &bull; Formal Specs</span>
                </div>
                <div class="text-muted-foreground grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div class="flex items-center gap-1.5">
                    <Check class="size-3.5 text-emerald-500" />
                    <span>Differential Privacy (ε = {{ epsilon.toFixed(1) }}, δ = 10⁻⁵)</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Check class="size-3.5 text-emerald-500" />
                    <span>K-Anonymity (k = 5) Cohort Clamping</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Check class="size-3.5 text-emerald-500" />
                    <span>Zero Direct Row Memorization</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Check class="size-3.5 text-emerald-500" />
                    <span>Ephemeral In-Memory Compute</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter
            class="border-border/40 text-muted-foreground flex flex-wrap items-center justify-between border-t py-3 text-xs"
          >
            <span class="flex items-center gap-1.5">
              <Zap class="size-3.5 text-amber-500" />
              Powered by LLM Semantic Synthesis &amp; Laplace Noise Engine
            </span>
            <span class="font-mono tabular-nums">
              Output: {{ outputFormat.toUpperCase() }} &bull; {{ activeFields.length }} fields &bull;
              {{ rowCount.toLocaleString() }} records
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
