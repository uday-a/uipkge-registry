<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Barcode,
  Check,
  Copy,
  Download,
  FileCode2,
  Package,
  Printer,
  RefreshCw,
  Scale,
  ShieldCheck,
  Truck,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export type CarrierId = 'fedex' | 'ups' | 'usps' | 'dhl'

export interface CarrierOption {
  id: CarrierId
  name: string
  code: string
  serviceBanner: string
  rate: number
  transitDays: string
  badge: string
  badgeVariant: 'default' | 'secondary' | 'outline' | 'success'
  trackingNumber: string
  barcodeString: string
  routingZip: string
  routingZone: string
  hubCode: string
}

interface Props {
  class?: HTMLAttributes['class']
  initialOrderRef?: string
  initialCarrier?: CarrierId
}

const props = withDefaults(defineProps<Props>(), {
  initialOrderRef: '#ORD-92841',
  initialCarrier: 'fedex',
})

const emit = defineEmits<{
  (e: 'print'): void
  (e: 'download-zpl', zpl: string): void
}>()

const CARRIERS: Record<CarrierId, CarrierOption> = {
  fedex: {
    id: 'fedex',
    name: 'FedEx Express Priority',
    code: 'FEDEX',
    serviceBanner: 'FEDEX 2DAY AIR · DELIVER BY 10:30 AM',
    rate: 24.5,
    transitDays: 'Next Business Day (10:30 AM)',
    badge: 'Fastest',
    badgeVariant: 'default',
    trackingNumber: '#TRK-9284-1029-4810-US',
    barcodeString: '*4209110192841029481029*',
    routingZip: 'PRIORITY 91101',
    routingZone: 'ZONE 8 · ROUTE W-04',
    hubCode: 'MEM (Memphis SuperHub)',
  },
  ups: {
    id: 'ups',
    name: 'UPS Ground',
    code: 'UPS',
    serviceBanner: 'UPS GROUND · GUARANTEED TRACKED',
    rate: 11.2,
    transitDays: '2-3 Business Days',
    badge: 'Best Value',
    badgeVariant: 'secondary',
    trackingNumber: '#1Z-9999-9992-8410-2948',
    barcodeString: '*420911011Z99999992841029*',
    routingZip: 'GROUND 91101',
    routingZone: 'ZONE 4 · ROUTE CA-08',
    hubCode: 'ONT (Ontario West Hub)',
  },
  usps: {
    id: 'usps',
    name: 'USPS Priority Mail',
    code: 'USPS',
    serviceBanner: 'USPS PRIORITY MAIL 2-DAY · COMMERCIAL BASE',
    rate: 9.85,
    transitDays: '1-3 Business Days',
    badge: 'Standard',
    badgeVariant: 'outline',
    trackingNumber: '#9400-1118-9922-3849-1029',
    barcodeString: '*4209110194001118992238*',
    routingZip: 'PRIORITY 91101',
    routingZone: 'ZONE 8 · ROUTE P-12',
    hubCode: 'LAX (Los Angeles P&DC)',
  },
  dhl: {
    id: 'dhl',
    name: 'DHL Express',
    code: 'DHL',
    serviceBanner: 'DHL EXPRESS WORLDWIDE · TIME DEFINITE',
    rate: 38.0,
    transitDays: 'Next Day by End of Day',
    badge: 'Express Air',
    badgeVariant: 'default',
    trackingNumber: '#DHL-92841-102948-US',
    barcodeString: '*42091101DHL9284102948*',
    routingZip: 'EXPRESS 91101',
    routingZone: 'ZONE INTL · GATEWAY LAX',
    hubCode: 'CVG (Cincinnati Hub)',
  },
}

const selectedCarrier = ref<CarrierId>(props.initialCarrier)
const weightLbs = ref(4)
const weightOz = ref(8)
const dimLength = ref(14)
const dimWidth = ref(10)
const dimHeight = ref(6)
const requireSignature = ref(true)
const declaredValue = ref('300.00')
const includeInsurance = ref(true)

const isScaleSyncing = ref(false)
const copiedOrder = ref(false)
const copiedTracking = ref(false)
const copiedZpl = ref(false)
const isPrinted = ref(false)

const activeCarrier = computed(() => CARRIERS[selectedCarrier.value] || CARRIERS.fedex)
const signatureFee = computed(() => (requireSignature.value ? 5.5 : 0))
const insuranceFee = computed(() => (includeInsurance.value ? 3.2 : 0))
const totalShippingCost = computed(() => activeCarrier.value.rate + signatureFee.value + insuranceFee.value)
const dimWeightLbs = computed(() => ((dimLength.value * dimWidth.value * dimHeight.value) / 139).toFixed(2))

function generateZplCode(): string {
  const c = activeCarrier.value
  return `^XA
^FO50,30^A0N,40,40^FD${c.code}^FS
^FO220,30^A0N,22,22^FDWT: ${weightLbs.value} LBS ${weightOz.value} OZ^FS
^FO220,60^A0N,22,22^FDDIM: ${dimLength.value}x${dimWidth.value}x${dimHeight.value} IN^FS
^FO50,95^GB700,3,3^FS
^FO50,110^A0N,26,26^FD${c.serviceBanner}^FS
^FO50,150^GB700,3,3^FS
^FO50,165^A0N,20,20^FDSHIP FROM:^FS
^FO50,190^A0N,20,20^FDACME LOGISTICS FULFILLMENT DC #4^FS
^FO50,215^A0N,20,20^FD100 ENTERPRISE WAY, SUITE 200^FS
^FO50,240^A0N,20,20^FDNEWARK NJ 07102-4100^FS
^FO50,270^GB700,3,3^FS
^FO50,285^A0N,22,22^FDSHIP TO:^FS
^FO50,315^A0N,26,26^FDALEXANDRA CHEN  (555) 019-2831^FS
^FO50,345^A0N,26,26^FD742 EVERGREEN TERRACE, APT 4B^FS
^FO50,375^A0N,26,26^FDPASADENA CA 91101-2104^FS
^FO50,415^GB700,70,4^FS
^FO70,435^A0N,40,40^FD${c.routingZip}^FS
^FO50,500^GB700,3,3^FS
${requireSignature.value ? '^FO50,515^A0N,22,22^FD*** DIRECT SIGNATURE REQUIRED UPON DELIVERY ***^FS\n^FO50,545^GB700,3,3^FS\n' : ''}
^FO100,570^BY3,3,90^BCN,90,Y,N,N^FD>${c.barcodeString}^FS
^FO50,710^A0N,28,28^FDTRACKING: ${c.trackingNumber}^FS
^FO50,760^GB700,2,2^FS
^FO50,775^A0N,18,18^FDELECTRONIC POSTAGE PAID - ZPL II 203 DPI - 1 OF 1^FS
^XZ`
}

function handlePrint() {
  emit('print')
  isPrinted.value = true
  setTimeout(() => {
    isPrinted.value = false
  }, 3000)
  if (typeof window !== 'undefined') {
    window.print()
  }
}

function handleDownloadZpl() {
  const zpl = generateZplCode()
  emit('download-zpl', zpl)
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(zpl)
  }
  copiedZpl.value = true
  setTimeout(() => {
    copiedZpl.value = false
  }, 2500)
}

function handleSyncScale() {
  isScaleSyncing.value = true
  setTimeout(() => {
    weightLbs.value = 4
    weightOz.value = 8
    isScaleSyncing.value = false
  }, 600)
}

function copyOrderRef() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(props.initialOrderRef)
    copiedOrder.value = true
    setTimeout(() => {
      copiedOrder.value = false
    }, 2000)
  }
}

function copyTracking() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(activeCarrier.value.trackingNumber)
    copiedTracking.value = true
    setTimeout(() => {
      copiedTracking.value = false
    }, 2000)
  }
}
</script>

<template>
  <div data-slot="shipping-label-printer" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Control Bar -->
    <div
      class="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <Badge variant="outline" class="gap-1.5 font-mono text-xs">
            <Truck class="text-primary size-3.5" aria-hidden="true" />
            Dispatch Station #04
          </Badge>
          <div
            class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            <span class="relative flex size-1.5">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span class="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Zebra ZD421 Ready · 203 DPI
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-1">
          <h1 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            Shipping Label Creation &amp; Dispatch
          </h1>
          <button
            type="button"
            class="hover:bg-muted focus-visible:ring-ring border-border bg-muted/40 text-foreground inline-flex min-h-6 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            title="Click to copy order reference"
            @click="copyOrderRef"
          >
            {{ props.initialOrderRef }}
            <Check v-if="copiedOrder" class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <Copy v-else class="text-muted-foreground size-3" aria-hidden="true" />
          </button>
        </div>
        <p class="text-muted-foreground text-xs">
          Multi-carrier rate rating, automated scale synchronization, and instant 4×6 thermal direct label generation.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 sm:self-center">
        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="gap-1.5 text-xs shadow-xs"
          @click="handleDownloadZpl"
        >
          <Check v-if="copiedZpl" class="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <Download v-else class="size-3.5" aria-hidden="true" />
          <span>{{ copiedZpl ? 'Copied ZPL II' : 'Download ZPL / PDF' }}</span>
        </Button>

        <Button size="sm" class="gap-1.5 text-xs shadow-xs" @click="handlePrint">
          <Printer class="size-3.5" aria-hidden="true" />
          <span>{{ isPrinted ? 'Sending to Thermal...' : 'Print 4x6 Thermal Label' }}</span>
        </Button>
      </div>
    </div>

    <!-- 2-Column Shipping Station Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Carrier & Package Inputs (7 cols on lg) -->
      <div class="space-y-6 lg:col-span-7">
        <!-- 1. Carrier Selector Radio Cards -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Truck class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Carrier &amp; Service Rate Selection</CardTitle>
              </div>
              <Badge variant="outline" class="font-mono text-xs">Live API Rates</Badge>
            </div>
            <CardDescription>
              Select optimal carrier routing based on transit time guarantee and negotiated rates
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3">
            <RadioGroup v-model="selectedCarrier" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                v-for="carrier in Object.values(CARRIERS)"
                :key="carrier.id"
                :class="
                  cn(
                    'relative flex cursor-pointer flex-col justify-between rounded-lg border p-3.5 transition-all',
                    selectedCarrier === carrier.id
                      ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                      : 'border-border bg-card hover:bg-muted/40',
                  )
                "
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <RadioGroupItem :id="carrier.id" :value="carrier.id" class="mt-0.5" />
                    <div>
                      <div class="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                        {{ carrier.name }}
                      </div>
                      <p class="text-muted-foreground text-xs">{{ carrier.transitDays }}</p>
                    </div>
                  </div>
                  <Badge :variant="carrier.badgeVariant" class="font-mono text-xs">
                    {{ carrier.badge }}
                  </Badge>
                </div>

                <div class="border-border/60 mt-3 flex items-center justify-between border-t pt-2">
                  <span class="text-muted-foreground font-mono text-xs">{{ carrier.code }} Commercial Rate</span>
                  <span class="text-foreground font-mono text-sm font-semibold tabular-nums">
                    ${{ carrier.rate.toFixed(2) }}
                  </span>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
        </Card>

        <!-- 2. Package Weight & Scale Sync -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Scale class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Package Weight &amp; Digital Scale</CardTitle>
              </div>
              <Badge variant="outline" class="font-mono text-xs">USB COM3</Badge>
            </div>
            <CardDescription>
              Live gross weight measurement captured via certified USB benchtop parcel scale
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Scale Telemetry Banner -->
            <div
              class="border-border bg-muted/20 flex flex-col gap-2.5 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-2.5">
                <div class="rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <Scale class="size-4 shrink-0" aria-hidden="true" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground text-xs font-semibold">Fairbanks SC-200 Bench Scale</span>
                    <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  </div>
                  <p class="text-muted-foreground font-mono text-xs">
                    Live Auto-Sync Active &bull; Certified NIST Class III
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-auto">
                <Badge
                  variant="outline"
                  class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  4 lbs 8.0 oz (2.04 kg)
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  class="h-7 gap-1 px-2 text-xs"
                  :disabled="isScaleSyncing"
                  @click="handleSyncScale"
                >
                  <RefreshCw :class="cn('size-3', isScaleSyncing && 'animate-spin')" aria-hidden="true" />
                  <span>{{ isScaleSyncing ? 'Syncing...' : 'Re-weigh' }}</span>
                </Button>
              </div>
            </div>

            <!-- Weight & Dimensions Form Inputs -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Weight Inputs -->
              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-semibold"> Gross Billed Weight </label>
                <div class="grid grid-cols-2 gap-2">
                  <div class="relative">
                    <Input v-model.number="weightLbs" type="number" min="0" max="150" class="pr-8 font-mono text-xs" />
                    <span
                      class="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 font-mono text-xs"
                    >
                      lbs
                    </span>
                  </div>
                  <div class="relative">
                    <Input
                      v-model.number="weightOz"
                      type="number"
                      min="0"
                      max="15.9"
                      step="0.1"
                      class="pr-8 font-mono text-xs"
                    />
                    <span
                      class="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 font-mono text-xs"
                    >
                      oz
                    </span>
                  </div>
                </div>
              </div>

              <!-- Package Dimensions -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-foreground text-xs font-semibold"> Package Dimensions (L × W × H) </label>
                  <span class="text-muted-foreground font-mono text-xs">{{ dimWeightLbs }} lbs Dim Wt</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5">
                  <div class="relative">
                    <Input v-model.number="dimLength" type="number" min="1" class="pr-6 font-mono text-xs" />
                    <span
                      class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 font-mono text-xs"
                    >
                      L
                    </span>
                  </div>
                  <div class="relative">
                    <Input v-model.number="dimWidth" type="number" min="1" class="pr-6 font-mono text-xs" />
                    <span
                      class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 font-mono text-xs"
                    >
                      W
                    </span>
                  </div>
                  <div class="relative">
                    <Input v-model.number="dimHeight" type="number" min="1" class="pr-6 font-mono text-xs" />
                    <span
                      class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 font-mono text-xs"
                    >
                      H
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 3. Value-Added Services & Declared Value -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ShieldCheck class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Delivery Access &amp; Insurance Options</CardTitle>
              </div>
              <Badge variant="outline" class="font-mono text-xs">Carrier Accessorials</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Signature on Delivery Switch -->
            <div class="border-border bg-card flex items-start justify-between gap-4 rounded-lg border p-3.5 shadow-xs">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Direct Signature Required</span>
                  <Badge variant="secondary" class="font-mono text-xs">+$5.50</Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Carrier will obtain a physical in-person signature from recipient at doorstep. Cannot be left
                  unattended.
                </p>
              </div>
              <Switch v-model="requireSignature" />
            </div>

            <!-- Declared Value / Cargo Insurance -->
            <div
              class="border-border bg-card flex flex-col gap-3 rounded-lg border p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Declared Insurance Value</span>
                  <Badge variant="outline" class="text-xs">Full Loss Protection</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Coverage up to declared amount for transit loss, theft, or damage (+$3.20 premium)
                </p>
              </div>
              <div class="relative w-full sm:w-36">
                <span
                  class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-xs font-semibold"
                >
                  $
                </span>
                <Input v-model="declaredValue" type="text" class="pl-6 text-right font-mono text-xs" />
              </div>
            </div>

            <!-- Package Items Summary Strip -->
            <div class="border-border bg-muted/20 rounded-lg border p-3 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Package class="text-muted-foreground size-3.5" aria-hidden="true" />
                  <span class="text-foreground font-semibold">Package Contents:</span>
                  <span class="text-muted-foreground">Pro Studio Headphones X9, Braided Cable (2 items)</span>
                </div>
                <Badge variant="outline" class="font-mono text-xs">SKU-AUD-9821</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 4. Pricing & Dispatch Cost Summary -->
        <Card class="border-border bg-muted/20 border shadow-xs">
          <CardContent class="space-y-3 p-4">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Base Carrier Rate ({{ activeCarrier.name }}):</span>
              <span class="text-foreground font-mono font-medium tabular-nums"
                >${{ activeCarrier.rate.toFixed(2) }}</span
              >
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Direct Signature Confirmation:</span>
              <span class="text-foreground font-mono font-medium tabular-nums">${{ signatureFee.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Declared Value Cargo Protection ($300.00):</span>
              <span class="text-foreground font-mono font-medium tabular-nums">${{ insuranceFee.toFixed(2) }}</span>
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <span class="text-foreground text-sm font-semibold">Total Label &amp; Dispatch Cost:</span>
              <span class="text-primary font-mono text-base font-semibold tabular-nums">
                ${{ totalShippingCost.toFixed(2) }} USD
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: 4x6 Thermal Printable Label Card (5 cols on lg) -->
      <div class="space-y-4 lg:col-span-5">
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Barcode class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">4×6 Thermal Label Preview</CardTitle>
              </div>
              <Badge variant="secondary" class="font-mono text-xs">ZPL II 203 DPI</Badge>
            </div>
            <CardDescription>
              Direct thermal printable output formatted for 4" × 6" standard roll label stock
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Thermal Label Canvas Container -->
            <div
              class="border-border bg-muted/40 relative flex flex-col items-center justify-center rounded-xl border p-4 shadow-inner sm:p-6"
            >
              <!-- Top Thermal Stock Perforation Marker -->
              <div class="text-muted-foreground/60 mb-2 flex items-center gap-1 font-mono text-xs select-none">
                <span>&#9986;</span>
                <span class="border-muted-foreground/40 inline-block w-48 border-b border-dashed" />
                <span>4" TEAR LINE</span>
              </div>

              <!-- REALISTIC 4x6 CARRIER SHIPPING LABEL MOCKUP -->
              <div
                class="w-full max-w-[340px] space-y-2.5 rounded-sm border-2 border-black bg-white p-4 font-mono text-xs leading-tight text-black shadow-lg select-none"
              >
                <!-- Label Header: Carrier Code & Meta -->
                <div class="flex items-start justify-between border-b-2 border-black pb-2">
                  <div>
                    <div
                      class="inline-block border-2 border-black px-2 py-0.5 text-base font-bold tracking-wider uppercase"
                    >
                      {{ activeCarrier.code }}
                    </div>
                    <div class="mt-1 text-xs font-semibold text-black">PRIORITY DISPATCH</div>
                  </div>

                  <div class="space-y-0.5 text-right text-xs">
                    <div class="font-semibold">WT: {{ weightLbs }} LBS {{ weightOz }} OZ</div>
                    <div>DIM: {{ dimLength }}x{{ dimWidth }}x{{ dimHeight }} IN</div>
                    <div>DATE: 21AUG26</div>
                  </div>
                </div>

                <!-- Service Banner -->
                <div class="bg-black px-1.5 py-1 text-center text-xs font-semibold tracking-wider text-white uppercase">
                  {{ activeCarrier.serviceBanner }}
                </div>

                <!-- Origin & 2D MaxiCode Block -->
                <div class="grid grid-cols-12 items-center gap-2 py-1">
                  <!-- Ship From Address -->
                  <div class="col-span-8 space-y-0.5 text-xs leading-none">
                    <div class="font-semibold tracking-wider uppercase">SHIP FROM:</div>
                    <div class="font-semibold">ACME LOGISTICS DC #4</div>
                    <div>100 ENTERPRISE WAY, STE 200</div>
                    <div>NEWARK NJ 07102-4100</div>
                    <div class="pt-1 text-xs">REF: {{ props.initialOrderRef }}</div>
                  </div>

                  <!-- 2D MaxiCode / PDF417 Vector Barcode -->
                  <div class="col-span-4 flex justify-end">
                    <svg
                      viewBox="0 0 100 100"
                      class="size-16 shrink-0 text-black"
                      fill="currentColor"
                      aria-label="MaxiCode 2D Routing Matrix"
                    >
                      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="4" />
                      <circle cx="50" cy="50" r="7" fill="currentColor" />
                      <rect x="8" y="8" width="9" height="9" rx="1" />
                      <rect x="22" y="8" width="9" height="9" rx="1" />
                      <rect x="36" y="8" width="9" height="9" rx="1" />
                      <rect x="55" y="8" width="9" height="9" rx="1" />
                      <rect x="69" y="8" width="9" height="9" rx="1" />
                      <rect x="83" y="8" width="9" height="9" rx="1" />
                      <rect x="8" y="22" width="9" height="9" rx="1" />
                      <rect x="83" y="22" width="9" height="9" rx="1" />
                      <rect x="8" y="36" width="9" height="9" rx="1" />
                      <rect x="22" y="36" width="9" height="9" rx="1" />
                      <rect x="69" y="36" width="9" height="9" rx="1" />
                      <rect x="83" y="36" width="9" height="9" rx="1" />
                      <rect x="8" y="55" width="9" height="9" rx="1" />
                      <rect x="22" y="55" width="9" height="9" rx="1" />
                      <rect x="69" y="55" width="9" height="9" rx="1" />
                      <rect x="83" y="55" width="9" height="9" rx="1" />
                      <rect x="8" y="69" width="9" height="9" rx="1" />
                      <rect x="83" y="69" width="9" height="9" rx="1" />
                      <rect x="8" y="83" width="9" height="9" rx="1" />
                      <rect x="22" y="83" width="9" height="9" rx="1" />
                      <rect x="36" y="83" width="9" height="9" rx="1" />
                      <rect x="55" y="83" width="9" height="9" rx="1" />
                      <rect x="69" y="83" width="9" height="9" rx="1" />
                      <rect x="83" y="83" width="9" height="9" rx="1" />
                    </svg>
                  </div>
                </div>

                <!-- Destination Address Block -->
                <div class="space-y-0.5 border-t-2 border-black pt-2">
                  <div class="font-semibold tracking-wider uppercase">SHIP TO:</div>
                  <div class="text-sm font-semibold">ALEXANDRA CHEN</div>
                  <div class="font-medium">742 EVERGREEN TERRACE, APT 4B</div>
                  <div class="text-sm font-semibold tracking-tight">PASADENA CA 91101-2104</div>
                  <div class="text-xs">TEL: (555) 019-2831</div>
                </div>

                <!-- Large Bold Zip Code Routing Bar -->
                <div class="my-1 border-2 border-black bg-white p-2 text-center">
                  <div class="text-lg font-bold tracking-widest uppercase">
                    {{ activeCarrier.routingZip }}
                  </div>
                  <div class="mt-0.5 text-xs font-semibold tracking-wider">
                    {{ activeCarrier.routingZone }} &bull; {{ activeCarrier.hubCode }}
                  </div>
                </div>

                <!-- Signature Required Strip -->
                <div
                  v-if="requireSignature"
                  class="bg-black px-1.5 py-0.5 text-center text-xs font-semibold tracking-wider text-white"
                >
                  *** DIRECT SIGNATURE REQUIRED ***
                </div>

                <!-- Large Code 128 Tracking Barcode -->
                <div class="space-y-1 border-t-2 border-black pt-2">
                  <div class="flex w-full justify-center overflow-hidden py-1">
                    <svg
                      viewBox="0 0 320 54"
                      class="h-12 w-full text-black"
                      fill="currentColor"
                      preserveAspectRatio="none"
                      aria-label="Code 128 Tracking Barcode"
                    >
                      <rect x="0" y="0" width="3" height="54" />
                      <rect x="5" y="0" width="2" height="54" />
                      <rect x="9" y="0" width="5" height="54" />
                      <rect x="16" y="0" width="2" height="54" />
                      <rect x="20" y="0" width="4" height="54" />
                      <rect x="26" y="0" width="1" height="54" />
                      <rect x="29" y="0" width="6" height="54" />
                      <rect x="37" y="0" width="3" height="54" />
                      <rect x="42" y="0" width="2" height="54" />
                      <rect x="46" y="0" width="4" height="54" />
                      <rect x="52" y="0" width="2" height="54" />
                      <rect x="56" y="0" width="5" height="54" />
                      <rect x="63" y="0" width="3" height="54" />
                      <rect x="68" y="0" width="1" height="54" />
                      <rect x="71" y="0" width="6" height="54" />
                      <rect x="79" y="0" width="2" height="54" />
                      <rect x="83" y="0" width="4" height="54" />
                      <rect x="89" y="0" width="3" height="54" />
                      <rect x="94" y="0" width="2" height="54" />
                      <rect x="98" y="0" width="5" height="54" />
                      <rect x="105" y="0" width="2" height="54" />
                      <rect x="109" y="0" width="4" height="54" />
                      <rect x="115" y="0" width="1" height="54" />
                      <rect x="118" y="0" width="6" height="54" />
                      <rect x="126" y="0" width="3" height="54" />
                      <rect x="131" y="0" width="2" height="54" />
                      <rect x="135" y="0" width="5" height="54" />
                      <rect x="142" y="0" width="3" height="54" />
                      <rect x="147" y="0" width="2" height="54" />
                      <rect x="151" y="0" width="4" height="54" />
                      <rect x="157" y="0" width="2" height="54" />
                      <rect x="161" y="0" width="6" height="54" />
                      <rect x="169" y="0" width="1" height="54" />
                      <rect x="172" y="0" width="4" height="54" />
                      <rect x="178" y="0" width="3" height="54" />
                      <rect x="183" y="0" width="2" height="54" />
                      <rect x="187" y="0" width="5" height="54" />
                      <rect x="194" y="0" width="3" height="54" />
                      <rect x="199" y="0" width="1" height="54" />
                      <rect x="202" y="0" width="6" height="54" />
                      <rect x="210" y="0" width="2" height="54" />
                      <rect x="214" y="0" width="4" height="54" />
                      <rect x="220" y="0" width="3" height="54" />
                      <rect x="225" y="0" width="2" height="54" />
                      <rect x="229" y="0" width="5" height="54" />
                      <rect x="236" y="0" width="2" height="54" />
                      <rect x="240" y="0" width="4" height="54" />
                      <rect x="246" y="0" width="1" height="54" />
                      <rect x="249" y="0" width="6" height="54" />
                      <rect x="257" y="0" width="3" height="54" />
                      <rect x="262" y="0" width="2" height="54" />
                      <rect x="266" y="0" width="5" height="54" />
                      <rect x="273" y="0" width="3" height="54" />
                      <rect x="278" y="0" width="1" height="54" />
                      <rect x="281" y="0" width="6" height="54" />
                      <rect x="289" y="0" width="2" height="54" />
                      <rect x="293" y="0" width="4" height="54" />
                      <rect x="299" y="0" width="3" height="54" />
                      <rect x="304" y="0" width="2" height="54" />
                      <rect x="308" y="0" width="4" height="54" />
                      <rect x="314" y="0" width="2" height="54" />
                      <rect x="318" y="0" width="2" height="54" />
                    </svg>
                  </div>
                  <div class="text-center text-xs font-semibold tracking-widest">
                    {{ activeCarrier.barcodeString }}
                  </div>
                </div>

                <!-- Tracking Number Line -->
                <div class="border-t border-black pt-1 text-center">
                  <div class="text-xs font-semibold tracking-wider">TRACKING #: {{ activeCarrier.trackingNumber }}</div>
                </div>

                <!-- Label Footer -->
                <div class="flex items-center justify-between border-t border-black pt-1 text-xs font-semibold">
                  <span>POSTAGE PAID</span>
                  <span>4x6 THERMAL</span>
                  <span>PKG 1 OF 1</span>
                </div>
              </div>
            </div>

            <!-- Print Actions & Quick Copy Toolbar -->
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div class="text-muted-foreground flex items-center gap-1.5 font-mono">
                <span>Tracking:</span>
                <button
                  type="button"
                  class="hover:bg-muted focus-visible:ring-ring bg-muted/60 text-foreground inline-flex min-h-6 items-center gap-1 rounded px-1.5 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  title="Click to copy tracking number"
                  @click="copyTracking"
                >
                  <span>{{ activeCarrier.trackingNumber }}</span>
                  <Check
                    v-if="copiedTracking"
                    class="size-3 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <Copy v-else class="size-3" aria-hidden="true" />
                </button>
              </div>

              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" class="h-7 gap-1 px-2 text-xs" @click="handleDownloadZpl">
                  <FileCode2 class="size-3" aria-hidden="true" />
                  <span>ZPL Payload</span>
                </Button>
                <Button size="sm" class="h-7 gap-1 px-2.5 text-xs" @click="handlePrint">
                  <Printer class="size-3" aria-hidden="true" />
                  <span>Print Label</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
