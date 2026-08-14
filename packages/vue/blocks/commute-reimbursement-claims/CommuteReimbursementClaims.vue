<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileCheck,
  FileText,
  Paperclip,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Train,
  TrendingUp,
  Upload,
  Wallet,
  X,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type CommuteCategory = 'transit' | 'parking' | 'mileage' | 'ev_charging'
export type ClaimStatus = 'reimbursed' | 'pending'

export interface ExpenseClaim {
  id: string
  date: string
  category: CommuteCategory
  categoryLabel: string
  description: string
  provider: string
  amount: number
  status: ClaimStatus
  statusLabel: string
  receiptFileName: string
  receiptFileSize: string
  receiptDate: string
  notes: string
}

interface Props {
  title?: string
  policyText?: string
  claimPeriod?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Commute & Transit Expense Claims',
  policyText: 'Monthly Commuter Benefit Program · Up to $315.00/mo IRS pre-tax limit',
  claimPeriod: 'August 2026',
})

const categoryMeta: Record<
  CommuteCategory,
  { label: string; shortLabel: string; badgeClass: string; icon: Component; irsLimitInfo: string }
> = {
  transit: {
    label: 'Public Transit Pass: BART/Metro',
    shortLabel: 'Public Transit',
    badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    icon: Train,
    irsLimitInfo: 'BART, Caltrain, Metro, Subway & Commuter Bus passes (IRC § 132(f))',
  },
  parking: {
    label: 'Parking (Station & Garage)',
    shortLabel: 'Parking',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    icon: Building2,
    irsLimitInfo: 'Park-and-ride commuter lots and near-office parking facilities',
  },
  mileage: {
    label: 'Mileage (IRS $0.67/mi)',
    shortLabel: 'Mileage',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: Car,
    irsLimitInfo: '2026 IRS standard rate: $0.67 per business/commuter detour mile',
  },
  ev_charging: {
    label: 'EV Public Charging',
    shortLabel: 'EV Charging',
    badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    icon: Zap,
    irsLimitInfo: 'Level 2 & DC fast charging at public networks & workplace chargers',
  },
}

const statusStyles: Record<ClaimStatus, string> = {
  reimbursed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
}

const statusDots: Record<ClaimStatus, string> = {
  reimbursed: 'bg-emerald-500',
  pending: 'bg-amber-500',
}

const claims = ref<ExpenseClaim[]>([
  {
    id: 'CLM-8041',
    date: 'Aug 18, 2026',
    category: 'transit',
    categoryLabel: 'Public Transit',
    description: 'Monthly BART Clipper Card Pass',
    provider: 'Bay Area Rapid Transit (BART)',
    amount: 120.0,
    status: 'reimbursed',
    statusLabel: 'Reimbursed on Payroll',
    receiptFileName: 'bart-clipper-pass-aug2026.pdf',
    receiptFileSize: '340 KB',
    receiptDate: 'Aug 18, 2026 · 08:14 AM',
    notes: 'Monthly pass reload for Embarcadero ↔ Millbrae commuter route.',
  },
  {
    id: 'CLM-7982',
    date: 'Aug 12, 2026',
    category: 'transit',
    categoryLabel: 'Public Transit',
    description: 'San Francisco Caltrain Monthly Pass',
    provider: 'Caltrain Peninsula Corridor',
    amount: 60.5,
    status: 'reimbursed',
    statusLabel: 'Reimbursed on Payroll',
    receiptFileName: 'caltrain-zone1-3-pass.pdf',
    receiptFileSize: '412 KB',
    receiptDate: 'Aug 12, 2026 · 07:45 AM',
    notes: 'Zone 1 to Zone 3 Caltrain commuter pass for headquarters travel.',
  },
  {
    id: 'CLM-8104',
    date: 'Aug 08, 2026',
    category: 'parking',
    categoryLabel: 'Parking',
    description: 'Downtown Parking Garage',
    provider: 'SOMA Park Management Corp.',
    amount: 65.0,
    status: 'pending',
    statusLabel: 'Pending Approval',
    receiptFileName: 'soma-garage-monthly-receipt.pdf',
    receiptFileSize: '185 KB',
    receiptDate: 'Aug 08, 2026 · 09:30 AM',
    notes: 'Commuter parking space #204 during quarterly planning week.',
  },
  {
    id: 'CLM-7729',
    date: 'Aug 03, 2026',
    category: 'ev_charging',
    categoryLabel: 'EV Charging',
    description: 'EV Supercharger Network',
    provider: 'EVgo / ChargePoint Public Hub',
    amount: 42.0,
    status: 'reimbursed',
    statusLabel: 'Reimbursed on Payroll',
    receiptFileName: 'evgo-charge-sessions-aug.pdf',
    receiptFileSize: '520 KB',
    receiptDate: 'Aug 03, 2026 · 06:20 PM',
    notes: '4x workplace Level-2 charge sessions during sprint week.',
  },
])

// Form Reactive State
const formCategory = ref<CommuteCategory>('transit')
const formDate = ref('2026-08-20')
const formProvider = ref('BART Clipper Card')
const formDescription = ref('Monthly BART Clipper Card Pass')
const formAmount = ref('120.00')
const formMiles = ref('45')
const formAttachedReceipt = ref<{ name: string; size: string } | null>({
  name: 'clipper-reload-receipt.pdf',
  size: '240 KB',
})
const formSubmittedNotice = ref(false)
const recentlySubmittedClaimId = ref('')

// Filter State
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')

// Receipt Modal State
const isReceiptModalOpen = ref(false)
const selectedClaim = ref<ExpenseClaim>(claims.value[0])

function openReceipt(claim: ExpenseClaim) {
  selectedClaim.value = claim
  isReceiptModalOpen.value = true
}

function handleCategoryChange(val: CommuteCategory) {
  formCategory.value = val
  if (val === 'transit') {
    formProvider.value = 'BART Clipper Card'
    formDescription.value = 'Monthly BART Clipper Card Pass'
    formAmount.value = '120.00'
  } else if (val === 'parking') {
    formProvider.value = 'Downtown Station Garage'
    formDescription.value = 'Monthly Station Parking Permit'
    formAmount.value = '65.00'
  } else if (val === 'mileage') {
    formProvider.value = 'Personal Vehicle (IRS Standard Rate)'
    formDescription.value = 'Commute detour travel to client site'
    updateMileageAmount()
  } else if (val === 'ev_charging') {
    formProvider.value = 'EVgo Fast Charging'
    formDescription.value = 'Workplace EV public charging sessions'
    formAmount.value = '42.00'
  }
}

function updateMileageAmount() {
  const miles = parseFloat(formMiles.value) || 0
  const calculated = (miles * 0.67).toFixed(2)
  formAmount.value = calculated
}

function handleAttachSampleReceipt() {
  formAttachedReceipt.value = {
    name: `receipt-${formCategory.value}-${Date.now().toString().slice(-4)}.pdf`,
    size: '318 KB',
  }
}

function handleRemoveReceipt() {
  formAttachedReceipt.value = null
}

function handleSubmitClaim() {
  const parsedAmt = parseFloat(formAmount.value) || 0
  if (parsedAmt <= 0) return

  const meta = categoryMeta[formCategory.value]
  const newId = `CLM-${Math.floor(8200 + Math.random() * 700)}`
  const newClaim: ExpenseClaim = {
    id: newId,
    date: 'Aug 21, 2026',
    category: formCategory.value,
    categoryLabel: meta.shortLabel,
    description: formDescription.value || meta.label,
    provider: formProvider.value || 'Transit Provider',
    amount: parsedAmt,
    status: 'pending',
    statusLabel: 'Pending Approval',
    receiptFileName: formAttachedReceipt.value?.name || 'commute-claim-receipt.pdf',
    receiptFileSize: formAttachedReceipt.value?.size || '290 KB',
    receiptDate: 'Aug 21, 2026 · Just now',
    notes: `Submitted via Commuter Benefit Portal for ${props.claimPeriod}.`,
  }

  claims.value.unshift(newClaim)
  recentlySubmittedClaimId.value = newId
  formSubmittedNotice.value = true

  // Scroll or highlight
  setTimeout(() => {
    formSubmittedNotice.value = false
  }, 6000)
}

function handleResetForm() {
  formCategory.value = 'transit'
  formDate.value = '2026-08-20'
  formProvider.value = 'BART Clipper Card'
  formDescription.value = 'Monthly BART Clipper Card Pass'
  formAmount.value = '120.00'
  formMiles.value = '45'
  formAttachedReceipt.value = {
    name: 'clipper-reload-receipt.pdf',
    size: '240 KB',
  }
  formSubmittedNotice.value = false
}

const isFiltered = computed(() => {
  return searchQuery.value.trim() !== '' || categoryFilter.value !== 'all' || statusFilter.value !== 'all'
})

const filteredClaims = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return claims.value.filter((claim) => {
    const matchCat = categoryFilter.value === 'all' || claim.category === categoryFilter.value
    const matchStatus = statusFilter.value === 'all' || claim.status === statusFilter.value
    const matchQuery =
      !q ||
      claim.id.toLowerCase().includes(q) ||
      claim.description.toLowerCase().includes(q) ||
      claim.provider.toLowerCase().includes(q) ||
      claim.categoryLabel.toLowerCase().includes(q)
    return matchCat && matchStatus && matchQuery
  })
})

function resetFilters() {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  statusFilter.value = 'all'
}

function scrollToSubmitForm() {
  const el = document.getElementById('commute-submit-form')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div data-slot="commute-reimbursement-claims" :class="cn('w-full space-y-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{{ props.title }}</h2>
          <Badge
            wrap
            variant="outline"
            class="border-sky-500/30 bg-sky-500/10 text-xs font-medium text-sky-600 dark:text-sky-400"
          >
            <Calendar class="mr-1 size-3" aria-hidden="true" />
            {{ props.claimPeriod }}
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          {{ props.policyText }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button aria-label="Download attachment" variant="outline" size="sm" class="shadow-xs">
          <Download class="size-4" aria-hidden="true" />
          Export Statement
        </Button>
        <Button size="sm" class="shadow-xs" @click="scrollToSubmitForm">
          <Plus class="size-4" aria-hidden="true" />
          Submit New Claim
        </Button>
      </div>
    </div>

    <!-- 4 Monthly Benefit Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Monthly Allowance Available -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-2 p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-sm font-medium">Monthly Allowance</p>
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Wallet class="size-4" aria-hidden="true" />
            </div>
          </div>
          <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$315.00 / mo</p>
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>IRS Pre-tax limit</span>
            <span class="text-foreground font-medium tabular-nums">$69.50 left</span>
          </div>
        </CardContent>
      </Card>

      <!-- 2. Claimed This Month -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-2 p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-sm font-medium">Claimed This Month</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <TrendingUp class="size-4" aria-hidden="true" />
            </div>
          </div>
          <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$245.50</p>
          <div class="space-y-1.5 pt-0.5">
            <Progress :model-value="78" class="h-1.5" />
            <p class="text-muted-foreground text-xs tabular-nums">$245.50 / $315.00 · 78% utilized</p>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Reimbursed YTD -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-2 p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-sm font-medium">Reimbursed YTD</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-4" aria-hidden="true" />
            </div>
          </div>
          <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$1,890.00</p>
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span class="inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck class="mr-1 size-3.5" aria-hidden="true" />
              100% Settled
            </span>
            <span>· 6 claims in 2026</span>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Pending Review -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-2 p-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-sm font-medium">Pending Review</p>
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Clock class="size-4" aria-hidden="true" />
            </div>
          </div>
          <p class="text-foreground text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
            1 Claim · $65.00
          </p>
          <p class="text-muted-foreground text-xs">Est. payout on Sep 1st payroll</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main 2-Column Portal Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Submit Claim Interactive Card & Policy Card -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Submit Claim Card -->
        <Card id="commute-submit-form" class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-base font-semibold">Submit Commute Claim</CardTitle>
                <CardDescription class="text-xs">
                  File transit pass, parking, mileage, or EV charging for monthly reimbursement.
                </CardDescription>
              </div>
              <Badge wrap variant="secondary" class="text-xs font-medium">
                {{ props.claimPeriod }}
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Submission Alert Notice -->
            <div
              v-if="formSubmittedNotice"
              class="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-800 dark:text-emerald-200"
            >
              <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="text-xs">
                <p class="font-semibold">Claim {{ recentlySubmittedClaimId }} submitted successfully!</p>
                <p class="mt-0.5 text-emerald-700/90 dark:text-emerald-300/90">
                  Itemized receipt received. Your claim has been added to pending payroll review.
                </p>
              </div>
            </div>

            <!-- Category Selector -->
            <div class="space-y-1.5">
              <label for="commute-category-select" class="text-foreground text-xs font-medium">
                Expense Category <span class="text-destructive">*</span>
              </label>
              <Select
                :model-value="formCategory"
                @update:model-value="(v) => handleCategoryChange(v as CommuteCategory)"
              >
                <SelectTrigger id="commute-category-select" class="w-full text-xs">
                  <SelectValue placeholder="Select commute category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transit">
                    <span class="flex items-center gap-2">
                      <Train class="size-3.5 text-sky-500" />
                      <span>Public Transit Pass: BART/Metro</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="parking">
                    <span class="flex items-center gap-2">
                      <Building2 class="size-3.5 text-indigo-500" />
                      <span>Parking (Station & Garage)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="mileage">
                    <span class="flex items-center gap-2">
                      <Car class="size-3.5 text-amber-500" />
                      <span>Mileage (IRS $0.67/mi)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="ev_charging">
                    <span class="flex items-center gap-2">
                      <Zap class="size-3.5 text-emerald-500" />
                      <span>EV Public Charging</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-muted-foreground text-xs">
                {{ categoryMeta[formCategory].irsLimitInfo }}
              </p>
            </div>

            <!-- Date & Provider -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="space-y-1.5">
                <label for="commute-date-input" class="text-foreground text-xs font-medium">
                  Date of Commute <span class="text-destructive">*</span>
                </label>
                <Input id="commute-date-input" v-model="formDate" type="date" class="h-9 text-xs" />
              </div>

              <div class="space-y-1.5">
                <label for="commute-provider-input" class="text-foreground text-xs font-medium">
                  Provider / Authority <span class="text-destructive">*</span>
                </label>
                <Input
                  id="commute-provider-input"
                  v-model="formProvider"
                  placeholder="e.g. BART, Caltrain, EVgo"
                  class="h-9 text-xs"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1.5">
              <label for="commute-desc-input" class="text-foreground text-xs font-medium">
                Claim Description & Route <span class="text-destructive">*</span>
              </label>
              <Input
                id="commute-desc-input"
                v-model="formDescription"
                placeholder="e.g. Monthly Clipper Pass · Embarcadero to Millbrae"
                class="h-9 text-xs"
              />
            </div>

            <!-- Mileage Calculation helper if mileage selected -->
            <div v-if="formCategory === 'mileage'" class="border-border bg-muted/30 space-y-2 rounded-lg border p-3">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground font-medium">IRS Standard Mileage Rate</span>
                <Badge wrap variant="outline" class="text-xs font-normal">$0.67 / mile</Badge>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <label for="commute-miles-input" class="text-muted-foreground text-xs">Total Miles Driven</label>
                  <Input
                    id="commute-miles-input"
                    v-model="formMiles"
                    type="number"
                    min="1"
                    step="1"
                    class="mt-1 h-8 text-xs tabular-nums"
                    @input="updateMileageAmount"
                  />
                </div>
                <div class="flex-1 text-right">
                  <span class="text-muted-foreground text-xs">Calculated Total</span>
                  <p class="text-foreground text-base font-bold tabular-nums">${{ formAmount }}</p>
                </div>
              </div>
            </div>

            <!-- Claim Amount Input -->
            <div class="space-y-1.5">
              <label for="commute-amount-input" class="text-foreground text-xs font-medium">
                Claim Amount (USD) <span class="text-destructive">*</span>
              </label>
              <div class="relative">
                <DollarSign
                  class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
                />
                <Input
                  id="commute-amount-input"
                  v-model="formAmount"
                  type="text"
                  placeholder="0.00"
                  class="h-9 pl-8 text-xs font-semibold tabular-nums"
                />
              </div>
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span>Maximum pre-tax monthly cap: $315.00</span>
                <span class="font-medium">Direct Payroll Payout</span>
              </div>
            </div>

            <!-- Receipt Dropzone Placeholder -->
            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-medium">
                Itemized Receipt Attachment <span class="text-destructive">*</span>
              </label>

              <!-- Attached file view -->
              <div
                v-if="formAttachedReceipt"
                class="border-border bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3 text-xs"
              >
                <div class="flex min-w-0 items-center gap-2.5">
                  <div class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                    <FileText class="size-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-foreground truncate font-medium">{{ formAttachedReceipt.name }}</p>
                    <p class="text-muted-foreground truncate">
                      {{ formAttachedReceipt.size }} · Itemized proof attached
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <Badge
                    wrap
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    <Check class="mr-1 size-3" />
                    Valid
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    class="text-muted-foreground hover:text-foreground size-7"
                    @click="handleRemoveReceipt"
                  >
                    <X class="size-3.5" />
                    <span class="sr-only">Remove receipt</span>
                  </Button>
                </div>
              </div>

              <!-- Dropzone container -->
              <button
                v-else
                type="button"
                class="border-border hover:bg-muted/40 hover:border-primary/50 focus-visible:ring-ring flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-4 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
                @click="handleAttachSampleReceipt"
              >
                <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
                  <Upload class="size-4" />
                </div>
                <p class="text-foreground text-xs font-medium">Click to upload or drag receipt file</p>
                <p class="text-muted-foreground text-xs">PDF, PNG, or JPG up to 10MB (Itemized proof required)</p>
              </button>
            </div>
          </CardContent>

          <CardFooter class="border-border flex items-center justify-between border-t pt-4">
            <Button type="button" variant="ghost" size="sm" class="text-xs" @click="handleResetForm">
              <RotateCcw class="mr-1.5 size-3.5" />
              Reset Form
            </Button>
            <Button
              type="button"
              size="sm"
              class="gap-1.5 text-xs shadow-xs"
              :disabled="!formAmount || parseFloat(formAmount) <= 0"
              @click="handleSubmitClaim"
            >
              <Send class="size-3.5" />
              Submit Claim
            </Button>
          </CardFooter>
        </Card>

        <!-- Compliance & IRS Rules Notice Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-2">
            <div class="flex items-center gap-2">
              <ShieldCheck class="text-primary size-4" />
              <CardTitle class="text-sm font-semibold">Commuter Benefit Program Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-2.5 text-xs">
            <p class="text-muted-foreground leading-relaxed">
              Expenses are reimbursed under Section 132(f) Qualified Transportation Fringe Benefits. Reimbursements are
              disbursed directly into employee payroll on the 1st of every month.
            </p>
            <div class="border-border/60 text-muted-foreground space-y-1.5 border-t pt-2">
              <div class="flex items-center gap-2">
                <Check class="size-3 text-emerald-500" />
                <span>Monthly maximum pre-tax election: $315.00</span>
              </div>
              <div class="flex items-center gap-2">
                <Check class="size-3 text-emerald-500" />
                <span>Receipts must reflect date, transit authority, and paid amount</span>
              </div>
              <div class="flex items-center gap-2">
                <Check class="size-3 text-emerald-500" />
                <span>Deadline for current month submissions: 25th of month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Expense Claims History Table -->
      <div class="space-y-4 lg:col-span-7">
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold">Expense Claims History</CardTitle>
                <CardDescription class="text-xs">
                  Itemized ledger of submitted commuter, transit, and EV expenses.
                </CardDescription>
              </div>
              <Badge wrap variant="outline" class="text-xs tabular-nums"> {{ claims.length }} Total Claims </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Filter & Search Toolbar -->
            <div
              class="border-border bg-muted/20 flex flex-col gap-2.5 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="relative flex-1 sm:max-w-xs">
                <Search
                  class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
                />
                <Input
                  v-model="searchQuery"
                  type="search"
                  placeholder="Search claims, ID, route..."
                  class="h-8 pl-8 text-xs"
                />
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <!-- Category Filter -->
                <Select v-model="categoryFilter">
                  <SelectTrigger class="h-8 w-36 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="transit">Public Transit</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="mileage">Mileage</SelectItem>
                    <SelectItem value="ev_charging">EV Charging</SelectItem>
                  </SelectContent>
                </Select>

                <!-- Status Filter -->
                <Select v-model="statusFilter">
                  <SelectTrigger class="h-8 w-36 text-xs">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="reimbursed">Reimbursed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button v-if="isFiltered" variant="ghost" size="sm" class="h-8 px-2 text-xs" @click="resetFilters">
                  <RotateCcw class="mr-1 size-3" />
                  Reset
                </Button>
              </div>
            </div>

            <!-- Table -->
            <div class="border-border overflow-hidden rounded-lg border">
              <div class="overflow-x-auto">
                <Table>
                  <TableHeader class="bg-muted/40">
                    <TableRow>
                      <TableHead class="min-w-[95px] text-xs">Claim ID</TableHead>
                      <TableHead class="min-w-[90px] text-xs">Date</TableHead>
                      <TableHead class="min-w-[110px] text-xs">Category</TableHead>
                      <TableHead class="min-w-[190px] text-xs">Description & Provider</TableHead>
                      <TableHead class="min-w-[90px] text-right text-xs">Amount</TableHead>
                      <TableHead class="min-w-[130px] text-xs">Status</TableHead>
                      <TableHead class="min-w-[80px] text-center text-xs">Receipt</TableHead>
                      <TableHead class="w-10 text-right text-xs">
                        <span class="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="claim in filteredClaims"
                      :key="claim.id"
                      class="hover:bg-muted/50 transition-colors"
                    >
                      <!-- Claim ID -->
                      <TableCell class="font-mono text-xs font-medium">
                        {{ claim.id }}
                      </TableCell>

                      <!-- Date -->
                      <TableCell class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                        {{ claim.date }}
                      </TableCell>

                      <!-- Category Badge -->
                      <TableCell>
                        <Badge
                          wrap
                          variant="outline"
                          :class="cn('text-xs font-normal', categoryMeta[claim.category]?.badgeClass)"
                        >
                          <component :is="categoryMeta[claim.category]?.icon" class="mr-1 size-3" />
                          {{ claim.categoryLabel }}
                        </Badge>
                      </TableCell>

                      <!-- Description & Provider -->
                      <TableCell>
                        <div class="min-w-0">
                          <p class="text-foreground truncate text-xs font-medium">{{ claim.description }}</p>
                          <p class="text-muted-foreground truncate text-xs">{{ claim.provider }}</p>
                        </div>
                      </TableCell>

                      <!-- Amount -->
                      <TableCell
                        class="text-foreground text-right text-xs font-semibold whitespace-nowrap tabular-nums"
                      >
                        ${{ claim.amount.toFixed(2) }}
                      </TableCell>

                      <!-- Status Badge -->
                      <TableCell>
                        <Badge wrap variant="outline" :class="cn('text-xs font-medium', statusStyles[claim.status])">
                          <span
                            class="mr-1.5 size-1.5 rounded-full"
                            :class="statusDots[claim.status]"
                            aria-hidden="true"
                          />
                          {{ claim.statusLabel }}
                        </Badge>
                      </TableCell>

                      <!-- Receipt Button -->
                      <TableCell class="text-center">
                        <Button
                          aria-label="Attach file"
                          variant="ghost"
                          size="sm"
                          class="h-7 px-2 text-xs"
                          @click="openReceipt(claim)"
                        >
                          <Paperclip class="text-muted-foreground mr-1 size-3" />
                          <span>View</span>
                        </Button>
                      </TableCell>

                      <!-- Actions Dropdown -->
                      <TableCell class="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              class="text-muted-foreground hover:text-foreground size-7"
                            >
                              <Eye class="size-3.5" />
                              <span class="sr-only">Actions for {{ claim.id }}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" class="w-44">
                            <DropdownMenuItem class="cursor-pointer text-xs" @click="openReceipt(claim)">
                              <Receipt class="mr-2 size-3.5" />
                              Inspect Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem class="cursor-pointer text-xs">
                              <FileCheck class="mr-2 size-3.5" />
                              Policy Audit Log
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem class="cursor-pointer text-xs">
                              <Download class="mr-2 size-3.5" />
                              Download Voucher
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    <!-- Empty state -->
                    <TableRow v-if="filteredClaims.length === 0">
                      <TableCell :colspan="8" class="h-32 text-center">
                        <div class="flex flex-col items-center justify-center gap-1.5">
                          <Search class="text-muted-foreground/50 size-5" />
                          <p class="text-foreground text-xs font-medium">No commute claims found</p>
                          <p class="text-muted-foreground text-xs">Try resetting your category or status filter</p>
                          <Button variant="outline" size="sm" class="mt-1 h-7 text-xs" @click="resetFilters">
                            Reset filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <!-- Table Summary Footer -->
              <div
                class="border-border bg-muted/20 text-muted-foreground flex flex-col items-center justify-between gap-2 border-t px-3 py-2 text-xs sm:flex-row"
              >
                <p class="tabular-nums">
                  Showing <span class="text-foreground font-medium">{{ filteredClaims.length }}</span> of
                  <span class="text-foreground font-medium">{{ claims.length }}</span> claims
                </p>
                <div class="flex items-center gap-3">
                  <span class="tabular-nums">
                    Filtered Total:
                    <span class="text-foreground font-semibold">
                      ${{ filteredClaims.reduce((acc, c) => acc + c.amount, 0).toFixed(2) }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Receipt Details Modal Dialog -->
    <Dialog v-model:open="isReceiptModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <div class="flex items-center justify-between pr-4">
            <div class="space-y-0.5">
              <DialogTitle class="text-base font-bold">Commute Receipt Voucher</DialogTitle>
              <DialogDescription class="text-xs">
                IRS-compliant proof of transit and commuter benefit claim.
              </DialogDescription>
            </div>
            <Badge wrap variant="outline" class="font-mono text-xs">
              {{ selectedClaim.id }}
            </Badge>
          </div>
        </DialogHeader>

        <div class="space-y-4 py-2 text-xs">
          <!-- Itemized Receipt Box -->
          <div class="border-border bg-muted/30 space-y-3 rounded-lg border p-3.5">
            <div class="flex items-center justify-between border-b pb-2">
              <div class="flex items-center gap-2">
                <component :is="categoryMeta[selectedClaim.category]?.icon" class="text-primary size-4" />
                <span class="text-foreground font-semibold">{{ selectedClaim.provider }}</span>
              </div>
              <Badge wrap :class="cn('text-xs font-normal', statusStyles[selectedClaim.status])">
                {{ selectedClaim.statusLabel }}
              </Badge>
            </div>

            <div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div>
                <span class="text-muted-foreground block">Transaction Date</span>
                <span class="text-foreground font-medium">{{ selectedClaim.receiptDate }}</span>
              </div>
              <div>
                <span class="text-muted-foreground block">Benefit Category</span>
                <span class="text-foreground font-medium">{{ selectedClaim.categoryLabel }}</span>
              </div>
              <div class="sm:col-span-2">
                <span class="text-muted-foreground block">Line Item Description</span>
                <span class="text-foreground font-medium">{{ selectedClaim.description }}</span>
              </div>
              <div class="sm:col-span-2">
                <span class="text-muted-foreground block">Employee Commute Note</span>
                <span class="text-muted-foreground italic">"{{ selectedClaim.notes }}"</span>
              </div>
            </div>

            <Separator />

            <!-- Amount Breakdown -->
            <div class="space-y-1.5 text-xs">
              <div class="text-muted-foreground flex justify-between">
                <span>Base Fare / Charge</span>
                <span class="font-mono tabular-nums">${{ selectedClaim.amount.toFixed(2) }}</span>
              </div>
              <div class="text-muted-foreground flex justify-between">
                <span>Pre-Tax IRS Exemption (IRC § 132f)</span>
                <span class="font-mono text-emerald-600 tabular-nums dark:text-emerald-400">-$0.00 (Tax Free)</span>
              </div>
              <div class="border-border flex justify-between border-t pt-1.5 text-sm font-bold">
                <span class="text-foreground">Total Reimbursable Amount</span>
                <span class="text-foreground font-mono tabular-nums">${{ selectedClaim.amount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Attached File Strip -->
            <div class="border-border bg-background flex items-center justify-between rounded-md border p-2 text-xs">
              <div class="flex items-center gap-2">
                <FileText class="text-primary size-3.5" />
                <span class="font-mono text-xs">{{ selectedClaim.receiptFileName }}</span>
                <span class="text-muted-foreground">({{ selectedClaim.receiptFileSize }})</span>
              </div>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <ShieldCheck class="mr-1 size-3" />
                Verified
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter class="flex sm:justify-between">
          <Button variant="outline" size="sm" class="text-xs" @click="isReceiptModalOpen = false"> Close </Button>
          <Button
            aria-label="Download attachment"
            size="sm"
            class="gap-1.5 text-xs"
            @click="isReceiptModalOpen = false"
          >
            <Download class="size-3.5" />
            Download Receipt PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
