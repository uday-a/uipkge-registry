<script lang="ts">
export interface WholesaleProduct {
  id: string
  sku: string
  name: string
  variant: string
  casePack: number
  msrpUnitPrice: number
  wholesaleUnitPrice: number
  cases: number
  availableCases: number
  image: string
  category: string
}

export const DEFAULT_WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    id: 'prod-1',
    sku: 'SKU-84920',
    name: 'Pro Studio Headphones',
    variant: 'Matte Black · Pro Series',
    casePack: 12,
    msrpUnitPrice: 299.0,
    wholesaleUnitPrice: 194.35,
    cases: 4,
    availableCases: 450,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    category: 'Audio & Acoustics',
  },
  {
    id: 'prod-2',
    sku: 'SKU-49102',
    name: 'Aero Minimalist Runner',
    variant: 'Arctic White · US 10-12 Assorted',
    casePack: 10,
    msrpUnitPrice: 140.0,
    wholesaleUnitPrice: 91.0,
    cases: 3,
    availableCases: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
    category: 'Footwear',
  },
  {
    id: 'prod-3',
    sku: 'SKU-77215',
    name: 'Technical Shell Parka',
    variant: 'Mineral Gray · Waterproof 3L',
    casePack: 8,
    msrpUnitPrice: 220.0,
    wholesaleUnitPrice: 143.0,
    cases: 2,
    availableCases: 95,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80',
    category: 'Outerwear',
  },
  {
    id: 'prod-4',
    sku: 'SKU-10934',
    name: 'Braided USB-C Cable',
    variant: 'Space Gray · 2m 240W EPR',
    casePack: 24,
    msrpUnitPrice: 25.0,
    wholesaleUnitPrice: 16.25,
    cases: 2,
    availableCases: 620,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
    category: 'Hardware & Cables',
  },
  {
    id: 'prod-5',
    sku: 'SKU-63821',
    name: 'Leather Cardholder',
    variant: 'Saddle Brown · Full-Grain Veg-Tan',
    casePack: 20,
    msrpUnitPrice: 50.0,
    wholesaleUnitPrice: 32.5,
    cases: 1,
    availableCases: 24,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80',
    category: 'Leather Goods',
  },
]
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  Bookmark,
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  TrendingDown,
  Truck,
  Upload,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  poNumber?: string
  accountName?: string
  accountTier?: string
  tierDiscountPercent?: number
  paymentTerms?: string
  freeFreightThreshold?: number
  initialProducts?: WholesaleProduct[]
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  poNumber: 'PO-2026-8841B',
  accountName: 'Northwind Retailers',
  accountTier: 'Tier 3 Wholesale Partner',
  tierDiscountPercent: 35,
  paymentTerms: 'Net 30 Invoicing',
  freeFreightThreshold: 10000,
})

const emit = defineEmits<{
  submitOrder: [
    payload: {
      poNumber: string
      items: WholesaleProduct[]
      subtotal: number
      totalUnits: number
      totalCases: number
      savings: number
    },
  ]
  saveTemplate: [items: WholesaleProduct[]]
  exportCsv: [items: WholesaleProduct[]]
}>()

const products = ref<WholesaleProduct[]>(
  props.initialProducts
    ? JSON.parse(JSON.stringify(props.initialProducts))
    : JSON.parse(JSON.stringify(DEFAULT_WHOLESALE_PRODUCTS)),
)

const poRef = ref(props.poNumber)
const showCsvBox = ref(false)
const csvPasteText = ref('')
const pasteFeedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)
const templateSaved = ref(false)
const orderSubmitted = ref(false)
const isSubmitting = ref(false)

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)
}

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val)
}

// Computations
const totalCases = computed(() => products.value.reduce((acc, p) => acc + (Number(p.cases) || 0), 0))
const totalUnits = computed(() => products.value.reduce((acc, p) => acc + (Number(p.cases) || 0) * p.casePack, 0))
const wholesaleSubtotal = computed(() =>
  products.value.reduce((acc, p) => acc + (Number(p.cases) || 0) * p.casePack * p.wholesaleUnitPrice, 0),
)
const msrpTotal = computed(() =>
  products.value.reduce((acc, p) => acc + (Number(p.cases) || 0) * p.casePack * p.msrpUnitPrice, 0),
)
const totalSavings = computed(() => Math.max(0, msrpTotal.value - wholesaleSubtotal.value))
const savingsPercent = computed(() => {
  if (msrpTotal.value <= 0) return props.tierDiscountPercent
  return Math.round((totalSavings.value / msrpTotal.value) * 100)
})

const isFreeFreight = computed(() => wholesaleSubtotal.value >= props.freeFreightThreshold)
const freightAmount = computed(() => (isFreeFreight.value ? 0 : 250))
const grandTotal = computed(() => wholesaleSubtotal.value + freightAmount.value)

const nextTierTarget = 50000
const nextTierRemaining = computed(() => Math.max(0, nextTierTarget - wholesaleSubtotal.value))
const tierProgressPercent = computed(() => Math.min(100, Math.round((wholesaleSubtotal.value / nextTierTarget) * 100)))

// Actions
const updateCases = (id: string, delta: number) => {
  const item = products.value.find((p) => p.id === id)
  if (item) {
    const current = Number(item.cases) || 0
    const next = Math.max(0, Math.min(item.availableCases, current + delta))
    item.cases = next
  }
}

const setCases = (id: string, val: string | number) => {
  const item = products.value.find((p) => p.id === id)
  if (item) {
    const parsed = parseInt(String(val), 10)
    if (isNaN(parsed) || parsed < 0) {
      item.cases = 0
    } else {
      item.cases = Math.min(item.availableCases, parsed)
    }
  }
}

const clearLine = (id: string) => {
  const item = products.value.find((p) => p.id === id)
  if (item) {
    item.cases = 0
  }
}

const resetAllCases = () => {
  products.value.forEach((p) => {
    p.cases = 0
  })
  pasteFeedback.value = null
}

const restoreDefaultCases = () => {
  products.value = JSON.parse(JSON.stringify(DEFAULT_WHOLESALE_PRODUCTS))
  pasteFeedback.value = null
}

const applyCsvPaste = () => {
  pasteFeedback.value = null
  if (!csvPasteText.value.trim()) {
    pasteFeedback.value = {
      type: 'error',
      message: 'Please paste SKU and case quantity rows to parse.',
    }
    return
  }

  const lines = csvPasteText.value.split(/\r?\n/)
  let updatedCount = 0
  const unknownSkus: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#') || line.toLowerCase().startsWith('sku')) continue

    const parts = line.split(/[,;\t]+/).map((s) => s.trim())
    if (parts.length >= 2) {
      const skuQuery = parts[0].toUpperCase()
      const qty = parseInt(parts[1], 10)

      if (!isNaN(qty)) {
        const product = products.value.find(
          (p) => p.sku.toUpperCase() === skuQuery || p.sku.toUpperCase().includes(skuQuery),
        )
        if (product) {
          product.cases = Math.max(0, Math.min(product.availableCases, qty))
          updatedCount++
        } else {
          unknownSkus.push(parts[0])
        }
      }
    }
  }

  if (updatedCount > 0) {
    pasteFeedback.value = {
      type: 'success',
      message: `Successfully updated ${updatedCount} SKU line items in bulk matrix.${
        unknownSkus.length > 0
          ? ` Note: ${unknownSkus.length} SKU(s) not found in catalog (${unknownSkus.slice(0, 3).join(', ')}).`
          : ''
      }`,
    }
  } else {
    pasteFeedback.value = {
      type: 'error',
      message: 'No matching catalog SKUs found. Verify format: SKU-84920, 10',
    }
  }
}

const loadSampleCsv = () => {
  csvPasteText.value = `SKU-84920, 8\nSKU-49102, 5\nSKU-77215, 4\nSKU-10934, 12\nSKU-63821, 6`
  applyCsvPaste()
}

const handleSaveTemplate = () => {
  templateSaved.value = true
  emit('saveTemplate', products.value)
  setTimeout(() => {
    templateSaved.value = false
  }, 4000)
}

const handleSubmitOrder = () => {
  if (totalCases.value === 0) return
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    orderSubmitted.value = true
    emit('submitOrder', {
      poNumber: poRef.value,
      items: products.value.filter((p) => p.cases > 0),
      subtotal: wholesaleSubtotal.value,
      totalUnits: totalUnits.value,
      totalCases: totalCases.value,
      savings: totalSavings.value,
    })
  }, 600)
}

const handleExportCsv = () => {
  emit('exportCsv', products.value)
  const header =
    'SKU,Product Name,Variant,Case Pack Multiplier,Cases Ordered,Total Units,Wholesale Unit Price,Line Total\n'
  const rows = products.value
    .filter((p) => p.cases > 0)
    .map(
      (p) =>
        `"${p.sku}","${p.name}","${p.variant}",${p.casePack},${p.cases},${p.cases * p.casePack},${p.wholesaleUnitPrice},${(p.cases * p.casePack * p.wholesaleUnitPrice).toFixed(2)}`,
    )
    .join('\n')
  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows)
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('href', csvContent)
  downloadLink.setAttribute('download', `${poRef.value}-order-matrix.csv`)
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
</script>

<template>
  <div data-slot="wholesale-b2b-quick-order" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header & Account Info -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Building2 class="size-3.5" />
                <span>{{ accountName }}</span>
                <span>·</span>
                <span>{{ accountTier }}</span>
              </div>
              <Badge
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles class="mr-1 size-3" />
                {{ tierDiscountPercent }}% Off MSRP Wholesale Tier
              </Badge>
            </div>
            <CardTitle class="text-xl font-bold tracking-tight sm:text-2xl">
              Wholesale & B2B Bulk Order Matrix
            </CardTitle>
            <CardDescription class="text-muted-foreground text-xs sm:text-sm">
              Build your purchase order by entering case quantities below or pasting bulk SKU manifests with automated
              case multipliers.
            </CardDescription>
          </div>

          <!-- Header Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <Button
              aria-label="Close CSV paste"
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs font-medium"
              @click="showCsvBox = !showCsvBox"
            >
              <FileSpreadsheet class="size-3.5" />
              <span>{{ showCsvBox ? 'Hide CSV Paste' : 'Upload CSV Order' }}</span>
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="handleSaveTemplate">
              <Bookmark class="size-3.5" />
              <span>Save Order Template</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="pt-0">
        <!-- Account Terms & Partner Meta Strip -->
        <div class="bg-muted/40 border-border grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4 sm:gap-4">
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">PO Reference</div>
            <div class="font-mono text-sm font-semibold">{{ poRef }}</div>
          </div>
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Payment Terms</div>
            <div class="text-foreground flex items-center gap-1 text-sm font-semibold">
              <CheckCircle2 class="size-3.5 text-emerald-500" />
              <span>{{ paymentTerms }}</span>
            </div>
          </div>
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Freight Status</div>
            <div
              :class="
                cn(
                  'text-sm font-semibold tabular-nums',
                  isFreeFreight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                )
              "
            >
              {{ isFreeFreight ? 'Free Ground Freight' : '$250 Standard Freight' }}
            </div>
          </div>
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Volume Tier Status</div>
            <div class="text-foreground text-sm font-semibold">
              Tier 3 <span class="text-muted-foreground font-normal">({{ tierDiscountPercent }}% Margin)</span>
            </div>
          </div>
        </div>

        <!-- Volume Tier Margin Incentive Banner -->
        <div class="border-border bg-card/60 mt-3 rounded-lg border p-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2">
              <TrendingDown class="size-4 shrink-0 text-emerald-500" />
              <div class="text-xs">
                <span class="text-foreground font-semibold">Tier 4 Milestone ($50,000):</span>
                <span class="text-muted-foreground ml-1">
                  {{
                    nextTierRemaining > 0
                      ? `Add ${formatCurrency(nextTierRemaining)} more to unlock 42% Tier 4 Enterprise Margin.`
                      : 'Tier 4 Enterprise Margin (42%) Unlocked!'
                  }}
                </span>
              </div>
            </div>
            <div class="text-muted-foreground flex items-center gap-2 text-xs">
              <span>{{ tierProgressPercent }}% to Tier 4</span>
              <div class="bg-muted border-border h-2 w-24 overflow-hidden rounded-full border">
                <div
                  class="h-full bg-emerald-500 transition-all duration-300"
                  :style="{ width: `${tierProgressPercent}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Template Saved Alert -->
    <div
      v-if="templateSaved"
      class="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 sm:text-sm dark:text-emerald-300"
    >
      <div class="flex items-center gap-2">
        <Bookmark class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Order matrix saved as your primary template. You can re-populate this draft at any time.</span>
      </div>
      <Button
        aria-label="Dismiss notification"
        variant="ghost"
        size="xs"
        class="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
        @click="templateSaved = false"
      >
        <X class="size-3.5" />
      </Button>
    </div>

    <!-- Order Submitted Success Alert -->
    <div
      v-if="orderSubmitted"
      class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 sm:p-5 dark:text-emerald-200"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-3">
          <CheckCircle2 class="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div class="space-y-1">
            <h3 class="text-sm font-semibold sm:text-base">Purchase Order {{ poRef }} Submitted Successfully!</h3>
            <p class="text-muted-foreground text-xs sm:text-sm">
              Your bulk order of
              <strong class="text-foreground">{{ totalCases }} cases ({{ totalUnits }} units)</strong> totaling
              <strong class="text-foreground">{{ formatCurrency(grandTotal) }}</strong> has been queued for warehouse
              dispatch under {{ paymentTerms }}.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button aria-label="Download attachment" variant="outline" size="sm" class="text-xs" @click="handleExportCsv">
            <Download class="mr-1.5 size-3.5" />
            Download PO PDF
          </Button>
          <Button size="sm" class="text-xs" @click="orderSubmitted = false"> Start New Order </Button>
        </div>
      </div>
    </div>

    <!-- Quick SKU & Quantity CSV Paste Box -->
    <Card v-if="showCsvBox" class="border-border bg-card shadow-xs transition-all duration-200">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileSpreadsheet class="text-primary size-4" />
            <CardTitle class="text-sm font-semibold sm:text-base"> Quick Paste SKU & Quantity Manifest </CardTitle>
          </div>
          <Button
            aria-label="Close CSV paste"
            variant="ghost"
            size="xs"
            class="text-muted-foreground hover:text-foreground"
            @click="showCsvBox = false"
          >
            <X class="size-4" />
          </Button>
        </div>
        <CardDescription class="text-muted-foreground text-xs">
          Paste CSV rows with SKU identifier and case quantity (one item per line, e.g.
          <code class="bg-muted rounded px-1 font-mono">SKU-84920, 10</code>) to auto-populate matrix.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-3">
        <Textarea
          v-model="csvPasteText"
          placeholder="SKU-84920, 8&#10;SKU-49102, 5&#10;SKU-77215, 4&#10;SKU-10934, 12&#10;SKU-63821, 6"
          :rows="4"
          class="font-mono text-xs"
        />

        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <Button size="sm" class="text-xs font-medium" @click="applyCsvPaste">
              <Upload class="mr-1.5 size-3.5" />
              Apply SKU List to Matrix
            </Button>
            <Button variant="outline" size="sm" class="text-xs font-medium" @click="loadSampleCsv">
              Load Sample Data
            </Button>
            <Button
              v-if="csvPasteText"
              variant="ghost"
              size="sm"
              class="text-muted-foreground text-xs"
              @click="csvPasteText = ''"
            >
              Clear Input
            </Button>
          </div>
          <div class="text-muted-foreground text-xs">Supports comma, tab, and semicolon delimited lines</div>
        </div>

        <!-- Parse Feedback Alert -->
        <div
          v-if="pasteFeedback"
          :class="
            cn(
              'flex items-center gap-2 rounded-lg border p-2.5 text-xs',
              pasteFeedback.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-destructive/30 bg-destructive/10 text-destructive',
            )
          "
        >
          <CheckCircle2
            v-if="pasteFeedback.type === 'success'"
            class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          <AlertCircle v-else class="size-4 shrink-0" />
          <span>{{ pasteFeedback.message }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Bulk SKU Matrix Table Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="border-border border-b pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Bulk SKU Order Matrix</CardTitle>
            <CardDescription class="text-muted-foreground text-xs">
              {{ products.length }} wholesale catalog items available with active case multipliers.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="xs" class="text-muted-foreground text-xs" @click="restoreDefaultCases">
              <RefreshCw class="mr-1 size-3" />
              Reset Defaults
            </Button>
            <Button variant="outline" size="xs" class="text-muted-foreground text-xs" @click="resetAllCases">
              <Trash2 class="mr-1 size-3" />
              Zero All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table class="w-full max-w-[760px] min-w-full">
            <TableHeader>
              <TableRow class="bg-muted/30">
                <TableHead class="w-[300px] text-xs font-semibold">Product & SKU Identifier</TableHead>
                <TableHead class="text-xs font-semibold">Case Multiplier</TableHead>
                <TableHead class="text-xs font-semibold">Unit Price</TableHead>
                <TableHead class="text-xs font-semibold">Case Quantity</TableHead>
                <TableHead class="text-xs font-semibold">Availability</TableHead>
                <TableHead class="text-right text-xs font-semibold">Line Total</TableHead>
                <TableHead class="w-[50px]">
                  <span class="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="product in products"
                :key="product.id"
                :class="cn('transition-colors', product.cases > 0 && 'bg-primary/5 dark:bg-primary/5')"
              >
                <!-- Product Thumbnail & Details -->
                <TableCell class="py-3.5">
                  <div class="flex items-center gap-3">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="border-border bg-muted/40 size-12 shrink-0 rounded-lg border object-cover"
                      loading="lazy"
                    />
                    <div class="min-w-0 space-y-0.5">
                      <div class="text-foreground truncate text-sm font-medium">
                        {{ product.name }}
                      </div>
                      <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <span class="font-mono">{{ product.sku }}</span>
                        <span>·</span>
                        <span class="truncate">{{ product.variant }}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <!-- Case Pack Multiplier -->
                <TableCell class="py-3.5">
                  <div class="flex items-center gap-1.5">
                    <Package class="text-muted-foreground size-3.5" />
                    <span class="text-foreground font-mono text-xs font-medium tabular-nums">
                      {{ product.casePack }} units / case
                    </span>
                  </div>
                </TableCell>

                <!-- Pricing (MSRP vs Wholesale) -->
                <TableCell class="py-3.5">
                  <div class="space-y-0.5">
                    <div class="text-foreground text-sm font-semibold tabular-nums">
                      {{ formatCurrency(product.wholesaleUnitPrice) }}
                      <span class="text-muted-foreground text-xs font-normal">wholesale</span>
                    </div>
                    <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <span class="tabular-nums line-through">{{ formatCurrency(product.msrpUnitPrice) }} MSRP</span>
                      <span class="font-medium text-emerald-600 dark:text-emerald-400">
                        -{{
                          Math.round(
                            ((product.msrpUnitPrice - product.wholesaleUnitPrice) / product.msrpUnitPrice) * 100,
                          )
                        }}%
                      </span>
                    </div>
                  </div>
                </TableCell>

                <!-- Quantity Stepper Input -->
                <TableCell class="py-3.5">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <Button
                        aria-label="Decrease cases"
                        variant="outline"
                        size="xs"
                        class="size-7 p-0"
                        :disabled="product.cases <= 0"
                        @click="updateCases(product.id, -1)"
                      >
                        <Minus class="size-3" />
                      </Button>
                      <Input
                        :model-value="product.cases"
                        type="number"
                        min="0"
                        :max="product.availableCases"
                        class="h-7 w-16 text-center font-mono text-xs tabular-nums"
                        @update:model-value="(val) => setCases(product.id, val)"
                      />
                      <Button
                        aria-label="Increase cases"
                        variant="outline"
                        size="xs"
                        class="size-7 p-0"
                        :disabled="product.cases >= product.availableCases"
                        @click="updateCases(product.id, 1)"
                      >
                        <Plus class="size-3" />
                      </Button>
                    </div>
                    <div class="text-muted-foreground font-mono text-xs tabular-nums">
                      {{ product.cases }} {{ product.cases === 1 ? 'case' : 'cases' }} =
                      <strong class="text-foreground">{{ product.cases * product.casePack }}</strong> units
                    </div>
                  </div>
                </TableCell>

                <!-- Stock Status -->
                <TableCell class="py-3.5">
                  <Badge
                    v-if="product.availableCases > 50"
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    In Stock · {{ formatNumber(product.availableCases) }} cases
                  </Badge>
                  <Badge
                    v-else
                    variant="outline"
                    class="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400"
                  >
                    Low Stock · {{ product.availableCases }} cases
                  </Badge>
                </TableCell>

                <!-- Line Total -->
                <TableCell class="py-3.5 text-right">
                  <div class="space-y-0.5">
                    <div class="text-foreground font-mono text-sm font-bold tabular-nums">
                      {{ formatCurrency(product.cases * product.casePack * product.wholesaleUnitPrice) }}
                    </div>
                    <div
                      v-if="product.cases > 0"
                      class="font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400"
                    >
                      Save
                      {{
                        formatCurrency(
                          product.cases * product.casePack * (product.msrpUnitPrice - product.wholesaleUnitPrice),
                        )
                      }}
                    </div>
                    <div v-else class="text-muted-foreground text-xs">0 units</div>
                  </div>
                </TableCell>

                <!-- Row Clear Action -->
                <TableCell class="py-3.5 text-center">
                  <Button
                    v-if="product.cases > 0"
                    variant="ghost"
                    size="xs"
                    class="text-muted-foreground hover:text-destructive size-7 p-0"
                    title="Clear row quantity"
                    @click="clearLine(product.id)"
                  >
                    <Trash2 class="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Sticky Order Summary Footer -->
    <div
      class="bg-card/95 border-border sticky bottom-4 z-20 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all sm:p-5"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <!-- Summary Totals Metrics -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
          <!-- Total Units -->
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Total Units</div>
            <div class="font-mono text-base font-bold tabular-nums sm:text-lg">
              {{ formatNumber(totalUnits) }} Units
            </div>
            <div class="text-muted-foreground font-mono text-xs tabular-nums">{{ totalCases }} Cases ordered</div>
          </div>

          <!-- Wholesale Subtotal -->
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Wholesale Subtotal</div>
            <div class="font-mono text-base font-bold tabular-nums sm:text-lg">
              {{ formatCurrency(wholesaleSubtotal) }}
            </div>
            <div class="text-muted-foreground text-xs">MSRP {{ formatCurrency(msrpTotal) }}</div>
          </div>

          <!-- Tier Savings -->
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Tier Volume Savings</div>
            <div class="font-mono text-base font-bold text-emerald-600 tabular-nums sm:text-lg dark:text-emerald-400">
              -{{ formatCurrency(totalSavings) }}
            </div>
            <div class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {{ savingsPercent }}% Margin Savings
            </div>
          </div>

          <!-- Freight & Terms -->
          <div class="space-y-0.5">
            <div class="text-muted-foreground text-xs font-medium">Freight & Terms</div>
            <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
              <Truck class="text-primary size-3.5 shrink-0" />
              <span>{{ isFreeFreight ? 'Free Freight (>$10k)' : '$250 Ground' }}</span>
            </div>
            <div class="text-muted-foreground text-xs">
              {{ paymentTerms }}
            </div>
          </div>
        </div>

        <!-- Submit & Secondary Actions -->
        <div class="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            class="text-xs font-medium"
            :disabled="totalCases === 0"
            @click="handleExportCsv"
          >
            <Download class="mr-1.5 size-3.5" />
            Export CSV
          </Button>

          <Button
            size="default"
            class="gap-2 text-xs font-semibold sm:text-sm"
            :disabled="totalCases === 0 || isSubmitting"
            @click="handleSubmitOrder"
          >
            <Send v-if="!isSubmitting" class="size-4" />
            <RefreshCw v-else class="size-4 animate-spin" />
            <span>{{ isSubmitting ? 'Processing PO...' : 'Submit Wholesale Purchase Order' }}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
