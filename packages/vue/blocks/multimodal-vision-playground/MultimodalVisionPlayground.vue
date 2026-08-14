<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Bot,
  Braces,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Crosshair,
  Eye,
  FileCheck,
  Info,
  Layers,
  RefreshCw,
  Scan,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

defineProps<Props>()

interface ModelOption {
  id: string
  name: string
  provider: string
  latency: string
  tokenUsage: number
  meanConfidence: number
}

interface VisionTaskOption {
  id: string
  name: string
  description: string
}

interface BoundingBox {
  id: string
  label: string
  text: string
  category: string
  confidence: number
  coordinates: string
  top: string
  left: string
  width: string
  height: string
  colorBorder: string
  colorBg: string
  colorBadge: string
}

interface ExtractedEntity {
  id: string
  fieldName: string
  extractedValue: string
  confidence: number
  boxId: string
  dataType: string
}

interface LineItem {
  id: number
  description: string
  qty: number
  unit: string
  unitPrice: number
  totalPrice: number
  confidence: number
}

interface VqaPreset {
  id: string
  question: string
  answer: string
  targetBoxId: string
}

const models: ModelOption[] = [
  {
    id: 'claude-3-5-sonnet-vision',
    name: 'Claude 3.5 Sonnet Vision',
    provider: 'Anthropic',
    latency: '642ms',
    tokenUsage: 1420,
    meanConfidence: 99.4,
  },
  {
    id: 'gpt-4o-vision',
    name: 'GPT-4o Vision',
    provider: 'OpenAI',
    latency: '584ms',
    tokenUsage: 1380,
    meanConfidence: 99.2,
  },
]

const visionTasks: VisionTaskOption[] = [
  {
    id: 'ocr-extraction',
    name: 'Document OCR & Extraction',
    description: 'High-precision layout bounding boxes, key-value extraction & structured RFC-8259 JSON parsing.',
  },
  {
    id: 'object-detection',
    name: 'Object & Bounding Box Detection',
    description: 'Semantic region segmentation, visual entity localization, and coordinate spatial mapping.',
  },
  {
    id: 'vqa',
    name: 'Visual Question Answering',
    description: 'Multi-step visual reasoning and spatial evidence grounding directly on the document image.',
  },
]

const boundingBoxes: BoundingBox[] = [
  {
    id: 'box-logo',
    label: 'Vendor Logo',
    text: 'APEX CLOUD SYSTEMS INC.',
    category: 'vendor',
    confidence: 99.9,
    coordinates: '[42, 48, 110, 320]',
    top: '4%',
    left: '4%',
    width: '42%',
    height: '11%',
    colorBorder: 'border-amber-500/70 dark:border-amber-400/80',
    colorBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    colorBadge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    id: 'box-inv',
    label: 'Invoice #',
    text: 'INV-84920',
    category: 'identifier',
    confidence: 99.8,
    coordinates: '[42, 680, 110, 1140]',
    top: '4%',
    left: '54%',
    width: '42%',
    height: '11%',
    colorBorder: 'border-blue-500/70 dark:border-blue-400/80',
    colorBg: 'bg-blue-500/10 dark:bg-blue-400/10',
    colorBadge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    id: 'box-billto',
    label: 'Customer Entity',
    text: 'Cyberdyne Systems Corp',
    category: 'customer',
    confidence: 99.3,
    coordinates: '[145, 48, 250, 480]',
    top: '17%',
    left: '4%',
    width: '46%',
    height: '13%',
    colorBorder: 'border-sky-500/70 dark:border-sky-400/80',
    colorBg: 'bg-sky-500/10 dark:bg-sky-400/10',
    colorBadge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  {
    id: 'box-due',
    label: 'Due Date & Terms',
    text: 'Due: 2026-09-01 (Net 10)',
    category: 'date',
    confidence: 99.4,
    coordinates: '[145, 680, 250, 1140]',
    top: '17%',
    left: '54%',
    width: '42%',
    height: '13%',
    colorBorder: 'border-rose-500/70 dark:border-rose-400/80',
    colorBg: 'bg-rose-500/10 dark:bg-rose-400/10',
    colorBadge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
  {
    id: 'box-table',
    label: 'Line Items Table',
    text: '3 Items (GPU, NVMe, Bandwidth)',
    category: 'table',
    confidence: 99.5,
    coordinates: '[320, 48, 710, 1140]',
    top: '32%',
    left: '4%',
    width: '92%',
    height: '39%',
    colorBorder: 'border-purple-500/70 dark:border-purple-400/80',
    colorBg: 'bg-purple-500/10 dark:bg-purple-400/10',
    colorBadge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    id: 'box-subtotal',
    label: 'Subtotal & VAT',
    text: 'Subtotal: $1,150.00 · VAT: $95.00',
    category: 'financial',
    confidence: 99.1,
    coordinates: '[730, 620, 830, 1140]',
    top: '73%',
    left: '50%',
    width: '46%',
    height: '10%',
    colorBorder: 'border-teal-500/70 dark:border-teal-400/80',
    colorBg: 'bg-teal-500/10 dark:bg-teal-400/10',
    colorBadge: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  },
  {
    id: 'box-total',
    label: 'Total Amount $1,245.00',
    text: 'Total Due: USD $1,245.00',
    category: 'total',
    confidence: 99.9,
    coordinates: '[850, 620, 960, 1140]',
    top: '85%',
    left: '50%',
    width: '46%',
    height: '11%',
    colorBorder: 'border-emerald-500/80 dark:border-emerald-400',
    colorBg: 'bg-emerald-500/15 dark:bg-emerald-400/15',
    colorBadge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-semibold',
  },
]

const extractedEntities: ExtractedEntity[] = [
  {
    id: 'ent-1',
    fieldName: 'Invoice Number',
    extractedValue: 'INV-84920',
    confidence: 99.8,
    boxId: 'box-inv',
    dataType: 'string',
  },
  {
    id: 'ent-2',
    fieldName: 'Due Date',
    extractedValue: '2026-09-01',
    confidence: 99.4,
    boxId: 'box-due',
    dataType: 'date',
  },
  {
    id: 'ent-3',
    fieldName: 'Issue Date',
    extractedValue: '2026-08-21',
    confidence: 99.6,
    boxId: 'box-due',
    dataType: 'date',
  },
  {
    id: 'ent-4',
    fieldName: 'Vendor Name',
    extractedValue: 'Apex Cloud Systems Inc.',
    confidence: 99.9,
    boxId: 'box-logo',
    dataType: 'string',
  },
  {
    id: 'ent-5',
    fieldName: 'Vendor Tax ID',
    extractedValue: 'US-EIN-94-8271923',
    confidence: 98.9,
    boxId: 'box-logo',
    dataType: 'string',
  },
  {
    id: 'ent-6',
    fieldName: 'Customer Entity',
    extractedValue: 'Cyberdyne Systems Corp',
    confidence: 99.3,
    boxId: 'box-billto',
    dataType: 'string',
  },
  {
    id: 'ent-7',
    fieldName: 'Subtotal Amount',
    extractedValue: '$1,150.00',
    confidence: 99.7,
    boxId: 'box-subtotal',
    dataType: 'currency',
  },
  {
    id: 'ent-8',
    fieldName: 'VAT / Tax Rate (8.25%)',
    extractedValue: '$95.00',
    confidence: 99.1,
    boxId: 'box-subtotal',
    dataType: 'currency',
  },
  {
    id: 'ent-9',
    fieldName: 'Total Amount Due',
    extractedValue: '$1,245.00',
    confidence: 99.9,
    boxId: 'box-total',
    dataType: 'currency',
  },
]

const lineItems: LineItem[] = [
  {
    id: 1,
    description: 'GPU Compute Instance (H100 NVLink 80GB)',
    qty: 2,
    unit: 'hours',
    unitPrice: 450.0,
    totalPrice: 900.0,
    confidence: 99.5,
  },
  {
    id: 2,
    description: 'High-Throughput NVMe Block Storage 4TB',
    qty: 1,
    unit: 'month',
    unitPrice: 150.0,
    totalPrice: 150.0,
    confidence: 99.2,
  },
  {
    id: 3,
    description: 'Dedicated Egress Bandwidth Allocation (10Gbps)',
    qty: 1,
    unit: 'allocation',
    unitPrice: 100.0,
    totalPrice: 100.0,
    confidence: 98.8,
  },
]

const vqaPresets: VqaPreset[] = [
  {
    id: 'q-total',
    question: 'What is the total amount due on this invoice?',
    answer:
      'The total amount due is $1,245.00 USD, parsed from the summary block with 99.9% confidence. It includes $1,150.00 subtotal plus $95.00 VAT (8.25%).',
    targetBoxId: 'box-total',
  },
  {
    id: 'q-due',
    question: 'What is the payment due date and terms?',
    answer:
      'The invoice payment due date is September 01, 2026 under Net 10 Day terms (issued on August 21, 2026), extracted with 99.4% confidence.',
    targetBoxId: 'box-due',
  },
  {
    id: 'q-math',
    question: 'Are all line item totals and taxes mathematically verified?',
    answer:
      'Yes. Calculated ($450 × 2) + $150 + $100 = $1,150.00 subtotal. VAT of 8.25% ($94.88 rounded to $95.00) brings grand total to $1,245.00 with 0 arithmetic errors.',
    targetBoxId: 'box-table',
  },
  {
    id: 'q-vendor',
    question: 'What is the verified vendor entity and tax identifier?',
    answer:
      'Vendor is Apex Cloud Systems Inc. with verified Federal Tax EIN: US-EIN-94-8271923, extracted with 99.9% confidence.',
    targetBoxId: 'box-logo',
  },
]

// State variables
const selectedModel = ref('claude-3-5-sonnet-vision')
const selectedTask = ref('ocr-extraction')
const isAnalyzing = ref(false)
const activeBoxId = ref<string | null>(null)
const activeTab = ref('entities')
const isCopied = ref(false)
const copiedFieldId = ref<string | null>(null)

// Bounding box layer toggles
const showOcrText = ref(true)
const showConfidence = ref(true)
const showCoordinates = ref(true)

// VQA Question Answering state
const vqaInput = ref(vqaPresets[0].question)
const currentVqaAnswer = ref(vqaPresets[0].answer)
const isAnsweringVqa = ref(false)

const activeModel = computed(() => {
  return models.find((m) => m.id === selectedModel.value) ?? models[0]
})

const activeBox = computed(() => {
  if (!activeBoxId.value) return null
  return boundingBoxes.find((b) => b.id === activeBoxId.value) ?? null
})

const rawJsonSchema = computed(() => {
  return JSON.stringify(
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      document_type: 'commercial_invoice',
      document_id: 'doc_vision_9824f8a1',
      model: selectedModel.value,
      mean_confidence: activeModel.value.meanConfidence / 100,
      metadata: {
        dimensions: { width: 1240, height: 1754, dpi: 300 },
        orientation_degrees: 0,
        language: 'en-US',
        pages_analyzed: 1,
        processed_at: new Date().toISOString(),
      },
      extracted_fields: {
        invoice_number: {
          value: 'INV-84920',
          confidence: 0.998,
          bbox: [42, 680, 110, 1140],
        },
        issue_date: {
          value: '2026-08-21',
          confidence: 0.996,
          bbox: [145, 680, 250, 1140],
        },
        due_date: {
          value: '2026-09-01',
          confidence: 0.994,
          bbox: [145, 680, 250, 1140],
        },
        vendor: {
          name: 'Apex Cloud Systems Inc.',
          tax_id: 'US-EIN-94-8271923',
          address: '500 Howard St, Suite 400, San Francisco, CA 94105',
          confidence: 0.999,
        },
        customer: {
          name: 'Cyberdyne Systems Corp',
          account_id: 'ACC-90412',
          confidence: 0.993,
        },
        currency: 'USD',
        subtotal: 1150.0,
        tax_amount: 95.0,
        tax_rate_pct: 8.25,
        total_amount: 1245.0,
      },
      line_items: lineItems.map((item) => ({
        item_id: item.id,
        description: item.description,
        quantity: item.qty,
        unit: item.unit,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        confidence: item.confidence / 100,
      })),
      validation_rules: {
        math_checksum_passed: true,
        tax_arithmetic_valid: true,
        vendor_sanctions_screened: true,
        flagged_anomalies_count: 0,
      },
    },
    null,
    2,
  )
})

function runVisionAnalysis() {
  if (isAnalyzing.value) return
  isAnalyzing.value = true
  activeBoxId.value = null

  setTimeout(() => {
    isAnalyzing.value = false
  }, 650)
}

function handleCopyJson() {
  navigator.clipboard?.writeText(rawJsonSchema.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

function handleCopyEntity(field: ExtractedEntity) {
  navigator.clipboard?.writeText(field.extractedValue)
  copiedFieldId.value = field.id
  setTimeout(() => {
    copiedFieldId.value = null
  }, 2000)
}

function selectVqaPreset(preset: VqaPreset) {
  vqaInput.value = preset.question
  isAnsweringVqa.value = true
  activeBoxId.value = preset.targetBoxId

  setTimeout(() => {
    currentVqaAnswer.value = preset.answer
    isAnsweringVqa.value = false
  }, 350)
}

function submitCustomVqa() {
  if (!vqaInput.value.trim() || isAnsweringVqa.value) return
  isAnsweringVqa.value = true

  setTimeout(() => {
    const match = vqaPresets.find((p) => p.question.toLowerCase().includes(vqaInput.value.toLowerCase().slice(0, 8)))
    if (match) {
      currentVqaAnswer.value = match.answer
      activeBoxId.value = match.targetBoxId
    } else {
      currentVqaAnswer.value = `Multimodal reasoning on visual region: Extracted relevant visual context from document canvas. Invoice INV-84920 Total is $1,245.00 due Sep 01, 2026. Arithmetic verified.`
      activeBoxId.value = 'box-total'
    }
    isAnsweringVqa.value = false
  }, 400)
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    runVisionAnalysis()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div data-slot="multimodal-vision-playground" :class="cn('w-full space-y-6', $props.class)">
    <!-- Header Controls Strip -->
    <div
      class="border-border bg-card flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 shadow-xs"
    >
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <div class="flex items-center gap-2.5">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
            <Scan class="size-4.5" />
          </div>
          <div class="min-w-[12rem]">
            <h2 class="text-foreground text-sm font-semibold tracking-tight">
              Multimodal Vision & Document Intelligence
            </h2>
            <p class="text-muted-foreground text-xs">Visual reasoning, layout parsing & entity extraction studio</p>
          </div>
        </div>

        <Separator orientation="vertical" class="hidden h-7 sm:block" />

        <!-- Model Selector -->
        <div class="w-52">
          <Select v-model="selectedModel">
            <SelectTrigger class="h-9 w-full text-xs font-medium" aria-label="Select Vision Model">
              <SelectValue placeholder="Select Vision Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="m in models" :key="m.id" :value="m.id">
                <div class="flex items-center gap-2">
                  <Sparkles class="text-primary size-3.5" />
                  <span>{{ m.name }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Vision Task Selector -->
        <div class="w-56">
          <Select v-model="selectedTask">
            <SelectTrigger class="h-9 w-full text-xs" aria-label="Select Vision Task">
              <SelectValue placeholder="Select Vision Task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="task in visionTasks" :key="task.id" :value="task.id">
                <span>{{ task.name }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Telemetry Pill -->
        <div
          class="border-border bg-muted/60 text-muted-foreground hidden items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs lg:inline-flex"
        >
          <Cpu class="text-primary size-3.5" />
          <span>{{ activeModel.latency }}</span>
          <span>{{ activeModel.tokenUsage }} tokens</span>
          <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ activeModel.meanConfidence }}% conf</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Run Vision Model Primary Button -->
        <Button
          size="sm"
          class="bg-primary text-primary-foreground hover:bg-primary/90 h-9 gap-1.5 text-xs font-medium shadow-xs"
          :disabled="isAnalyzing"
          @click="runVisionAnalysis"
        >
          <RefreshCw v-if="isAnalyzing" class="size-3.5 animate-spin" />
          <Eye v-else class="size-3.5" />
          <span>{{ isAnalyzing ? 'Analyzing Image...' : 'Run Vision Model' }}</span>
          <kbd
            class="bg-primary-foreground/20 hidden items-center rounded px-1 py-0.5 font-mono text-xs sm:inline-flex"
          >
            ⌘↵
          </kbd>
        </Button>
      </div>
    </div>

    <!-- 2-Column Vision Studio (50% / 50%) -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Visual Document Preview & Interactive Bounding Box Canvas (50%) -->
      <div class="space-y-4 lg:col-span-6">
        <Card class="border-border bg-card overflow-hidden shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Layers class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Visual Document Canvas</CardTitle>
                  <CardDescription class="text-xs">
                    Spatial bounding polygon detection & OCR anchor layer
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" class="text-muted-foreground font-mono text-xs"> 1240 × 1754 · 300 DPI </Badge>
            </div>

            <!-- Bounding Box Layer Toggles -->
            <div
              class="border-border/80 bg-muted/40 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs"
            >
              <span class="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Crosshair class="text-primary size-3.5" />
                <span>Layer Overlays:</span>
              </span>

              <div class="flex flex-wrap items-center gap-4">
                <!-- Toggle: OCR Text -->
                <div class="flex items-center gap-1.5">
                  <Switch id="vue-show-ocr" v-model="showOcrText" />
                  <label for="vue-show-ocr" class="text-foreground cursor-pointer text-xs font-medium">
                    OCR Text
                  </label>
                </div>

                <!-- Toggle: Confidence Scores -->
                <div class="flex items-center gap-1.5">
                  <Switch id="vue-show-conf" v-model="showConfidence" />
                  <label for="vue-show-conf" class="text-foreground cursor-pointer text-xs font-medium">
                    Confidence
                  </label>
                </div>

                <!-- Toggle: Coordinates -->
                <div class="flex items-center gap-1.5">
                  <Switch id="vue-show-coords" v-model="showCoordinates" />
                  <label for="vue-show-coords" class="text-foreground cursor-pointer text-xs font-medium">
                    Coordinates
                  </label>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent class="pt-0">
            <!-- Document Viewport Container -->
            <div
              class="border-border bg-muted/30 relative w-full overflow-hidden rounded-lg border p-3 select-none sm:p-4"
            >
              <!-- The Rendered High-Fidelity Document Sheet -->
              <div
                class="border-border/90 bg-card text-card-foreground relative mx-auto flex aspect-[1/1.36] min-h-[420px] w-full max-w-[560px] max-w-full flex-col justify-between overflow-auto rounded-md border p-4 shadow-sm sm:p-6"
              >
                <!-- Watermark Background Texture -->
                <div
                  class="pointer-events-none absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] dark:opacity-[0.05]"
                />

                <!-- Document Header Section -->
                <div class="border-border/70 relative z-10 flex items-start justify-between border-b pb-4">
                  <!-- Vendor Brand Info -->
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <div
                        class="bg-primary/20 text-primary flex size-6 items-center justify-center rounded text-xs font-bold"
                      >
                        ▲
                      </div>
                      <span class="text-foreground text-xs font-bold tracking-wider uppercase">
                        Apex Cloud Systems
                      </span>
                    </div>
                    <p class="text-muted-foreground text-xs">500 Howard St, Suite 400</p>
                    <p class="text-muted-foreground text-xs">San Francisco, CA 94105</p>
                    <p class="text-muted-foreground font-mono text-xs">EIN: US-94-8271923</p>
                  </div>

                  <!-- Invoice Meta -->
                  <div class="space-y-1 text-right">
                    <div class="bg-primary/10 text-primary inline-block rounded px-2 py-0.5 text-xs font-bold">
                      TAX INVOICE
                    </div>
                    <p class="text-foreground font-mono text-xs font-semibold">INV-84920</p>
                    <p class="text-muted-foreground text-xs">Issued: Aug 21, 2026</p>
                    <p class="text-xs font-medium text-rose-600 dark:text-rose-400">Due: Sep 01, 2026</p>
                  </div>
                </div>

                <!-- Bill To & Account Details -->
                <div class="border-border/60 relative z-10 grid grid-cols-1 gap-3 border-b py-3 text-xs sm:grid-cols-2">
                  <div>
                    <span class="text-muted-foreground text-xs font-semibold uppercase">Billed To:</span>
                    <p class="text-foreground mt-0.5 font-semibold">Cyberdyne Systems Corp</p>
                    <p class="text-muted-foreground">100 Cyberdyne Blvd, Suite 800</p>
                    <p class="text-muted-foreground">San Francisco, CA 94107</p>
                  </div>
                  <div class="text-right">
                    <span class="text-muted-foreground text-xs font-semibold uppercase">Payment Terms:</span>
                    <p class="text-foreground mt-0.5 font-medium">Net 10 Days (Wire Transfer)</p>
                    <p class="text-muted-foreground font-mono">PO Ref: PO-2026-90412</p>
                    <p class="text-muted-foreground">Currency: USD ($)</p>
                  </div>
                </div>

                <!-- Document Line Items Table Mockup -->
                <div class="relative z-10 flex-1 py-3">
                  <div class="w-full text-xs">
                    <div
                      class="border-border/80 text-muted-foreground grid grid-cols-12 gap-1 border-b pb-1.5 font-semibold"
                    >
                      <div class="col-span-6">Item & Description</div>
                      <div class="col-span-2 text-center">Qty</div>
                      <div class="col-span-2 text-right">Rate</div>
                      <div class="col-span-2 text-right">Amount</div>
                    </div>
                    <div class="divide-border/40 divide-y text-xs">
                      <div class="grid grid-cols-12 items-center gap-1 py-2">
                        <div class="col-span-6">
                          <p class="text-foreground font-medium">GPU Instance (H100 NVLink 80GB)</p>
                          <p class="text-muted-foreground text-xs">Dedicated high-speed cluster</p>
                        </div>
                        <div class="col-span-2 text-center font-mono">2 hrs</div>
                        <div class="col-span-2 text-right font-mono">$450.00</div>
                        <div class="col-span-2 text-right font-mono font-medium">$900.00</div>
                      </div>
                      <div class="grid grid-cols-12 items-center gap-1 py-2">
                        <div class="col-span-6">
                          <p class="text-foreground font-medium">High-Throughput NVMe Storage</p>
                          <p class="text-muted-foreground text-xs">4TB Tier-1 SSD Volume</p>
                        </div>
                        <div class="col-span-2 text-center font-mono">1 mo</div>
                        <div class="col-span-2 text-right font-mono">$150.00</div>
                        <div class="col-span-2 text-right font-mono font-medium">$150.00</div>
                      </div>
                      <div class="grid grid-cols-12 items-center gap-1 py-2">
                        <div class="col-span-6">
                          <p class="text-foreground font-medium">Dedicated Egress Bandwidth</p>
                          <p class="text-muted-foreground text-xs">10Gbps Burstable Pipe</p>
                        </div>
                        <div class="col-span-2 text-center font-mono">1 alloc</div>
                        <div class="col-span-2 text-right font-mono">$100.00</div>
                        <div class="col-span-2 text-right font-mono font-medium">$100.00</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Financial Calculation Bottom Strip -->
                <div class="border-border/80 relative z-10 flex items-end justify-between border-t pt-3">
                  <div class="space-y-1">
                    <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <ShieldCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Cryptographic Checksum: 0x8F9A2B</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Wire: Wells Fargo Routing 121000358</p>
                  </div>
                  <div class="w-48 space-y-1 text-right text-xs">
                    <div class="text-muted-foreground flex justify-between">
                      <span>Subtotal:</span>
                      <span class="text-foreground font-mono font-medium">$1,150.00</span>
                    </div>
                    <div class="text-muted-foreground flex justify-between">
                      <span>VAT (8.25%):</span>
                      <span class="text-foreground font-mono font-medium">$95.00</span>
                    </div>
                    <div
                      class="border-border text-foreground flex justify-between border-t pt-1 text-xs font-bold sm:text-sm"
                    >
                      <span>Total Due:</span>
                      <span class="font-mono text-emerald-600 dark:text-emerald-400">$1,245.00</span>
                    </div>
                  </div>
                </div>

                <!-- INTERACTIVE BOUNDING BOX OVERLAYS LAYER -->
                <div class="pointer-events-auto absolute inset-0 z-20">
                  <div
                    v-for="box in boundingBoxes"
                    :key="box.id"
                    tabindex="0"
                    role="button"
                    :aria-label="box.label + ': ' + box.text"
                    :style="{
                      top: box.top,
                      left: box.left,
                      width: box.width,
                      height: box.height,
                    }"
                    class="focus-visible:ring-primary absolute cursor-pointer rounded border-2 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-hidden"
                    :class="[
                      box.colorBorder,
                      box.colorBg,
                      activeBoxId === box.id
                        ? 'ring-primary z-30 scale-[1.01] opacity-100 shadow-md ring-2'
                        : 'hover:ring-primary/60 opacity-85 hover:opacity-100 hover:ring-1',
                    ]"
                    @mouseenter="activeBoxId = box.id"
                    @mouseleave="activeBoxId = null"
                    @click="activeBoxId = box.id"
                    @focus="activeBoxId = box.id"
                    @blur="activeBoxId = null"
                  >
                    <!-- Corner Anchor Dots -->
                    <span class="bg-primary border-background absolute -top-1 -left-1 size-2 rounded-full border" />
                    <span class="bg-primary border-background absolute -top-1 -right-1 size-2 rounded-full border" />
                    <span class="bg-primary border-background absolute -bottom-1 -left-1 size-2 rounded-full border" />
                    <span class="bg-primary border-background absolute -right-1 -bottom-1 size-2 rounded-full border" />

                    <!-- Floating Metadata Tag on Box -->
                    <div
                      class="absolute -top-5.5 left-0 flex items-center gap-1 rounded px-1.5 py-0.5 text-xs whitespace-nowrap shadow-xs transition-opacity"
                      :class="box.colorBadge"
                    >
                      <Tag class="size-3" />
                      <span class="font-semibold">{{ box.label }}</span>
                      <span v-if="showConfidence" class="font-mono text-xs opacity-90"> {{ box.confidence }}% </span>
                    </div>

                    <!-- OCR Text Preview Ribbon (Bottom) -->
                    <div
                      v-if="showOcrText"
                      class="bg-foreground/90 text-background py-0.2 absolute -bottom-5 left-0 max-w-full truncate rounded px-1.5 font-mono text-xs shadow-xs"
                    >
                      {{ box.text }}
                    </div>

                    <!-- Coordinates Pill -->
                    <div
                      v-if="showCoordinates && activeBoxId === box.id"
                      class="bg-background/95 border-border text-muted-foreground absolute top-1 right-1 rounded border px-1 py-0.5 font-mono text-xs shadow-xs"
                    >
                      {{ box.coordinates }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs"
          >
            <span class="flex items-center gap-1.5">
              <Info class="text-primary size-3.5" />
              <span>Hover or click any bounding box to isolate extracted entities</span>
            </span>
            <span v-if="activeBox" class="text-foreground font-mono font-medium">
              Active: {{ activeBox.label }} ({{ activeBox.confidence }}%)
            </span>
            <span v-else class="font-mono text-xs">7 Bounding Anchors</span>
          </CardFooter>
        </Card>
      </div>

      <!-- Right Column: Structured Output & Analysis Studio (50%) -->
      <div class="space-y-4 lg:col-span-6">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Bot class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Structured Output & Visual Analysis</CardTitle>
                  <CardDescription class="text-xs">
                    Multi-modal entity parsing, JSON schemas & visual reasoning
                  </CardDescription>
                </div>
              </div>

              <!-- Status Badge -->
              <Badge
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 class="mr-1 size-3 text-emerald-600 dark:text-emerald-400" />
                Validated · 0 Errors
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <Tabs v-model="activeTab" class="w-full">
              <TabsList class="grid h-9 w-full grid-cols-4">
                <TabsTrigger value="entities" class="text-xs">Key-Values</TabsTrigger>
                <TabsTrigger value="table" class="text-xs">Line Items</TabsTrigger>
                <TabsTrigger value="json" class="text-xs">Raw JSON</TabsTrigger>
                <TabsTrigger value="reasoning" class="text-xs">Reasoning</TabsTrigger>
              </TabsList>

              <!-- TAB 1: Extracted Key-Value Data Table -->
              <TabsContent value="entities" class="mt-4 space-y-3">
                <div class="border-border overflow-hidden rounded-md border">
                  <div class="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow class="bg-muted/50 text-xs">
                          <TableHead class="font-semibold">Field Name</TableHead>
                          <TableHead class="font-semibold">Extracted Value</TableHead>
                          <TableHead class="text-center font-semibold">Confidence</TableHead>
                          <TableHead class="text-right font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody class="text-xs">
                        <TableRow
                          v-for="field in extractedEntities"
                          :key="field.id"
                          class="cursor-pointer transition-colors"
                          :class="activeBoxId === field.boxId ? 'bg-primary/10 font-medium' : 'hover:bg-muted/40'"
                          @mouseenter="activeBoxId = field.boxId"
                          @mouseleave="activeBoxId = null"
                        >
                          <TableCell class="text-foreground py-2.5 font-medium">
                            <div class="flex items-center gap-1.5">
                              <span
                                class="size-1.5 rounded-full"
                                :class="activeBoxId === field.boxId ? 'bg-primary' : 'bg-muted-foreground/40'"
                              />
                              <span>{{ field.fieldName }}</span>
                            </div>
                          </TableCell>
                          <TableCell class="text-foreground py-2.5 font-mono">
                            {{ field.extractedValue }}
                          </TableCell>
                          <TableCell class="py-2.5 text-center">
                            <Badge
                              variant="secondary"
                              class="font-mono text-xs"
                              :class="
                                field.confidence >= 99.5
                                  ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                  : 'border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                              "
                            >
                              {{ field.confidence }}%
                            </Badge>
                          </TableCell>
                          <TableCell class="py-2.5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              class="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
                              aria-label="Copy field value"
                              @click.stop="handleCopyEntity(field)"
                            >
                              <Check
                                v-if="copiedFieldId === field.id"
                                class="size-3.5 text-emerald-600 dark:text-emerald-400"
                              />
                              <Copy v-else class="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <!-- TAB 2: Line Items Tabular Structure -->
              <TabsContent value="table" class="mt-4 space-y-3">
                <div class="border-border overflow-hidden rounded-md border">
                  <div class="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow class="bg-muted/50 text-xs">
                          <TableHead class="w-8 font-semibold">#</TableHead>
                          <TableHead class="font-semibold">Description</TableHead>
                          <TableHead class="text-center font-semibold">Qty</TableHead>
                          <TableHead class="text-right font-semibold">Unit Price</TableHead>
                          <TableHead class="text-right font-semibold">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody class="text-xs">
                        <TableRow
                          v-for="item in lineItems"
                          :key="item.id"
                          class="hover:bg-muted/40 cursor-pointer"
                          @mouseenter="activeBoxId = 'box-table'"
                          @mouseleave="activeBoxId = null"
                        >
                          <TableCell class="text-muted-foreground py-2.5 font-mono">{{ item.id }}</TableCell>
                          <TableCell class="text-foreground py-2.5 font-medium">
                            <p>{{ item.description }}</p>
                            <span class="text-muted-foreground font-mono text-xs"
                              >Confidence: {{ item.confidence }}%</span
                            >
                          </TableCell>
                          <TableCell class="py-2.5 text-center font-mono">{{ item.qty }} {{ item.unit }}</TableCell>
                          <TableCell class="py-2.5 text-right font-mono">${{ item.unitPrice.toFixed(2) }}</TableCell>
                          <TableCell class="text-foreground py-2.5 text-right font-mono font-semibold">
                            ${{ item.totalPrice.toFixed(2) }}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <!-- TAB 3: Raw Structured JSON Schema -->
              <TabsContent value="json" class="mt-4 space-y-3">
                <div
                  class="bg-muted/60 border-border flex items-center justify-between rounded-t-md border border-b-0 px-3 py-2 text-xs"
                >
                  <span class="text-muted-foreground flex items-center gap-1.5 font-mono">
                    <Braces class="text-primary size-3.5" />
                    <span>rfc8259-invoice-schema.json</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    @click="handleCopyJson"
                  >
                    <Check v-if="isCopied" class="mr-1 size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <Copy v-else class="mr-1 size-3.5" />
                    <span>{{ isCopied ? 'Copied JSON!' : 'Copy Schema' }}</span>
                  </Button>
                </div>
                <pre
                  class="border-border bg-muted/30 text-foreground max-h-[320px] overflow-x-auto overflow-y-auto rounded-b-md border p-3.5 font-mono text-xs leading-relaxed"
                ><code>{{ rawJsonSchema }}</code></pre>
              </TabsContent>

              <!-- TAB 4: Visual Reasoning & Question Answering -->
              <TabsContent value="reasoning" class="mt-4 space-y-4">
                <!-- Prose Summary Box -->
                <div class="border-border/90 bg-muted/30 space-y-2.5 rounded-lg border p-3.5 text-xs">
                  <div class="flex items-center gap-2">
                    <Sparkles class="text-primary size-4" />
                    <h4 class="text-foreground text-xs font-semibold">Multimodal Reasoning Summary</h4>
                  </div>
                  <p class="text-muted-foreground leading-relaxed">
                    Identified standard commercial invoice with 3 line items. VAT calculation validated with 0
                    arithmetic errors. Vendor entity verified against active directory with clean 0.0° skew angle and
                    300 DPI clarity.
                  </p>
                  <div class="border-border/60 grid grid-cols-1 gap-2 border-t pt-1 sm:grid-cols-3">
                    <div class="border-border/70 bg-card rounded border p-2">
                      <span class="text-muted-foreground text-xs">Arithmetic Check</span>
                      <p class="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">100% Match</p>
                    </div>
                    <div class="border-border/70 bg-card rounded border p-2">
                      <span class="text-muted-foreground text-xs">Layout Skew</span>
                      <p class="text-foreground mt-0.5 font-mono font-medium">0.0° (Aligned)</p>
                    </div>
                    <div class="border-border/70 bg-card rounded border p-2">
                      <span class="text-muted-foreground text-xs">Optical Clarity</span>
                      <p class="text-foreground mt-0.5 font-semibold">300 DPI High</p>
                    </div>
                  </div>
                </div>

                <!-- Interactive VQA Console -->
                <div class="space-y-2.5">
                  <label class="text-foreground flex items-center justify-between text-xs font-semibold">
                    <span>Visual Question Answering (VQA):</span>
                    <span class="text-muted-foreground text-xs font-normal">Click a sample prompt</span>
                  </label>

                  <!-- Preset Question Chips -->
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="preset in vqaPresets"
                      :key="preset.id"
                      type="button"
                      class="border-border/80 bg-muted/40 hover:border-primary/60 hover:bg-primary/5 rounded-md border px-2 py-1 text-left text-xs transition-colors"
                      @click="selectVqaPreset(preset)"
                    >
                      {{ preset.question }}
                    </button>
                  </div>

                  <!-- Query Input Box -->
                  <div class="flex items-center gap-2">
                    <Input
                      v-model="vqaInput"
                      placeholder="Ask a visual question about this document..."
                      class="h-9 text-xs"
                      @keydown.enter="submitCustomVqa"
                    />
                    <Button
                      size="sm"
                      class="h-9 gap-1.5 px-3 text-xs font-medium"
                      :disabled="isAnsweringVqa"
                      @click="submitCustomVqa"
                    >
                      <RefreshCw v-if="isAnsweringVqa" class="size-3.5 animate-spin" />
                      <Send v-else class="size-3.5" />
                      <span>Ask</span>
                    </Button>
                  </div>

                  <!-- Reasoning Answer Box -->
                  <div
                    class="border-primary/20 bg-primary/5 text-foreground flex items-start gap-2.5 rounded-md border p-3 text-xs leading-relaxed"
                  >
                    <Bot class="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <p class="text-foreground font-medium">
                        {{ currentVqaAnswer }}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs"
          >
            <span class="flex items-center gap-1.5">
              <FileCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Extracted 10 Entities · 3 Line Items</span>
            </span>
            <span class="font-mono">Throughput: ~412 tok/s</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
