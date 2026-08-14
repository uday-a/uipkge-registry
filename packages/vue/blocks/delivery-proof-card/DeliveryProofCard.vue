<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import {
  Camera,
  Check,
  Copy,
  Download,
  FileCheck,
  Fingerprint,
  Key,
  MapPin,
  Package,
  Share2,
  ShieldCheck,
  Truck,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const copiedTracking = ref(false)
const copiedGps = ref(false)
const copiedHash = ref(false)
const sharedLink = ref(false)

function copyTracking() {
  navigator.clipboard?.writeText('TRK-98421094')
  copiedTracking.value = true
  setTimeout(() => {
    copiedTracking.value = false
  }, 2000)
}

function copyGps() {
  navigator.clipboard?.writeText('34.0522°N, 118.2437°W')
  copiedGps.value = true
  setTimeout(() => {
    copiedGps.value = false
  }, 2000)
}

function copyHash() {
  navigator.clipboard?.writeText('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069')
  copiedHash.value = true
  setTimeout(() => {
    copiedHash.value = false
  }, 2000)
}

function handleShare() {
  navigator.clipboard?.writeText('https://uipkge.dev/epod/TRK-98421094')
  sharedLink.value = true
  setTimeout(() => {
    sharedLink.value = false
  }, 2000)
}
</script>

<template>
  <div data-slot="delivery-proof-card" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Card -->
    <Card class="border shadow-xs">
      <CardHeader class="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <Badge wrap variant="outline" class="gap-1.5 font-mono text-xs">
              <FileCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ePOD Receipt
            </Badge>
            <div
              class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              <span class="relative flex size-1.5">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span class="relative inline-flex size-1.5 rounded-full bg-emerald-500"></span>
              </span>
              Delivered · Signed & Verified
            </div>
          </div>

          <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
              Electronic Proof of Delivery (ePOD)
            </h1>
            <div class="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span>Tracking Number:</span>
              <button
                type="button"
                @click="copyTracking"
                class="hover:bg-muted focus-visible:ring-ring border-border bg-muted/40 text-foreground inline-flex min-h-6 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                title="Click to copy tracking number"
              >
                #TRK-98421094
                <Check v-if="copiedTracking" class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <Copy v-else class="text-muted-foreground size-3" aria-hidden="true" />
              </button>
              <span class="text-muted-foreground tabular-nums">Aug 21, 2026 at 14:32:08 PST</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5 pt-1">
          <Button aria-label="Download attachment" variant="default" class="gap-2 shadow-xs">
            <Download class="size-4" aria-hidden="true" />
            Download ePOD PDF
          </Button>
          <Button variant="outline" @click="handleShare" class="gap-2 shadow-xs">
            <Check v-if="sharedLink" class="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <Share2 v-else class="size-4" aria-hidden="true" />
            {{ sharedLink ? 'Link Copied' : 'Share Proof Link' }}
          </Button>
        </div>
      </CardHeader>
    </Card>

    <!-- 2-Column Delivery Verification Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Visual Proof & Electronic Signatures (lg:col-span-6) -->
      <div class="space-y-6 lg:col-span-6">
        <!-- Drop-off Photo Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <Camera class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Drop-off Photo Verification</CardTitle>
              </div>
              <Badge wrap variant="secondary" class="font-mono text-xs"> Front Porch / Secure Entry </Badge>
            </div>
            <CardDescription> Photographic proof of drop-off captured at consignee doorstep </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Delivery Photo Container with Viewfinder and HUD overlay -->
            <div
              class="group border-border relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white shadow-inner"
            >
              <!-- Photographic Canvas Composition -->
              <div class="absolute inset-0 flex items-center justify-center p-6">
                <!-- Porch Perspective & Doorstep Elements -->
                <svg
                  class="h-full w-full opacity-90"
                  viewBox="0 0 600 375"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Delivery parcel positioned securely on consignee front porch"
                >
                  <!-- Background Architectural Siding & Wall -->
                  <rect width="600" height="375" fill="#18181b" />
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#27272a" stroke-width="1.5" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#27272a" stroke-width="1.5" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#27272a" stroke-width="1.5" />
                  <line x1="0" y1="160" x2="600" y2="160" stroke="#27272a" stroke-width="1.5" />

                  <!-- Doorframe & Entry Siding -->
                  <rect x="70" y="30" width="160" height="345" fill="#09090b" stroke="#3f3f46" stroke-width="2" />
                  <line x1="150" y1="30" x2="150" y2="375" stroke="#27272a" stroke-width="2" />
                  <circle cx="215" cy="190" r="5" fill="#a1a1aa" />

                  <!-- Porch Slate Flooring Horizon -->
                  <polygon points="0,210 600,210 600,375 0,375" fill="#1c1917" />
                  <line x1="0" y1="210" x2="600" y2="210" stroke="#44403c" stroke-width="2" />
                  <line x1="0" y1="270" x2="600" y2="270" stroke="#292524" stroke-width="1" />
                  <line x1="0" y1="330" x2="600" y2="330" stroke="#292524" stroke-width="1" />

                  <!-- Floor Plank Angles -->
                  <line x1="120" y1="210" x2="60" y2="375" stroke="#292524" stroke-width="1.5" />
                  <line x1="280" y1="210" x2="240" y2="375" stroke="#292524" stroke-width="1.5" />
                  <line x1="440" y1="210" x2="420" y2="375" stroke="#292524" stroke-width="1.5" />

                  <!-- Woven Door Mat -->
                  <rect
                    x="250"
                    y="225"
                    width="230"
                    height="115"
                    rx="4"
                    fill="#451a03"
                    fill-opacity="0.4"
                    stroke="#78350f"
                    stroke-width="1.5"
                  />
                  <line
                    x1="260"
                    y1="235"
                    x2="470"
                    y2="235"
                    stroke="#78350f"
                    stroke-width="0.75"
                    stroke-dasharray="3 3"
                  />
                  <line
                    x1="260"
                    y1="330"
                    x2="470"
                    y2="330"
                    stroke="#78350f"
                    stroke-width="0.75"
                    stroke-dasharray="3 3"
                  />

                  <!-- Package Shadow -->
                  <ellipse cx="360" cy="305" rx="75" ry="18" fill="#000000" fill-opacity="0.6" />

                  <!-- 3D Cardboard Package Box -->
                  <!-- Box Front Face -->
                  <polygon
                    points="305,230 405,230 405,300 305,300"
                    fill="#b45309"
                    stroke="#78350f"
                    stroke-width="1.5"
                  />
                  <!-- Box Top Face -->
                  <polygon
                    points="305,230 350,195 450,195 405,230"
                    fill="#d97706"
                    stroke="#78350f"
                    stroke-width="1.5"
                  />
                  <!-- Box Right Face -->
                  <polygon
                    points="405,230 450,195 450,265 405,300"
                    fill="#92400e"
                    stroke="#78350f"
                    stroke-width="1.5"
                  />

                  <!-- Sealing Tape Across Top & Front -->
                  <polygon points="370,195 385,195 355,230 340,230" fill="#f59e0b" fill-opacity="0.8" />
                  <rect x="348" y="230" width="14" height="70" fill="#f59e0b" fill-opacity="0.8" />

                  <!-- White Shipping Label on Box Front -->
                  <rect x="315" y="242" width="48" height="34" rx="1.5" fill="#ffffff" />
                  <line x1="320" y1="248" x2="350" y2="248" stroke="#18181b" stroke-width="1.5" />
                  <line x1="320" y1="252" x2="340" y2="252" stroke="#71717a" stroke-width="1" />
                  <!-- Barcode on Label -->
                  <line x1="320" y1="262" x2="320" y2="272" stroke="#000000" stroke-width="1.5" />
                  <line x1="323" y1="262" x2="323" y2="272" stroke="#000000" stroke-width="1" />
                  <line x1="325" y1="262" x2="325" y2="272" stroke="#000000" stroke-width="2" />
                  <line x1="329" y1="262" x2="329" y2="272" stroke="#000000" stroke-width="1" />
                  <line x1="332" y1="262" x2="332" y2="272" stroke="#000000" stroke-width="1.5" />
                  <line x1="336" y1="262" x2="336" y2="272" stroke="#000000" stroke-width="1" />
                  <line x1="340" y1="262" x2="340" y2="272" stroke="#000000" stroke-width="2" />
                  <line x1="344" y1="262" x2="344" y2="272" stroke="#000000" stroke-width="1" />
                  <line x1="348" y1="262" x2="348" y2="272" stroke="#000000" stroke-width="1.5" />

                  <!-- Fragile / Express Stamp -->
                  <rect
                    x="370"
                    y="248"
                    width="26"
                    height="14"
                    rx="1"
                    fill="#ef4444"
                    fill-opacity="0.15"
                    stroke="#ef4444"
                    stroke-width="0.75"
                  />
                  <line x1="373" y1="255" x2="393" y2="255" stroke="#ef4444" stroke-width="1" />
                </svg>
              </div>

              <!-- Camera Viewfinder Overlay Reticles -->
              <div class="pointer-events-none absolute inset-4 border border-white/20">
                <!-- Top-Left Corner -->
                <div class="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-emerald-400"></div>
                <!-- Top-Right Corner -->
                <div class="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-emerald-400"></div>
                <!-- Bottom-Left Corner -->
                <div class="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-emerald-400"></div>
                <!-- Bottom-Right Corner -->
                <div class="absolute -right-1 -bottom-1 size-3 border-r-2 border-b-2 border-emerald-400"></div>
                <!-- Center Target Crosshair -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div class="relative size-6">
                    <div class="absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-white/40"></div>
                    <div class="absolute bottom-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-white/40"></div>
                    <div class="absolute top-1/2 left-0 h-0.5 w-2 -translate-y-1/2 bg-white/40"></div>
                    <div class="absolute top-1/2 right-0 h-0.5 w-2 -translate-y-1/2 bg-white/40"></div>
                    <div
                      class="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Top Telemetry Pill -->
              <div
                class="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 backdrop-blur-md"
              >
                <span class="size-2 animate-pulse rounded-full bg-emerald-400"></span>
                <span class="font-mono text-xs font-medium text-white/90">OPTICAL PROOF CAPTURED</span>
              </div>

              <!-- Bottom Geostamp HUD Banner -->
              <div
                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 pt-6 sm:p-4"
              >
                <div class="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5 text-emerald-400">
                      <MapPin class="size-3.5 shrink-0" aria-hidden="true" />
                      <span class="font-mono text-xs font-semibold tracking-tight tabular-nums">
                        34.0522°N, 118.2437°W · Accurate to 3m
                      </span>
                    </div>
                    <p class="font-mono text-xs text-zinc-300">Springfield, OR · Geofence Validated (0.8m delta)</p>
                  </div>
                  <div class="flex items-center gap-2 text-right">
                    <span class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-zinc-300"> Zebra TC57x </span>
                    <span class="font-mono text-xs text-zinc-400 tabular-nums"> 14:32:08 PST </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Photo Metadata Breakdown -->
            <div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <p class="text-muted-foreground">Capture Time</p>
                <p class="text-foreground mt-0.5 font-mono font-medium tabular-nums">14:32:08 PST</p>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <p class="text-muted-foreground">Camera Sensor</p>
                <p class="text-foreground mt-0.5 font-mono font-medium">13 MP AutoFocus</p>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <p class="text-muted-foreground">Geofence Delta</p>
                <p class="mt-0.5 font-mono font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                  0.8m radius
                </p>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <p class="text-muted-foreground">Integrity Stamp</p>
                <p class="text-foreground mt-0.5 font-mono font-medium">SHA-256 Valid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Customer Electronic Signature Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <Fingerprint class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Customer Electronic Signature</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                class="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                <ShieldCheck class="size-3" aria-hidden="true" />
                ID Verified
              </Badge>
            </div>
            <CardDescription>
              Legally binding digital acceptance recorded via courier handheld terminal
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Digital Signature Lined Canvas Readout -->
            <div class="border-border bg-muted/20 relative rounded-lg border border-dashed p-4 sm:p-6">
              <!-- Security Watermark Background -->
              <div
                class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none dark:opacity-[0.06]"
              >
                <span class="font-mono text-xl font-semibold tracking-widest uppercase sm:text-2xl">
                  VERIFIED DIGITAL SIGNATURE • EPOD-#98421094
                </span>
              </div>

              <!-- Signature SVG Canvas -->
              <div class="relative z-10 flex h-24 w-full items-center justify-center">
                <svg
                  class="stroke-foreground h-full w-full max-w-md"
                  viewBox="0 0 460 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Handwritten signature of Elena Rostova"
                >
                  <!-- Natural Cursive Handwritten Signature Path: Elena Rostova -->
                  <path
                    d="M 35,68 C 42,32 55,24 64,28 C 74,32 78,78 86,76 C 94,74 98,52 108,52 C 118,52 122,68 134,68 C 142,68 146,56 158,56 C 170,56 174,68 186,68 M 205,38 C 208,62 212,80 220,78 C 228,76 238,44 250,44 C 262,44 266,74 278,74 C 286,74 290,62 300,62 C 310,62 316,74 328,74 C 342,74 358,48 372,44 C 388,40 398,62 414,64 C 424,65 435,52 445,48"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Flourish Underline -->
                  <path
                    d="M 50,88 C 110,84 240,88 380,82 C 410,81 430,78 440,74"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-dasharray="4 2"
                    class="opacity-60"
                  />
                </svg>
              </div>

              <!-- Signer Line Marker -->
              <div
                class="border-border text-muted-foreground mt-2 flex flex-wrap items-center justify-between border-t pt-2 text-xs"
              >
                <span class="font-mono">✕ Signer Baseline</span>
                <span class="font-mono text-emerald-600 dark:text-emerald-400">● Digitally Encrypted</span>
              </div>
            </div>

            <!-- Signer Audit Metadata -->
            <div class="space-y-2 text-sm">
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs">Received By</span>
                <span class="text-foreground text-xs font-semibold sm:text-sm">Elena Rostova</span>
              </div>
              <Separator />
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs">Signer Identity</span>
                <span class="text-foreground text-xs font-medium">Direct Consignee (Government ID Verified)</span>
              </div>
              <Separator />
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs">Timestamp</span>
                <span class="text-foreground font-mono text-xs tabular-nums">Aug 21, 2026 at 14:32:08 PST</span>
              </div>
              <Separator />
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs">Capture Method</span>
                <span class="text-foreground font-mono text-xs">Capacitive Stylus · Terminal #SCAN-842</span>
              </div>
              <Separator />
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs">Cryptographic Seal</span>
                <button
                  type="button"
                  @click="copyHash"
                  class="hover:bg-muted focus-visible:ring-ring text-muted-foreground hover:text-foreground inline-flex min-h-6 items-center gap-1 rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  title="Click to copy SHA-256 seal hash"
                >
                  <span>SHA-256: 7f83b1...126d9069</span>
                  <Check v-if="copiedHash" class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Delivery Address, Courier Metadata, & Package Manifest (lg:col-span-6) -->
      <div class="space-y-6 lg:col-span-6">
        <!-- Delivery Address & Locker Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <MapPin class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Delivery Destination</CardTitle>
              </div>
              <Badge wrap variant="outline" class="text-xs">Residential</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-3.5 text-sm">
            <div class="space-y-1">
              <p class="text-foreground font-semibold">Elena Rostova</p>
              <p class="text-muted-foreground">742 Evergreen Terrace, Apt 4B</p>
              <p class="text-muted-foreground">Springfield, OR 97477</p>
              <p class="text-muted-foreground text-xs">United States • +1 (555) 839-2041</p>
            </div>

            <!-- Delivery Instructions Callout -->
            <div class="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
              <Key class="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <div class="space-y-0.5">
                <p class="font-medium text-amber-900 dark:text-amber-300">Delivery Instruction Recorded:</p>
                <p class="text-amber-800/90 dark:text-amber-300/80">"Left inside package locker #4B"</p>
                <p class="text-muted-foreground pt-0.5 text-xs">Electronic latch verified locked at 14:32 PST.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Courier & Vehicle Metadata Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <Truck class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Courier & Vehicle Metadata</CardTitle>
              </div>
              <Badge wrap variant="secondary" class="bg-primary/10 text-primary text-xs font-medium">
                FedEx Express Priority
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Driver Profile Row -->
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-3">
                <Avatar class="border-border size-10 border">
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold"> DC </AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-foreground text-sm font-semibold">David Chen</p>
                  <p class="text-muted-foreground text-xs">Van #204 · Ford Transit 350</p>
                </div>
              </div>
              <Badge wrap variant="outline" class="font-mono text-xs"> Rating: 4.99 ★ </Badge>
            </div>

            <Separator />

            <!-- Dispatch & Terminal Grid -->
            <div class="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div class="space-y-1">
                <span class="text-muted-foreground">Carrier Service</span>
                <p class="text-foreground font-medium">FedEx Express Priority</p>
              </div>
              <div class="space-y-1">
                <span class="text-muted-foreground">Handheld Terminal ID</span>
                <p class="text-foreground font-mono font-medium">#SCAN-842</p>
              </div>
              <div class="space-y-1">
                <span class="text-muted-foreground">Dispatch Hub</span>
                <p class="text-foreground font-medium">Pacific NW Hub (PDX-04)</p>
              </div>
              <div class="space-y-1">
                <span class="text-muted-foreground">Route & Sequence</span>
                <p class="text-foreground font-mono font-medium">RTE-NW-084 · Stop #42</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Package Manifest Table Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <Package class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Package Manifest</CardTitle>
              </div>
              <Badge wrap variant="outline" class="font-mono text-xs"> 2 Items · 1 Parcel </Badge>
            </div>
            <CardDescription> Itemized manifest details and physical cargo specifications </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Manifest Table -->
            <div class="border-border overflow-hidden rounded-lg border">
              <div class="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow class="bg-muted/40">
                      <TableHead class="text-xs font-semibold">Item Description</TableHead>
                      <TableHead class="text-xs font-semibold">SKU / Ref</TableHead>
                      <TableHead class="text-right text-xs font-semibold">Qty</TableHead>
                      <TableHead class="text-right text-xs font-semibold">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell class="text-foreground py-2.5 text-xs font-medium">
                        Pro Wireless Studio Headphones X9
                      </TableCell>
                      <TableCell class="text-muted-foreground py-2.5 font-mono text-xs"> SKU-AUD-9821 </TableCell>
                      <TableCell class="text-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                        1
                      </TableCell>
                      <TableCell class="text-muted-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                        5.6 lbs
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell class="text-foreground py-2.5 text-xs font-medium">
                        Braided Balanced XLR Cable (Pair, 3m)
                      </TableCell>
                      <TableCell class="text-muted-foreground py-2.5 font-mono text-xs"> SKU-CBL-4482 </TableCell>
                      <TableCell class="text-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                        1
                      </TableCell>
                      <TableCell class="text-muted-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                        2.8 lbs
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <!-- Physical Specs Summary Grid -->
            <div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <span class="text-muted-foreground">Total Weight</span>
                <p class="text-foreground mt-0.5 font-mono font-semibold tabular-nums">8.4 lbs (3.81 kg)</p>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <span class="text-muted-foreground">Dimensions</span>
                <p class="text-foreground mt-0.5 font-mono font-semibold tabular-nums">14" × 10" × 6"</p>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <span class="text-muted-foreground">Handling</span>
                <p class="text-foreground mt-0.5 font-medium">Fragile Express</p>
              </div>
              <div class="border-border bg-muted/30 rounded-lg border p-2.5">
                <span class="text-muted-foreground">Tamper Seal</span>
                <p class="mt-0.5 font-mono font-medium text-emerald-600 dark:text-emerald-400">#SEAL-9842</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Security & Chain of Custody Audit Strip -->
    <Card class="border-border bg-muted/20 border shadow-xs">
      <CardContent class="flex flex-col gap-3 p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div class="text-muted-foreground flex items-center gap-2">
          <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span> Chain of Custody Verified · Cryptographically Timestamped & Geofence Locked </span>
        </div>
        <div class="text-muted-foreground flex flex-wrap items-center gap-2 font-mono">
          <span class="text-muted-foreground/80">GPS Lock:</span>
          <button
            type="button"
            @click="copyGps"
            class="hover:bg-muted focus-visible:ring-ring bg-muted/60 text-foreground inline-flex min-h-6 items-center gap-1 rounded px-1.5 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
            title="Click to copy GPS coordinates"
          >
            <span class="tabular-nums">34.0522°N, 118.2437°W</span>
            <Check v-if="copiedGps" class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <Copy v-else class="size-3" aria-hidden="true" />
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
