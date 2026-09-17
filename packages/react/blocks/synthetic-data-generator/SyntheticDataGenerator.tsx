'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface SyntheticDataGeneratorProps {
  className?: string
  initialTemplate?: string
  initialRowCount?: number
  initialEpsilon?: number
}

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

export function SyntheticDataGenerator({
  className,
  initialTemplate = 'customer-transactions',
  initialRowCount = 1000,
  initialEpsilon = 1.2,
}: SyntheticDataGeneratorProps) {
  // --- STATE ---
  const [selectedTemplateKey, setSelectedTemplateKey] = React.useState<string>(initialTemplate)
  const [outputFormat, setOutputFormat] = React.useState<'csv' | 'jsonl'>('csv')
  const [rowCount, setRowCount] = React.useState<number>(initialRowCount)
  const [epsilon, setEpsilon] = React.useState<number>(initialEpsilon)
  const [kAnonymity, setKAnonymity] = React.useState<boolean>(true)
  const [saltedHash, setSaltedHash] = React.useState<boolean>(true)
  const [noiseMechanism, setNoiseMechanism] = React.useState<boolean>(true)

  const [activeFields, setActiveFields] = React.useState<SchemaField[]>(() => {
    return TEMPLATES[initialTemplate]?.fields ? JSON.parse(JSON.stringify(TEMPLATES[initialTemplate].fields)) : []
  })

  const [isGenerating, setIsGenerating] = React.useState<boolean>(false)
  const [copied, setCopied] = React.useState<boolean>(false)
  const [downloadToast, setDownloadToast] = React.useState<string | null>(null)
  const [previewTab, setPreviewTab] = React.useState<'table' | 'json' | 'metrics'>('table')
  const [generationSeed, setGenerationSeed] = React.useState<number>(48291)

  // Field addition state
  const [showAddField, setShowAddField] = React.useState<boolean>(false)
  const [newFieldName, setNewFieldName] = React.useState<string>('')
  const [newFieldType, setNewFieldType] = React.useState<FieldDataType>('gaussian_float')

  // Handle template selection switch
  const handleTemplateChange = (key: string) => {
    setSelectedTemplateKey(key)
    const tpl = TEMPLATES[key]
    if (tpl) {
      setActiveFields(JSON.parse(JSON.stringify(tpl.fields)))
      triggerRegeneration()
    }
  }

  // Generation trigger
  const triggerRegeneration = () => {
    setIsGenerating(true)
    setGenerationSeed(Math.floor(Math.random() * 90000) + 10000)
    setTimeout(() => {
      setIsGenerating(false)
    }, 450)
  }

  // Box-Muller Gaussian random generator with differential privacy noise
  const boxMullerRandom = (mean: number, stdDev: number, seedOffset: number): number => {
    const u1 = Math.max(1e-6, Math.abs(Math.sin(generationSeed + seedOffset * 17.3)))
    const u2 = Math.max(1e-6, Math.abs(Math.cos(generationSeed + seedOffset * 31.7)))
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)

    const dpNoiseScale = noiseMechanism ? stdDev / (Math.max(0.1, epsilon) * 12) : 0
    const dpNoise = Math.sin(generationSeed * 3.7 + seedOffset * 5.1) * dpNoiseScale

    return mean + z0 * stdDev + dpNoise
  }

  // Dynamic preview records computation
  const previewRecords = React.useMemo(() => {
    const rows: Record<string, string | number>[] = []
    const count = 6

    for (let i = 0; i < count; i++) {
      const fn = FIRST_NAMES[(i * 3 + generationSeed) % FIRST_NAMES.length]
      const ln = LAST_NAMES[(i * 5 + generationSeed + 2) % LAST_NAMES.length]
      const fullName = `${fn} ${ln}`
      const baseSlug = `${fn.charAt(0).toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, '')}`

      const record: Record<string, string | number> = {
        id: saltedHash
          ? `syn_${((generationSeed * 9301 + i * 49297) % 233280).toString(16).padStart(6, '0')}`
          : `usr_${1000 + i}`,
      }

      for (const field of activeFields) {
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
            const last4 = (((generationSeed * 7 + i * 1337 + 1000) % 9000) + 1000).toString()
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
            const catIndex = (i + Math.floor(generationSeed / 100)) % cats.length
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
  }, [activeFields, generationSeed, saltedHash, noiseMechanism, epsilon])

  // Statistical fidelity metrics
  const fidelityMetrics = React.useMemo(() => {
    const rawSimilarity = Math.min(99.4, Math.max(82.0, 99.2 - ((5.0 - epsilon) / 4.9) * 9.6))
    const similarity = parseFloat(rawSimilarity.toFixed(1))
    const leakageRisk = kAnonymity && saltedHash && epsilon <= 3.5 ? 0.0 : Math.max(0, (epsilon - 3.5) * 0.04)
    const correlationRetention = parseFloat(Math.min(99.1, 98.6 - ((5.0 - epsilon) / 4.9) * 6.2).toFixed(1))
    const wassersteinDistance = parseFloat((0.032 + ((5.0 - epsilon) / 4.9) * 0.024).toFixed(3))
    const laplaceNoiseStd = (0.12 / Math.max(0.1, epsilon)).toFixed(3)

    let privacyTier = 'Balanced Privacy & Utility'
    let privacyBadgeColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'

    if (epsilon <= 0.5) {
      privacyTier = 'Maximum Privacy / High DP Noise'
      privacyBadgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    } else if (epsilon > 2.5) {
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
  }, [epsilon, kAnonymity, saltedHash])

  // Estimated file size calculation
  const estimatedFileSize = React.useMemo(() => {
    const bytesPerRow = outputFormat === 'csv' ? 180 : 380
    const totalKb = (rowCount * bytesPerRow) / 1024
    if (totalKb < 1024) {
      return `~${totalKb.toFixed(1)} KB`
    }
    return `~${(totalKb / 1024).toFixed(2)} MB`
  }, [outputFormat, rowCount])

  // Add field handler
  const handleAddCustomField = () => {
    if (!newFieldName.trim()) return

    const cleanName = newFieldName.trim().toLowerCase().replace(/\s+/g, '_')
    const newField: SchemaField = {
      id: `f-custom-${Date.now()}`,
      name: cleanName,
      label: newFieldName.trim(),
      type: newFieldType,
      description: `Custom ${newFieldType} schema column`,
      params:
        newFieldType === 'gaussian_float'
          ? { mean: 500, stdDev: 120, currency: '$' }
          : newFieldType === 'category_weights'
            ? { categories: ['Alpha', 'Beta', 'Gamma'], weights: [0.5, 0.3, 0.2] }
            : {},
    }

    setActiveFields((prev) => [...prev, newField])
    setNewFieldName('')
    setShowAddField(false)
    triggerRegeneration()
  }

  // Remove field handler
  const removeField = (fieldId: string) => {
    if (activeFields.length <= 2) return
    setActiveFields((prev) => prev.filter((f) => f.id !== fieldId))
    triggerRegeneration()
  }

  // Copy JSON lines
  const copyJsonLines = async () => {
    try {
      const jsonLinesText = previewRecords.map((r) => JSON.stringify(r)).join('\n')
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(jsonLinesText)
      }
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard', err)
    }
  }

  // Download simulation
  const handleDownloadDataset = () => {
    const filename = `synthetic_${selectedTemplateKey}_${rowCount}_rows.${outputFormat === 'csv' ? 'csv' : 'jsonl'}`
    setDownloadToast(`Downloaded ${rowCount.toLocaleString()} synthetic records (${filename})`)
    setTimeout(() => {
      setDownloadToast(null)
    }, 3500)
  }

  return (
    <div data-slot="synthetic-data-generator" className={cn('mx-auto w-full max-w-7xl space-y-6', className)}>
      {/* TOP HEADER HERO */}
      <Card className="border-border overflow-hidden shadow-xs">
        <CardHeader className="border-border/60 bg-muted/20 border-b pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <Cpu className="size-4.5" />
                </div>
                <CardTitle className="text-lg font-bold tracking-tight md:text-xl">
                  Synthetic Dataset Generator &amp; Privacy Engine
                </CardTitle>
                <Badge variant="outline" className="gap-1 text-xs font-normal">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Differential Privacy Enabled
                </Badge>
              </div>
              <CardDescription className="text-xs md:text-sm">
                Mathematical &amp; LLM-guided synthetic tabular dataset synthesizer with configurable (ε, δ)-DP noise
                injection.
              </CardDescription>
            </div>

            {/* Header Right Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Format Selector Segmented Control */}
              <div className="bg-muted/60 border-border inline-flex items-center rounded-lg border p-0.5 text-xs">
                <button
                  type="button"
                  className={cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all',
                    outputFormat === 'csv'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setOutputFormat('csv')}
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Tabular CSV</span>
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all',
                    outputFormat === 'jsonl'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setOutputFormat('jsonl')}
                >
                  <Code2 className="size-3.5" />
                  <span>JSON Lines</span>
                </button>
              </div>

              {/* Download Button */}
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs font-medium"
                onClick={handleDownloadDataset}
              >
                <Download className="size-3.5" />
                <span>Download Dataset</span>
              </Button>

              {/* Primary Generate Batch Button */}
              <Button
                variant="default"
                size="sm"
                className="h-9 gap-1.5 px-4 text-xs font-semibold shadow-xs transition-all active:scale-95"
                disabled={isGenerating}
                onClick={triggerRegeneration}
              >
                {isGenerating ? <RefreshCw className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Synthetic Batch'}</span>
              </Button>
            </div>
          </div>

          {/* Template Selector Bar */}
          <div className="border-border/50 bg-background/50 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3.5 py-2">
            <div className="flex items-center gap-2">
              <Layers className="text-muted-foreground size-4" />
              <span className="text-foreground text-xs font-semibold">Schema Template:</span>
            </div>

            <div className="w-full min-w-0 sm:max-w-md sm:flex-1">
              <Select value={selectedTemplateKey} onValueChange={handleTemplateChange}>
                <SelectTrigger className="bg-background h-8.5 w-full text-xs font-medium [&>span]:truncate [&>svg]:shrink-0">
                  <SelectValue placeholder="Select Schema Template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEMPLATES).map(([key, tpl]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {tpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-normal">
                {TEMPLATES[selectedTemplateKey]?.category}
              </Badge>
              <span>•</span>
              <span className="font-mono tabular-nums">{activeFields.length} fields configured</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* DOWNLOAD SUCCESS NOTIFICATION */}
      {downloadToast && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-700 shadow-xs dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Check className="size-4 stroke-[2.5]" />
            <span>{downloadToast}</span>
          </div>
          <Badge variant="outline" className="border-emerald-500/40 font-mono text-xs">
            {estimatedFileSize}
          </Badge>
        </div>
      )}

      {/* 2-COLUMN STUDIO GENERATOR */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: SCHEMA & PRIVACY CONFIGURATION (40% / 5 Cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* CARD 1: ROW COUNT & BATCH SCALE */}
          <Card className="border-border shadow-xs">
            <CardHeader className="border-border/50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                    <Database className="size-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold">Dataset Generation Volume</CardTitle>
                </div>
                <Badge variant="secondary" className="font-mono text-xs font-semibold tabular-nums">
                  {rowCount.toLocaleString()} rows
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Row Slider */}
              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>100 rows</span>
                  <span className="text-foreground font-mono font-medium">Estimated: {estimatedFileSize}</span>
                  <span>50,000 rows</span>
                </div>

                <Slider
                  value={[rowCount]}
                  min={100}
                  max={50000}
                  step={100}
                  className="w-full py-1"
                  onValueChange={(val) => setRowCount(val[0])}
                />
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-muted-foreground mr-1 text-xs">Presets:</span>
                {[100, 1000, 5000, 10000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={cn(
                      'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all',
                      rowCount === preset
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                    )}
                    onClick={() => setRowCount(preset)}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: DIFFERENTIAL PRIVACY EPSILON (ε) CONTROLS */}
          <Card className="border-border shadow-xs">
            <CardHeader className="border-border/50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <ShieldCheck className="size-3.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Differential Privacy Budget</CardTitle>
                    <CardDescription className="text-xs">Laplace (ε, δ)-DP noise calibration</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs font-bold tabular-nums">
                  ε = {epsilon.toFixed(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Epsilon Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">ε=0.1 (High Privacy)</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">ε=5.0 (High Fidelity)</span>
                </div>

                <Slider
                  value={[epsilon]}
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  className="w-full py-1"
                  onValueChange={(val) => setEpsilon(val[0])}
                />
              </div>

              {/* Epsilon Interpretation Banner */}
              <div
                className={cn(
                  'flex items-start gap-2.5 rounded-lg border p-3 text-xs',
                  fidelityMetrics.privacyBadgeColor,
                )}
              >
                <Info className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <div className="font-semibold">{fidelityMetrics.privacyTier}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Laplace noise scale:{' '}
                    <span className="text-foreground font-mono font-medium">σ=±{fidelityMetrics.laplaceNoiseStd}</span>{' '}
                    • Delta: <span className="text-foreground font-mono font-medium">δ=10⁻⁵</span> • Zero memorization
                    guarantee.
                  </p>
                </div>
              </div>

              {/* Quick Epsilon Presets */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { eps: 0.5, label: 'Healthcare' },
                  { eps: 1.2, label: 'Standard' },
                  { eps: 3.0, label: 'Analytics' },
                ].map(({ eps, label }) => (
                  <button
                    key={eps}
                    type="button"
                    className={cn(
                      'cursor-pointer rounded-lg border p-2 text-center text-xs transition-all',
                      epsilon === eps
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted/40',
                    )}
                    onClick={() => setEpsilon(eps)}
                  >
                    <div className="font-bold">ε = {eps.toFixed(1)}</div>
                    <div className="text-muted-foreground text-xs">{label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: FIELD SCHEMAS GENERATOR */}
          <Card className="border-border shadow-xs">
            <CardHeader className="border-border/50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                    <Sliders className="size-3.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Schema Fields Generator</CardTitle>
                    <CardDescription className="text-xs">
                      {activeFields.length} active synthesizer distributions
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7.5 gap-1 px-2.5 text-xs"
                  onClick={() => setShowAddField(!showAddField)}
                >
                  <Plus className="size-3.5" />
                  <span>{showAddField ? 'Cancel' : 'Add Field'}</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              {/* Add Field Form */}
              {showAddField && (
                <div className="border-border/80 bg-muted/30 space-y-3 rounded-lg border p-3.5 text-xs">
                  <div className="text-foreground font-semibold">Configure New Synthetic Field</div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-muted-foreground text-xs">Field Identifier</label>
                      <Input
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="e.g. account_balance"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-muted-foreground text-xs">Data Distribution Type</label>
                      <Select value={newFieldType} onValueChange={(val) => setNewFieldType(val as FieldDataType)}>
                        <SelectTrigger className="bg-background h-8 w-full min-w-0 text-xs">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gaussian_float" className="text-xs">
                            Float Gaussian Distribution
                          </SelectItem>
                          <SelectItem value="name" className="text-xs">
                            Full Name Faker
                          </SelectItem>
                          <SelectItem value="email" className="text-xs">
                            Email Faker
                          </SelectItem>
                          <SelectItem value="credit_card" className="text-xs">
                            Credit Card Faker
                          </SelectItem>
                          <SelectItem value="category_weights" className="text-xs">
                            Category Weights
                          </SelectItem>
                          <SelectItem value="date_range" className="text-xs">
                            Date Range
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="h-7.5 text-xs" onClick={() => setShowAddField(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7.5 text-xs"
                      disabled={!newFieldName.trim()}
                      onClick={handleAddCustomField}
                    >
                      Add to Schema
                    </Button>
                  </div>
                </div>
              )}

              {/* Fields List */}
              <div className="divide-border/60 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {activeFields.map((field) => (
                  <div
                    key={field.id}
                    className="group border-border/70 bg-card hover:bg-muted/20 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono text-xs font-semibold">{field.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
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
                          )}
                        >
                          {field.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {field.description || 'Configured synthesizer parameter'}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-7 w-7 p-0 opacity-80 group-hover:opacity-100"
                      aria-label="Delete field"
                      disabled={activeFields.length <= 2}
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: PII ANONYMIZATION POLICY SWITCHES */}
          <Card className="border-border shadow-xs">
            <CardHeader className="border-border/50 border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                  <Lock className="size-3.5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">PII Anonymization Policy</CardTitle>
                  <CardDescription className="text-xs">Zero linkage &amp; re-identification guarantees</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* K-Anonymity Switch */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-foreground text-xs font-semibold">K-Anonymity (k = 5 Cohort Enforcement)</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Generalizes quasi-identifiers so each demographic bucket contains ≥ 5 records.
                  </p>
                </div>
                <Switch checked={kAnonymity} onCheckedChange={setKAnonymity} />
              </div>

              <Separator />

              {/* Salted Hash Switch */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-foreground text-xs font-semibold">Salted HMAC-SHA256 for Primary Keys</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Deterministically pseudonymizes primary keys with ephemeral cryptographic salt.
                  </p>
                </div>
                <Switch checked={saltedHash} onCheckedChange={setSaltedHash} />
              </div>

              <Separator />

              {/* Noise Injection Switch */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-foreground text-xs font-semibold">Differential Privacy Gaussian Noise</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Injects calibrated noise calibrated to global sensitivity (Δf / ε).
                  </p>
                </div>
                <Switch checked={noiseMechanism} onCheckedChange={setNoiseMechanism} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: LIVE GENERATED SYNTHETIC DATA PREVIEW (60% / 7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* TOP GAUGE BANNER: STATISTICAL FIDELITY VS PRIVACY */}
          <Card className="border-border overflow-hidden shadow-xs">
            <div className="border-border/60 border-b bg-emerald-500/10 px-4 py-3 dark:bg-emerald-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-foreground font-mono text-sm font-bold tracking-tight">
                    {fidelityMetrics.similarity}% Distribution Similarity • {fidelityMetrics.leakageRisk}% PII Leakage
                    Risk
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-background border-emerald-500/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                  ε-DP Bound: ≤ {epsilon.toFixed(1)}
                </Badge>
              </div>
            </div>

            <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              {/* Metric 1: Fidelity Score */}
              <div className="border-border/60 bg-muted/10 space-y-1.5 rounded-lg border p-3">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Fidelity Score</span>
                  <Zap className="size-3.5 text-amber-500" />
                </div>
                <div className="text-foreground font-mono text-lg font-bold tabular-nums">
                  {fidelityMetrics.similarity}%
                </div>
                <Progress value={fidelityMetrics.similarity} className="h-1.5" />
              </div>

              {/* Metric 2: Correlation Preservation */}
              <div className="border-border/60 bg-muted/10 space-y-1.5 rounded-lg border p-3">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Covariance Retention</span>
                  <BarChart3 className="size-3.5 text-sky-500" />
                </div>
                <div className="text-foreground font-mono text-lg font-bold tabular-nums">
                  {fidelityMetrics.correlationRetention}%
                </div>
                <Progress value={fidelityMetrics.correlationRetention} className="h-1.5" />
              </div>

              {/* Metric 3: Wasserstein Distance */}
              <div className="border-border/60 bg-muted/10 space-y-1.5 rounded-lg border p-3">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Wasserstein Distance</span>
                  <Binary className="size-3.5 text-purple-500" />
                </div>
                <div className="text-foreground font-mono text-lg font-bold tabular-nums">
                  {fidelityMetrics.wassersteinDistance}
                </div>
                <div className="text-muted-foreground text-xs">Low error bound (&lt; 0.05)</div>
              </div>
            </CardContent>
          </Card>

          {/* PREVIEW TABS CARD */}
          <Card className="border-border shadow-xs">
            <CardHeader className="border-border/50 border-b pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                    <TableIcon className="size-3.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Live Generated Synthetic Data Preview</CardTitle>
                    <CardDescription className="text-xs">
                      Real-time sampler showing first {previewRecords.length} synthesized records
                    </CardDescription>
                  </div>
                </div>

                {/* View Switcher */}
                <Tabs
                  value={previewTab}
                  onValueChange={(val) => setPreviewTab(val as 'table' | 'json' | 'metrics')}
                  className="w-auto"
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="table" className="h-7 px-2.5 text-xs">
                      <TableIcon className="mr-1 size-3" />
                      <span>Table</span>
                    </TabsTrigger>
                    <TabsTrigger value="json" className="h-7 px-2.5 text-xs">
                      <Code2 className="mr-1 size-3" />
                      <span>JSONL</span>
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="h-7 px-2.5 text-xs">
                      <BarChart3 className="mr-1 size-3" />
                      <span>Marginals</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {/* TAB 1: TABULAR PREVIEW */}
              {previewTab === 'table' && (
                <div className="space-y-3">
                  <div className="border-border overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                      <Table className="min-w-full text-xs">
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            {activeFields.map((f) => (
                              <TableHead
                                key={f.id}
                                className="text-foreground font-mono text-xs font-semibold whitespace-nowrap"
                              >
                                {f.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewRecords.map((row, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                              {activeFields.map((f) => (
                                <TableCell key={f.id} className="py-2.5 whitespace-nowrap">
                                  {f.name === 'id' ||
                                  f.name.includes('id') ||
                                  f.name.includes('uuid') ||
                                  f.name.includes('token') ? (
                                    <span className="text-muted-foreground font-mono font-medium">{row[f.name]}</span>
                                  ) : f.type === 'category_weights' ? (
                                    <Badge variant="secondary" className="font-mono text-xs font-medium">
                                      {row[f.name]}
                                    </Badge>
                                  ) : f.type === 'gaussian_float' ? (
                                    <span className="text-foreground font-mono font-semibold tabular-nums">
                                      {row[f.name]}
                                    </span>
                                  ) : f.type === 'credit_card' ? (
                                    <span className="text-foreground font-mono text-xs font-medium">{row[f.name]}</span>
                                  ) : f.type === 'email' ? (
                                    <span className="text-primary font-mono text-xs font-normal">{row[f.name]}</span>
                                  ) : (
                                    <span className="text-foreground font-medium">{row[f.name]}</span>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                    <span className="flex items-center gap-1.5 font-mono tabular-nums">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Showing {previewRecords.length} sample records of {rowCount.toLocaleString()} generated rows
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">Seed: #{generationSeed}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: JSON LINES PREVIEW */}
              {previewTab === 'json' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Streaming JSON Lines formatted output:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7.5 gap-1.5 px-2.5 text-xs font-medium"
                      onClick={copyJsonLines}
                    >
                      {copied ? (
                        <Check className="size-3 stroke-[2.5] text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>{copied ? 'Copied JSONL' : 'Copy JSON Lines'}</span>
                    </Button>
                  </div>

                  <div className="border-border/80 bg-muted/40 max-h-[380px] overflow-x-auto overflow-y-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
                    {previewRecords.map((rec, idx) => (
                      <div key={idx} className="hover:bg-muted/60 rounded px-1.5 py-1 whitespace-pre transition-colors">
                        <span className="text-muted-foreground select-none">{idx + 1}&nbsp;</span>
                        <span className="text-foreground">{'{ '}</span>
                        {Object.entries(rec).map(([key, val], kIdx) => (
                          <React.Fragment key={key}>
                            <span className="font-semibold text-sky-600 dark:text-sky-400">"{key}"</span>
                            <span className="text-muted-foreground">: </span>
                            <span
                              className={
                                typeof val === 'number'
                                  ? 'font-medium text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }
                            >
                              {typeof val === 'number' ? val : `"${val}"`}
                            </span>
                            {kIdx < Object.keys(rec).length - 1 && <span className="text-muted-foreground">, </span>}
                          </React.Fragment>
                        ))}
                        <span className="text-foreground">{' }'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MARGINALS & FIDELITY DENSITY */}
              {previewTab === 'metrics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Density Gauge 1 */}
                    <div className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-semibold">Gaussian Distribution Overlap</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          96.2%
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Kolmogorov-Smirnov distance between synthetic batch and continuous Gaussian ground truth.
                      </p>
                      <Progress value={96.2} className="h-2" />
                    </div>

                    {/* Density Gauge 2 */}
                    <div className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-semibold">Categorical Frequency Prior</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          98.4%
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Total variation distance across categorical weight assignments.
                      </p>
                      <Progress value={98.4} className="h-2" />
                    </div>
                  </div>

                  {/* Mathematical Guarantees Breakdown */}
                  <div className="border-border/60 bg-muted/10 space-y-2.5 rounded-lg border p-4 text-xs">
                    <div className="text-foreground flex items-center gap-1.5 font-semibold">
                      <Shield className="text-primary size-4" />
                      <span>Mathematical Privacy Guarantees • Formal Specs</span>
                    </div>
                    <div className="text-muted-foreground grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-500" />
                        <span>Differential Privacy (ε = {epsilon.toFixed(1)}, δ = 10⁻⁵)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-500" />
                        <span>K-Anonymity (k = 5) Cohort Clamping</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-500" />
                        <span>Zero Direct Row Memorization</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-500" />
                        <span>Ephemeral In-Memory Compute</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-border/40 text-muted-foreground flex flex-wrap items-center justify-between border-t py-3 text-xs">
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" />
                Powered by LLM Semantic Synthesis &amp; Laplace Noise Engine
              </span>
              <span className="font-mono tabular-nums">
                Output: {outputFormat.toUpperCase()} • {activeFields.length} fields • {rowCount.toLocaleString()}{' '}
                records
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SyntheticDataGenerator
