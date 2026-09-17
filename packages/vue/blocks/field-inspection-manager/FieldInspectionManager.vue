<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  Eye,
  MapPin,
  MoreHorizontal,
  Percent,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  Wrench,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type InspectionStatus = 'passed' | 'critical' | 'minor'

export interface PhotoEvidence {
  id: string
  title: string
  caption: string
  time: string
  previewType:
    | 'gauge'
    | 'coil'
    | 'mount'
    | 'thermal'
    | 'box'
    | 'conduit'
    | 'riser'
    | 'pump'
    | 'switch'
    | 'tank'
    | 'battery'
    | 'ats'
    | 'spall'
    | 'rebar'
    | 'crack'
}

export interface ChecklistItem {
  id: string
  label: string
  status: 'pass' | 'fail' | 'minor'
  value: string
}

export interface InspectionRecord {
  id: string
  assetId: string
  assetName: string
  category: string
  facility: string
  buildingBadge: string
  date: string
  time: string
  gps: string
  gpsAccuracy: string
  scorePassed: number
  scoreTotal: number
  status: InspectionStatus
  statusLabel: string
  duration: string
  defectSummary?: string
  workOrder?: string
  photos: PhotoEvidence[]
  inspector: {
    name: string
    role: string
    initials: string
    badge: string
    signoffStatus: string
    signoffHash: string
  }
  checklist: ChecklistItem[]
}

interface Props {
  initialFilter?: 'all' | 'passed' | 'critical' | 'minor'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialFilter: 'all',
})

// Active UI states
const activeFilter = ref<'all' | 'passed' | 'critical' | 'minor'>(props.initialFilter)
const searchQuery = ref('')
const selectedFacility = ref('all')
const copiedGpsId = ref<string | null>(null)
const toastMessage = ref<string | null>(null)

// Dialog Modals
const previewPhoto = ref<{ photo: PhotoEvidence; record: InspectionRecord } | null>(null)
const selectedAudit = ref<InspectionRecord | null>(null)
const isNewAuditOpen = ref(false)

// New Audit Form State
const newAuditAsset = ref('AST-HVAC-4091')
const newAuditFacility = ref('Building A · Rooftop Mechanical Room')
const newAuditNotes = ref('')
const newAuditSuccess = ref(false)

// Hardcoded Inspection Records Data
const inspectionRecords = ref<InspectionRecord[]>([
  {
    id: 'insp-1',
    assetId: 'AST-HVAC-4091',
    assetName: 'Commercial HVAC Chiller Unit #4',
    category: 'HVAC & Thermal Systems',
    facility: 'Building A · Rooftop Mechanical Room',
    buildingBadge: 'Bldg A',
    date: 'Aug 21, 2026',
    time: '09:15 AM EDT',
    gps: '34.0522°N, 118.2437°W',
    gpsAccuracy: '±2.4m',
    scorePassed: 18,
    scoreTotal: 18,
    status: 'passed',
    statusLabel: '18 / 18 Passed',
    duration: '26 mins',
    photos: [
      {
        id: 'p1-1',
        title: 'Compressor Suction Manifold',
        caption: 'Suction pressure holding steady at 68.4 PSI; temperature sensor verified within calibration spec.',
        time: '09:18 AM',
        previewType: 'gauge',
      },
      {
        id: 'p1-2',
        title: 'Condenser Fan Coil Assembly',
        caption: 'Clean aluminum fin surfaces with zero debris obstruction; axial fan bearings lubricated.',
        time: '09:24 AM',
        previewType: 'coil',
      },
      {
        id: 'p1-3',
        title: 'Vibration Dampener Isolators',
        caption: 'Neoprene spring isolator pads intact with zero hairline settling fractures or mounting deflection.',
        time: '09:32 AM',
        previewType: 'mount',
      },
    ],
    inspector: {
      name: 'Marcus Vance',
      role: 'Senior Field Engineer',
      initials: 'MV',
      badge: 'PE #84920-CA',
      signoffStatus: 'Verified Cryptographic Sign-off',
      signoffHash: 'SHA-256: 9f8e21...41a2',
    },
    checklist: [
      {
        id: 'c1-1',
        label: 'Refrigerant Charge & Pressures',
        status: 'pass',
        value: '68.4 PSI Suction / 225 PSI Discharge',
      },
      { id: 'c1-2', label: 'Compressor Motor Amp Draw', status: 'pass', value: '42.1A (rated 46A max)' },
      { id: 'c1-3', label: 'Chilled Water Loop Delta-T', status: 'pass', value: '10.2°F Temperature Drop' },
      { id: 'c1-4', label: 'Emergency High-Pressure Cutout', status: 'pass', value: 'Trips accurately at 380 PSI' },
    ],
  },
  {
    id: 'insp-2',
    assetId: 'AST-SOLAR-1082',
    assetName: 'Rooftop Solar Array & Inverters',
    category: 'Renewable Energy & Power',
    facility: 'Building C · South Wing Solar Deck',
    buildingBadge: 'Bldg C',
    date: 'Aug 21, 2026',
    time: '10:45 AM EDT',
    gps: '34.0528°N, 118.2445°W',
    gpsAccuracy: '±1.8m',
    scorePassed: 14,
    scoreTotal: 18,
    status: 'critical',
    statusLabel: '14 / 18 - 2 Critical Fails',
    duration: '34 mins',
    defectSummary: 'DC string combiner box busbar overheating (84.2°C); micro-inverter #6 circuit failure.',
    workOrder: 'WO-SOLAR-4921 (High Priority Dispatched)',
    photos: [
      {
        id: 'p2-1',
        title: 'Inverter #6 Thermal Hotspot',
        caption: 'FLIR radiometric thermography shows 84.2°C localized hotspot at DC-AC bridge capacitor.',
        time: '10:52 AM',
        previewType: 'thermal',
      },
      {
        id: 'p2-2',
        title: 'Combiner Box Arc Degradation',
        caption: 'Busbar contact surface oxidation with heat discoloration and slight terminal pitting.',
        time: '11:04 AM',
        previewType: 'box',
      },
      {
        id: 'p2-3',
        title: 'PV String #4 Conduit Ingress',
        caption: 'Degraded rubber gasket on string junction conduit fitting allowing moisture penetration.',
        time: '11:12 AM',
        previewType: 'conduit',
      },
    ],
    inspector: {
      name: 'Marcus Vance',
      role: 'Senior Field Engineer',
      initials: 'MV',
      badge: 'PE #84920-CA',
      signoffStatus: 'Critical Defect Action Required',
      signoffHash: 'SHA-256: 4c3d88...71ef',
    },
    checklist: [
      {
        id: 'c2-1',
        label: 'Combiner Box Busbar Temp',
        status: 'fail',
        value: '84.2°C (exceeds 65°C safe operating limit)',
      },
      { id: 'c2-2', label: 'Micro-inverter #6 Communication', status: 'fail', value: 'Modbus timeout / Offline state' },
      { id: 'c2-3', label: 'PV Panel Surface Clarity', status: 'pass', value: 'Soiling index < 1.8%' },
      { id: 'c2-4', label: 'Rapid Shutdown System', status: 'pass', value: 'Voltages drop < 30V in 12s' },
    ],
  },
  {
    id: 'insp-3',
    assetId: 'AST-FIRE-8820',
    assetName: 'Fire Suppression & Sprinkler System',
    category: 'Life Safety & Protection',
    facility: 'Main Tower · Sub-Basement Pump Room B2',
    buildingBadge: 'Tower B2',
    date: 'Aug 21, 2026',
    time: '11:30 AM EDT',
    gps: '34.0515°N, 118.2420°W',
    gpsAccuracy: '±3.1m',
    scorePassed: 17,
    scoreTotal: 18,
    status: 'minor',
    statusLabel: '17 / 18 - 1 Minor Defect',
    duration: '22 mins',
    defectSummary: 'Main riser pressure gauge annual NIST calibration tag expired by 21 days; pressure intact.',
    workOrder: 'WO-FIRE-8820 (Standard Calibration Scheduled)',
    photos: [
      {
        id: 'p3-1',
        title: 'Main Riser Pressure Gauge',
        caption: 'Static pressure 145 PSI (nominal). Calibration tag stamped 07/2025 requiring routine re-tagging.',
        time: '11:34 AM',
        previewType: 'riser',
      },
      {
        id: 'p3-2',
        title: 'Jockey Pump Shaft Packing',
        caption: 'Packing gland seal dry with zero leakage; auto start/stop pressure cutoff cycle verified.',
        time: '11:41 AM',
        previewType: 'pump',
      },
      {
        id: 'p3-3',
        title: 'OS&Y Tamper Supervisory Switch',
        caption: 'Zone 1 control valve open; tamper switch sends instant supervisory signal to FACP.',
        time: '11:48 AM',
        previewType: 'switch',
      },
    ],
    inspector: {
      name: 'Marcus Vance',
      role: 'Senior Field Engineer',
      initials: 'MV',
      badge: 'PE #84920-CA',
      signoffStatus: 'Verified Cryptographic Sign-off',
      signoffHash: 'SHA-256: 7d1a99...33bc',
    },
    checklist: [
      { id: 'c3-1', label: 'System Static Water Pressure', status: 'pass', value: '145 PSI static / 125 PSI residual' },
      {
        id: 'c3-2',
        label: 'Riser Gauge Calibration Tag',
        status: 'minor',
        value: 'Overdue by 21 days (recalibration due)',
      },
      { id: 'c3-3', label: 'Diesel Fire Pump Auto-Start', status: 'pass', value: 'Cranked to 1750 RPM in 4.2s' },
      { id: 'c3-4', label: 'Flow Alarm Switch Delay', status: 'pass', value: 'Gong chime triggered at 32s' },
    ],
  },
  {
    id: 'insp-4',
    assetId: 'AST-GEN-3304',
    assetName: 'Emergency Backup Generator #2',
    category: 'Emergency Standby Power',
    facility: 'East Campus · Utility Pad North',
    buildingBadge: 'East Pad',
    date: 'Aug 21, 2026',
    time: '01:15 PM EDT',
    gps: '34.0535°N, 118.2450°W',
    gpsAccuracy: '±2.1m',
    scorePassed: 18,
    scoreTotal: 18,
    status: 'passed',
    statusLabel: '18 / 18 Passed',
    duration: '29 mins',
    photos: [
      {
        id: 'p4-1',
        title: 'Diesel Sub-Base Day Tank',
        caption:
          'Ultra-low sulfur diesel fuel level at 98.4%; optical fuel water separator clean with zero particulate.',
        time: '01:21 PM',
        previewType: 'tank',
      },
      {
        id: 'p4-2',
        title: '24V Dual Starter Battery Bank',
        caption: 'Terminal posts clean with dielectric grease coating; float charging verified at 27.6V.',
        time: '01:28 PM',
        previewType: 'battery',
      },
      {
        id: 'p4-3',
        title: '800A ATS Transfer Switch',
        caption: 'Phase alignment and mechanical interlocking verified; utility power sync nominal.',
        time: '01:38 PM',
        previewType: 'ats',
      },
    ],
    inspector: {
      name: 'Marcus Vance',
      role: 'Senior Field Engineer',
      initials: 'MV',
      badge: 'PE #84920-CA',
      signoffStatus: 'Verified Cryptographic Sign-off',
      signoffHash: 'SHA-256: 3a7b54...82e9',
    },
    checklist: [
      { id: 'c4-1', label: 'Engine Crank & Run Test', status: 'pass', value: '60 Hz output reached in 6.8s' },
      { id: 'c4-2', label: 'Coolant Jacket Heater Temp', status: 'pass', value: '118°F Block temperature' },
      { id: 'c4-3', label: 'Oil Pressure & Level', status: 'pass', value: '55 PSI running oil pressure' },
      { id: 'c4-4', label: 'Exhaust Silencer & Insulation', status: 'pass', value: 'Zero exhaust gas or soot leakage' },
    ],
  },
  {
    id: 'insp-5',
    assetId: 'AST-STR-0019',
    assetName: 'Structural Foundation & Load Beams',
    category: 'Structural Integrity & Civil',
    facility: 'Parking Structure · Level P3 Pillar Grid 4D',
    buildingBadge: 'P3 Grid 4D',
    date: 'Aug 21, 2026',
    time: '02:40 PM EDT',
    gps: '34.0510°N, 118.2412°W',
    gpsAccuracy: '±1.9m',
    scorePassed: 16,
    scoreTotal: 18,
    status: 'critical',
    statusLabel: '16 / 18 - 2 Critical Fails',
    duration: '31 mins',
    defectSummary:
      'Concrete shear spall at beam joint 4D corbel; exposed tension rebar #6 exhibiting active oxidation.',
    workOrder: 'WO-STR-4922 (Structural Engineer On-Site)',
    photos: [
      {
        id: 'p5-1',
        title: 'Pillar 4D Beam Shear Spall',
        caption: 'Concrete shear delamination (18cm wide x 4cm depth) near primary corbel support bracket.',
        time: '02:46 PM',
        previewType: 'spall',
      },
      {
        id: 'p5-2',
        title: 'Exposed Steel Rebar Oxidation',
        caption: 'Deformed rebar #6 exposed to ambient moisture with active ferric surface oxidation.',
        time: '02:54 PM',
        previewType: 'rebar',
      },
      {
        id: 'p5-3',
        title: 'Optical Crack Comparator Test',
        caption: 'Structural hairline fissure width measured at 2.2mm across tension face (spec max 0.3mm).',
        time: '03:02 PM',
        previewType: 'crack',
      },
    ],
    inspector: {
      name: 'Marcus Vance',
      role: 'Senior Field Engineer',
      initials: 'MV',
      badge: 'PE #84920-CA',
      signoffStatus: 'Critical Defect Action Required',
      signoffHash: 'SHA-256: 8e5f12...04db',
    },
    checklist: [
      { id: 'c5-1', label: 'Concrete Cover Spalling', status: 'fail', value: '18cm spall at corbel connection' },
      {
        id: 'c5-2',
        label: 'Structural Crack Aperture',
        status: 'fail',
        value: '2.2mm fissure (exceeds 0.3mm tolerance)',
      },
      { id: 'c5-3', label: 'Expansion Joint Elastomer', status: 'pass', value: 'Sealant elasticity within spec' },
      { id: 'c5-4', label: 'Drainage Channel Clearance', status: 'pass', value: 'Deck scuppers free of sediment' },
    ],
  },
])

// Filtered Records
const filteredRecords = computed(() => {
  return inspectionRecords.value.filter((record) => {
    // Status Filter
    if (activeFilter.value === 'passed' && record.status !== 'passed') return false
    if (activeFilter.value === 'critical' && record.status !== 'critical') return false
    if (activeFilter.value === 'minor' && record.status !== 'minor') return false

    // Facility Filter
    if (selectedFacility.value !== 'all' && !record.facility.includes(selectedFacility.value)) return false

    // Search Query
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const matchesText =
        record.assetName.toLowerCase().includes(q) ||
        record.assetId.toLowerCase().includes(q) ||
        record.facility.toLowerCase().includes(q) ||
        record.category.toLowerCase().includes(q)
      if (!matchesText) return false
    }

    return true
  })
})

function copyGps(gps: string, recordId: string) {
  navigator.clipboard?.writeText(gps)
  copiedGpsId.value = recordId
  showToast(`GPS Coordinates ${gps} copied to clipboard`)
  setTimeout(() => {
    if (copiedGpsId.value === recordId) {
      copiedGpsId.value = null
    }
  }, 2200)
}

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = null
    }
  }, 3000)
}

function handleOpenPhoto(photo: PhotoEvidence, record: InspectionRecord) {
  previewPhoto.value = { photo, record }
}

function handleViewReport(record: InspectionRecord) {
  selectedAudit.value = record
}

function handleDownloadPdf(record: InspectionRecord) {
  showToast(`Downloading certified PDF audit report for ${record.assetId}...`)
}

function handleCreateWorkOrder(record: InspectionRecord) {
  showToast(`Work Order generated for ${record.assetName} (Assigned to Facilities Ops)`)
}

function handleStartNewInspection() {
  isNewAuditOpen.value = true
  newAuditSuccess.value = false
}

function submitNewAudit() {
  newAuditSuccess.value = true
  showToast('New audit inspection successfully submitted and recorded!')
  setTimeout(() => {
    isNewAuditOpen.value = false
    newAuditSuccess.value = false
  }, 1400)
}
</script>

<template>
  <div data-slot="field-inspection-manager" :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- ================================================================= -->
    <!-- TOAST NOTIFICATION BANNER                                         -->
    <!-- ================================================================= -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="toastMessage"
        class="border-primary/30 bg-primary/10 text-foreground fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur-md"
      >
        <CheckCircle2 class="text-primary size-4 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- ================================================================= -->
    <!-- MAIN HEADER: TITLE, INSPECTOR BADGE, ON-TIME STATUS, ACTION CTA   -->
    <!-- ================================================================= -->
    <Card class="border-border shadow-xs">
      <CardHeader class="flex flex-col gap-4 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <!-- Compliance Pills & Live Status -->
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="outline" class="gap-1.5 font-mono text-xs">
              <ClipboardCheck class="text-primary size-3.5" aria-hidden="true" />
              ISO-55001 & OSHA Audit Matrix
            </Badge>

            <!-- Emerald Status Badge -->
            <div
              class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              <span class="relative flex size-1.5">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span class="relative inline-flex size-1.5 rounded-full bg-emerald-500"></span>
              </span>
              8 Audits Completed Today · 100% On-Time
            </div>
          </div>

          <!-- Title & Inspector Subtext -->
          <div>
            <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Site & Asset Inspection Audits</h1>
            <div class="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <div class="text-foreground flex items-center gap-1.5 font-medium">
                <Avatar class="border-border size-5 border">
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">MV</AvatarFallback>
                </Avatar>
                <span>Marcus Vance</span>
              </div>
              <span class="text-muted-foreground">Senior Field Engineer (PE #84920-CA)</span>
              <span class="text-muted-foreground font-mono">Terminal: Apex Facility West</span>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-wrap items-center gap-2.5 pt-1">
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            class="gap-1.5 text-xs font-medium shadow-xs"
            @click="showToast('Exporting complete site inspection audit summary CSV...')"
          >
            <Download class="size-3.5" aria-hidden="true" />
            Export Audits CSV
          </Button>

          <Button size="sm" class="gap-1.5 text-xs font-medium shadow-xs" @click="handleStartNewInspection">
            <Plus class="size-3.5" aria-hidden="true" />
            Start New Inspection
          </Button>
        </div>
      </CardHeader>
    </Card>

    <!-- ================================================================= -->
    <!-- 4 FIELD INSPECTION METRIC KPI CARDS                               -->
    <!-- ================================================================= -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Completed Inspections -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Completed Inspections</span>
            <div
              class="flex size-8 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">24</div>
            <div class="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">24 Audits This Week</span>
              <span>·</span>
              <span class="text-muted-foreground">+14.2% vs target</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Critical Defects Flagged -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Critical Defects Flagged</span>
            <div
              class="flex size-8 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            >
              <ShieldAlert class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">2</div>
            <div class="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <span class="font-semibold text-rose-600 dark:text-rose-400">2 Critical Deficiencies</span>
              <span>·</span>
              <span class="text-muted-foreground">Work Orders Dispatched</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: First-Time Pass Rate -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">First-Time Pass Rate</span>
            <div
              class="border-primary/20 bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md border"
            >
              <Percent class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">91.6%</div>
            <div class="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">91.6% Pass Rate</span>
              <span>·</span>
              <span class="text-muted-foreground">Above 90.0% SLA</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Avg Inspection Duration -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Avg Inspection Duration</span>
            <div
              class="flex size-8 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Clock class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">28m</div>
            <div class="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <span class="text-foreground font-medium">28 mins / audit</span>
              <span>·</span>
              <span class="text-emerald-600 dark:text-emerald-400">-4m vs benchmark</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================= -->
    <!-- SEARCH & FILTER TOOLBAR                                           -->
    <!-- ================================================================= -->
    <Card class="border-border shadow-xs">
      <CardContent class="p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <!-- Filter Tabs / Pills -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              :class="[
                'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                activeFilter === 'all'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeFilter = 'all'"
            >
              All Audits (5)
            </button>

            <button
              type="button"
              :class="[
                'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                activeFilter === 'passed'
                  ? 'bg-emerald-600 font-semibold text-white shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeFilter = 'passed'"
            >
              <CheckCircle2 class="size-3.5" />
              Passed (2)
            </button>

            <button
              type="button"
              :class="[
                'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                activeFilter === 'critical'
                  ? 'bg-rose-600 font-semibold text-white shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeFilter = 'critical'"
            >
              <AlertTriangle class="size-3.5" />
              Critical Defects (2)
            </button>

            <button
              type="button"
              :class="[
                'focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                activeFilter === 'minor'
                  ? 'bg-amber-600 font-semibold text-white shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeFilter = 'minor'"
            >
              <AlertCircle class="size-3.5" />
              Minor Issues (1)
            </button>
          </div>

          <!-- Search Input & Facility Selector -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="relative min-w-[220px] flex-1 sm:w-64">
              <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input v-model="searchQuery" placeholder="Search asset, ID, facility..." class="h-8 pl-8 text-xs" />
            </div>

            <Select v-model="selectedFacility">
              <SelectTrigger class="h-8 w-40 text-xs">
                <SelectValue placeholder="All Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                <SelectItem value="Building A">Building A (Chillers)</SelectItem>
                <SelectItem value="Building C">Building C (Solar)</SelectItem>
                <SelectItem value="Main Tower">Main Tower (Fire)</SelectItem>
                <SelectItem value="East Campus">East Campus (Gen)</SelectItem>
                <SelectItem value="Parking Structure">Parking Structure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- ================================================================= -->
    <!-- FIELD INSPECTIONS TABLE                                           -->
    <!-- ================================================================= -->
    <Card class="border-border overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30">
              <TableHead class="min-w-[220px] text-xs font-semibold">Asset ID & Name</TableHead>
              <TableHead class="min-w-[200px] text-xs font-semibold">Facility Location</TableHead>
              <TableHead class="min-w-[200px] text-xs font-semibold">Inspection Date & GPS Geostamp</TableHead>
              <TableHead class="min-w-[160px] text-xs font-semibold">Checklist Score</TableHead>
              <TableHead class="min-w-[170px] text-xs font-semibold">Photo Evidence (2-3)</TableHead>
              <TableHead class="min-w-[170px] text-xs font-semibold">Inspector & Sign-off</TableHead>
              <TableHead class="w-[80px] text-right text-xs font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="record in filteredRecords"
              :key="record.id"
              :class="[
                'group transition-colors',
                record.status === 'critical'
                  ? 'bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-950/10'
                  : 'hover:bg-muted/30',
              ]"
            >
              <!-- 1. Asset ID & Name -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-xs font-bold sm:text-sm">
                      {{ record.assetName }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span
                      class="border-border bg-muted/50 text-muted-foreground py-0.2 rounded border px-1.5 font-mono text-xs font-semibold"
                    >
                      {{ record.assetId }}
                    </span>
                    <span class="text-muted-foreground text-xs">• {{ record.category }}</span>
                  </div>
                  <div v-if="record.defectSummary" class="text-xs font-medium text-rose-600 dark:text-rose-400">
                    ⚠️ {{ record.defectSummary }}
                  </div>
                </div>
              </TableCell>

              <!-- 2. Facility Location -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1">
                  <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Building2 class="text-primary size-3.5 shrink-0" />
                    <span>{{ record.facility }}</span>
                  </div>
                  <Badge variant="outline" class="font-mono text-xs">
                    {{ record.buildingBadge }}
                  </Badge>
                </div>
              </TableCell>

              <!-- 3. Inspection Date & GPS Geostamp -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1">
                  <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <Calendar class="text-muted-foreground size-3.5 shrink-0" />
                    <span class="tabular-nums">{{ record.date }} · {{ record.time }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      :class="[
                        'border-border hover:bg-muted focus-visible:ring-ring bg-muted/40 inline-flex min-h-6 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
                        copiedGpsId === record.id
                          ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground hover:text-foreground',
                      ]"
                      :title="`Click to copy GPS coordinates: ${record.gps}`"
                      @click="copyGps(record.gps, record.id)"
                    >
                      <MapPin class="text-primary size-3 shrink-0" />
                      <span class="tabular-nums">{{ record.gps }}</span>
                      <Check v-if="copiedGpsId === record.id" class="size-3 text-emerald-600 dark:text-emerald-400" />
                      <Copy v-else class="size-3 opacity-60" />
                    </button>
                    <span class="text-muted-foreground text-xs tabular-nums">({{ record.gpsAccuracy }})</span>
                  </div>
                </div>
              </TableCell>

              <!-- 4. Pass/Fail Checklist Score -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5">
                    <Badge
                      :variant="
                        record.status === 'critical' ? 'destructive' : record.status === 'minor' ? 'warning' : 'outline'
                      "
                      :class="[
                        'gap-1 font-mono text-xs font-semibold tabular-nums',
                        record.status === 'passed' &&
                          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                      ]"
                    >
                      <CheckCircle2 v-if="record.status === 'passed'" class="size-3" />
                      <AlertTriangle v-else-if="record.status === 'critical'" class="size-3" />
                      <AlertCircle v-else class="size-3" />
                      {{ record.statusLabel }}
                    </Badge>
                  </div>
                  <div class="text-muted-foreground text-xs tabular-nums">Duration: {{ record.duration }}</div>
                </div>
              </TableCell>

              <!-- 5. Photo Evidence Thumbnail Gallery (2-3 photo attachments) -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5">
                    <!-- Photo 1 Thumbnail -->
                    <button
                      v-for="(photo, pIdx) in record.photos"
                      :key="photo.id"
                      type="button"
                      :aria-label="`View inspection photo ${pIdx + 1}: ${photo.title}`"
                      class="border-border hover:border-primary focus-visible:ring-ring group/thumb relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-md border bg-zinc-900 shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      @click="handleOpenPhoto(photo, record)"
                    >
                      <!-- Stylized Vector SVG Illustration per Preview Type -->
                      <!-- Gauge -->
                      <svg v-if="photo.previewType === 'gauge'" class="h-full w-full" viewBox="0 0 44 44" fill="none">
                        <circle cx="22" cy="22" r="19" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" />
                        <path
                          d="M 12,28 A 14,14 0 1,1 32,28"
                          fill="none"
                          stroke="#22c55e"
                          stroke-width="2"
                          stroke-dasharray="2 2"
                        />
                        <line
                          x1="22"
                          y1="22"
                          x2="28"
                          y2="15"
                          stroke="#ef4444"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <circle cx="22" cy="22" r="2.5" fill="#f4f4f5" />
                      </svg>
                      <!-- Coil -->
                      <svg
                        v-else-if="photo.previewType === 'coil'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <line x1="6" y1="10" x2="38" y2="10" stroke="#38bdf8" stroke-width="1.5" />
                        <line x1="6" y1="18" x2="38" y2="18" stroke="#38bdf8" stroke-width="1.5" />
                        <line x1="6" y1="26" x2="38" y2="26" stroke="#38bdf8" stroke-width="1.5" />
                        <line x1="6" y1="34" x2="38" y2="34" stroke="#38bdf8" stroke-width="1.5" />
                        <circle
                          cx="22"
                          cy="22"
                          r="7"
                          fill="#0284c7"
                          fill-opacity="0.3"
                          stroke="#38bdf8"
                          stroke-width="1.5"
                        />
                      </svg>
                      <!-- Mount -->
                      <svg
                        v-else-if="photo.previewType === 'mount'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect x="8" y="8" width="28" height="4" rx="1" fill="#71717a" />
                        <path
                          d="M 14,12 C 14,18 30,18 30,24 C 30,30 14,30 14,36"
                          fill="none"
                          stroke="#f59e0b"
                          stroke-width="2"
                        />
                        <rect x="8" y="36" width="28" height="4" rx="1" fill="#71717a" />
                      </svg>
                      <!-- Thermal Scan -->
                      <svg
                        v-else-if="photo.previewType === 'thermal'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#3b0764" />
                        <circle cx="22" cy="22" r="14" fill="#db2777" fill-opacity="0.6" />
                        <circle cx="22" cy="22" r="7" fill="#facc15" />
                        <line x1="12" y1="22" x2="32" y2="22" stroke="#ffffff" stroke-width="0.75" />
                        <line x1="22" y1="12" x2="22" y2="32" stroke="#ffffff" stroke-width="0.75" />
                      </svg>
                      <!-- Box -->
                      <svg
                        v-else-if="photo.previewType === 'box'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect x="6" y="6" width="32" height="32" rx="2" stroke="#eab308" stroke-width="1.5" />
                        <line x1="14" y1="12" x2="14" y2="32" stroke="#f97316" stroke-width="2" />
                        <line x1="22" y1="12" x2="22" y2="32" stroke="#f97316" stroke-width="2" />
                        <circle cx="22" cy="22" r="5" fill="#ef4444" />
                      </svg>
                      <!-- Conduit -->
                      <svg
                        v-else-if="photo.previewType === 'conduit'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect x="16" y="4" width="12" height="36" fill="#52525b" />
                        <circle
                          cx="22"
                          cy="22"
                          r="10"
                          fill="#a1a1aa"
                          fill-opacity="0.3"
                          stroke="#e4e4e7"
                          stroke-width="1.5"
                        />
                        <line x1="16" y1="22" x2="28" y2="22" stroke="#ef4444" stroke-width="1.5" />
                      </svg>
                      <!-- Riser -->
                      <svg
                        v-else-if="photo.previewType === 'riser'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect x="14" y="4" width="16" height="36" fill="#dc2626" />
                        <circle cx="22" cy="18" r="8" fill="#e4e4e7" stroke="#dc2626" stroke-width="1.5" />
                        <line x1="22" y1="18" x2="26" y2="14" stroke="#000000" stroke-width="1" />
                      </svg>
                      <!-- Pump -->
                      <svg
                        v-else-if="photo.previewType === 'pump'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <circle cx="22" cy="22" r="13" fill="#b91c1c" stroke="#f87171" stroke-width="1.5" />
                        <circle cx="22" cy="22" r="5" fill="#52525b" />
                        <line x1="22" y1="4" x2="22" y2="10" stroke="#f87171" stroke-width="2" />
                      </svg>
                      <!-- Switch -->
                      <svg
                        v-else-if="photo.previewType === 'switch'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <circle cx="22" cy="16" r="9" stroke="#dc2626" stroke-width="2" fill="none" />
                        <rect x="16" y="24" width="12" height="14" rx="2" fill="#eab308" />
                      </svg>
                      <!-- Tank -->
                      <svg
                        v-else-if="photo.previewType === 'tank'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect
                          x="10"
                          y="8"
                          width="24"
                          height="28"
                          rx="6"
                          fill="#3f3f46"
                          stroke="#71717a"
                          stroke-width="1.5"
                        />
                        <rect x="14" y="14" width="4" height="16" rx="1" fill="#22c55e" />
                      </svg>
                      <!-- Battery -->
                      <svg
                        v-else-if="photo.previewType === 'battery'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect
                          x="6"
                          y="12"
                          width="32"
                          height="24"
                          rx="2"
                          fill="#27272a"
                          stroke="#52525b"
                          stroke-width="1.5"
                        />
                        <rect x="11" y="8" width="6" height="4" fill="#ef4444" />
                        <rect x="27" y="8" width="6" height="4" fill="#3b82f6" />
                      </svg>
                      <!-- ATS -->
                      <svg
                        v-else-if="photo.previewType === 'ats'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#18181b" />
                        <rect
                          x="6"
                          y="6"
                          width="32"
                          height="32"
                          rx="2"
                          fill="#27272a"
                          stroke="#059669"
                          stroke-width="1.5"
                        />
                        <circle cx="14" cy="14" r="2.5" fill="#22c55e" />
                        <circle cx="14" cy="22" r="2.5" fill="#eab308" />
                        <line x1="22" y1="12" x2="32" y2="12" stroke="#a1a1aa" stroke-width="2" />
                      </svg>
                      <!-- Spall -->
                      <svg
                        v-else-if="photo.previewType === 'spall'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#27272a" />
                        <polygon points="6,6 38,6 38,38 24,38 18,26 6,24" fill="#71717a" />
                        <polygon
                          points="18,26 26,24 24,38"
                          fill="#ef4444"
                          fill-opacity="0.4"
                          stroke="#ef4444"
                          stroke-width="1"
                        />
                      </svg>
                      <!-- Rebar -->
                      <svg
                        v-else-if="photo.previewType === 'rebar'"
                        class="h-full w-full"
                        viewBox="0 0 44 44"
                        fill="none"
                      >
                        <rect width="44" height="44" fill="#27272a" />
                        <line x1="6" y1="38" x2="38" y2="6" stroke="#b45309" stroke-width="4" stroke-dasharray="2 1" />
                        <circle cx="22" cy="22" r="6" stroke="#ef4444" stroke-width="1.5" fill="none" />
                      </svg>
                      <!-- Crack -->
                      <svg v-else class="h-full w-full" viewBox="0 0 44 44" fill="none">
                        <rect width="44" height="44" fill="#18181b" />
                        <path d="M 12,38 L 18,26 L 24,20 L 32,6" stroke="#ef4444" stroke-width="2" fill="none" />
                        <rect
                          x="14"
                          y="14"
                          width="16"
                          height="12"
                          rx="1"
                          fill="#ffffff"
                          fill-opacity="0.2"
                          stroke="#ffffff"
                          stroke-width="0.75"
                        />
                      </svg>

                      <!-- Hover magnifying glass overlay -->
                      <div
                        class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover/thumb:opacity-100"
                      >
                        <Eye class="size-3.5 text-white" />
                      </div>
                    </button>
                  </div>
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <Camera class="size-3" />
                    <span>{{ record.photos.length }} Attachments</span>
                  </div>
                </div>
              </TableCell>

              <!-- 6. Inspector & Sign-off -->
              <TableCell class="py-3.5 align-top">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <Avatar class="border-border size-6 border">
                      <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">
                        {{ record.inspector.initials }}
                      </AvatarFallback>
                    </Avatar>
                    <span class="text-foreground text-xs font-semibold">
                      {{ record.inspector.name }}
                    </span>
                  </div>
                  <div>
                    <span
                      :class="[
                        'inline-flex items-center gap-1 font-mono text-xs font-medium',
                        record.status === 'critical'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400',
                      ]"
                    >
                      <ShieldCheck v-if="record.status !== 'critical'" class="size-3 shrink-0" />
                      <ShieldAlert v-else class="size-3 shrink-0" />
                      {{ record.inspector.signoffStatus }}
                    </span>
                  </div>
                  <div class="text-muted-foreground/80 font-mono text-xs">
                    {{ record.inspector.signoffHash }}
                  </div>
                </div>
              </TableCell>

              <!-- 7. Actions Dropdown -->
              <TableCell class="py-3.5 text-right align-top">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="sm" class="size-8 p-0">
                      <span class="sr-only">Open audit menu</span>
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-48 text-xs">
                    <DropdownMenuLabel class="font-mono text-xs">{{ record.assetId }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="cursor-pointer gap-2" @click="handleViewReport(record)">
                      <Eye class="text-primary size-3.5" />
                      <span>View Audit Report</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem class="cursor-pointer gap-2" @click="handleDownloadPdf(record)">
                      <Download class="size-3.5" />
                      <span>Download PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem class="cursor-pointer gap-2" @click="copyGps(record.gps, record.id)">
                      <Copy class="size-3.5" />
                      <span>Copy GPS Coordinates</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      :class="[
                        'cursor-pointer gap-2',
                        record.status === 'critical' ? 'font-semibold text-rose-600 dark:text-rose-400' : '',
                      ]"
                      @click="handleCreateWorkOrder(record)"
                    >
                      <Wrench class="size-3.5" />
                      <span>{{ record.status === 'critical' ? 'Expedite Work Order' : 'Create Work Order' }}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>

    <!-- ================================================================= -->
    <!-- PHOTO EVIDENCE LIGHTBOX MODAL DIALOG                              -->
    <!-- ================================================================= -->
    <Dialog :open="!!previewPhoto" @update:open="(val: boolean) => !val && (previewPhoto = null)">
      <DialogContent v-if="previewPhoto" class="sm:max-w-2xl">
        <DialogHeader>
          <div class="flex items-center justify-between pr-4">
            <div class="flex items-center gap-2">
              <Camera class="text-primary size-4" />
              <DialogTitle class="text-base font-bold">
                {{ previewPhoto.photo.title }}
              </DialogTitle>
            </div>
            <Badge variant="outline" class="font-mono text-xs">
              {{ previewPhoto.record.assetId }}
            </Badge>
          </div>
          <DialogDescription class="text-xs">
            Captured during {{ previewPhoto.record.assetName }} site inspection audit.
          </DialogDescription>
        </DialogHeader>

        <!-- Simulated Full Inspection Photo Canvas -->
        <div class="space-y-4 py-2">
          <div
            class="border-border relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-4 text-white shadow-inner"
          >
            <!-- High Definition Photo SVG Composition -->
            <div class="absolute inset-0 flex items-center justify-center p-6">
              <!-- Gauge Large -->
              <svg
                v-if="previewPhoto.photo.previewType === 'gauge'"
                class="h-full w-full"
                viewBox="0 0 300 200"
                fill="none"
              >
                <rect width="300" height="200" fill="#18181b" />
                <circle cx="150" cy="100" r="70" fill="#27272a" stroke="#71717a" stroke-width="4" />
                <path
                  d="M 100,125 A 55,55 0 1,1 200,125"
                  fill="none"
                  stroke="#22c55e"
                  stroke-width="6"
                  stroke-dasharray="4 2"
                />
                <line x1="150" y1="100" x2="185" y2="65" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
                <circle cx="150" cy="100" r="8" fill="#f4f4f5" />
                <text x="150" y="140" fill="#a1a1aa" font-size="12" text-anchor="middle" font-family="monospace">
                  68.4 PSI · NOMINAL
                </text>
              </svg>
              <!-- Thermal Large -->
              <svg
                v-else-if="previewPhoto.photo.previewType === 'thermal'"
                class="h-full w-full"
                viewBox="0 0 300 200"
                fill="none"
              >
                <rect width="300" height="200" fill="#3b0764" />
                <circle cx="150" cy="100" r="65" fill="#db2777" fill-opacity="0.6" />
                <circle cx="150" cy="100" r="30" fill="#facc15" />
                <line x1="80" y1="100" x2="220" y2="100" stroke="#ffffff" stroke-width="1.5" />
                <line x1="150" y1="30" x2="150" y2="170" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="150" cy="100" r="6" stroke="#ffffff" stroke-width="1.5" fill="none" />
                <text x="160" y="90" fill="#ffffff" font-size="14" font-weight="bold" font-family="monospace">
                  84.2°C CRITICAL
                </text>
              </svg>
              <!-- Spall Large -->
              <svg
                v-else-if="previewPhoto.photo.previewType === 'spall'"
                class="h-full w-full"
                viewBox="0 0 300 200"
                fill="none"
              >
                <rect width="300" height="200" fill="#27272a" />
                <polygon
                  points="40,30 260,30 260,170 170,170 130,110 40,100"
                  fill="#52525b"
                  stroke="#71717a"
                  stroke-width="2"
                />
                <polygon
                  points="130,110 180,90 170,170"
                  fill="#ef4444"
                  fill-opacity="0.4"
                  stroke="#ef4444"
                  stroke-width="2"
                />
                <line x1="130" y1="110" x2="180" y2="90" stroke="#facc15" stroke-width="2" stroke-dasharray="3 3" />
                <text x="155" y="80" fill="#facc15" font-size="12" font-family="monospace">18cm SHEAR SPALL</text>
              </svg>
              <!-- Default Large -->
              <svg v-else class="h-full w-full" viewBox="0 0 300 200" fill="none">
                <rect width="300" height="200" fill="#18181b" />
                <rect x="40" y="30" width="220" height="140" rx="4" fill="#27272a" stroke="#3f3f46" stroke-width="2" />
                <circle cx="150" cy="100" r="35" fill="#3f3f46" stroke="#38bdf8" stroke-width="2" />
                <line x1="70" y1="60" x2="230" y2="60" stroke="#38bdf8" stroke-width="1.5" />
                <line x1="70" y1="140" x2="230" y2="140" stroke="#38bdf8" stroke-width="1.5" />
              </svg>
            </div>

            <!-- Viewfinder Reticles -->
            <div class="pointer-events-none absolute inset-4 border border-white/20">
              <div class="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-emerald-400"></div>
              <div class="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-emerald-400"></div>
              <div class="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-emerald-400"></div>
              <div class="absolute -right-1 -bottom-1 size-3 border-r-2 border-b-2 border-emerald-400"></div>
            </div>

            <!-- Top Telemetry Tag -->
            <div
              class="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 font-mono text-xs backdrop-blur-sm"
            >
              <span class="size-2 animate-pulse rounded-full bg-emerald-400"></span>
              <span>GEO-AUTHENTICATED FIELD PHOTO</span>
            </div>

            <!-- Bottom Geostamp Overlay -->
            <div
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 font-mono text-xs"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-bold text-emerald-400 tabular-nums">
                  📍 {{ previewPhoto.record.gps }} ({{ previewPhoto.record.gpsAccuracy }})
                </span>
                <span class="text-zinc-300"> {{ previewPhoto.record.date }} · {{ previewPhoto.photo.time }} </span>
              </div>
            </div>
          </div>

          <!-- Notes & Metadata -->
          <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-3 text-xs">
            <div class="text-foreground font-semibold">Inspector Field Observation:</div>
            <p class="text-muted-foreground leading-relaxed">{{ previewPhoto.photo.caption }}</p>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div class="border-border bg-muted/30 rounded border p-2">
              <span class="text-muted-foreground block text-xs">Asset ID</span>
              <span class="text-foreground font-mono font-semibold">{{ previewPhoto.record.assetId }}</span>
            </div>
            <div class="border-border bg-muted/30 rounded border p-2">
              <span class="text-muted-foreground block text-xs">Facility</span>
              <span class="text-foreground truncate font-medium">{{ previewPhoto.record.buildingBadge }}</span>
            </div>
            <div class="border-border bg-muted/30 rounded border p-2">
              <span class="text-muted-foreground block text-xs">Capture Timestamp</span>
              <span class="text-foreground font-mono font-medium tabular-nums">{{ previewPhoto.photo.time }}</span>
            </div>
            <div class="border-border bg-muted/30 rounded border p-2">
              <span class="text-muted-foreground block text-xs">Cryptographic Seal</span>
              <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400">Valid SHA-256</span>
            </div>
          </div>
        </div>

        <DialogFooter class="flex flex-wrap items-center justify-between gap-2">
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            class="text-xs font-medium"
            @click="showToast('Exporting high-resolution raw image file...')"
          >
            <Download class="mr-1.5 size-3.5" />
            Download Original Photo
          </Button>
          <DialogClose as-child>
            <Button size="sm" class="text-xs">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ================================================================= -->
    <!-- COMPREHENSIVE AUDIT REPORT MODAL DIALOG                           -->
    <!-- ================================================================= -->
    <Dialog :open="!!selectedAudit" @update:open="(val: boolean) => !val && (selectedAudit = null)">
      <DialogContent v-if="selectedAudit" class="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div class="flex flex-wrap items-center justify-between gap-2 pr-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <Badge variant="outline" class="font-mono text-xs">
                  {{ selectedAudit.assetId }}
                </Badge>
                <Badge
                  :variant="
                    selectedAudit.status === 'critical'
                      ? 'destructive'
                      : selectedAudit.status === 'minor'
                        ? 'warning'
                        : 'outline'
                  "
                  :class="[
                    'font-mono text-xs font-semibold',
                    selectedAudit.status === 'passed' &&
                      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                  ]"
                >
                  {{ selectedAudit.statusLabel }}
                </Badge>
              </div>
              <DialogTitle class="text-lg font-bold sm:text-xl">
                {{ selectedAudit.assetName }}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription class="text-xs">
            Commercial facility asset engineering inspection audit record · {{ selectedAudit.category }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 py-2">
          <!-- Key Meta Strip -->
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Facility Location</span>
              <span class="text-foreground mt-0.5 block text-xs font-semibold">{{ selectedAudit.facility }}</span>
            </div>
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Inspection Time</span>
              <span class="text-foreground mt-0.5 block text-xs font-semibold tabular-nums"
                >{{ selectedAudit.date }} · {{ selectedAudit.time }}</span
              >
            </div>
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">GPS Geostamp</span>
              <span class="text-foreground mt-0.5 block font-mono text-xs font-semibold tabular-nums">{{
                selectedAudit.gps
              }}</span>
              <span class="text-muted-foreground text-xs">Accuracy: {{ selectedAudit.gpsAccuracy }}</span>
            </div>
            <div class="border-border bg-muted/20 rounded-lg border p-3">
              <span class="text-muted-foreground block text-xs font-medium">Audit Duration</span>
              <span class="text-foreground mt-0.5 block text-xs font-semibold tabular-nums">{{
                selectedAudit.duration
              }}</span>
              <span class="text-muted-foreground text-xs">SLA compliant</span>
            </div>
          </div>

          <!-- Critical Defect Callout (if any) -->
          <div
            v-if="selectedAudit.status === 'critical'"
            class="space-y-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-400"
          >
            <div class="flex items-center gap-1.5 font-bold">
              <AlertTriangle class="size-4 text-rose-600 dark:text-rose-400" />
              <span>Critical Deficiencies Flagged · Action Dispatched</span>
            </div>
            <p class="leading-relaxed">{{ selectedAudit.defectSummary }}</p>
            <div class="pt-1 font-mono font-semibold">Active Work Order: {{ selectedAudit.workOrder }}</div>
          </div>

          <!-- Checklist Breakdown Matrix -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-foreground text-xs font-semibold">Pass / Fail Checklist Audit Items</span>
              <span class="text-muted-foreground font-mono text-xs tabular-nums">
                {{ selectedAudit.scorePassed }} / {{ selectedAudit.scoreTotal }} Passed
              </span>
            </div>
            <div class="border-border divide-border divide-y rounded-lg border">
              <div
                v-for="item in selectedAudit.checklist"
                :key="item.id"
                class="flex items-center justify-between p-2.5 text-xs"
              >
                <div class="flex items-center gap-2">
                  <Badge
                    :variant="item.status === 'fail' ? 'destructive' : item.status === 'minor' ? 'warning' : 'outline'"
                    class="h-5 px-1.5 font-mono text-xs uppercase"
                  >
                    {{ item.status }}
                  </Badge>
                  <span class="text-foreground font-medium">{{ item.label }}</span>
                </div>
                <span class="text-muted-foreground font-mono text-xs tabular-nums">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <!-- Photo Evidence Mini Gallery in Modal -->
          <div class="space-y-2">
            <span class="text-foreground text-xs font-semibold">Photographic Evidence Attachments</span>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="photo in selectedAudit.photos"
                :key="photo.id"
                type="button"
                class="border-border hover:border-primary/60 group/p cursor-pointer overflow-hidden rounded-lg border bg-zinc-900 p-2 text-left transition-all"
                @click="handleOpenPhoto(photo, selectedAudit)"
              >
                <div class="relative aspect-[16/10] w-full overflow-hidden rounded bg-black">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <Camera class="size-6 text-zinc-500" />
                  </div>
                </div>
                <div class="text-foreground mt-1.5 truncate text-xs font-semibold">{{ photo.title }}</div>
                <div class="text-muted-foreground font-mono text-xs tabular-nums">{{ photo.time }}</div>
              </button>
            </div>
          </div>

          <!-- Digital Signature & Certification Box -->
          <div class="border-border bg-muted/15 space-y-2 rounded-xl border p-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck class="text-primary size-3.5" />
                Electronic Cryptographic Engineer Sign-off
              </span>
              <span class="text-muted-foreground font-mono text-xs">{{ selectedAudit.inspector.badge }}</span>
            </div>
            <div class="border-border/60 border-b pt-1 pb-3">
              <p class="text-primary text-2xl font-medium tracking-wide italic">
                {{ selectedAudit.inspector.name }}
              </p>
            </div>
            <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span>Signer: {{ selectedAudit.inspector.name }} · {{ selectedAudit.inspector.role }}</span>
              <span>{{ selectedAudit.inspector.signoffHash }}</span>
            </div>
          </div>
        </div>

        <DialogFooter class="flex flex-wrap items-center justify-between gap-2">
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            class="text-xs font-medium"
            @click="handleDownloadPdf(selectedAudit)"
          >
            <Download class="mr-1.5 size-3.5" />
            Download PDF Report
          </Button>
          <DialogClose as-child>
            <Button size="sm" class="text-xs">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ================================================================= -->
    <!-- START NEW INSPECTION MODAL DIALOG                                 -->
    <!-- ================================================================= -->
    <Dialog :open="isNewAuditOpen" @update:open="(val: boolean) => (isNewAuditOpen = val)">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <ClipboardCheck class="text-primary size-5" />
            <DialogTitle class="text-base font-bold"> Start New Site & Asset Inspection Audit </DialogTitle>
          </div>
          <DialogDescription class="text-xs">
            Initiate a field engineering inspection with automatic GPS geostamping and checklist validation.
          </DialogDescription>
        </DialogHeader>

        <div v-if="newAuditSuccess" class="space-y-3 py-8 text-center">
          <div
            class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="size-6" />
          </div>
          <h3 class="text-foreground text-base font-bold">Inspection Audit Logged Successfully</h3>
          <p class="text-muted-foreground mx-auto max-w-sm text-xs">
            Audit has been recorded with GPS geostamp 34.0522°N, 118.2437°W and synced to cloud repository.
          </p>
        </div>

        <div v-else class="space-y-4 py-2">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-semibold">Select Target Asset *</label>
              <Select v-model="newAuditAsset">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AST-HVAC-4091">AST-HVAC-4091 · Chiller Unit #4</SelectItem>
                  <SelectItem value="AST-SOLAR-1082">AST-SOLAR-1082 · Solar Array & Inverters</SelectItem>
                  <SelectItem value="AST-FIRE-8820">AST-FIRE-8820 · Fire Sprinkler System</SelectItem>
                  <SelectItem value="AST-GEN-3304">AST-GEN-3304 · Backup Generator #2</SelectItem>
                  <SelectItem value="AST-STR-0019">AST-STR-0019 · Foundation & Beams</SelectItem>
                  <SelectItem value="AST-ELEV-9012">AST-ELEV-9012 · Passenger Elevator Bank A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-semibold">Facility Location</label>
              <Input v-model="newAuditFacility" class="h-8 text-xs" />
            </div>
          </div>

          <!-- Live GPS Lock Strip -->
          <div class="border-border bg-muted/20 flex items-center justify-between rounded-lg border p-3 text-xs">
            <div class="flex items-center gap-2">
              <MapPin class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span class="text-foreground font-semibold">Live GPS Telemetry Lock</span>
                <span class="text-muted-foreground block font-mono text-xs"
                  >34.0522°N, 118.2437°W · Accuracy ±1.5m</span
                >
              </div>
            </div>
            <Badge
              variant="outline"
              class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
            >
              GPS Locked
            </Badge>
          </div>

          <!-- Photo Evidence Drag & Drop Placeholder -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-semibold">Photographic Evidence</label>
            <div
              class="border-border/80 hover:border-primary/50 bg-card cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors"
              @click="showToast('Mock photo uploaded: asset_evidence_live.jpg')"
            >
              <div class="flex flex-col items-center justify-center gap-1">
                <UploadCloud class="text-primary size-5" />
                <p class="text-foreground text-xs font-medium">Click to upload photo evidence or drag & drop</p>
                <p class="text-muted-foreground text-xs">Supports JPG, PNG up to 15MB with GPS EXIF retention</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-semibold">Inspector Observations & Checklist Notes</label>
            <Input
              v-model="newAuditNotes"
              placeholder="Enter notes, gauge pressures, or deficiency remarks..."
              class="h-8 text-xs"
            />
          </div>
        </div>

        <DialogFooter v-if="!newAuditSuccess" class="flex items-center justify-end gap-2">
          <DialogClose as-child>
            <Button variant="outline" size="sm" class="text-xs">Cancel</Button>
          </DialogClose>
          <Button size="sm" class="gap-1.5 text-xs font-medium" @click="submitNewAudit">
            <ClipboardCheck class="size-3.5" />
            Submit Completed Audit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
