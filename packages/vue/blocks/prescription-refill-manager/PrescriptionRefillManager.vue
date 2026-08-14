<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  ArrowLeftRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  MapPin,
  MoreHorizontal,
  Phone,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Store,
  Truck,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type PrescriptionStatus = 'ready' | 'needs_auth' | 'in_transit' | 'active'

export interface Prescription {
  id: string
  rxNumber: string
  name: string
  genericFor: string
  dosageForm: string
  instructions: string
  refillsRemaining: number
  totalRefills: number
  lastFilledDate: string
  nextDueDate: string
  isDue: boolean
  prescriber: {
    name: string
    specialty: string
    clinic: string
    phone: string
  }
  status: PrescriptionStatus
  daysSupply: number
  copayEst: number
  ndc: string
  packageTracking?: {
    carrier: string
    trackingNumber: string
    status: string
    estimatedArrival: string
    steps: { title: string; time: string; done: boolean; current?: boolean }[]
  }
}

export interface Pharmacy {
  id: string
  name: string
  subtitle: string
  address: string
  phone: string
  fax: string
  hours: string
  isDriveThru: boolean
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

// Prescriptions mock database
const prescriptions: Prescription[] = [
  {
    id: 'rx-1',
    rxNumber: 'RX-849201',
    name: 'Metformin HCl 500mg',
    genericFor: 'Generic for Glucophage',
    dosageForm: 'Oral Tablet',
    instructions: 'Take 1 tablet by mouth twice daily with meals',
    refillsRemaining: 2,
    totalRefills: 5,
    lastFilledDate: 'Jul 24, 2026',
    nextDueDate: 'Aug 24, 2026',
    isDue: true,
    prescriber: {
      name: 'Dr. Emily Vance, MD',
      specialty: 'Internal Medicine',
      clinic: 'Wilshire Medical Center',
      phone: '(310) 555-0142',
    },
    status: 'ready',
    daysSupply: 30,
    copayEst: 10,
    ndc: '50090-0819-0',
  },
  {
    id: 'rx-2',
    rxNumber: 'RX-849202',
    name: 'Lisinopril 20mg',
    genericFor: 'Generic for Prinivil / Zestril',
    dosageForm: 'Oral Tablet',
    instructions: 'Take 1 tablet by mouth daily in the morning',
    refillsRemaining: 3,
    totalRefills: 6,
    lastFilledDate: 'Jul 10, 2026',
    nextDueDate: 'Aug 10, 2026',
    isDue: true,
    prescriber: {
      name: 'Dr. Marcus Chen, MD',
      specialty: 'Cardiology',
      clinic: 'Pacific Heart & Vascular Institute',
      phone: '(310) 555-0188',
    },
    status: 'ready',
    daysSupply: 30,
    copayEst: 10,
    ndc: '68180-0518-01',
  },
  {
    id: 'rx-3',
    rxNumber: 'RX-774920',
    name: 'Albuterol HFA Inhaler',
    genericFor: 'ProAir HFA 90mcg Inhalation Aerosol',
    dosageForm: 'Inhalation Aerosol (8.5g canister)',
    instructions: 'Inhale 2 puffs every 4-6 hours as needed for wheezing or shortness of breath',
    refillsRemaining: 0,
    totalRefills: 3,
    lastFilledDate: 'Jun 15, 2026',
    nextDueDate: 'Aug 18, 2026',
    isDue: false,
    prescriber: {
      name: 'Dr. Sarah Lin, MD',
      specialty: 'Pulmonology',
      clinic: 'Westside Respiratory Clinic',
      phone: '(310) 555-0195',
    },
    status: 'needs_auth',
    daysSupply: 30,
    copayEst: 15,
    ndc: '59310-0579-22',
  },
  {
    id: 'rx-4',
    rxNumber: 'RX-910384',
    name: 'Atorvastatin Calcium 40mg',
    genericFor: 'Generic for Lipitor',
    dosageForm: 'Oral Tablet',
    instructions: 'Take 1 tablet by mouth once daily at bedtime',
    refillsRemaining: 1,
    totalRefills: 4,
    lastFilledDate: 'Aug 19, 2026',
    nextDueDate: 'Nov 19, 2026',
    isDue: false,
    prescriber: {
      name: 'Dr. Marcus Chen, MD',
      specialty: 'Cardiology',
      clinic: 'Pacific Heart & Vascular Institute',
      phone: '(310) 555-0188',
    },
    status: 'in_transit',
    daysSupply: 90,
    copayEst: 20,
    ndc: '00071-0157-23',
    packageTracking: {
      carrier: 'USPS Priority Rx Express',
      trackingNumber: '9400 1118 9956 2831 4092 11',
      status: 'Out for Delivery',
      estimatedArrival: 'Today by 6:00 PM',
      steps: [
        { title: 'Prescription Refill Ordered', time: 'Aug 19, 9:30 AM', done: true },
        { title: 'Verified & Dispensed by Pharmacist', time: 'Aug 19, 2:15 PM', done: true },
        { title: 'Shipped from Regional Fulfillment', time: 'Aug 20, 8:00 AM', done: true },
        { title: 'Out for Delivery', time: 'Aug 21, 8:45 AM', done: true, current: true },
      ],
    },
  },
]

const availablePharmacies: Pharmacy[] = [
  {
    id: 'cvs-4829',
    name: 'CVS Pharmacy #4829',
    subtitle: '24-Hour Drive-Thru',
    address: '4500 Wilshire Blvd, Los Angeles, CA 90010',
    phone: '(213) 555-0198',
    fax: '(213) 555-0199',
    hours: 'Open 24 Hours · Drive-Thru Open',
    isDriveThru: true,
  },
  {
    id: 'walgreens-1204',
    name: 'Walgreens Pharmacy #1204',
    subtitle: 'Full Service Pharmacy',
    address: '3724 W Olympic Blvd, Los Angeles, CA 90019',
    phone: '(323) 555-0144',
    fax: '(323) 555-0145',
    hours: 'Mon-Sun: 8:00 AM – 10:00 PM',
    isDriveThru: false,
  },
  {
    id: 'kaiser-sunset',
    name: 'Kaiser Sunset Medical Center Pharmacy',
    subtitle: 'Specialty & Mail Hub',
    address: '4760 Sunset Blvd, Los Angeles, CA 90027',
    phone: '(323) 555-0177',
    fax: '(323) 555-0178',
    hours: 'Mon-Fri: 7:00 AM – 9:00 PM · Sat-Sun: 8:00 AM – 6:00 PM',
    isDriveThru: true,
  },
]

// State variables
const searchQuery = ref('')
const statusFilter = ref<'all' | 'ready' | 'needs_auth' | 'in_transit'>('all')
const activePharmacy = ref<Pharmacy>(availablePharmacies[0])

// Refill modal state
const isRefillOpen = ref(false)
const selectedPrescriptionId = ref<string>('rx-1')
const supplyDuration = ref<'30' | '90'>('90')
const deliveryMethod = ref<'pickup' | 'delivery'>('delivery')
const orderSubmitted = ref(false)

// Tracking modal state
const isTrackingOpen = ref(false)
const trackingPrescription = ref<Prescription | null>(null)

// Transfer modal state
const isTransferOpen = ref(false)
const transferForm = ref({
  pharmacyName: '',
  phone: '',
  rxNumber: '',
  medicationName: '',
  notes: '',
})
const transferSubmitted = ref(false)

// Change pharmacy modal state
const isChangePharmacyOpen = ref(false)
const tempSelectedPharmacyId = ref(activePharmacy.value.id)

// Prescribing MD Auth Request modal state
const isAuthRequestOpen = ref(false)
const authRequestedRx = ref<Prescription | null>(null)
const authRequestSubmitted = ref(false)

// Computed list
const filteredPrescriptions = computed(() => {
  return prescriptions.filter((rx) => {
    const matchesSearch =
      rx.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      rx.rxNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      rx.genericFor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      rx.prescriber.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter.value === 'all') return true
    return rx.status === statusFilter.value
  })
})

const selectedPrescription = computed(() => {
  return prescriptions.find((rx) => rx.id === selectedPrescriptionId.value) || prescriptions[0]
})

const estimatedCopay = computed(() => {
  if (supplyDuration.value === '90') {
    return 20.0
  }
  return selectedPrescription.value.copayEst
})

const estimatedInsuranceSavings = computed(() => {
  if (supplyDuration.value === '90') {
    return 75.0
  }
  return 35.0
})

// Action handlers
function openRefillModal(prescriptionId?: string) {
  if (prescriptionId) {
    selectedPrescriptionId.value = prescriptionId
  } else {
    // Default to the first ready prescription
    const readyMed = prescriptions.find((r) => r.status === 'ready')
    selectedPrescriptionId.value = readyMed ? readyMed.id : prescriptions[0].id
  }
  orderSubmitted.value = false
  isRefillOpen.value = true
}

function handleOpenTracking(rx: Prescription) {
  trackingPrescription.value = rx
  isTrackingOpen.value = true
}

function handleOpenAuthRequest(rx: Prescription) {
  authRequestedRx.value = rx
  authRequestSubmitted.value = false
  isAuthRequestOpen.value = true
}

function submitRefillOrder() {
  orderSubmitted.value = true
  setTimeout(() => {
    // Keep feedback visible
  }, 1000)
}

function handleOpenTransfer() {
  transferForm.value = {
    pharmacyName: '',
    phone: '',
    rxNumber: '',
    medicationName: '',
    notes: '',
  }
  transferSubmitted.value = false
  isTransferOpen.value = true
}

function submitTransfer() {
  transferSubmitted.value = true
}

function handleChangePharmacy() {
  tempSelectedPharmacyId.value = activePharmacy.value.id
  isChangePharmacyOpen.value = true
}

function savePharmacyChange() {
  const chosen = availablePharmacies.find((p) => p.id === tempSelectedPharmacyId.value)
  if (chosen) {
    activePharmacy.value = chosen
  }
  isChangePharmacyOpen.value = false
}
</script>

<template>
  <div
    data-slot="prescription-refill-manager"
    :class="cn('bg-background text-foreground w-full space-y-6', props.class)"
  >
    <!-- Header Section -->
    <header
      class="bg-card border-border flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs sm:p-6 md:flex-row md:items-center"
    >
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Pill class="size-4" />
          </div>
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Prescriptions & Medications</h1>
          <Badge variant="outline" class="border-primary/20 bg-primary/5 text-primary text-xs font-medium">
            Active Care Plan
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Manage recurring refills, dosage schedules, and home delivery tracking.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <Button variant="outline" class="gap-1.5 text-xs font-medium" @click="handleOpenTransfer">
          <ArrowLeftRight class="size-3.5" />
          Transfer Prescription
        </Button>
        <Button variant="default" class="gap-1.5 text-xs font-medium shadow-xs" @click="openRefillModal()">
          <Plus class="size-3.5" />
          Request Refill
        </Button>
      </div>
    </header>

    <!-- 3 Medication Status Metric Cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Active Prescriptions -->
      <Card class="shadow-xs">
        <CardContent class="flex items-center justify-between p-5">
          <div class="space-y-1">
            <p class="text-muted-foreground text-xs font-medium">Active Prescriptions</p>
            <div class="flex items-baseline gap-2">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">4</span>
              <span class="text-muted-foreground text-xs">Total on file</span>
            </div>
            <p class="text-muted-foreground text-xs">All active maintenance therapies</p>
          </div>
          <div class="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
            <Pill class="size-5" />
          </div>
        </CardContent>
      </Card>

      <!-- Refills Ready for Order -->
      <Card class="border-amber-500/30 bg-amber-500/5 shadow-xs dark:bg-amber-500/10">
        <CardContent class="flex items-center justify-between p-5">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5">
              <p class="text-xs font-semibold text-amber-700 dark:text-amber-400">Refills Ready for Order</p>
              <Badge
                variant="outline"
                class="border-amber-500/40 bg-amber-500/15 text-xs font-medium text-amber-700 dark:text-amber-300"
              >
                2 Action Needed
              </Badge>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold tracking-tight text-amber-700 tabular-nums dark:text-amber-300">2</span>
              <span class="text-xs text-amber-700/80 dark:text-amber-400/80">Meds eligible now</span>
            </div>
            <p class="text-xs text-amber-700/80 dark:text-amber-400/80">Metformin HCl & Lisinopril due</p>
          </div>
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400"
          >
            <AlertCircle class="size-5" />
          </div>
        </CardContent>
      </Card>

      <!-- In Delivery / Transit -->
      <Card class="shadow-xs sm:col-span-2 lg:col-span-1">
        <CardContent class="flex items-center justify-between p-5">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5">
              <p class="text-muted-foreground text-xs font-medium">In Delivery / Transit</p>
              <Badge
                variant="outline"
                class="gap-1 border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
              >
                <span class="size-1.5 animate-pulse rounded-full bg-blue-500" />
                1 En Route
              </Badge>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">1</span>
              <span class="text-muted-foreground text-xs">Package tracked</span>
            </div>
            <p class="text-muted-foreground text-xs">Atorvastatin 40mg · USPS Priority</p>
          </div>
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <Truck class="size-5" />
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Preferred Pharmacy Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start gap-3">
            <div
              class="bg-muted text-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border"
            >
              <Store class="text-primary size-4" />
            </div>
            <div class="space-y-0.5">
              <div class="flex flex-wrap items-center gap-2">
                <CardTitle class="text-base font-semibold">
                  {{ activePharmacy.name }} · {{ activePharmacy.subtitle }}
                </CardTitle>
                <Badge variant="secondary" class="gap-1 text-xs font-medium">
                  <CheckCircle2 class="size-3 text-emerald-500" />
                  Preferred Pharmacy
                </Badge>
                <Badge
                  variant="outline"
                  class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  {{ activePharmacy.hours }}
                </Badge>
              </div>
              <CardDescription class="text-xs">
                Default location for prescription fulfillment, drive-thru pick-ups, and transfers.
              </CardDescription>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            class="shrink-0 gap-1.5 text-xs font-medium"
            @click="handleChangePharmacy"
          >
            <Building2 class="size-3.5" />
            Change Pharmacy
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent class="pt-3">
        <div class="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
          <div class="text-muted-foreground flex items-center gap-2">
            <MapPin class="text-primary size-3.5 shrink-0" />
            <span class="text-foreground truncate font-medium">{{ activePharmacy.address }}</span>
          </div>
          <div class="text-muted-foreground flex items-center gap-2">
            <Phone class="text-primary size-3.5 shrink-0" />
            <span
              >Phone: <strong class="text-foreground font-medium">{{ activePharmacy.phone }}</strong></span
            >
          </div>
          <div class="text-muted-foreground flex items-center gap-2">
            <Clock class="text-primary size-3.5 shrink-0" />
            <span>Rx Counter: <strong class="text-foreground font-medium">Ready in 2 hrs</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Prescriptions List Table Section -->
    <Card class="border-border shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle class="text-lg font-bold">Active Prescriptions ({{ filteredPrescriptions.length }})</CardTitle>
            <CardDescription class="text-xs">
              Review remaining refills, dosage instructions, and ordering eligibility.
            </CardDescription>
          </div>

          <!-- Search and Filter Bar -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="relative w-full sm:w-64">
              <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search medication, Rx#, doctor..."
                class="border-input bg-background text-foreground focus-visible:ring-ring h-8 w-full rounded-md border pr-3 pl-8 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                :class="cn('h-8 text-xs font-medium', statusFilter === 'all' && 'bg-accent text-accent-foreground')"
                @click="statusFilter = 'all'"
              >
                All ({{ prescriptions.length }})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="
                  cn(
                    'h-8 text-xs font-medium',
                    statusFilter === 'ready' && 'bg-accent text-accent-foreground text-amber-600 dark:text-amber-400',
                  )
                "
                @click="statusFilter = 'ready'"
              >
                Ready for Refill (2)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="
                  cn('h-8 text-xs font-medium', statusFilter === 'in_transit' && 'bg-accent text-accent-foreground')
                "
                @click="statusFilter = 'in_transit'"
              >
                In Transit (1)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :class="
                  cn(
                    'h-8 text-xs font-medium',
                    statusFilter === 'needs_auth' &&
                      'bg-accent text-accent-foreground text-rose-600 dark:text-rose-400',
                  )
                "
                @click="statusFilter = 'needs_auth'"
              >
                Needs Auth (1)
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="min-w-[220px] text-xs font-semibold">Medication & Rx#</TableHead>
              <TableHead class="min-w-[240px] text-xs font-semibold">Directions & Dosage</TableHead>
              <TableHead class="min-w-[170px] text-xs font-semibold">Refill Status</TableHead>
              <TableHead class="min-w-[160px] text-xs font-semibold">Fill Dates / Schedule</TableHead>
              <TableHead class="min-w-[180px] text-xs font-semibold">Prescribing Doctor</TableHead>
              <TableHead class="min-w-[150px] text-right text-xs font-semibold">Quick Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="rx in filteredPrescriptions"
              :key="rx.id"
              :class="cn('transition-colors', rx.status === 'ready' && 'bg-amber-500/[0.02] dark:bg-amber-500/[0.04]')"
            >
              <!-- Medication Name & Rx# -->
              <TableCell class="py-4 align-top">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5">
                    <span class="text-foreground text-sm font-semibold">{{ rx.name }}</span>
                  </div>
                  <p class="text-muted-foreground text-xs">{{ rx.genericFor }}</p>
                  <div class="flex items-center gap-2 pt-0.5">
                    <span class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                      {{ rx.rxNumber }}
                    </span>
                    <span class="text-muted-foreground text-xs">NDC: {{ rx.ndc }}</span>
                  </div>
                </div>
              </TableCell>

              <!-- Directions & Dosage -->
              <TableCell class="py-4 align-top">
                <div class="space-y-1">
                  <p class="text-foreground text-xs leading-relaxed font-medium">
                    {{ rx.instructions }}
                  </p>
                  <p class="text-muted-foreground text-xs">
                    Form: <span class="text-foreground font-medium">{{ rx.dosageForm }}</span> · Qty:
                    <span class="font-mono tabular-nums">{{ rx.daysSupply }} Days</span>
                  </p>
                </div>
              </TableCell>

              <!-- Refill Status Badge -->
              <TableCell class="py-4 align-top">
                <div class="space-y-1.5">
                  <div v-if="rx.status === 'ready'">
                    <Badge
                      variant="outline"
                      class="gap-1 border-amber-500/40 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                    >
                      <AlertCircle class="size-3" />
                      {{ rx.refillsRemaining }} refills remaining
                    </Badge>
                  </div>
                  <div v-else-if="rx.status === 'needs_auth'">
                    <Badge
                      variant="destructive"
                      class="bg-destructive/15 text-destructive dark:text-destructive-foreground dark:bg-destructive/30 gap-1 border-transparent text-xs font-medium"
                    >
                      <ShieldAlert class="size-3" />
                      0 refills - Needs MD authorization
                    </Badge>
                  </div>
                  <div v-else-if="rx.status === 'in_transit'">
                    <Badge
                      variant="outline"
                      class="gap-1 border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                      <Truck class="size-3" />
                      In Transit · Est. Arrival Today
                    </Badge>
                  </div>
                  <div v-else>
                    <Badge variant="secondary" class="text-xs font-medium">
                      {{ rx.refillsRemaining }} of {{ rx.totalRefills }} remaining
                    </Badge>
                  </div>

                  <p class="text-muted-foreground text-xs tabular-nums">
                    Est. Copay: <strong class="text-foreground">${{ rx.copayEst }}.00</strong>
                  </p>
                </div>
              </TableCell>

              <!-- Fill Dates / Schedule -->
              <TableCell class="py-4 align-top text-xs">
                <div class="space-y-1">
                  <div class="text-muted-foreground flex items-center gap-1.5">
                    <Calendar class="size-3 shrink-0" />
                    <span
                      >Last Filled:
                      <strong class="text-foreground font-medium tabular-nums">{{ rx.lastFilledDate }}</strong></span
                    >
                  </div>
                  <div
                    :class="
                      cn(
                        'flex items-center gap-1.5 font-medium tabular-nums',
                        rx.isDue ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-muted-foreground',
                      )
                    "
                  >
                    <Clock class="size-3 shrink-0" />
                    <span>Next Due: {{ rx.nextDueDate }}</span>
                  </div>
                  <span v-if="rx.isDue" class="inline-block text-xs font-medium text-amber-600 dark:text-amber-400">
                    Refill window open
                  </span>
                </div>
              </TableCell>

              <!-- Prescribing Doctor -->
              <TableCell class="py-4 align-top text-xs">
                <div class="space-y-0.5">
                  <p class="text-foreground font-medium">{{ rx.prescriber.name }}</p>
                  <p class="text-muted-foreground">{{ rx.prescriber.specialty }}</p>
                  <p class="text-muted-foreground truncate text-xs">{{ rx.prescriber.clinic }}</p>
                </div>
              </TableCell>

              <!-- Quick Action & Dropdown Menu -->
              <TableCell class="py-4 text-right align-top">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Ready state: Order Refill Button -->
                  <template v-if="rx.status === 'ready'">
                    <Button
                      variant="default"
                      size="sm"
                      class="h-8 gap-1 text-xs font-medium shadow-xs"
                      @click="openRefillModal(rx.id)"
                    >
                      <RefreshCw class="size-3" />
                      Order Refill
                    </Button>
                  </template>

                  <!-- Needs Auth State: Request MD Auth -->
                  <template v-else-if="rx.status === 'needs_auth'">
                    <Button
                      variant="outline"
                      size="sm"
                      class="border-destructive/30 text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs font-medium"
                      @click="handleOpenAuthRequest(rx)"
                    >
                      <Clock class="size-3" />
                      Request Auth
                    </Button>
                  </template>

                  <!-- In Transit State: Track Package -->
                  <template v-else-if="rx.status === 'in_transit'">
                    <Button
                      variant="secondary"
                      size="sm"
                      class="h-8 gap-1 text-xs font-medium"
                      @click="handleOpenTracking(rx)"
                    >
                      <Truck class="size-3 text-blue-500" />
                      Track
                    </Button>
                  </template>

                  <!-- Row Dropdown Menu -->
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-8" aria-label="Prescription options">
                        <MoreHorizontal class="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-52">
                      <DropdownMenuLabel class="text-xs font-semibold">Rx Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        v-if="rx.status === 'ready'"
                        class="gap-2 text-xs"
                        @click="openRefillModal(rx.id)"
                      >
                        <RefreshCw class="text-primary size-3.5" />
                        Order Refill (30/90 Days)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        v-if="rx.status === 'needs_auth'"
                        class="text-destructive gap-2 text-xs"
                        @click="handleOpenAuthRequest(rx)"
                      >
                        <ShieldAlert class="size-3.5" />
                        Request MD Renewal
                      </DropdownMenuItem>
                      <DropdownMenuItem v-if="rx.packageTracking" class="gap-2 text-xs" @click="handleOpenTracking(rx)">
                        <Truck class="size-3.5 text-blue-500" />
                        Track USPS Delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem class="gap-2 text-xs" @click="handleOpenTransfer">
                        <ArrowLeftRight class="size-3.5" />
                        Transfer to Another Pharmacy
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="gap-2 text-xs">
                        <FileText class="text-muted-foreground size-3.5" />
                        View Full Drug Monograph
                      </DropdownMenuItem>
                      <DropdownMenuItem class="gap-2 text-xs">
                        <Phone class="text-muted-foreground size-3.5" />
                        Call Prescriber ({{ rx.prescriber.phone }})
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <CardFooter
        class="bg-muted/30 border-border text-muted-foreground flex flex-col justify-between gap-3 border-t p-4 text-xs sm:flex-row sm:items-center"
      >
        <div class="flex items-center gap-2">
          <Info class="text-primary size-3.5 shrink-0" />
          <span>Refills requested before 3:00 PM are processed same-day by our clinical pharmacy team.</span>
        </div>
        <div class="flex items-center gap-3">
          <span>Automatic Refill Program: <strong class="text-foreground font-medium">Enabled</strong></span>
        </div>
      </CardFooter>
    </Card>

    <!-- Refill Request Modal / Dialog -->
    <Dialog v-model:open="isRefillOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <RefreshCw class="size-4" />
            </div>
            <div>
              <DialogTitle class="text-lg font-bold">Request Prescription Refill</DialogTitle>
              <DialogDescription class="text-xs">
                Select your supply duration, delivery method, and confirm your copay.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <!-- If order submitted success view -->
        <div v-if="orderSubmitted" class="space-y-4 py-4">
          <div
            class="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-700 dark:text-emerald-300"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-6" />
            </div>
            <h3 class="text-base font-bold">Refill Order Successfully Placed!</h3>
            <p class="mx-auto max-w-md text-xs text-emerald-700/90 dark:text-emerald-300/90">
              Your order for <strong>{{ selectedPrescription.name }}</strong> ({{ supplyDuration }}-day supply) has been
              sent to {{ activePharmacy.name }}.
            </p>
            <p class="pt-1 font-mono text-xs font-medium">
              Order Ref: #ORD-{{ Math.floor(100000 + Math.random() * 900000) }}
            </p>
          </div>

          <div class="bg-muted/40 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
            <div class="flex justify-between">
              <span>Fulfillment Method:</span>
              <strong class="text-foreground">{{
                deliveryMethod === 'delivery' ? 'Express Home Delivery (1-2 Days)' : 'In-Store Pickup'
              }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Estimated Copay:</span>
              <strong class="text-foreground font-mono tabular-nums">${{ estimatedCopay.toFixed(2) }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Remaining Refills After This Order:</span>
              <strong class="text-foreground tabular-nums">{{
                Math.max(0, selectedPrescription.refillsRemaining - 1)
              }}</strong>
            </div>
          </div>

          <DialogFooter class="pt-2">
            <Button variant="default" class="w-full" @click="isRefillOpen = false">
              Done & Return to Prescriptions
            </Button>
          </DialogFooter>
        </div>

        <!-- Form view -->
        <div v-else class="space-y-5 py-2">
          <!-- Medication Selector / Summary Box -->
          <div class="bg-muted/40 border-border space-y-3 rounded-xl border p-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-0.5">
                <p class="text-muted-foreground text-xs font-semibold">Selected Prescription</p>
                <h4 class="text-foreground text-sm font-bold">{{ selectedPrescription.name }}</h4>
                <p class="text-muted-foreground text-xs">{{ selectedPrescription.genericFor }}</p>
              </div>
              <div class="space-y-0.5 text-left sm:text-right">
                <span class="bg-background rounded border px-2 py-0.5 font-mono text-xs font-medium">
                  {{ selectedPrescription.rxNumber }}
                </span>
                <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {{ selectedPrescription.refillsRemaining }} refills remaining
                </p>
              </div>
            </div>

            <div class="text-muted-foreground flex items-center justify-between border-t pt-2.5 text-xs">
              <span
                >Prescriber:
                <strong class="text-foreground font-medium">{{ selectedPrescription.prescriber.name }}</strong></span
              >
              <span
                >Directions:
                <strong class="text-foreground font-medium">{{ selectedPrescription.instructions }}</strong></span
              >
            </div>
          </div>

          <!-- Quantity / Supply Selector -->
          <div class="space-y-2.5">
            <label class="text-foreground flex items-center justify-between text-xs font-semibold">
              <span>Choose Supply Quantity</span>
              <span class="text-muted-foreground font-normal">Insurance Tier 1 Preferred</span>
            </label>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <!-- 30-Day Supply Option -->
              <button
                type="button"
                :class="
                  cn(
                    'flex cursor-pointer flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-150',
                    supplyDuration === '30'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-border bg-card hover:bg-muted/50',
                  )
                "
                @click="supplyDuration = '30'"
              >
                <div class="mb-1 flex w-full items-center justify-between">
                  <span class="text-foreground text-xs font-bold">30-Day Supply</span>
                  <span class="text-foreground font-mono text-xs font-bold tabular-nums">$10.00</span>
                </div>
                <p class="text-muted-foreground text-xs">Standard monthly bottle (30 tablets)</p>
                <span class="text-muted-foreground mt-2 text-xs">Local pickup or standard mail</span>
              </button>

              <!-- 90-Day Supply Option (Recommended) -->
              <button
                type="button"
                :class="
                  cn(
                    'relative flex cursor-pointer flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-150',
                    supplyDuration === '90'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-border bg-card hover:bg-muted/50',
                  )
                "
                @click="supplyDuration = '90'"
              >
                <div class="mb-1 flex w-full items-center justify-between">
                  <span class="text-foreground text-xs font-bold">90-Day Mail Order</span>
                  <span class="text-foreground font-mono text-xs font-bold tabular-nums">$20.00</span>
                </div>
                <p class="text-muted-foreground text-xs">3-Month Supply (90 tablets)</p>
                <Badge
                  variant="outline"
                  class="mt-2 border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  Save $10 on Copay
                </Badge>
              </button>
            </div>
          </div>

          <!-- Delivery Method Selector -->
          <div class="space-y-2.5">
            <label class="text-foreground text-xs font-semibold"> Select Delivery & Fulfillment Method </label>

            <RadioGroup v-model="deliveryMethod" class="gap-2.5">
              <!-- Free Express Home Delivery -->
              <label
                :class="
                  cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all',
                    deliveryMethod === 'delivery'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-border bg-card hover:bg-muted/30',
                  )
                "
              >
                <RadioGroupItem value="delivery" id="delivery-option" class="mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="text-foreground flex items-center gap-1.5 text-xs font-bold">
                      <Truck class="text-primary size-3.5" />
                      Free Express Home Delivery
                    </span>
                    <Badge variant="outline" class="border-primary/30 bg-primary/10 text-primary text-xs">
                      FREE 2-Day
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Ships to: <strong>1420 Ocean Ave, Apt 4B, Santa Monica, CA</strong>
                  </p>
                  <p class="text-muted-foreground text-xs">Estimated arrival in 1–2 business days via USPS Priority</p>
                </div>
              </label>

              <!-- Pharmacy Pickup -->
              <label
                :class="
                  cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all',
                    deliveryMethod === 'pickup'
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-border bg-card hover:bg-muted/30',
                  )
                "
              >
                <RadioGroupItem value="pickup" id="pickup-option" class="mt-0.5" />
                <div class="flex-1 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="text-foreground flex items-center gap-1.5 text-xs font-bold">
                      <Store class="text-primary size-3.5" />
                      In-Store / Drive-Thru Pickup
                    </span>
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ready Today</span>
                  </div>
                  <p class="text-muted-foreground text-xs">{{ activePharmacy.name }} · {{ activePharmacy.address }}</p>
                  <p class="text-muted-foreground text-xs">
                    Ready for pickup in ~2 hours. 24-Hour drive-thru accessible.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <!-- Copay and Cost Breakdown -->
          <div class="bg-muted/50 space-y-2 rounded-xl border p-3.5 text-xs">
            <div class="text-muted-foreground flex justify-between">
              <span>Medication Retail Cost:</span>
              <span class="font-mono tabular-nums line-through"
                >${{ (estimatedCopay + estimatedInsuranceSavings).toFixed(2) }}</span
              >
            </div>
            <div class="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Insurance Coverage (Aetna Choice POS II):</span>
              <span class="font-mono tabular-nums">-${{ estimatedInsuranceSavings.toFixed(2) }}</span>
            </div>
            <div class="text-muted-foreground flex justify-between">
              <span>Shipping & Handling:</span>
              <span class="font-medium text-emerald-600 dark:text-emerald-400">FREE</span>
            </div>
            <Separator />
            <div class="text-foreground flex items-center justify-between pt-0.5 text-sm font-bold">
              <span>Estimated Out-of-Pocket:</span>
              <span class="text-primary font-mono text-base tabular-nums">${{ estimatedCopay.toFixed(2) }}</span>
            </div>
          </div>

          <DialogFooter class="flex items-center justify-between gap-2 pt-2 sm:justify-end">
            <Button variant="outline" @click="isRefillOpen = false"> Cancel </Button>
            <Button variant="default" class="gap-1.5 shadow-xs" @click="submitRefillOrder">
              <Check class="size-4" />
              Submit Refill Order
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Tracking Modal / Dialog -->
    <Dialog v-model:open="isTrackingOpen">
      <DialogContent v-if="trackingPrescription" class="sm:max-w-lg">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <Truck class="size-4" />
            </div>
            <div>
              <DialogTitle class="text-lg font-bold">Delivery & Tracking Status</DialogTitle>
              <DialogDescription class="text-xs">
                Tracking details for {{ trackingPrescription.name }}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div v-if="trackingPrescription.packageTracking" class="space-y-4 py-2 text-xs">
          <!-- Tracking Header Banner -->
          <div class="bg-muted/40 border-border space-y-2 rounded-xl border p-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Carrier & Service:</span>
              <strong class="text-foreground">{{ trackingPrescription.packageTracking.carrier }}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Tracking Number:</span>
              <strong class="text-foreground font-mono">{{
                trackingPrescription.packageTracking.trackingNumber
              }}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Status:</span>
              <Badge
                variant="outline"
                class="border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-600 dark:text-blue-400"
              >
                {{ trackingPrescription.packageTracking.status }}
              </Badge>
            </div>
            <div class="flex items-center justify-between border-t pt-1">
              <span class="text-muted-foreground">Estimated Delivery:</span>
              <strong class="text-foreground font-bold">{{
                trackingPrescription.packageTracking.estimatedArrival
              }}</strong>
            </div>
          </div>

          <!-- Step Timeline Tracker -->
          <div class="space-y-3 pl-2">
            <p class="text-foreground text-xs font-semibold">Package History Timeline</p>
            <div class="border-border relative ml-2 space-y-4 border-l pl-4">
              <div
                v-for="(step, idx) in trackingPrescription.packageTracking.steps"
                :key="idx"
                class="relative space-y-0.5"
              >
                <div
                  :class="
                    cn(
                      'ring-background absolute top-0.5 -left-[23px] flex size-3.5 items-center justify-center rounded-full ring-2',
                      step.current
                        ? 'animate-pulse bg-blue-500 ring-blue-500'
                        : step.done
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted border',
                    )
                  "
                />
                <p
                  :class="
                    cn('text-xs font-semibold', step.current ? 'text-blue-600 dark:text-blue-400' : 'text-foreground')
                  "
                >
                  {{ step.title }}
                </p>
                <p class="text-muted-foreground text-xs tabular-nums">{{ step.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" class="w-full sm:w-auto" @click="isTrackingOpen = false"> Close Tracking </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Transfer Prescription Modal / Dialog -->
    <Dialog v-model:open="isTransferOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <ArrowLeftRight class="size-4" />
            </div>
            <div>
              <DialogTitle class="text-lg font-bold">Transfer Prescription</DialogTitle>
              <DialogDescription class="text-xs">
                Move an existing prescription from another pharmacy to {{ activePharmacy.name }}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div v-if="transferSubmitted" class="space-y-4 py-4">
          <div
            class="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-700 dark:text-emerald-300"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-6" />
            </div>
            <h3 class="text-base font-bold">Transfer Request Submitted!</h3>
            <p class="mx-auto max-w-sm text-xs text-emerald-700/90 dark:text-emerald-300/90">
              Our clinical pharmacy team will contact your previous pharmacy to transfer the prescription. This
              typically takes 24–48 hours.
            </p>
          </div>
          <DialogFooter>
            <Button variant="default" class="w-full" @click="isTransferOpen = false"> Done </Button>
          </DialogFooter>
        </div>

        <div v-else class="space-y-3.5 py-2 text-xs">
          <div class="space-y-1">
            <label class="text-foreground text-xs font-medium">Current / Previous Pharmacy Name</label>
            <input
              v-model="transferForm.pharmacyName"
              type="text"
              placeholder="e.g. Walgreens, Rite Aid, Walmart..."
              class="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-foreground text-xs font-medium">Pharmacy Phone Number</label>
              <input
                v-model="transferForm.phone"
                type="tel"
                placeholder="(555) 000-0000"
                class="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="text-foreground text-xs font-medium">Existing Rx Number (if known)</label>
              <input
                v-model="transferForm.rxNumber"
                type="text"
                placeholder="e.g. RX-123456"
                class="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 font-mono text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-foreground text-xs font-medium">Medication Name & Strength</label>
            <input
              v-model="transferForm.medicationName"
              type="text"
              placeholder="e.g. Lipitor 20mg or Levothyroxine 50mcg"
              class="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="text-foreground text-xs font-medium"
              >Special Instructions / Prescriber Notes (Optional)</label
            >
            <textarea
              v-model="transferForm.notes"
              rows="2"
              placeholder="Any additional notes for the receiving pharmacist..."
              class="border-input bg-background text-foreground focus-visible:ring-ring w-full rounded-md border p-2 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <DialogFooter class="pt-2">
            <Button variant="outline" @click="isTransferOpen = false">Cancel</Button>
            <Button variant="default" class="gap-1.5 shadow-xs" @click="submitTransfer">
              <ArrowLeftRight class="size-3.5" />
              Initiate Transfer
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Change Preferred Pharmacy Modal / Dialog -->
    <Dialog v-model:open="isChangePharmacyOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Building2 class="size-4" />
            </div>
            <div>
              <DialogTitle class="text-lg font-bold">Select Preferred Pharmacy</DialogTitle>
              <DialogDescription class="text-xs">
                Choose the location where your local orders and drive-thru pickups are routed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div class="space-y-3 py-2 text-xs">
          <div
            v-for="pharmacy in availablePharmacies"
            :key="pharmacy.id"
            :class="
              cn(
                'flex cursor-pointer items-start justify-between rounded-xl border p-3.5 transition-all',
                tempSelectedPharmacyId === pharmacy.id
                  ? 'border-primary bg-primary/5 ring-primary ring-1'
                  : 'border-border bg-card hover:bg-muted/40',
              )
            "
            @click="tempSelectedPharmacyId = pharmacy.id"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-foreground font-bold">{{ pharmacy.name }}</span>
                <Badge v-if="pharmacy.id === activePharmacy.id" variant="secondary" class="text-xs">Current</Badge>
              </div>
              <p class="text-muted-foreground">{{ pharmacy.address }}</p>
              <div class="text-muted-foreground flex items-center gap-3 pt-1">
                <span
                  >Phone: <strong class="text-foreground font-medium">{{ pharmacy.phone }}</strong></span
                >
                <span>{{ pharmacy.hours }}</span>
              </div>
            </div>
            <div class="pt-0.5">
              <div
                :class="
                  cn(
                    'flex size-4 items-center justify-center rounded-full border',
                    tempSelectedPharmacyId === pharmacy.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40',
                  )
                "
              >
                <div v-if="tempSelectedPharmacyId === pharmacy.id" class="bg-background size-1.5 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="pt-2">
          <Button variant="outline" @click="isChangePharmacyOpen = false">Cancel</Button>
          <Button variant="default" @click="savePharmacyChange">Save Preferred Pharmacy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Request MD Authorization Modal / Dialog -->
    <Dialog v-model:open="isAuthRequestOpen">
      <DialogContent v-if="authRequestedRx" class="sm:max-w-md">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-destructive/10 text-destructive flex size-8 items-center justify-center rounded-lg">
              <ShieldAlert class="size-4" />
            </div>
            <div>
              <DialogTitle class="text-lg font-bold">Request Prescriber Authorization</DialogTitle>
              <DialogDescription class="text-xs">
                Renew zero-refill prescription with your physician.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div v-if="authRequestSubmitted" class="space-y-3 py-4 text-center">
          <div
            class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="size-6" />
          </div>
          <h3 class="text-foreground text-sm font-bold">Authorization Request Sent!</h3>
          <p class="text-muted-foreground text-xs">
            A renewal request for <strong>{{ authRequestedRx.name }}</strong> has been electronically transmitted to
            <strong>{{ authRequestedRx.prescriber.name }}</strong
            >.
          </p>
          <DialogFooter class="pt-2">
            <Button variant="default" class="w-full" @click="isAuthRequestOpen = false">Done</Button>
          </DialogFooter>
        </div>

        <div v-else class="space-y-4 py-2 text-xs">
          <div class="bg-muted/40 space-y-1.5 rounded-xl border p-3.5">
            <p class="text-foreground font-bold">{{ authRequestedRx.name }}</p>
            <p class="text-muted-foreground">{{ authRequestedRx.genericFor }}</p>
            <p class="text-muted-foreground">
              Prescribing Physician: <strong class="text-foreground">{{ authRequestedRx.prescriber.name }}</strong>
            </p>
            <p class="text-muted-foreground">
              Clinic: {{ authRequestedRx.prescriber.clinic }} ({{ authRequestedRx.prescriber.phone }})
            </p>
          </div>

          <p class="text-muted-foreground leading-relaxed">
            Because this prescription has 0 refills remaining, we will send an electronic request (e-Prescription
            Renewal) directly to your doctor's office.
          </p>

          <DialogFooter>
            <Button variant="outline" @click="isAuthRequestOpen = false">Cancel</Button>
            <Button variant="default" class="gap-1.5" @click="authRequestSubmitted = true">
              <Check class="size-3.5" />
              Send Renewal Request
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
