<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Disc,
  Download,
  FileCheck,
  FileText,
  Flame,
  Gauge,
  Layers,
  Lightbulb,
  Minus,
  Printer,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Truck,
  UploadCloud,
  User,
  Wrench,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export type CheckStatus = 'pass' | 'fail' | 'na'
export type DefectSeverity = 'minor' | 'critical'
export type InspectionType = 'pre-trip' | 'post-trip' | 'intermodal'

export interface InspectionItem {
  id: string
  label: string
  spec: string
  status: CheckStatus
  notes?: string
}

export interface InspectionCategory {
  id: string
  title: string
  description: string
  icon: string
  items: InspectionItem[]
}

export interface DefectPhoto {
  id: string
  name: string
  size: string
  url?: string
}

export interface DVIRReportData {
  reportId: string
  vehicleId: string
  trailerId: string
  odometer: string
  inspectionType: InspectionType
  driverName: string
  driverCdl: string
  carrierName: string
  dotNumber: string
  inspectionDate: string
  inspectionTime: string
  location: string
  categories: InspectionCategory[]
  defectSeverity: DefectSeverity
  defectNotes: string
  defectPhotos: DefectPhoto[]
  certified: boolean
  signatureTimestamp: string
}

interface Props {
  initialInspectionType?: InspectionType
  initialDefectState?: boolean
  initialSubmitted?: boolean
  vehicleId?: string
  trailerId?: string
  odometer?: string
  driverName?: string
  driverCdl?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialInspectionType: 'pre-trip',
  initialDefectState: false,
  initialSubmitted: false,
  vehicleId: 'Truck #104 · Freightliner Cascadia',
  trailerId: "Trailer #TR-8821 (53' Dry Van)",
  odometer: '142,850 miles',
  driverName: 'Marcus Vance',
  driverCdl: 'CA-948201',
})

const emits = defineEmits<{
  (e: 'submit', data: DVIRReportData): void
  (e: 'defect-change', defects: InspectionItem[]): void
}>()

// Core state
const reportId = ref('DVIR-2026-90412')
const inspectionType = ref<InspectionType>(props.initialInspectionType)
const vehicleId = ref(props.vehicleId)
const trailerId = ref(props.trailerId)
const odometer = ref(props.odometer)
const driverName = ref(props.driverName)
const driverCdl = ref(props.driverCdl)
const carrierName = ref('Apex Freight Logistics Inc.')
const dotNumber = ref('USDOT #2940182')
const inspectionDate = ref('2026-08-21')
const inspectionTime = ref('06:45 AM EDT')
const location = ref('Terminal #12 · Ontario Logistics Hub, CA')

// Defect report details
const defectSeverity = ref<DefectSeverity>(props.initialDefectState ? 'critical' : 'minor')
const defectNotes = ref(
  props.initialDefectState
    ? 'Air supply line to secondary reservoir exhibits slight pressure drop (down to 105 PSI under load). Audible hiss near tractor-trailer gladhand seal.'
    : '',
)
const defectReportedToDesk = ref(true)

const defectPhotos = ref<DefectPhoto[]>(
  props.initialDefectState
    ? [
        { id: 'p1', name: 'gladhand_seal_wear.jpg', size: '2.4 MB' },
        { id: 'p2', name: 'air_pressure_gauge_105psi.png', size: '1.8 MB' },
      ]
    : [],
)

// Driver Certification
const certified = ref(true)
const typedSignature = ref(props.driverName)
const submitted = ref(props.initialSubmitted)

// Default Inspection Categories
const categories = reactive<InspectionCategory[]>([
  {
    id: 'brakes',
    title: '1. Brakes & Air Pressure',
    description: 'FMCSA § 393.40 / 393.51 Air Brake System & Lines',
    icon: 'disc',
    items: [
      {
        id: 'brakes-service',
        label: 'Service Brakes & Stopping Response',
        spec: 'Smooth pedal feel, no pulling, stopping within 35 ft at 20 mph',
        status: 'pass',
      },
      {
        id: 'brakes-parking',
        label: 'Parking Brake Mechanism',
        spec: 'Holds fully loaded vehicle against low gear engine torque',
        status: 'pass',
      },
      {
        id: 'brakes-airlines',
        label: 'Air Lines & System Pressure (120 PSI)',
        spec: 'Maintains 120 PSI operating pressure; gladhand seals leak-free',
        status: props.initialDefectState ? 'fail' : 'pass',
      },
      {
        id: 'brakes-drums',
        label: 'Brake Drums, Linings & Slack Adjusters',
        spec: 'Lining thickness > 1/4", no oil/grease contamination on drums',
        status: 'pass',
      },
    ],
  },
  {
    id: 'tires',
    title: '2. Tires, Wheels & Rims',
    description: 'FMCSA § 393.75 Wheel Assemblies & Tread Integrity',
    icon: 'layers',
    items: [
      {
        id: 'tires-tread',
        label: 'Steer & Drive Tire Tread Depth',
        spec: 'Steer tires > 4/32" tread; drive/trailer tires > 2/32" tread',
        status: 'pass',
      },
      {
        id: 'tires-pressure',
        label: 'Tire Pressure & Cold Inflation (100 PSI)',
        spec: 'All 10 dual/steer tires at 100 PSI cold; valve caps sealed',
        status: props.initialDefectState ? 'fail' : 'pass',
      },
      {
        id: 'tires-lugnuts',
        label: 'Lug Nuts & Wheel Rim Fasteners',
        spec: 'All wheel studs present & torqued; no rust trails or rim cracks',
        status: 'pass',
      },
      {
        id: 'tires-hubseals',
        label: 'Wheel Hub Oil Seals & Bearings',
        spec: 'Oil level visible in sight glass; hub seals dry with no leaks',
        status: 'pass',
      },
    ],
  },
  {
    id: 'lights',
    title: '3. Lights & Electrical Systems',
    description: 'FMCSA § 393.9 Lamps, Reflective Devices & Electrical Wiring',
    icon: 'lightbulb',
    items: [
      {
        id: 'lights-headlights',
        label: 'Headlights (Low & High Beams)',
        spec: 'Both sealed beams operable; lenses clean and properly aimed',
        status: 'pass',
      },
      {
        id: 'lights-turnsignals',
        label: 'Turn Signals & 4-Way Hazard Flashers',
        spec: 'Front, cab-side, and rear flashers functional on tractor & trailer',
        status: 'pass',
      },
      {
        id: 'lights-brakelights',
        label: 'Brake Lights & Tail Lights',
        spec: 'Instant illumination upon pedal depression; lenses intact',
        status: 'pass',
      },
      {
        id: 'lights-clearance',
        label: 'Clearance Lights & DOT Reflectors',
        spec: 'Amber front/sides, red rear; DOT-C2 reflective sheeting clean',
        status: 'pass',
      },
    ],
  },
  {
    id: 'engine',
    title: '4. Engine Compartment & Fluids',
    description: 'Powertrain fluids, radiator integrity, belts & steering gear',
    icon: 'wrench',
    items: [
      {
        id: 'engine-oil',
        label: 'Engine Oil Level & Quality',
        spec: 'Dipstick level in safe crosshatch; oil clean without burnt odor',
        status: 'pass',
      },
      {
        id: 'engine-coolant',
        label: 'Engine Coolant & Radiator Core',
        spec: 'Surge tank level at MAX line; radiator cap tight, no hose weeping',
        status: 'pass',
      },
      {
        id: 'engine-powersteering',
        label: 'Power Steering Fluid & Reservoir',
        spec: 'Fluid level within cold fill mark; pump operates without whine',
        status: 'pass',
      },
      {
        id: 'engine-belts',
        label: 'Serpentine Belts & Cooling Hoses',
        spec: 'Belt deflection < 1/2"; no rib fraying, cracks, or soft hoses',
        status: 'pass',
      },
    ],
  },
  {
    id: 'safety',
    title: '5. Emergency & Safety Equipment',
    description: 'FMCSA § 393.95 Emergency Equipment in Commercial Motor Vehicles',
    icon: 'flame',
    items: [
      {
        id: 'safety-extinguisher',
        label: 'Fire Extinguisher (Charged & Tagged)',
        spec: 'Minimum 5 B:C rating; pressure needle in green, annual tag valid',
        status: 'pass',
      },
      {
        id: 'safety-triangles',
        label: 'Reflective Warning Triangles (3 Pack)',
        spec: 'Three bidirectional red reflective triangles present & secured',
        status: 'pass',
      },
      {
        id: 'safety-firstaid',
        label: 'First Aid & Spill Response Kit',
        spec: 'Sealed commercial first aid pack, eye wash, HazMat pads',
        status: 'pass',
      },
      {
        id: 'safety-wipers',
        label: 'Windshield Wipers, Washers & Horn',
        spec: 'Clean sweep without streaks; air horn and electric city horn loud',
        status: 'pass',
      },
    ],
  },
])

// Computed tallies
const allItems = computed(() => categories.flatMap((c) => c.items))
const totalCount = computed(() => allItems.value.length)
const passCount = computed(() => allItems.value.filter((i) => i.status === 'pass').length)
const failCount = computed(() => allItems.value.filter((i) => i.status === 'fail').length)
const naCount = computed(() => allItems.value.filter((i) => i.status === 'na').length)
const failedItems = computed(() => allItems.value.filter((i) => i.status === 'fail'))
const hasDefects = computed(() => failedItems.value.length > 0)

const completionPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  const checked = allItems.value.filter((i) => i.status !== undefined).length
  return Math.round((checked / totalCount.value) * 100)
})

watch(
  failedItems,
  (newFailed) => {
    emits('defect-change', newFailed)
    if (newFailed.length > 0 && defectNotes.value.trim() === '') {
      defectNotes.value = `Inspection defect recorded for: ${newFailed.map((f) => f.label).join(', ')}. Requires shop evaluation.`
    }
  },
  { deep: true },
)

function setItemStatus(categoryIndex: number, itemIndex: number, status: CheckStatus) {
  categories[categoryIndex].items[itemIndex].status = status
}

function setCategoryAll(categoryIndex: number, status: CheckStatus) {
  categories[categoryIndex].items.forEach((item) => {
    item.status = status
  })
}

function markAllPass() {
  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      item.status = 'pass'
    })
  })
}

function addMockPhoto() {
  const photoIndex = defectPhotos.value.length + 1
  defectPhotos.value.push({
    id: `photo-${Date.now()}`,
    name: `defect_evidence_0${photoIndex}.jpg`,
    size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
  })
}

function removePhoto(id: string) {
  defectPhotos.value = defectPhotos.value.filter((p) => p.id !== id)
}

function handleSubmit() {
  if (!certified.value || typedSignature.value.trim() === '') return
  submitted.value = true
  emits('submit', {
    reportId: reportId.value,
    vehicleId: vehicleId.value,
    trailerId: trailerId.value,
    odometer: odometer.value,
    inspectionType: inspectionType.value,
    driverName: driverName.value,
    driverCdl: driverCdl.value,
    carrierName: carrierName.value,
    dotNumber: dotNumber.value,
    inspectionDate: inspectionDate.value,
    inspectionTime: inspectionTime.value,
    location: location.value,
    categories: JSON.parse(JSON.stringify(categories)),
    defectSeverity: defectSeverity.value,
    defectNotes: defectNotes.value,
    defectPhotos: [...defectPhotos.value],
    certified: certified.value,
    signatureTimestamp: new Date().toISOString(),
  })
}

function handleReset() {
  submitted.value = false
  markAllPass()
  defectNotes.value = ''
  defectPhotos.value = []
}
</script>

<template>
  <div
    data-slot="driver-inspection-checklist"
    :class="cn('text-foreground mx-auto w-full max-w-5xl space-y-6', props.class)"
  >
    <!-- ================================================================= -->
    <!-- POST-SUBMISSION CONFIRMATION RECEIPT                              -->
    <!-- ================================================================= -->
    <div v-if="submitted" class="space-y-6">
      <Card class="border-border overflow-hidden shadow-xs">
        <div
          :class="[
            'border-b p-6 text-center sm:p-8',
            hasDefects
              ? 'border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20'
              : 'border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20',
          ]"
        >
          <div class="relative mx-auto mb-4 size-16">
            <span
              :class="['absolute inset-0 rounded-full blur-xl', hasDefects ? 'bg-amber-500/30' : 'bg-emerald-500/30']"
              aria-hidden="true"
            />
            <span
              :class="[
                'relative flex size-16 items-center justify-center rounded-full border shadow-xs',
                hasDefects
                  ? 'border-amber-500/40 bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
              ]"
            >
              <ShieldAlert v-if="hasDefects" class="size-8" aria-hidden="true" />
              <CheckCircle2 v-else class="size-8" aria-hidden="true" />
            </span>
          </div>

          <Badge
            :variant="hasDefects ? 'destructive' : 'outline'"
            :class="[
              'mb-2 font-mono text-xs tracking-wider uppercase',
              !hasDefects && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            ]"
          >
            FMCSA § 396.11 Certified Electronic DVIR
          </Badge>

          <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            {{ hasDefects ? 'DVIR Transmitted · Defect Action Required' : 'DVIR Certified · Ready for Dispatch' }}
          </h2>
          <p class="text-muted-foreground mx-auto mt-1.5 max-w-xl text-xs sm:text-sm">
            {{
              hasDefects
                ? 'Inspection report logged with safety defects. Maintenance dispatch notification has been dispatched to the terminal garage desk.'
                : 'Commercial motor vehicle safety inspection verified with zero safety defects. Safe to operate under FMCSA regulations.'
            }}
          </p>

          <div
            class="border-border bg-background/80 mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border px-3.5 py-1 text-xs backdrop-blur-xs"
          >
            <span class="text-muted-foreground font-medium">Compliance Document Ref:</span>
            <span class="text-foreground font-mono font-bold">{{ reportId }}</span>
          </div>
        </div>

        <CardContent class="space-y-6 p-6">
          <!-- Key Inspection Meta Grid -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Vehicle / Tractor</span>
              <span class="text-foreground mt-0.5 block text-sm font-semibold">{{ vehicleId }}</span>
              <span class="text-muted-foreground text-xs">{{ odometer }}</span>
            </div>
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Associated Trailer</span>
              <span class="text-foreground mt-0.5 block text-sm font-semibold">{{ trailerId }}</span>
              <span class="text-muted-foreground text-xs">Type: 53-ft Dry Van</span>
            </div>
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Certified Driver</span>
              <span class="text-foreground mt-0.5 block text-sm font-semibold">{{ driverName }}</span>
              <span class="text-muted-foreground font-mono text-xs">CDL #{{ driverCdl }}</span>
            </div>
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Timestamp & Hub</span>
              <span class="text-foreground mt-0.5 block text-sm font-semibold"
                >{{ inspectionDate }} · {{ inspectionTime }}</span
              >
              <span class="text-muted-foreground block truncate text-xs">{{ location }}</span>
            </div>
          </div>

          <!-- Audit Result Stats Strip -->
          <div class="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
            <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <span class="text-muted-foreground block text-xs">Items Inspected</span>
                <span class="text-foreground text-lg font-bold tabular-nums">{{ totalCount }} / {{ totalCount }}</span>
              </div>
              <Separator orientation="vertical" class="h-8" />
              <div>
                <span class="text-muted-foreground block text-xs">Passed</span>
                <span class="text-lg font-bold text-emerald-600 tabular-nums dark:text-emerald-400">{{
                  passCount
                }}</span>
              </div>
              <Separator orientation="vertical" class="h-8" />
              <div>
                <span class="text-muted-foreground block text-xs">Failed / Defects</span>
                <span
                  :class="[
                    'text-lg font-bold tabular-nums',
                    failCount > 0 ? 'text-destructive' : 'text-muted-foreground',
                  ]"
                >
                  {{ failCount }}
                </span>
              </div>
              <Separator orientation="vertical" class="h-8" />
              <div>
                <span class="text-muted-foreground block text-xs">N/A</span>
                <span class="text-muted-foreground text-lg font-bold tabular-nums">{{ naCount }}</span>
              </div>
            </div>

            <Badge :variant="hasDefects ? 'destructive' : 'outline'" class="gap-1.5 px-3 py-1 text-xs">
              <CheckCircle2 v-if="!hasDefects" class="size-3.5" />
              <AlertTriangle v-else class="size-3.5" />
              {{ hasDefects ? `Defects Found (${failCount})` : 'All Systems Verified' }}
            </Badge>
          </div>

          <!-- Digital Signature Receipt Box -->
          <div class="border-border bg-muted/15 space-y-2 rounded-xl border p-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck class="text-primary size-3.5" />
                Electronic Cryptographic Driver Signature
              </span>
              <span class="text-muted-foreground font-mono text-xs">DOT § 396.11 Certified</span>
            </div>
            <div class="border-border/60 border-b pt-1 pb-3">
              <p class="text-primary text-2xl font-medium tracking-wide italic">
                {{ typedSignature || driverName }}
              </p>
            </div>
            <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span>Signer: {{ driverName }} · CDL #{{ driverCdl }}</span>
              <span>SHA-256: 8f9b7c2d-9482-41e9-b631-{{ reportId }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="handleReset">
              <RotateCcw class="size-3.5" />
              Start New Inspection
            </Button>

            <div class="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
                <Printer class="size-3.5" />
                Print Driver Copy
              </Button>
              <Button aria-label="Download attachment" size="sm" class="gap-1.5 text-xs font-medium">
                <Download class="size-3.5" />
                Download Certified DVIR PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================= -->
    <!-- ACTIVE INSPECTION WORKFLOW                                        -->
    <!-- ================================================================= -->
    <div v-else class="space-y-6">
      <!-- Top Inspection Header Card -->
      <Card class="border-border shadow-xs">
        <CardHeader class="pb-4">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  class="border-primary/30 bg-primary/10 text-primary gap-1.5 py-0.5 text-xs font-medium"
                >
                  <Truck class="size-3.5" aria-hidden="true" />
                  FMCSA § 396.11 Audit
                </Badge>

                <!-- Status Badge -->
                <Badge v-if="hasDefects" variant="destructive" class="animate-pulse gap-1.5 py-0.5 text-xs font-medium">
                  <AlertTriangle class="size-3.5" aria-hidden="true" />
                  Defects Found · {{ failCount }} {{ failCount === 1 ? 'Item' : 'Items' }} Failed
                </Badge>
                <Badge
                  v-else
                  variant="outline"
                  class="gap-1.5 border-amber-500/40 bg-amber-500/10 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
                >
                  <Clock class="size-3.5" aria-hidden="true" />
                  Inspection In Progress
                </Badge>
              </div>

              <CardTitle class="text-xl font-bold tracking-tight sm:text-2xl">
                Driver Vehicle Inspection Report (DVIR)
              </CardTitle>
              <CardDescription class="text-xs sm:text-sm">
                Mandatory pre-trip and post-trip commercial motor vehicle safety certification and defect tracking
                portal.
              </CardDescription>
            </div>

            <!-- Header Quick Action CTA -->
            <div class="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="gap-1.5 text-xs font-medium"
                @click="markAllPass"
              >
                <CheckCircle2 class="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                Quick Pass All
              </Button>
              <Button
                type="button"
                size="sm"
                class="gap-1.5 text-xs font-medium"
                :disabled="!certified || typedSignature.trim() === ''"
                @click="handleSubmit"
              >
                <FileCheck class="size-3.5" aria-hidden="true" />
                Submit Completed DVIR
              </Button>
            </div>
          </div>
        </CardHeader>

        <!-- Vehicle Telemetry & Inspection Metadata Bar -->
        <CardContent class="pt-0 pb-5">
          <div class="border-border bg-muted/20 grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Vehicle ID -->
            <div class="space-y-1">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Truck class="text-primary size-3.5" />
                <span>Vehicle / Unit Number</span>
              </div>
              <div class="text-foreground text-xs font-semibold">{{ vehicleId }}</div>
              <div class="text-muted-foreground text-xs">Trailer: {{ trailerId }}</div>
            </div>

            <!-- Odometer -->
            <div class="space-y-1">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Gauge class="text-primary size-3.5" />
                <span>Odometer Mileage</span>
              </div>
              <div class="text-foreground text-xs font-semibold tabular-nums">{{ odometer }}</div>
              <div class="text-muted-foreground text-xs">ECM Telemetry Synced</div>
            </div>

            <!-- Inspection Type Selector -->
            <div class="space-y-1">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <FileText class="text-primary size-3.5" />
                <span>Inspection Type</span>
              </div>
              <Select v-model="inspectionType">
                <SelectTrigger class="h-7 text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-trip">Pre-Trip Safety Inspection</SelectItem>
                  <SelectItem value="post-trip">Post-Trip Safety Audit</SelectItem>
                  <SelectItem value="intermodal">Intermodal Chassis Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Driver & Terminal Info -->
            <div class="space-y-1">
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <User class="text-primary size-3.5" />
                <span>Driver & Terminal</span>
              </div>
              <div class="text-foreground text-xs font-semibold">{{ driverName }} · CDL #{{ driverCdl }}</div>
              <div class="text-muted-foreground truncate text-xs">{{ location }}</div>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-4 space-y-1.5">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span>Audit Completion Progress</span>
              <span class="text-foreground font-mono font-medium tabular-nums">
                {{ passCount }} Pass · {{ failCount }} Fail · {{ naCount }} N/A ({{ totalCount }} Total)
              </span>
            </div>
            <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
              <div
                class="h-full transition-all duration-300"
                :class="hasDefects ? 'bg-amber-500' : 'bg-primary'"
                :style="{ width: `${completionPercentage}%` }"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- =============================================================== -->
      <!-- 5 FMCSA INSPECTION CATEGORIES                                   -->
      <!-- =============================================================== -->
      <div class="space-y-4">
        <Card
          v-for="(category, catIndex) in categories"
          :key="category.id"
          class="border-border overflow-hidden shadow-xs"
        >
          <CardHeader class="bg-muted/15 border-border border-b px-5 py-3.5">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2.5">
                <div
                  class="border-primary/20 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md border"
                >
                  <Disc v-if="category.icon === 'disc'" class="size-4" />
                  <Layers v-else-if="category.icon === 'layers'" class="size-4" />
                  <Lightbulb v-else-if="category.icon === 'lightbulb'" class="size-4" />
                  <Wrench v-else-if="category.icon === 'wrench'" class="size-4" />
                  <Flame v-else class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-bold tracking-tight sm:text-base">
                    {{ category.title }}
                  </CardTitle>
                  <CardDescription class="text-xs">
                    {{ category.description }}
                  </CardDescription>
                </div>
              </div>

              <!-- Quick category batch controls -->
              <div class="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 text-xs"
                  @click="setCategoryAll(catIndex, 'pass')"
                >
                  Pass All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 text-xs"
                  @click="setCategoryAll(catIndex, 'na')"
                >
                  N/A All
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="divide-border divide-y p-0">
            <div
              v-for="(item, itemIndex) in category.items"
              :key="item.id"
              :class="[
                'flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
                item.status === 'fail' ? 'bg-rose-500/5 dark:bg-rose-950/10' : 'hover:bg-muted/30',
              ]"
            >
              <!-- Item Details -->
              <div class="min-w-0 space-y-1 pr-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-foreground text-xs font-semibold sm:text-sm">
                    {{ item.label }}
                  </span>
                  <Badge
                    v-if="item.status === 'fail'"
                    variant="destructive"
                    class="h-4 py-0 font-mono text-xs uppercase"
                  >
                    Defect
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  {{ item.spec }}
                </p>
              </div>

              <!-- Segmented Pass / Fail / N/A Toggle Buttons -->
              <div class="flex shrink-0 items-center gap-1 self-start sm:self-center">
                <!-- Pass Button -->
                <button
                  type="button"
                  :aria-label="`Mark ${item.label} as Pass`"
                  :class="[
                    'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-xs transition-all outline-none focus-visible:ring-2',
                    item.status === 'pass'
                      ? 'border-emerald-500/40 bg-emerald-500/15 font-semibold text-emerald-700 dark:text-emerald-400'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                  @click="setItemStatus(catIndex, itemIndex, 'pass')"
                >
                  <Check class="size-3.5" aria-hidden="true" />
                  Pass
                </button>

                <!-- Fail Button -->
                <button
                  type="button"
                  :aria-label="`Mark ${item.label} as Fail`"
                  :class="[
                    'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-xs transition-all outline-none focus-visible:ring-2',
                    item.status === 'fail'
                      ? 'border-rose-500/40 bg-rose-500/15 font-semibold text-rose-700 dark:text-rose-400'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                  @click="setItemStatus(catIndex, itemIndex, 'fail')"
                >
                  <X class="size-3.5" aria-hidden="true" />
                  Fail
                </button>

                <!-- N/A Button -->
                <button
                  type="button"
                  :aria-label="`Mark ${item.label} as Not Applicable`"
                  :class="[
                    'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-xs transition-all outline-none focus-visible:ring-2',
                    item.status === 'na'
                      ? 'border-border bg-muted text-foreground font-semibold'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                  @click="setItemStatus(catIndex, itemIndex, 'na')"
                >
                  <Minus class="size-3.5" aria-hidden="true" />
                  N/A
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- =============================================================== -->
      <!-- DYNAMIC DEFECT REPORT CARD (Appears when any item is marked Fail) -->
      <!-- =============================================================== -->
      <Card
        v-if="hasDefects"
        class="overflow-hidden border-rose-500/40 bg-rose-500/5 shadow-xs transition-all duration-200 dark:bg-rose-950/10"
      >
        <CardHeader class="border-b border-rose-500/20 bg-rose-500/10 pb-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap items-center gap-2.5">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-400"
              >
                <AlertTriangle class="size-4.5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle class="text-base font-bold text-rose-700 dark:text-rose-400">
                  Critical Defect Log & Repair Dispatch Form
                </CardTitle>
                <CardDescription class="text-xs text-rose-600/80 dark:text-rose-400/80">
                  {{ failCount }} item(s) flagged with safety defects requiring mechanic sign-off under FMCSA § 396.13.
                </CardDescription>
              </div>
            </div>

            <Badge variant="destructive" class="font-mono text-xs uppercase"> Action Required </Badge>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 p-5">
          <!-- Flagged Failed Items Chips -->
          <div class="space-y-1.5">
            <Label class="text-foreground text-xs font-semibold">Defective Components Identified</Label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in failedItems"
                :key="item.id"
                class="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400"
              >
                <AlertCircle class="size-3.5 shrink-0" />
                {{ item.label }}
              </span>
            </div>
          </div>

          <!-- Defect Severity Selector -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="min-w-0 space-y-1.5">
              <Label for="defect-severity" class="text-xs font-semibold">Defect Severity Classification *</Label>
              <Select v-model="defectSeverity">
                <SelectTrigger id="defect-severity" class="h-9 w-full min-w-0 text-xs [&>span]:truncate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor"> Minor Defect — Safe to operate; scheduled for terminal shop </SelectItem>
                  <SelectItem value="critical">
                    Out-of-Service (OOS) Critical — Dispatch prohibited until repaired
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs font-semibold">Fleet Maintenance Desk Dispatch</Label>
              <div class="border-border bg-card flex flex-wrap items-center gap-2 rounded-md border p-2 text-xs">
                <Checkbox id="desk-notify" v-model="defectReportedToDesk" />
                <Label for="desk-notify" class="cursor-pointer text-xs font-normal">
                  Auto-create Priority Work Order in Garage Portal (Ticket #WO-8910)
                </Label>
              </div>
            </div>
          </div>

          <!-- Defect Notes Textarea -->
          <div class="space-y-1.5">
            <Label for="defect-notes" class="text-xs font-semibold">Detailed Defect Description & Driver Notes *</Label>
            <Textarea
              id="defect-notes"
              v-model="defectNotes"
              :rows="3"
              placeholder="Describe exact defect location, leak sounds, tire damage, PSI measurements, or electrical malfunction..."
              class="text-xs"
            />
          </div>

          <!-- Photo Attachment Dropzone Placeholder -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label class="flex items-center gap-1.5 text-xs font-semibold">
                <Camera class="text-primary size-3.5" />
                Defect Photographic Evidence
              </Label>
              <span class="text-muted-foreground text-xs">JPG, PNG up to 15MB</span>
            </div>

            <!-- Upload dropzone box -->
            <div
              class="border-border/80 hover:border-primary/50 bg-card cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-colors"
              @click="addMockPhoto"
            >
              <div class="flex flex-col items-center justify-center gap-1.5 py-2">
                <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
                  <UploadCloud class="size-4.5" />
                </div>
                <p class="text-foreground text-xs font-medium">Click to attach photo or drag and drop image here</p>
                <p class="text-muted-foreground text-xs">
                  Capture close-ups of damaged tires, fluid puddles, broken lights, or air fittings
                </p>
              </div>
            </div>

            <!-- List of Attached Photos -->
            <div v-if="defectPhotos.length > 0" class="grid gap-2 sm:grid-cols-2">
              <div
                v-for="photo in defectPhotos"
                :key="photo.id"
                class="border-border bg-card flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
              >
                <div class="flex flex-wrap items-center gap-2 truncate">
                  <Camera class="text-primary size-3.5 shrink-0" />
                  <span class="text-foreground truncate font-medium">{{ photo.name }}</span>
                  <span class="text-muted-foreground text-xs">({{ photo.size }})</span>
                </div>
                <button
                  type="button"
                  aria-label="Remove photo"
                  class="text-muted-foreground hover:text-destructive cursor-pointer rounded-sm p-1 transition-colors"
                  @click="removePhoto(photo.id)"
                >
                  <Trash2 class="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- =============================================================== -->
      <!-- DRIVER CERTIFICATION & SIGNATURE                                -->
      <!-- =============================================================== -->
      <Card class="border-border shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <ShieldCheck class="text-primary size-4" />
              <CardTitle class="text-base font-bold"> Driver Safety Certification & Electronic Signature </CardTitle>
            </div>
            <Badge variant="outline" class="text-primary border-primary/30 font-mono text-xs">
              FMCSA § 396.11(a)
            </Badge>
          </div>
          <CardDescription class="text-xs">
            Commercial motor vehicle driver must certify that all required items have been inspected and all known
            defects disclosed.
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Legal Acknowledgement Checkbox -->
          <div class="border-border bg-muted/20 rounded-lg border p-3.5">
            <div class="flex items-start gap-3">
              <Checkbox id="cert-check" v-model="certified" class="mt-0.5" />
              <div class="space-y-1">
                <Label for="cert-check" class="text-foreground cursor-pointer text-xs leading-relaxed font-semibold">
                  I certify that I have conducted a thorough safety inspection of this vehicle and trailer in compliance
                  with Federal Motor Carrier Safety Regulations.
                </Label>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  All components listed above have been checked. Any conditions likely to affect the safe operation of
                  this vehicle or result in mechanical breakdown have been truthfully recorded.
                </p>
              </div>
            </div>
          </div>

          <!-- Driver Signature Fields -->
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="space-y-1.5 sm:col-span-2">
              <Label for="driver-sig" class="text-xs font-semibold"
                >Type Full Legal Name as Electronic Signature *</Label
              >
              <Input id="driver-sig" v-model="typedSignature" placeholder="Marcus Vance" size="small" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs font-semibold">Inspection Timestamp</Label>
              <div
                class="border-border bg-muted/30 text-muted-foreground flex h-8 items-center rounded-md border px-3 font-mono text-xs"
              >
                {{ inspectionDate }} · {{ inspectionTime }}
              </div>
            </div>
          </div>

          <!-- Live Digital Stamp Preview -->
          <div class="border-primary/30 bg-primary/5 space-y-2 rounded-xl border p-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck class="text-primary size-3.5" />
                Live Digital Signature Stamp
              </span>
              <span class="text-primary font-mono text-xs font-medium">Verified CDL Class-A Holder</span>
            </div>

            <div class="border-primary/20 border-b pt-1 pb-2">
              <p class="text-primary text-2xl font-medium tracking-wide italic">
                {{ typedSignature || 'Marcus Vance' }}
              </p>
            </div>

            <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span>Driver: {{ driverName }} · CDL #{{ driverCdl }}</span>
              <span>Carrier: {{ carrierName }} ({{ dotNumber }})</span>
            </div>
          </div>
        </CardContent>

        <CardFooter
          class="border-border bg-muted/15 flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4"
        >
          <div class="text-muted-foreground text-xs">
            Audit Status:
            <strong class="text-foreground"> {{ passCount }} Pass, {{ failCount }} Fail, {{ naCount }} N/A </strong>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" class="text-xs font-medium" @click="handleReset">
              Reset Audit
            </Button>
            <Button
              type="button"
              size="sm"
              class="gap-1.5 text-xs font-medium"
              :disabled="!certified || typedSignature.trim() === ''"
              @click="handleSubmit"
            >
              <FileCheck class="size-4" aria-hidden="true" />
              Submit Completed DVIR
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
