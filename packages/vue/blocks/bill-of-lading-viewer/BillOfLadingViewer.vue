<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  AlertCircle,
  Anchor,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Ship,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ContainerCargoItem {
  id: string
  containerNo: string
  sealNo: string
  containerType: string
  packagesCount: number
  packagesKind: string
  description: string
  hsCode: string
  grossWeightKg: number
  grossWeightLbs: number
  volumeCbm: number
  hazardClass?: string
  temperature?: string
}

export interface ComplianceGate {
  id: string
  name: string
  status: 'passed' | 'warning' | 'pending'
  authority: string
  reference: string
  details: string
}

interface Props {
  class?: HTMLAttributes['class']
  documentTitle?: string
  bolNumber?: string
  carrierName?: string
  scacCode?: string
  bookingReference?: string
  exportReference?: string
  issueDate?: string
  placeOfIssue?: string
  shipperName?: string
  shipperAddress?: string
  shipperContact?: string
  shipperEmail?: string
  shipperEori?: string
  consigneeName?: string
  consigneeAddress?: string
  consigneeContact?: string
  consigneeEmail?: string
  consigneeEori?: string
  notifyPartyName?: string
  notifyPartyAddress?: string
  notifyPartyContact?: string
  notifyPartyEmail?: string
  notifyPartyAttention?: string
  preCarriageBy?: string
  placeOfReceipt?: string
  vesselVoyage?: string
  vesselImo?: string
  vesselFlag?: string
  portOfLoading?: string
  portOfDischarge?: string
  placeOfDelivery?: string
  finalDestination?: string
  freightTerms?: string
  freightPayableAt?: string
  declaredValue?: string
  insuranceCert?: string
  incoterms?: string
  letterOfCredit?: string
  blockchainTxHash?: string
  blockchainBlock?: string
  blockchainNetwork?: string
}

const props = withDefaults(defineProps<Props>(), {
  documentTitle: 'Straight Bill of Lading (Original)',
  bolNumber: '#BOL-2026-894210',
  carrierName: 'Maersk Line A/S',
  scacCode: 'MAEU',
  bookingReference: 'BKG-771920-EU',
  exportReference: 'EXP-2026-0812',
  issueDate: 'August 21, 2026',
  placeOfIssue: 'Shanghai, China',
  shipperName: 'Shenzhen AudioTech Precision Ltd.',
  shipperAddress: 'Building 4, High-Tech Industrial Park, Nanshan District, Shenzhen, Guangdong 518057, China',
  shipperContact: '+86 755 8892 1044',
  shipperEmail: 'export@audiotech-cn.com',
  shipperEori: 'CN-91440300MA5EXP01',
  consigneeName: 'SonicAura Europe B.V.',
  consigneeAddress: 'Keizersgracht 421, 1016 EK Amsterdam, Netherlands',
  consigneeContact: '+31 20 894 3300',
  consigneeEmail: 'import@sonicaura.eu',
  consigneeEori: 'NL864219034 / VAT: NL864219034B01',
  notifyPartyName: 'Rotterdam Intermodal Logistics GmbH',
  notifyPartyAddress: 'Willemskade 18, 3016 DK Rotterdam, Netherlands',
  notifyPartyContact: '+31 10 400 9820',
  notifyPartyEmail: 'clearance@rotterdam-intermodal.com',
  notifyPartyAttention: 'Customs Brokerage Dept. / Desk 4B',
  preCarriageBy: 'Feeder Barge "Yangtze River 12"',
  placeOfReceipt: 'Shenzhen Inland Depot, China (CNSZX)',
  vesselVoyage: 'Ever Given / V.042W',
  vesselImo: 'IMO 9811000',
  vesselFlag: 'Panama (PA)',
  portOfLoading: 'Shanghai Port, China (CNSHA)',
  portOfDischarge: 'Rotterdam Port, Netherlands (NLRTM)',
  placeOfDelivery: 'Duisburg Intermodal Terminal, Germany (DEDUI)',
  finalDestination: 'Duisburg Central DC #4 (DEDUI)',
  freightTerms: 'Prepaid',
  freightPayableAt: 'Shanghai, China',
  declaredValue: '$142,500.00 USD',
  insuranceCert: '#INS-9421-MAR',
  incoterms: 'CIF Rotterdam Port (Incoterms 2020)',
  letterOfCredit: 'LC-BNP-2026-99410-EU (BNP Paribas)',
  blockchainTxHash: '0x71e4d3a8904f84c8a5142d131fba827b5e4c91a2',
  blockchainBlock: '59,182,904',
  blockchainNetwork: 'Polygon Mainnet (Decentralized Cargo Registry)',
})

const emit = defineEmits<{
  (e: 'download-pdf'): void
  (e: 'verify-blockchain'): void
  (e: 'print'): void
}>()

const activeTab = ref<'document' | 'compliance' | 'edi'>('document')
const copiedBol = ref(false)
const copiedEdi = ref(false)
const showVerifyDetails = ref(false)

const cargoItems: ContainerCargoItem[] = [
  {
    id: 'cargo-1',
    containerNo: 'MSKU-948201-4',
    sealNo: 'SL-94021',
    containerType: "40' High Cube (40' HC)",
    packagesCount: 24,
    packagesKind: 'Pallets / 480 Cartons',
    description: 'Consumer Electronics: Pro Audio Studio Headphones, Dynamic Transducers & Wireless DAC Amplifiers',
    hsCode: '8518.30.00',
    grossWeightKg: 4850.0,
    grossWeightLbs: 10692.42,
    volumeCbm: 32.4,
    hazardClass: 'UN3481 Class 9 (Lithium Ion Batteries contained in equipment)',
    temperature: 'Ambient (Dry Van)',
  },
  {
    id: 'cargo-2',
    containerNo: 'MSKU-819034-2',
    sealNo: 'SL-94022',
    containerType: "40' High Cube (40' HC)",
    packagesCount: 16,
    packagesKind: 'Pallets / 320 Cartons',
    description: 'Audio Accessories: Braided MMCX Oxygen-Free Cables, Velour Replacement Earpads & Hard Travel Cases',
    hsCode: '8518.90.80',
    grossWeightKg: 2320.0,
    grossWeightLbs: 5114.72,
    volumeCbm: 18.6,
    hazardClass: 'Non-Hazardous / Standard Cargo',
    temperature: 'Ambient (Dry Van)',
  },
]

const complianceGates: ComplianceGate[] = [
  {
    id: 'gate-1',
    name: 'EU EORI & VAT Identity Verification',
    status: 'passed',
    authority: 'European Customs Agency (VIES / EOS)',
    reference: 'NL864219034',
    details: 'Consignee EORI validated against EU Economic Operators Registry with valid Dutch VAT matching.',
  },
  {
    id: 'gate-2',
    name: 'ICS2 Entry Summary Declaration (ENS)',
    status: 'passed',
    authority: 'EU Customs Import Control System 2',
    reference: 'MRN: 26NL948201083921A',
    details: 'Pre-arrival cargo security manifest filed 24 hours prior to loading in Shanghai (Approved).',
  },
  {
    id: 'gate-3',
    name: 'HS Tariff Classification & Duty Schedule',
    status: 'passed',
    authority: 'TARIC European Customs Database',
    reference: 'HS 8518.30.00 / 8518.90.80',
    details: 'Eligible for 0.0% EU base tariff rate + standard 21.0% Netherlands Import VAT under Article 23.',
  },
  {
    id: 'gate-4',
    name: 'ISO 17712 High-Security Container Seals',
    status: 'passed',
    authority: 'International Maritime Organization (IMO)',
    reference: 'SL-94021 / SL-94022',
    details: 'High-security mechanical bolt seals verified intact at origin terminal container gate-in.',
  },
  {
    id: 'gate-5',
    name: 'IMDG Dangerous Goods UN3481 Compliance',
    status: 'passed',
    authority: 'International Maritime Dangerous Goods (IMDG)',
    reference: 'UN3481 PI966 Sec. II',
    details: 'Lithium-ion cells packed with equipment certified under special provision 188 for under-deck stowage.',
  },
  {
    id: 'gate-6',
    name: 'Global Sanctions & Denied Party Screening',
    status: 'passed',
    authority: 'UN, OFAC & EU Consolidated Sanction Lists',
    reference: 'SCR-2026-99104',
    details: '0 matches identified across all parties (Shipper, Consignee, Notify Party, Carrier vessel).',
  },
]

const totalPackagesCount = computed(() => cargoItems.reduce((acc, item) => acc + item.packagesCount, 0))
const totalGrossWeightKg = computed(() => cargoItems.reduce((acc, item) => acc + item.grossWeightKg, 0))
const totalGrossWeightLbs = computed(() => cargoItems.reduce((acc, item) => acc + item.grossWeightLbs, 0))
const totalVolumeCbm = computed(() => cargoItems.reduce((acc, item) => acc + item.volumeCbm, 0))

function handleCopyBol() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(props.bolNumber)
    copiedBol.value = true
    setTimeout(() => {
      copiedBol.value = false
    }, 2000)
  }
}

function handleCopyEdi() {
  const ediContent = generateEdiText()
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(ediContent)
    copiedEdi.value = true
    setTimeout(() => {
      copiedEdi.value = false
    }, 2000)
  }
}

function handlePrint() {
  emit('print')
  if (typeof window !== 'undefined') {
    window.print()
  }
}

function handleDownloadPdf() {
  emit('download-pdf')
  handlePrint()
}

function toggleBlockchainDetails() {
  showVerifyDetails.value = !showVerifyDetails.value
  emit('verify-blockchain')
}

function generateEdiText(): string {
  return `UNB+UNOA:2+${props.scacCode}:ZZ+SONICAURA:ZZ+260821:1400+0000001'
UNH+1+IFTMIN:D:01B:UN:EAN004'
BGM+705+${props.bolNumber.replace('#', '')}+9'
DTM+137:20260821:102'
NAD+CZ+${props.shipperEori}::9++${props.shipperName}+${props.shipperAddress}+SHENZHEN++518057+CN'
NAD+CN+NL864219034::9++${props.consigneeName}+${props.consigneeAddress}+AMSTERDAM++1016EK+NL'
NAD+NI+++${props.notifyPartyName}+${props.notifyPartyAddress}+ROTTERDAM++3016DK+NL'
TDT+20+V.042W+1+13+MAEU:172:20+++${props.vesselImo}::11:${props.vesselVoyage}'
LOC+9+CNSHA:139:6+SHANGHAI PORT'
LOC+11+NLRTM:139:6+ROTTERDAM PORT'
LOC+7+DEDUI:139:6+DUISBURG TERMINAL'
EQD+CN+MSKU9482014+45G1:102:5++2+5'
SEL+SL94021+SH'
GID+1+24:BX+PRO AUDIO HEADPHONES:85183000'
MEA+WT+G+KGM:4850.00'
MEA+VOL+AAW+MTQ:32.40'
MOA+39:142500:USD'
UNT+18+1'
UNZ+1+0000001'`
}
</script>

<template>
  <div data-slot="bill-of-lading-viewer" :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- Top Action Bar / Document Control Header -->
    <div
      class="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <Badge wrap variant="outline" class="font-mono text-xs tracking-wider uppercase">
            {{ props.scacCode }} &bull; Maritime Ocean BOL
          </Badge>
          <button
            type="button"
            class="group focus-visible:ring-ring inline-flex min-h-6 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:outline-none dark:text-emerald-400"
            @click="toggleBlockchainDetails"
          >
            <ShieldCheck class="size-3.5" aria-hidden="true" />
            <span>Verify Blockchain Authenticity</span>
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <h1 class="text-xl font-bold tracking-tight sm:text-2xl">{{ props.documentTitle }}</h1>
          <span class="text-muted-foreground font-mono text-base font-semibold tabular-nums">{{
            props.bolNumber
          }}</span>
          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-7"
            title="Copy BOL number"
            @click="handleCopyBol"
          >
            <Check v-if="copiedBol" class="size-3.5 text-emerald-500" />
            <Copy v-else class="size-3.5" />
            <span class="sr-only">Copy BOL number</span>
          </Button>
        </div>
        <p class="text-muted-foreground text-xs">
          Carrier: <strong class="text-foreground font-medium">{{ props.carrierName }}</strong> &bull; Issued:
          {{ props.issueDate }} in {{ props.placeOfIssue }}
        </p>
      </div>

      <!-- Action Buttons & Tab Switcher -->
      <div class="flex flex-wrap items-center gap-2 sm:self-center">
        <div class="border-border bg-muted/40 flex items-center rounded-lg border p-1">
          <button
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                activeTab === 'document'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="activeTab = 'document'"
          >
            Document View
          </button>
          <button
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                activeTab === 'compliance'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="activeTab = 'compliance'"
          >
            <span>Customs &amp; Compliance</span>
            <Badge wrap variant="success" class="size-4 justify-center p-0 text-center font-mono text-xs leading-4"
              >6</Badge
            >
          </button>
          <button
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                activeTab === 'edi'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="activeTab = 'edi'"
          >
            Raw EDI / JSON
          </button>
        </div>

        <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="handlePrint">
          <Printer class="size-3.5" aria-hidden="true" />
          <span>Print</span>
        </Button>

        <Button aria-label="Download attachment" size="sm" class="gap-1.5 text-xs" @click="handleDownloadPdf">
          <Download class="size-3.5" aria-hidden="true" />
          <span>Download Printable BOL</span>
        </Button>
      </div>
    </div>

    <!-- Blockchain Cryptographic Proof Drawer / Card -->
    <div
      v-if="showVerifyDetails"
      class="animate-in fade-in slide-in-from-top-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs transition-all"
    >
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-3">
          <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck class="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-foreground font-semibold">Cryptographic Bill of Lading Authenticity Verified</span>
              <Badge wrap variant="success" class="text-xs">Immutable Ledger Record</Badge>
            </div>
            <p class="text-muted-foreground">
              Document state verified on {{ props.blockchainNetwork }}. Digital hash matches original carrier signature
              at origin.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span class="bg-background/80 border-border text-foreground rounded border px-2 py-1"
            >Block #{{ props.blockchainBlock }}</span
          >
          <span
            class="bg-background/80 border-border text-foreground max-w-xs truncate rounded border px-2 py-1"
            :title="props.blockchainTxHash"
          >
            Tx: {{ props.blockchainTxHash }}
          </span>
        </div>
      </div>
    </div>

    <!-- TAB 1: OFFICIAL BILL OF LADING PAPER DOCUMENT -->
    <div
      v-if="activeTab === 'document'"
      class="border-border bg-card overflow-hidden rounded-xl border shadow-xs print:border-none print:shadow-none"
    >
      <!-- Formal Document Header -->
      <div class="border-border bg-muted/20 border-b p-6 sm:p-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <!-- Carrier Branding & Document Classification -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div
                class="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg shadow-xs"
              >
                <Anchor class="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 class="text-lg font-semibold tracking-tight sm:text-xl">{{ props.carrierName }}</h2>
                <p class="text-muted-foreground font-mono text-xs">
                  SCAC: {{ props.scacCode }} &bull; Standard Ocean Carrier Bill of Lading
                </p>
              </div>
            </div>
            <p class="text-muted-foreground max-w-xl text-xs leading-relaxed">
              Issued in accordance with the International Convention for the Unification of Certain Rules of Law
              relating to Bills of Lading (Hague-Visby Rules) and UN Multimodal Transport Guidelines.
            </p>
          </div>

          <!-- Document References & Status Stamp -->
          <div class="border-border bg-background/80 flex flex-col gap-2 rounded-lg border p-4 sm:min-w-[280px]">
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground text-xs font-medium">Bill of Lading No.</span>
              <span class="text-primary font-mono text-sm font-semibold tabular-nums">{{ props.bolNumber }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground text-xs">Booking Reference:</span>
              <span class="font-mono text-xs font-semibold tabular-nums">{{ props.bookingReference }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground text-xs">Export Reference:</span>
              <span class="font-mono text-xs tabular-nums">{{ props.exportReference }}</span>
            </div>
            <Separator class="my-1" />
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground text-xs">Document Status:</span>
              <Badge wrap variant="default" class="text-xs font-medium">Negotiable / Original</Badge>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 1: Parties Grid (Shipper, Consignee, Notify Party) -->
      <div
        class="divide-border border-border grid grid-cols-1 divide-y border-b md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        <!-- Shipper / Exporter -->
        <div class="bg-card space-y-3 p-5 sm:p-6">
          <div class="flex items-center justify-between">
            <span class="text-primary font-mono text-xs font-semibold">1. Shipper / Exporter</span>
            <Building2 class="text-muted-foreground size-4" aria-hidden="true" />
          </div>
          <div class="space-y-1.5 text-xs">
            <p class="text-foreground text-sm font-semibold">{{ props.shipperName }}</p>
            <p class="text-muted-foreground leading-relaxed">{{ props.shipperAddress }}</p>
            <div class="text-muted-foreground space-y-1 pt-2">
              <p class="flex items-center gap-1.5">
                <Phone class="text-muted-foreground size-3 shrink-0" />
                <span class="tabular-nums">{{ props.shipperContact }}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <Mail class="text-muted-foreground size-3 shrink-0" />
                <span>{{ props.shipperEmail }}</span>
              </p>
              <p class="text-foreground pt-1 font-mono">
                <span class="text-muted-foreground">EORI / Tax ID:</span> {{ props.shipperEori }}
              </p>
            </div>
          </div>
        </div>

        <!-- Consignee / Importer -->
        <div class="bg-card space-y-3 p-5 sm:p-6">
          <div class="flex items-center justify-between">
            <span class="text-primary font-mono text-xs font-semibold">2. Consignee / Importer</span>
            <MapPin class="text-muted-foreground size-4" aria-hidden="true" />
          </div>
          <div class="space-y-1.5 text-xs">
            <p class="text-foreground text-sm font-semibold">{{ props.consigneeName }}</p>
            <p class="text-muted-foreground leading-relaxed">{{ props.consigneeAddress }}</p>
            <div class="text-muted-foreground space-y-1 pt-2">
              <p class="flex items-center gap-1.5">
                <Phone class="text-muted-foreground size-3 shrink-0" />
                <span class="tabular-nums">{{ props.consigneeContact }}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <Mail class="text-muted-foreground size-3 shrink-0" />
                <span>{{ props.consigneeEmail }}</span>
              </p>
              <p class="text-foreground pt-1 font-mono">
                <span class="text-muted-foreground">EORI / VAT:</span> {{ props.consigneeEori }}
              </p>
            </div>
          </div>
        </div>

        <!-- Notify Party -->
        <div class="bg-card space-y-3 p-5 sm:p-6">
          <div class="flex items-center justify-between">
            <span class="text-primary font-mono text-xs font-semibold">3. Notify Party</span>
            <FileText class="text-muted-foreground size-4" aria-hidden="true" />
          </div>
          <div class="space-y-1.5 text-xs">
            <p class="text-foreground text-sm font-semibold">{{ props.notifyPartyName }}</p>
            <p class="text-muted-foreground leading-relaxed">{{ props.notifyPartyAddress }}</p>
            <div class="text-muted-foreground space-y-1 pt-2">
              <p class="flex items-center gap-1.5">
                <Phone class="text-muted-foreground size-3 shrink-0" />
                <span class="tabular-nums">{{ props.notifyPartyContact }}</span>
              </p>
              <p class="flex items-center gap-1.5">
                <Mail class="text-muted-foreground size-3 shrink-0" />
                <span>{{ props.notifyPartyEmail }}</span>
              </p>
              <p class="text-foreground pt-1 font-medium">
                <span class="text-muted-foreground">Attention:</span> {{ props.notifyPartyAttention }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Transport & Routing Details Grid -->
      <div class="border-border bg-muted/10 border-b p-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
            <span class="text-muted-foreground text-xs font-medium">Pre-Carriage By</span>
            <p class="text-foreground text-xs font-semibold">{{ props.preCarriageBy }}</p>
            <span class="text-muted-foreground text-xs">Receipt: {{ props.placeOfReceipt }}</span>
          </div>

          <div class="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
            <span class="text-muted-foreground text-xs font-medium">Ocean Vessel &amp; Voyage</span>
            <p class="text-foreground flex items-center gap-1.5 text-xs font-semibold">
              <Ship class="text-primary size-3.5 shrink-0" />
              <span>{{ props.vesselVoyage }}</span>
            </p>
            <span class="text-muted-foreground font-mono text-xs"
              >{{ props.vesselImo }} &bull; {{ props.vesselFlag }}</span
            >
          </div>

          <div class="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
            <span class="text-muted-foreground text-xs font-medium">Port of Loading (POL)</span>
            <p class="text-foreground text-xs font-semibold">{{ props.portOfLoading }}</p>
            <span class="text-muted-foreground text-xs">Departure: Aug 23, 2026</span>
          </div>

          <div class="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
            <span class="text-muted-foreground text-xs font-medium">Port of Discharge (POD)</span>
            <p class="text-foreground text-xs font-semibold">{{ props.portOfDischarge }}</p>
            <span class="text-muted-foreground text-xs">Delivery: {{ props.placeOfDelivery }}</span>
          </div>
        </div>
      </div>

      <!-- Section 3: Container & Cargo Manifest Table -->
      <div class="space-y-4 p-5 sm:p-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-foreground text-sm font-semibold">Container &amp; Cargo Description</h3>
            <p class="text-muted-foreground text-xs">
              Itemized manifest of goods, seal identification, Harmonized Tariff codes, and gross weight
            </p>
          </div>
          <Badge wrap variant="outline" class="w-fit font-mono text-xs">FCL / FCL &bull; CY-CY Movement</Badge>
        </div>

        <div class="border-border overflow-hidden rounded-lg border">
          <div class="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow>
                  <TableHead class="text-xs">Container No. &amp; Seal No.</TableHead>
                  <TableHead class="text-xs">Packages &amp; Kind</TableHead>
                  <TableHead class="text-xs">Description of Goods</TableHead>
                  <TableHead class="text-xs">HS Tariff Code</TableHead>
                  <TableHead class="text-right text-xs">Gross Wt (kg)</TableHead>
                  <TableHead class="text-right text-xs">Volume (CBM)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in cargoItems" :key="item.id">
                  <TableCell class="align-top">
                    <div class="text-foreground font-mono text-xs font-semibold">{{ item.containerNo }}</div>
                    <div class="text-muted-foreground font-mono text-xs">Seal: {{ item.sealNo }}</div>
                    <Badge wrap variant="secondary" class="mt-1 text-xs font-normal">{{ item.containerType }}</Badge>
                  </TableCell>
                  <TableCell class="align-top">
                    <div class="text-foreground text-xs font-medium tabular-nums">{{ item.packagesCount }} Pallets</div>
                    <div class="text-muted-foreground text-xs">{{ item.packagesKind }}</div>
                  </TableCell>
                  <TableCell class="max-w-md align-top">
                    <div class="text-foreground text-xs leading-relaxed font-medium">{{ item.description }}</div>
                    <div
                      v-if="item.hazardClass"
                      class="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"
                    >
                      <AlertCircle class="size-3 shrink-0" />
                      <span>{{ item.hazardClass }}</span>
                    </div>
                  </TableCell>
                  <TableCell class="text-foreground align-top font-mono text-xs tabular-nums">
                    {{ item.hsCode }}
                  </TableCell>
                  <TableCell class="text-foreground text-right align-top font-mono text-xs font-semibold tabular-nums">
                    {{ item.grossWeightKg.toLocaleString('en-US', { minimumFractionDigits: 2 }) }} kg
                    <div class="text-muted-foreground font-normal">
                      {{ item.grossWeightLbs.toLocaleString('en-US', { minimumFractionDigits: 1 }) }} lbs
                    </div>
                  </TableCell>
                  <TableCell class="text-foreground text-right align-top font-mono text-xs tabular-nums">
                    {{ item.volumeCbm.toFixed(2) }} m³
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colspan="2" class="text-xs font-semibold">
                    Totals: {{ cargoItems.length }} Containers &bull; {{ totalPackagesCount }} Pallets
                  </TableCell>
                  <TableCell colspan="2" class="text-muted-foreground text-xs">
                    Dangerous Goods Stowage Declared &bull; Certified Dry Van
                  </TableCell>
                  <TableCell class="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                    {{ totalGrossWeightKg.toLocaleString('en-US', { minimumFractionDigits: 2 }) }} kg
                  </TableCell>
                  <TableCell class="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                    {{ totalVolumeCbm.toFixed(2) }} m³
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>

      <!-- Section 4: Freight Charges & Commercial Terms -->
      <div
        class="divide-border border-border grid grid-cols-1 divide-y border-t sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
      >
        <div class="bg-muted/10 space-y-1.5 p-5">
          <span class="text-muted-foreground text-xs font-medium">Freight &amp; Charges</span>
          <div class="flex items-center gap-2">
            <Badge wrap variant="default" class="text-xs font-medium tracking-wide uppercase">{{
              props.freightTerms
            }}</Badge>
          </div>
          <p class="text-muted-foreground pt-1 text-xs">
            Payable at: <strong class="text-foreground">{{ props.freightPayableAt }}</strong>
          </p>
        </div>

        <div class="bg-muted/10 space-y-1.5 p-5">
          <span class="text-muted-foreground text-xs font-medium">Declared Value (Customs)</span>
          <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ props.declaredValue }}</p>
          <p class="text-muted-foreground text-xs">Commercial Invoice #INV-2026-8942</p>
        </div>

        <div class="bg-muted/10 space-y-1.5 p-5">
          <span class="text-muted-foreground text-xs font-medium">Marine Cargo Insurance</span>
          <p class="text-foreground font-mono text-xs font-semibold">{{ props.insuranceCert }}</p>
          <p class="text-muted-foreground text-xs">Institute Cargo Clauses (A) All Risks</p>
        </div>

        <div class="bg-muted/10 space-y-1.5 p-5">
          <span class="text-muted-foreground text-xs font-medium">Incoterms &amp; Letter of Credit</span>
          <p class="text-foreground text-xs font-semibold">{{ props.incoterms }}</p>
          <p class="text-muted-foreground truncate font-mono text-xs" :title="props.letterOfCredit">
            {{ props.letterOfCredit }}
          </p>
        </div>
      </div>

      <!-- Section 5: Carrier Signature & Authorization Stamp -->
      <div class="border-border bg-card border-t p-6 sm:p-8">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
          <!-- Left: Carrier Certification Notice -->
          <div class="space-y-2 md:col-span-6">
            <span class="text-primary text-xs font-semibold">Carrier Authorization &amp; Endorsement</span>
            <p class="text-muted-foreground text-xs leading-relaxed">
              IN WITNESS whereof the carrier, through its authorized master or port agent, has signed three (3) original
              Bills of Lading, one of which being accomplished, the others to stand void.
            </p>
            <div class="text-muted-foreground flex flex-col gap-1 pt-2 font-mono text-xs">
              <p>
                <span class="text-foreground font-semibold">Authorized Agent:</span> Capt. H. van der Meer (Master /
                Port Agent)
              </p>
              <p>
                <span class="text-foreground font-semibold">Digital Signature SHA-256:</span>
                9b2d8fe14157a3e8...c72194b0
              </p>
              <p>
                <span class="text-foreground font-semibold">Issued:</span> {{ props.issueDate }} at Port of Shanghai,
                China
              </p>
            </div>
          </div>

          <!-- Center: Official Maritime Carrier Stamp -->
          <div class="flex justify-center md:col-span-3">
            <div
              class="border-primary/40 bg-primary/5 text-primary rotate-[-2deg] rounded-lg border-2 border-dashed p-4 text-center font-mono text-xs tracking-widest uppercase shadow-xs"
            >
              <div class="mb-1 flex justify-center">
                <Ship class="text-primary size-6" />
              </div>
              <div class="text-sm font-semibold tracking-tight">MAERSK LINE A/S</div>
              <div class="text-muted-foreground text-xs font-semibold">PORT OF SHANGHAI AGENCY</div>
              <div
                class="border-primary/30 mt-1 border-t pt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                OFFICIALLY ENDORSED
              </div>
            </div>
          </div>

          <!-- Right: Interactive QR Code Verification -->
          <div
            class="border-border bg-muted/20 flex flex-col items-center justify-center rounded-lg border p-4 text-center md:col-span-3"
          >
            <svg
              viewBox="0 0 100 100"
              class="text-foreground size-20 shrink-0"
              fill="currentColor"
              aria-label="QR Code"
            >
              <!-- Top-left finder pattern -->
              <rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="4" />
              <rect x="10" y="10" width="12" height="12" rx="1.5" />
              <!-- Top-right finder pattern -->
              <rect x="70" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="4" />
              <rect x="78" y="10" width="12" height="12" rx="1.5" />
              <!-- Bottom-left finder pattern -->
              <rect x="2" y="70" width="28" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="4" />
              <rect x="10" y="78" width="12" height="12" rx="1.5" />
              <!-- QR data matrix dots -->
              <rect x="36" y="6" width="6" height="6" rx="1" />
              <rect x="48" y="6" width="6" height="6" rx="1" />
              <rect x="58" y="6" width="6" height="6" rx="1" />
              <rect x="6" y="36" width="6" height="6" rx="1" />
              <rect x="18" y="36" width="6" height="6" rx="1" />
              <rect x="36" y="36" width="6" height="6" rx="1" />
              <rect x="48" y="36" width="6" height="6" rx="1" />
              <rect x="58" y="36" width="6" height="6" rx="1" />
              <rect x="74" y="36" width="6" height="6" rx="1" />
              <rect x="86" y="36" width="6" height="6" rx="1" />
              <rect x="36" y="48" width="6" height="6" rx="1" />
              <rect x="48" y="48" width="6" height="6" rx="1" />
              <rect x="58" y="48" width="6" height="6" rx="1" />
              <rect x="36" y="60" width="6" height="6" rx="1" />
              <rect x="48" y="60" width="6" height="6" rx="1" />
              <rect x="58" y="60" width="6" height="6" rx="1" />
              <rect x="36" y="76" width="6" height="6" rx="1" />
              <rect x="48" y="76" width="6" height="6" rx="1" />
              <rect x="58" y="76" width="6" height="6" rx="1" />
              <rect x="74" y="76" width="6" height="6" rx="1" />
              <rect x="86" y="76" width="6" height="6" rx="1" />
              <rect x="74" y="86" width="6" height="6" rx="1" />
              <rect x="86" y="86" width="6" height="6" rx="1" />
            </svg>
            <span class="text-foreground mt-2 font-mono text-xs font-medium">Scan for Port Customs e-Verification</span>
            <span class="text-muted-foreground text-xs">UIPKGE Trust Protocol</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: CUSTOMS & COMPLIANCE INSPECTOR -->
    <div v-else-if="activeTab === 'compliance'" class="space-y-6">
      <!-- Compliance Health Score Banner -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card class="border-border bg-card">
          <CardHeader class="p-4 pb-2">
            <CardDescription class="text-xs">Customs Risk Assessment</CardDescription>
            <div class="flex items-baseline gap-2">
              <CardTitle class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99 / 100</CardTitle>
              <Badge wrap variant="success" class="text-xs">Low Risk</Badge>
            </div>
          </CardHeader>
          <CardContent class="text-muted-foreground p-4 pt-1 text-xs">
            Green channel clearance granted for Rotterdam entry. Pre-arrival ICS2 security declaration verified.
          </CardContent>
        </Card>

        <Card class="border-border bg-card">
          <CardHeader class="p-4 pb-2">
            <CardDescription class="text-xs">Import Duties &amp; VAT Estimation</CardDescription>
            <div class="flex items-baseline gap-2">
              <CardTitle class="text-foreground font-mono text-2xl font-bold">$29,925.00</CardTitle>
              <Badge wrap variant="outline" class="font-mono text-xs">EUR 27,665</Badge>
            </div>
          </CardHeader>
          <CardContent class="text-muted-foreground p-4 pt-1 text-xs">
            0% Base Duty (TARIC 8518.30.00) + 21.0% Netherlands Import VAT under Article 23 reverse-charge mechanism.
          </CardContent>
        </Card>

        <Card class="border-border bg-card">
          <CardHeader class="p-4 pb-2">
            <CardDescription class="text-xs">Container Seal Audit</CardDescription>
            <div class="flex items-baseline gap-2">
              <CardTitle class="text-foreground text-2xl font-bold">2 / 2 Valid</CardTitle>
              <Badge wrap variant="success" class="text-xs">ISO 17712 Compliant</Badge>
            </div>
          </CardHeader>
          <CardContent class="text-muted-foreground p-4 pt-1 text-xs">
            Bolt seals SL-94021 &amp; SL-94022 confirmed tamper-free at origin gate inspection.
          </CardContent>
        </Card>
      </div>

      <!-- Compliance Verification Checklist Grid -->
      <Card class="border-border bg-card">
        <CardHeader class="p-5 pb-3">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold">Customs Compliance &amp; Regulatory Audit Checklist</CardTitle>
              <CardDescription class="text-xs"
                >International trade compliance checks required for European Union port entry and inland
                transit</CardDescription
              >
            </div>
            <Badge wrap variant="success" class="gap-1 text-xs">
              <CheckCircle2 class="size-3.5" />
              <span>All 6 Gates Passed</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3 p-5 pt-0">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div
              v-for="gate in complianceGates"
              :key="gate.id"
              class="border-border bg-muted/20 flex items-start gap-3 rounded-lg border p-3.5 shadow-xs"
            >
              <div class="mt-0.5 shrink-0 rounded-full bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 class="size-4" aria-hidden="true" />
              </div>
              <div class="space-y-1 text-xs">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-foreground font-semibold">{{ gate.name }}</span>
                  <span class="text-muted-foreground font-mono text-xs font-medium">{{ gate.reference }}</span>
                </div>
                <p class="text-muted-foreground leading-relaxed">{{ gate.details }}</p>
                <span class="text-primary block text-xs font-medium">Authority: {{ gate.authority }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- TAB 3: ELECTRONIC DATA INTERCHANGE (EDI) / JSON MANIFEST -->
    <div v-else-if="activeTab === 'edi'" class="space-y-4">
      <Card class="border-border bg-card">
        <CardHeader class="p-5 pb-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle class="text-base font-semibold">Electronic Data Interchange (UN/EDIFACT IFTMIN)</CardTitle>
              <CardDescription class="text-xs"
                >Standardized electronic consignment instructions formatted per UN/EDIFACT D.01B maritime transport
                standards</CardDescription
              >
            </div>
            <Button variant="outline" size="sm" class="gap-1.5 self-start text-xs sm:self-auto" @click="handleCopyEdi">
              <Check v-if="copiedEdi" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
              <span>{{ copiedEdi ? 'Copied EDI Payload' : 'Copy EDI Payload' }}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="p-5 pt-0">
          <pre
            class="border-border bg-muted/40 text-foreground overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed select-all"
            >{{ generateEdiText() }}</pre
          >
        </CardContent>
      </Card>
    </div>
  </div>
</template>
