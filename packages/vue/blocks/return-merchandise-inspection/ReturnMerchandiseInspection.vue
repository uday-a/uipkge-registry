<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertTriangle,
  ArrowRight,
  Barcode,
  Box,
  CheckCircle2,
  Clock,
  CornerDownLeft,
  CreditCard,
  Download,
  FileCheck,
  Package,
  PackageCheck,
  Printer,
  Radio,
  RotateCcw,
  ScanLine,
  Sparkles,
  Tag,
  UserCheck,
  Warehouse,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export type ConditionGrade = 'grade-a' | 'grade-b' | 'grade-c' | 'grade-d'
export type RefundAction = 'full-refund' | 'store-credit' | 'restock-fee'

export interface InspectionChecklist {
  tagsAttached: boolean
  originalBox: boolean
  allAccessories: boolean
  odorStainFree: boolean
}

export interface ReturnInspectionData {
  rmaNumber: string
  stationId: string
  inspectorName: string
  returnReason: string
  item: {
    name: string
    variant: string
    msrp: number
    sku: string
    upc: string
    verified: boolean
  }
  grade: ConditionGrade
  checklist: InspectionChecklist
  refundAction: RefundAction
  qcNotes: string
  dispositionOutcome: {
    route: string
    destinationBin: string
    lpnCode: string
    priority: string
  }
}

interface Props {
  initialRma?: string
  initialGrade?: ConditionGrade
  initialRefundAction?: RefundAction
  initialSubmitted?: boolean
  inspectorName?: string
  stationName?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialRma: '#RMA-849201',
  initialGrade: 'grade-a',
  initialRefundAction: 'full-refund',
  initialSubmitted: false,
  inspectorName: 'Alex Rivera · QC Lead',
  stationName: 'Warehouse Returns Intake & Grading Station #02',
})

const emits = defineEmits<{
  (e: 'complete', data: ReturnInspectionData): void
}>()

// Item scanned hardcoded data
const itemData = {
  name: 'Aero Minimalist Runner · Size 10.5 · Matte Black',
  variant: 'Matte Black / US 10.5 M',
  sku: 'AMR-BLK-105',
  upc: 'UPC-018249',
  msrp: 145.0,
  orderRef: '#ORD-98421',
  carrier: 'FedEx Return Express',
  trackingNumber: '7946 1102 9842',
  returnReason: 'Customer reported wrong size ordered',
}

// Reactive state
const rmaNumber = ref(props.initialRma)
const selectedGrade = ref<ConditionGrade>(props.initialGrade)
const selectedRefundAction = ref<RefundAction>(props.initialRefundAction)
const submitted = ref(props.initialSubmitted)
const qcNotes = ref(
  'Outer packaging opened by customer. All interior packaging materials, extra shoelaces, and brand care card verified in pristine condition. Zero sole wear detected.',
)

const checklist = ref<InspectionChecklist>({
  tagsAttached: true,
  originalBox: true,
  allAccessories: true,
  odorStainFree: true,
})

watch(
  () => props.initialGrade,
  (val) => {
    selectedGrade.value = val
  },
)

watch(
  () => props.initialRefundAction,
  (val) => {
    selectedRefundAction.value = val
  },
)

watch(
  () => props.initialSubmitted,
  (val) => {
    submitted.value = val
  },
)

// Condition Grade options definition
const gradeDefinitions = {
  'grade-a': {
    id: 'grade-a' as ConditionGrade,
    code: 'Grade A',
    title: 'Grade A: Brand New / Unopened',
    conditionLabel: 'Brand New / Pristine',
    summary: 'Original tags & packaging intact',
    route: 'Restock to Primary Inventory',
    targetBin: 'Aisle 04-B · Bin #04-B-12',
    lpnCode: 'LPN-849201-RESTOCK-A',
    priority: 'High · Inventory Replenishment',
    badgeVariant: 'outline' as const,
    badgeClasses: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold',
    activeBorderBg:
      'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500/20',
    indicatorColor: 'bg-emerald-500',
    statusText: 'Primary Inventory Restock Approved',
  },
  'grade-b': {
    id: 'grade-b' as ConditionGrade,
    code: 'Grade B',
    title: 'Grade B: Open Box / Minor Cosmetic',
    conditionLabel: 'Open Box / Inspected',
    summary: 'No functional damage, packaging opened',
    route: 'Route to Outlet / Refurbished Store',
    targetBin: 'Secondary Channel · Pallet #03',
    lpnCode: 'LPN-849201-OUTLET-B',
    priority: 'Standard · Secondary Routing',
    badgeVariant: 'outline' as const,
    badgeClasses: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold',
    activeBorderBg: 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20 shadow-xs ring-1 ring-amber-500/20',
    indicatorColor: 'bg-amber-500',
    statusText: 'Secondary Channel Re-routing',
  },
  'grade-c': {
    id: 'grade-c' as ConditionGrade,
    code: 'Grade C',
    title: 'Grade C: Worn / Used',
    conditionLabel: 'Worn / Blemished',
    summary: 'Minor wear on soles, visible creasing',
    route: 'Liquidation Batch #LQ-409',
    targetBin: 'Bulk Liquidation Pallet #C-88',
    lpnCode: 'LPN-849201-LIQUIDATE-C',
    priority: 'Batch Weekly Dispatch',
    badgeVariant: 'outline' as const,
    badgeClasses: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400 font-semibold',
    activeBorderBg: 'border-orange-500/40 bg-orange-500/5 dark:bg-orange-950/20 shadow-xs ring-1 ring-orange-500/20',
    indicatorColor: 'bg-orange-500',
    statusText: 'Wholesale Liquidation Staging',
  },
  'grade-d': {
    id: 'grade-d' as ConditionGrade,
    code: 'Grade D',
    title: 'Grade D: Damaged / Defective',
    conditionLabel: 'Defective / Damaged',
    summary: 'Torn fabric, seam defect, structural flaw',
    route: 'Quarantine / Return to Vendor (RTV)',
    targetBin: 'Quarantine Bay Q-08 (Vendor Claims)',
    lpnCode: 'LPN-849201-QUARANTINE-D',
    priority: 'Urgent · Vendor RTV Credit Hold',
    badgeVariant: 'destructive' as const,
    badgeClasses: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold',
    activeBorderBg: 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20 shadow-xs ring-1 ring-rose-500/20',
    indicatorColor: 'bg-rose-500',
    statusText: 'Quarantine Hold & Vendor Credit Claim',
  },
}

const currentGrade = computed(() => gradeDefinitions[selectedGrade.value])

// Checklist counts
const totalChecklistCount = 4
const checkedChecklistCount = computed(() => {
  let count = 0
  if (checklist.value.tagsAttached) count++
  if (checklist.value.originalBox) count++
  if (checklist.value.allAccessories) count++
  if (checklist.value.odorStainFree) count++
  return count
})

const allChecksPassed = computed(() => checkedChecklistCount.value === totalChecklistCount)

// Financial calculation based on refund action
const refundCalculations = computed(() => {
  const msrp = itemData.msrp
  if (selectedRefundAction.value === 'store-credit') {
    const bonus = msrp * 0.1
    return {
      subtotal: msrp,
      adjustmentLabel: 'Store Credit Bonus (+10%)',
      adjustmentAmount: bonus,
      isBonus: true,
      totalRefund: msrp + bonus,
      methodLabel: 'Digital Gift Card (sarah.c@example.com)',
      payoutSpeed: 'Instant email delivery upon grading',
    }
  }

  if (selectedRefundAction.value === 'restock-fee') {
    const fee = 15.0
    return {
      subtotal: msrp,
      adjustmentLabel: 'Restocking & Repacking Fee',
      adjustmentAmount: fee,
      isBonus: false,
      totalRefund: msrp - fee,
      methodLabel: 'Net Credit to Visa •••• 4242',
      payoutSpeed: '3–5 business days to card',
    }
  }

  return {
    subtotal: msrp,
    adjustmentLabel: 'Restocking Fee Waived',
    adjustmentAmount: 0,
    isBonus: false,
    totalRefund: msrp,
    methodLabel: 'Full Refund to Visa •••• 4242',
    payoutSpeed: '3–5 business days to card',
  }
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val)
}

function selectAllChecklist(pass: boolean) {
  checklist.value.tagsAttached = pass
  checklist.value.originalBox = pass
  checklist.value.allAccessories = pass
  checklist.value.odorStainFree = pass
}

function applyPresetNote(note: string) {
  if (!qcNotes.value.includes(note)) {
    qcNotes.value = qcNotes.value ? `${qcNotes.value} ${note}` : note
  }
}

function handleCompleteInspection() {
  submitted.value = true
  emits('complete', {
    rmaNumber: rmaNumber.value,
    stationId: 'STATION-02-B',
    inspectorName: props.inspectorName,
    returnReason: itemData.returnReason,
    item: {
      name: itemData.name,
      variant: itemData.variant,
      msrp: itemData.msrp,
      sku: itemData.sku,
      upc: itemData.upc,
      verified: true,
    },
    grade: selectedGrade.value,
    checklist: { ...checklist.value },
    refundAction: selectedRefundAction.value,
    qcNotes: qcNotes.value,
    dispositionOutcome: {
      route: currentGrade.value.route,
      destinationBin: currentGrade.value.targetBin,
      lpnCode: currentGrade.value.lpnCode,
      priority: currentGrade.value.priority,
    },
  })
}

function handleReset() {
  submitted.value = false
  selectedGrade.value = 'grade-a'
  selectedRefundAction.value = 'full-refund'
  selectAllChecklist(true)
  qcNotes.value =
    'Outer packaging opened by customer. All interior packaging materials, extra shoelaces, and brand care card verified in pristine condition. Zero sole wear detected.'
}
</script>

<template>
  <div
    data-slot="return-merchandise-inspection"
    :class="cn('text-foreground mx-auto w-full max-w-6xl space-y-6', props.class)"
  >
    <!-- ================================================================= -->
    <!-- POST-SUBMISSION CONFIRMATION RECEIPT VIEW                         -->
    <!-- ================================================================= -->
    <div v-if="submitted" class="space-y-6">
      <Card class="border-border overflow-hidden shadow-xs">
        <div
          :class="[
            'border-b p-6 text-center sm:p-8',
            selectedGrade === 'grade-d'
              ? 'border-rose-500/30 bg-rose-500/10 dark:bg-rose-950/20'
              : 'border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20',
          ]"
        >
          <div class="relative mx-auto mb-4 size-16">
            <span
              :class="[
                'absolute inset-0 rounded-full blur-xl',
                selectedGrade === 'grade-d' ? 'bg-rose-500/30' : 'bg-emerald-500/30',
              ]"
              aria-hidden="true"
            />
            <span
              :class="[
                'relative flex size-16 items-center justify-center rounded-full border shadow-xs',
                selectedGrade === 'grade-d'
                  ? 'border-rose-500/40 bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
              ]"
            >
              <PackageCheck v-if="selectedGrade !== 'grade-d'" class="size-8" aria-hidden="true" />
              <AlertTriangle v-else class="size-8" aria-hidden="true" />
            </span>
          </div>

          <Badge
            :variant="selectedGrade === 'grade-d' ? 'destructive' : 'outline'"
            :class="[
              'mb-2 font-mono text-xs tracking-wider uppercase',
              selectedGrade !== 'grade-d' &&
                'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
            ]"
          >
            RMA Disposition Manifest Dispatched
          </Badge>

          <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            {{
              selectedGrade === 'grade-d'
                ? 'RMA Inspection Flagged · Quarantine RTV Initiated'
                : 'Inspection Complete · Automated Routing Logged'
            }}
          </h2>
          <p class="text-muted-foreground mx-auto mt-1.5 max-w-2xl text-xs sm:text-sm">
            Disposition for <span class="text-foreground font-medium">{{ itemData.name }}</span> has been recorded.
            Warehouse routing slip and automated customer refund authorization have been queued.
          </p>

          <div
            class="border-border bg-background/80 mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border px-3.5 py-1 text-xs backdrop-blur-xs"
          >
            <span class="text-muted-foreground font-medium">RMA Reference:</span>
            <span class="text-foreground font-mono font-bold">{{ rmaNumber }}</span>
            <span class="text-muted-foreground font-medium">LPN:</span>
            <span class="text-foreground font-mono font-bold">{{ currentGrade.lpnCode }}</span>
          </div>
        </div>

        <CardContent class="space-y-6 p-6">
          <!-- Disposition Summary Meta Grid -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
              <span class="text-muted-foreground block text-xs font-medium">Condition Grade</span>
              <span class="text-foreground block text-sm font-semibold">{{ currentGrade.title }}</span>
              <span class="text-muted-foreground text-xs">{{ currentGrade.summary }}</span>
            </div>

            <div class="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
              <span class="text-muted-foreground block text-xs font-medium">Warehouse Destination</span>
              <span class="text-foreground block text-sm font-semibold">{{ currentGrade.targetBin }}</span>
              <span class="text-muted-foreground text-xs">{{ currentGrade.route }}</span>
            </div>

            <div class="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
              <span class="text-muted-foreground block text-xs font-medium">Customer Resolution</span>
              <span class="text-foreground block text-sm font-semibold tabular-nums">
                {{ formatCurrency(refundCalculations.totalRefund) }}
              </span>
              <span class="text-muted-foreground block truncate text-xs">{{ refundCalculations.methodLabel }}</span>
            </div>

            <div class="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
              <span class="text-muted-foreground block text-xs font-medium">QC Inspector</span>
              <span class="text-foreground block text-sm font-semibold">{{ props.inspectorName }}</span>
              <span class="text-muted-foreground text-xs">Station #02 · Timestamped</span>
            </div>
          </div>

          <!-- LPN Barcode & Routing Pass Box -->
          <div class="border-border bg-muted/15 space-y-3 rounded-xl border p-4 sm:p-5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <Barcode class="text-primary size-4" />
                <span class="text-foreground text-xs font-semibold tracking-wide uppercase">
                  Pallet / Tote License Plate Number (LPN)
                </span>
              </div>
              <Badge variant="outline" class="font-mono text-xs">READY FOR PUTAWAY</Badge>
            </div>

            <div
              class="border-border bg-card flex flex-col items-center justify-center space-y-2 rounded-lg border p-4 text-center"
            >
              <!-- Barcode SVG visualization -->
              <svg
                class="text-foreground h-12 w-full max-w-sm"
                viewBox="0 0 280 48"
                fill="currentColor"
                aria-label="LPN Warehouse Barcode"
              >
                <!-- Barcode vertical lines -->
                <rect x="0" y="0" width="4" height="48" />
                <rect x="7" y="0" width="2" height="48" />
                <rect x="12" y="0" width="5" height="48" />
                <rect x="20" y="0" width="2" height="48" />
                <rect x="25" y="0" width="6" height="48" />
                <rect x="34" y="0" width="3" height="48" />
                <rect x="40" y="0" width="2" height="48" />
                <rect x="45" y="0" width="5" height="48" />
                <rect x="53" y="0" width="3" height="48" />
                <rect x="60" y="0" width="6" height="48" />
                <rect x="69" y="0" width="2" height="48" />
                <rect x="74" y="0" width="4" height="48" />
                <rect x="81" y="0" width="3" height="48" />
                <rect x="88" y="0" width="5" height="48" />
                <rect x="96" y="0" width="2" height="48" />
                <rect x="101" y="0" width="6" height="48" />
                <rect x="110" y="0" width="3" height="48" />
                <rect x="116" y="0" width="4" height="48" />
                <rect x="123" y="0" width="2" height="48" />
                <rect x="128" y="0" width="5" height="48" />
                <rect x="136" y="0" width="3" height="48" />
                <rect x="142" y="0" width="6" height="48" />
                <rect x="151" y="0" width="2" height="48" />
                <rect x="156" y="0" width="4" height="48" />
                <rect x="163" y="0" width="3" height="48" />
                <rect x="170" y="0" width="5" height="48" />
                <rect x="178" y="0" width="2" height="48" />
                <rect x="183" y="0" width="6" height="48" />
                <rect x="192" y="0" width="4" height="48" />
                <rect x="199" y="0" width="2" height="48" />
                <rect x="204" y="0" width="5" height="48" />
                <rect x="212" y="0" width="3" height="48" />
                <rect x="218" y="0" width="6" height="48" />
                <rect x="227" y="0" width="2" height="48" />
                <rect x="232" y="0" width="4" height="48" />
                <rect x="239" y="0" width="3" height="48" />
                <rect x="245" y="0" width="5" height="48" />
                <rect x="253" y="0" width="2" height="48" />
                <rect x="258" y="0" width="6" height="48" />
                <rect x="267" y="0" width="3" height="48" />
                <rect x="273" y="0" width="4" height="48" />
              </svg>
              <div class="flex items-center gap-3 font-mono text-xs font-bold">
                <span class="text-foreground tracking-wider">{{ currentGrade.lpnCode }}</span>
                <span class="text-muted-foreground font-normal">{{ currentGrade.targetBin }}</span>
              </div>
            </div>

            <!-- Inspector Notes Display -->
            <div v-if="qcNotes" class="space-y-1 pt-1 text-xs">
              <span class="text-muted-foreground font-medium">Logged Inspector Notes:</span>
              <p class="border-border bg-card text-foreground rounded-md border p-3 leading-relaxed italic">
                “{{ qcNotes }}”
              </p>
            </div>
          </div>

          <!-- Actions Strip -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="handleReset">
              <RotateCcw class="size-3.5" />
              Start Next RMA Inspection
            </Button>

            <div class="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
                <Printer class="size-3.5" />
                Print LPN Tote Label
              </Button>
              <Button aria-label="Download attachment" size="sm" class="gap-1.5 text-xs font-medium">
                <Download class="size-3.5" />
                Download Disposition PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================= -->
    <!-- ACTIVE INSPECTION WORKBENCH VIEW                                  -->
    <!-- ================================================================= -->
    <div v-else class="space-y-6">
      <!-- Top Station Header Card -->
      <Card class="border-border shadow-xs">
        <CardHeader class="pb-4">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="outline" class="border-primary/30 bg-primary/10 text-primary gap-1.5 py-0.5 text-xs">
                  <Warehouse class="size-3.5" />
                  Station #02 · Returns Intake & Grading
                </Badge>
                <Badge variant="outline" class="gap-1.5 py-0.5 font-mono text-xs">
                  <Tag class="size-3" />
                  {{ rmaNumber }}
                </Badge>
                <Badge
                  variant="outline"
                  class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-xs text-emerald-700 dark:text-emerald-400"
                >
                  <Radio class="size-3 text-emerald-600 dark:text-emerald-400" />
                  Scanner Online
                </Badge>
              </div>

              <div>
                <CardTitle class="text-xl font-bold tracking-tight sm:text-2xl">
                  Warehouse Returns Intake & Grading Station #02
                </CardTitle>
                <CardDescription class="text-xs sm:text-sm">
                  RMA intake verification, physical condition evaluation, restock/quarantine disposition routing, and
                  customer refund action.
                </CardDescription>
              </div>
            </div>

            <!-- Primary Header CTA -->
            <div class="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="default"
                class="gap-2 text-xs font-semibold sm:text-sm"
                @click="handleCompleteInspection"
              >
                <FileCheck class="size-4" />
                Complete Inspection & Disposition
              </Button>
            </div>
          </div>
        </CardHeader>

        <!-- Metadata Ribbon Bar -->
        <CardContent class="pt-0 pb-4">
          <div class="border-border bg-muted/20 grid gap-3 rounded-lg border p-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <div class="space-y-0.5">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Tag class="text-primary size-3.5" />
                <span>RMA Reference</span>
              </div>
              <p class="text-foreground font-mono text-xs font-semibold">{{ rmaNumber }}</p>
              <p class="text-muted-foreground text-xs">Order: {{ itemData.orderRef }}</p>
            </div>

            <div class="space-y-0.5">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <UserCheck class="text-primary size-3.5" />
                <span>Inspector / Station</span>
              </div>
              <p class="text-foreground text-xs font-semibold">{{ props.inspectorName }}</p>
              <p class="text-muted-foreground text-xs">Terminal Station #02</p>
            </div>

            <div class="space-y-0.5">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <CornerDownLeft class="text-primary size-3.5" />
                <span>Customer Return Reason</span>
              </div>
              <p class="text-foreground truncate text-xs font-semibold">{{ itemData.returnReason }}</p>
              <p class="text-muted-foreground text-xs">Carrier: {{ itemData.carrier }}</p>
            </div>

            <div class="space-y-0.5">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Clock class="text-primary size-3.5" />
                <span>Intake Status</span>
              </div>
              <p class="text-foreground text-xs font-semibold">In Progress · Pending Disposition</p>
              <p class="text-muted-foreground font-mono text-xs">{{ itemData.trackingNumber }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- =============================================================== -->
      <!-- 2-COLUMN INSPECTION WORKBENCH                                   -->
      <!-- =============================================================== -->
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <!-- LEFT COLUMN: Item Verification & Condition Grading (7 Cols) -->
        <div class="space-y-6 lg:col-span-7">
          <!-- 1. Scanned Item Verification Card -->
          <Card class="border-border shadow-xs">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2">
                  <ScanLine class="text-primary size-4" />
                  <CardTitle class="text-sm font-semibold">Intake Item Scanned</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  class="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 class="size-3" />
                  Match Verified
                </Badge>
              </div>
            </CardHeader>

            <CardContent class="space-y-4">
              <div
                class="border-border bg-card flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center"
              >
                <div
                  class="border-border bg-muted/60 text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-lg border"
                >
                  <Package class="text-primary size-7" />
                </div>

                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 class="text-foreground text-sm leading-tight font-semibold">
                        {{ itemData.name }}
                      </h4>
                      <p class="text-muted-foreground text-xs">
                        {{ itemData.variant }} · SKU: <span class="font-mono font-medium">{{ itemData.sku }}</span>
                      </p>
                    </div>
                    <div class="text-right">
                      <span class="text-foreground text-base font-bold tabular-nums">
                        {{ formatCurrency(itemData.msrp) }}
                      </span>
                      <span class="text-muted-foreground block text-xs">MSRP</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <div class="text-muted-foreground flex items-center gap-1.5 font-mono">
                      <Barcode class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span class="text-foreground font-semibold">{{ itemData.upc }}</span>
                      <Badge variant="outline" class="h-4 px-1.5 py-0 text-xs text-emerald-700 dark:text-emerald-400">
                        UPC OK
                      </Badge>
                    </div>
                    <Separator orientation="vertical" class="h-3.5" />
                    <span class="text-muted-foreground">Order: {{ itemData.orderRef }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- 2. Condition Grading Radio Cards -->
          <Card class="border-border shadow-xs">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <CardTitle class="text-sm font-semibold">Condition Grading Assessment</CardTitle>
                  <CardDescription class="text-xs">
                    Select physical grading level to trigger automated warehouse routing rules.
                  </CardDescription>
                </div>
                <Badge :class="currentGrade.badgeClasses">
                  {{ currentGrade.code }}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <RadioGroup
                :model-value="selectedGrade"
                class="grid grid-cols-1 gap-2.5"
                @update:model-value="(val: any) => (selectedGrade = val)"
              >
                <!-- Grade A -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                      selectedGrade === 'grade-a'
                        ? gradeDefinitions['grade-a'].activeBorderBg
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedGrade = 'grade-a'"
                >
                  <RadioGroupItem id="grade-a" value="grade-a" class="mt-0.5" />
                  <div class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <label for="grade-a" class="text-foreground cursor-pointer text-xs font-semibold sm:text-sm">
                        Grade A: Brand New / Unopened
                      </label>
                      <Badge
                        variant="outline"
                        class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                      >
                        Primary Restock
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      Original factory tags & packaging intact. No cosmetic or functional flaws.
                    </p>
                    <div class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                      <ArrowRight class="text-primary size-3" />
                      <span
                        >Target:
                        <strong class="text-foreground font-medium"
                          >Restock to Primary Inventory (Aisle 04-B)</strong
                        ></span
                      >
                    </div>
                  </div>
                </div>

                <!-- Grade B -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                      selectedGrade === 'grade-b'
                        ? gradeDefinitions['grade-b'].activeBorderBg
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedGrade = 'grade-b'"
                >
                  <RadioGroupItem id="grade-b" value="grade-b" class="mt-0.5" />
                  <div class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <label for="grade-b" class="text-foreground cursor-pointer text-xs font-semibold sm:text-sm">
                        Grade B: Open Box / Minor Cosmetic
                      </label>
                      <Badge
                        variant="outline"
                        class="border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                      >
                        Outlet Store
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      Box opened or minor package scuffs, but product is 100% unworn and fully functional.
                    </p>
                    <div class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                      <ArrowRight class="text-primary size-3" />
                      <span
                        >Target:
                        <strong class="text-foreground font-medium">Route to Outlet / Refurbished Store</strong></span
                      >
                    </div>
                  </div>
                </div>

                <!-- Grade C -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                      selectedGrade === 'grade-c'
                        ? gradeDefinitions['grade-c'].activeBorderBg
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedGrade = 'grade-c'"
                >
                  <RadioGroupItem id="grade-c" value="grade-c" class="mt-0.5" />
                  <div class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <label for="grade-c" class="text-foreground cursor-pointer text-xs font-semibold sm:text-sm">
                        Grade C: Worn / Used
                      </label>
                      <Badge
                        variant="outline"
                        class="border-orange-500/30 bg-orange-500/10 text-xs text-orange-700 dark:text-orange-400"
                      >
                        Liquidation
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      Visible wear on soles, minor creasing or cosmetic stains. Not suitable for retail shelves.
                    </p>
                    <div class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                      <ArrowRight class="text-primary size-3" />
                      <span
                        >Target:
                        <strong class="text-foreground font-medium"
                          >Liquidation Batch #LQ-409 (Wholesale Lot)</strong
                        ></span
                      >
                    </div>
                  </div>
                </div>

                <!-- Grade D -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                      selectedGrade === 'grade-d'
                        ? gradeDefinitions['grade-d'].activeBorderBg
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedGrade = 'grade-d'"
                >
                  <RadioGroupItem id="grade-d" value="grade-d" class="mt-0.5" />
                  <div class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <label for="grade-d" class="text-foreground cursor-pointer text-xs font-semibold sm:text-sm">
                        Grade D: Damaged / Defective
                      </label>
                      <Badge variant="destructive" class="text-xs"> Quarantine RTV </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      Torn fabric, broken seam, outsole separation, or manufacturing defect.
                    </p>
                    <div class="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                      <ArrowRight class="text-primary size-3" />
                      <span
                        >Target:
                        <strong class="text-foreground font-medium"
                          >Quarantine Bay Q-08 / Return to Vendor (RTV)</strong
                        ></span
                      >
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <!-- 3. Physical Inspection Checklist -->
          <Card class="border-border shadow-xs">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <CardTitle class="text-sm font-semibold">Physical Inspection Checklist</CardTitle>
                  <CardDescription class="text-xs">
                    Verify all physical criteria before approving final warehouse putaway.
                  </CardDescription>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" class="font-mono text-xs">
                    {{ checkedChecklistCount }}/{{ totalChecklistCount }} Passed
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-7 text-xs"
                    @click="selectAllChecklist(!allChecksPassed)"
                  >
                    {{ allChecksPassed ? 'Uncheck All' : 'Pass All' }}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent class="space-y-2.5">
              <!-- Item 1: Tags Attached -->
              <div
                :class="
                  cn(
                    'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                    checklist.tagsAttached ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                  )
                "
              >
                <Checkbox id="chk-tags" v-model="checklist.tagsAttached" class="mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <label for="chk-tags" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                    Tags attached
                  </label>
                  <p class="text-muted-foreground text-xs">
                    Factory hangtags, barcode UPC stickers, and care labels intact.
                  </p>
                </div>
              </div>

              <!-- Item 2: Original Box Present -->
              <div
                :class="
                  cn(
                    'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                    checklist.originalBox ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                  )
                "
              >
                <Checkbox id="chk-box" v-model="checklist.originalBox" class="mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <label for="chk-box" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                    Original box present
                  </label>
                  <p class="text-muted-foreground text-xs">
                    Manufacturer shoebox present with readable SKU and size label.
                  </p>
                </div>
              </div>

              <!-- Item 3: Accessories in Box -->
              <div
                :class="
                  cn(
                    'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                    checklist.allAccessories ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                  )
                "
              >
                <Checkbox id="chk-acc" v-model="checklist.allAccessories" class="mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <label for="chk-acc" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                    All accessories in box
                  </label>
                  <p class="text-muted-foreground text-xs">
                    Extra pair of laces, dust bag, and product manual verified.
                  </p>
                </div>
              </div>

              <!-- Item 4: Odor and Stain Free -->
              <div
                :class="
                  cn(
                    'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                    checklist.odorStainFree ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                  )
                "
              >
                <Checkbox id="chk-odor" v-model="checklist.odorStainFree" class="mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <label for="chk-odor" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                    Odor & stain free
                  </label>
                  <p class="text-muted-foreground text-xs">
                    Free from perfume scent, tobacco smoke, pet hair, dirt, or cosmetic scuffs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- RIGHT COLUMN: Disposition & Customer Refund Action Card (5 Cols) -->
        <div class="space-y-6 lg:col-span-5">
          <!-- 1. Selected Automated Warehouse Disposition Card -->
          <Card class="border-border overflow-hidden shadow-xs">
            <CardHeader class="bg-muted/15 border-border border-b pb-3">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2">
                  <Warehouse class="text-primary size-4" />
                  <CardTitle class="text-sm font-semibold">Warehouse Routing Outcome</CardTitle>
                </div>
                <Badge :class="currentGrade.badgeClasses">
                  {{ currentGrade.code }}
                </Badge>
              </div>
            </CardHeader>

            <CardContent class="space-y-4 p-4">
              <!-- Active Outcome Card Banner -->
              <div :class="cn('rounded-lg border p-4 transition-all', currentGrade.activeBorderBg)">
                <div class="flex items-start gap-3">
                  <div
                    class="border-border bg-background/80 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border"
                  >
                    <Box class="text-primary size-5" />
                  </div>
                  <div class="min-w-0 flex-1 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-foreground text-xs font-bold sm:text-sm">
                        {{ currentGrade.route }}
                      </span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      Destination Bin:
                      <strong class="text-foreground font-mono font-semibold">{{ currentGrade.targetBin }}</strong>
                    </p>
                    <p class="text-muted-foreground text-xs">
                      Priority: <span class="text-foreground font-medium">{{ currentGrade.priority }}</span>
                    </p>
                  </div>
                </div>

                <div class="border-border/60 mt-3.5 flex items-center justify-between border-t pt-3 text-xs">
                  <span class="text-muted-foreground font-mono">LPN: {{ currentGrade.lpnCode }}</span>
                  <Badge variant="outline" class="font-mono text-xs">READY FOR SCAN</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- 2. Customer Refund Action Card -->
          <Card class="border-border shadow-xs">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <CardTitle class="text-sm font-semibold">Customer Refund Action</CardTitle>
                  <CardDescription class="text-xs">
                    Choose financial settlement for RMA {{ rmaNumber }}.
                  </CardDescription>
                </div>
                <CreditCard class="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent class="space-y-4">
              <RadioGroup
                :model-value="selectedRefundAction"
                class="grid grid-cols-1 gap-2.5"
                @update:model-value="(val: any) => (selectedRefundAction = val)"
              >
                <!-- Option 1: Full Refund -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors select-none',
                      selectedRefundAction === 'full-refund'
                        ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 shadow-xs'
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedRefundAction = 'full-refund'"
                >
                  <RadioGroupItem id="ref-full" value="full-refund" class="mt-0.5" />
                  <div class="flex-1 space-y-0.5">
                    <div class="flex items-center justify-between">
                      <label for="ref-full" class="text-foreground cursor-pointer text-xs font-semibold">
                        Authorize Full Refund
                      </label>
                      <span class="text-foreground text-xs font-semibold tabular-nums">
                        {{ formatCurrency(itemData.msrp) }}
                      </span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      100% refund to <span class="text-foreground font-medium">Visa •••• 4242</span>. 3–5 business days.
                    </p>
                  </div>
                </div>

                <!-- Option 2: Store Credit (+10% Bonus) -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors select-none',
                      selectedRefundAction === 'store-credit'
                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-1 ring-emerald-500/20 dark:bg-emerald-950/20'
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedRefundAction = 'store-credit'"
                >
                  <RadioGroupItem id="ref-credit" value="store-credit" class="mt-0.5" />
                  <div class="flex-1 space-y-0.5">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <Sparkles class="size-3 text-emerald-600 dark:text-emerald-400" />
                        <label for="ref-credit" class="text-foreground cursor-pointer text-xs font-semibold">
                          Issue Store Credit (+10%)
                        </label>
                      </div>
                      <span class="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {{ formatCurrency(itemData.msrp * 1.1) }}
                      </span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      Includes
                      <span class="text-foreground font-medium">+{{ formatCurrency(itemData.msrp * 0.1) }}</span> bonus
                      credit. Delivered instantly by email.
                    </p>
                  </div>
                </div>

                <!-- Option 3: Charge Restocking Fee -->
                <div
                  :class="
                    cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors select-none',
                      selectedRefundAction === 'restock-fee'
                        ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 shadow-xs'
                        : 'border-border bg-card hover:bg-muted/30',
                    )
                  "
                  @click="selectedRefundAction = 'restock-fee'"
                >
                  <RadioGroupItem id="ref-fee" value="restock-fee" class="mt-0.5" />
                  <div class="flex-1 space-y-0.5">
                    <div class="flex items-center justify-between">
                      <label for="ref-fee" class="text-foreground cursor-pointer text-xs font-semibold">
                        Charge Restocking Fee (-$15)
                      </label>
                      <span class="text-foreground text-xs font-semibold tabular-nums">
                        {{ formatCurrency(itemData.msrp - 15) }}
                      </span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      $15.00 repackaging & inspection deduction. Net to
                      <span class="text-foreground font-medium">Visa •••• 4242</span>.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <!-- Settlement Calculation Summary Box -->
              <div class="border-border bg-muted/30 space-y-1.5 rounded-lg border p-3 text-xs">
                <div class="text-muted-foreground flex items-center justify-between">
                  <span>Item MSRP</span>
                  <span class="text-foreground font-mono font-medium">{{
                    formatCurrency(refundCalculations.subtotal)
                  }}</span>
                </div>
                <div
                  v-if="selectedRefundAction === 'store-credit'"
                  class="flex items-center justify-between text-emerald-600 dark:text-emerald-400"
                >
                  <span>{{ refundCalculations.adjustmentLabel }}</span>
                  <span class="font-mono font-medium">+{{ formatCurrency(refundCalculations.adjustmentAmount) }}</span>
                </div>
                <div
                  v-else-if="selectedRefundAction === 'restock-fee'"
                  class="flex items-center justify-between text-rose-600 dark:text-rose-400"
                >
                  <span>{{ refundCalculations.adjustmentLabel }}</span>
                  <span class="font-mono font-medium">-{{ formatCurrency(refundCalculations.adjustmentAmount) }}</span>
                </div>
                <div class="border-border text-foreground flex items-center justify-between border-t pt-1.5 font-bold">
                  <span>Authorized Net Settlement</span>
                  <span
                    :class="[
                      'font-mono text-sm font-bold tabular-nums',
                      selectedRefundAction === 'store-credit' && 'text-emerald-600 dark:text-emerald-400',
                    ]"
                  >
                    {{ formatCurrency(refundCalculations.totalRefund) }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- 3. Internal QC Inspection Notes -->
          <Card class="border-border shadow-xs">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <CardTitle class="text-sm font-semibold">Internal QC Inspection Notes</CardTitle>
                  <CardDescription class="text-xs"> Station audit log appended to inventory history. </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent class="space-y-3">
              <Textarea
                v-model="qcNotes"
                :rows="3"
                placeholder="Enter internal inspection notes, physical defect description, or warehouse packaging details..."
                class="text-xs"
              />

              <!-- Quick Tag Helpers -->
              <div class="space-y-1.5">
                <span class="text-muted-foreground block text-xs font-medium">Quick Preset Tags:</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    class="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                    @click="applyPresetNote('Pristine unworn condition.')"
                  >
                    + Pristine Condition
                  </button>
                  <button
                    type="button"
                    class="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                    @click="applyPresetNote('Minor outer box scuff; shoes mint.')"
                  >
                    + Box Scuffed
                  </button>
                  <button
                    type="button"
                    class="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                    @click="applyPresetNote('Slight sole friction detected.')"
                  >
                    + Sole Friction
                  </button>
                  <button
                    type="button"
                    class="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                    @click="applyPresetNote('Factory seam defect identified - Flagged RTV.')"
                  >
                    + Flagged RTV
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter class="border-border bg-muted/15 flex items-center justify-between border-t p-4">
              <span class="text-muted-foreground text-xs">
                Audit sign-off: <strong class="text-foreground font-medium">{{ props.inspectorName }}</strong>
              </span>
              <Button size="sm" class="gap-1.5 text-xs font-semibold" @click="handleCompleteInspection">
                <FileCheck class="size-3.5" />
                Complete Inspection
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
