'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface DeliveryProofCardProps {
  className?: string
}

export function DeliveryProofCard({ className }: DeliveryProofCardProps) {
  const [copiedTracking, setCopiedTracking] = React.useState(false)
  const [copiedGps, setCopiedGps] = React.useState(false)
  const [copiedHash, setCopiedHash] = React.useState(false)
  const [sharedLink, setSharedLink] = React.useState(false)

  const copyTracking = () => {
    navigator.clipboard?.writeText('TRK-98421094')
    setCopiedTracking(true)
    setTimeout(() => {
      setCopiedTracking(false)
    }, 2000)
  }

  const copyGps = () => {
    navigator.clipboard?.writeText('34.0522°N, 118.2437°W')
    setCopiedGps(true)
    setTimeout(() => {
      setCopiedGps(false)
    }, 2000)
  }

  const copyHash = () => {
    navigator.clipboard?.writeText('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069')
    setCopiedHash(true)
    setTimeout(() => {
      setCopiedHash(false)
    }, 2000)
  }

  const handleShare = () => {
    navigator.clipboard?.writeText('https://uipkge.dev/epod/TRK-98421094')
    setSharedLink(true)
    setTimeout(() => {
      setSharedLink(false)
    }, 2000)
  }

  return (
    <div data-slot="delivery-proof-card" className={cn('w-full space-y-6', className)}>
      {/* Header Card */}
      <Card className="border shadow-xs">
        <CardHeader className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge wrap variant="outline" className="gap-1.5 font-mono text-xs">
                <FileCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ePOD Receipt
              </Badge>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Delivered · Signed & Verified
              </div>
            </div>

            <div>
              <h1 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                Electronic Proof of Delivery (ePOD)
              </h1>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span>Tracking Number:</span>
                <button
                  type="button"
                  onClick={copyTracking}
                  className="hover:bg-muted focus-visible:ring-ring border-border bg-muted/40 text-foreground inline-flex min-h-6 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                  title="Click to copy tracking number"
                >
                  #TRK-98421094
                  {copiedTracking ? (
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                  )}
                </button>
                <span className="text-muted-foreground tabular-nums">Aug 21, 2026 at 14:32:08 PST</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button aria-label="Download attachment" variant="default" className="gap-2 shadow-xs">
              <Download className="size-4" aria-hidden="true" />
              Download ePOD PDF
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2 shadow-xs">
              {sharedLink ? (
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Share2 className="size-4" aria-hidden="true" />
              )}
              {sharedLink ? 'Link Copied' : 'Share Proof Link'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 2-Column Delivery Verification Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Visual Proof & Electronic Signatures (lg:col-span-6) */}
        <div className="space-y-6 lg:col-span-6">
          {/* Drop-off Photo Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Drop-off Photo Verification</CardTitle>
                </div>
                <Badge wrap variant="secondary" className="font-mono text-xs">
                  Front Porch / Secure Entry
                </Badge>
              </div>
              <CardDescription>Photographic proof of drop-off captured at consignee doorstep</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Delivery Photo Container with Viewfinder and HUD overlay */}
              <div className="group border-border relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white shadow-inner">
                {/* Photographic Canvas Composition */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {/* Porch Perspective & Doorstep Elements */}
                  <svg
                    className="h-full w-full opacity-90"
                    viewBox="0 0 600 375"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Delivery parcel positioned securely on consignee front porch"
                  >
                    {/* Background Architectural Siding & Wall */}
                    <rect width="600" height="375" fill="#18181b" />
                    <line x1="0" y1="40" x2="600" y2="40" stroke="#27272a" strokeWidth="1.5" />
                    <line x1="0" y1="80" x2="600" y2="80" stroke="#27272a" strokeWidth="1.5" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#27272a" strokeWidth="1.5" />
                    <line x1="0" y1="160" x2="600" y2="160" stroke="#27272a" strokeWidth="1.5" />

                    {/* Doorframe & Entry Siding */}
                    <rect x="70" y="30" width="160" height="345" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
                    <line x1="150" y1="30" x2="150" y2="375" stroke="#27272a" strokeWidth="2" />
                    <circle cx="215" cy="190" r="5" fill="#a1a1aa" />

                    {/* Porch Slate Flooring Horizon */}
                    <polygon points="0,210 600,210 600,375 0,375" fill="#1c1917" />
                    <line x1="0" y1="210" x2="600" y2="210" stroke="#44403c" strokeWidth="2" />
                    <line x1="0" y1="270" x2="600" y2="270" stroke="#292524" strokeWidth="1" />
                    <line x1="0" y1="330" x2="600" y2="330" stroke="#292524" strokeWidth="1" />

                    {/* Floor Plank Angles */}
                    <line x1="120" y1="210" x2="60" y2="375" stroke="#292524" strokeWidth="1.5" />
                    <line x1="280" y1="210" x2="240" y2="375" stroke="#292524" strokeWidth="1.5" />
                    <line x1="440" y1="210" x2="420" y2="375" stroke="#292524" strokeWidth="1.5" />

                    {/* Woven Door Mat */}
                    <rect
                      x="250"
                      y="225"
                      width="230"
                      height="115"
                      rx="4"
                      fill="#451a03"
                      fillOpacity="0.4"
                      stroke="#78350f"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="260"
                      y1="235"
                      x2="470"
                      y2="235"
                      stroke="#78350f"
                      strokeWidth="0.75"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="260"
                      y1="330"
                      x2="470"
                      y2="330"
                      stroke="#78350f"
                      strokeWidth="0.75"
                      strokeDasharray="3 3"
                    />

                    {/* Package Shadow */}
                    <ellipse cx="360" cy="305" rx="75" ry="18" fill="#000000" fillOpacity="0.6" />

                    {/* 3D Cardboard Package Box */}
                    {/* Box Front Face */}
                    <polygon
                      points="305,230 405,230 405,300 305,300"
                      fill="#b45309"
                      stroke="#78350f"
                      strokeWidth="1.5"
                    />
                    {/* Box Top Face */}
                    <polygon
                      points="305,230 350,195 450,195 405,230"
                      fill="#d97706"
                      stroke="#78350f"
                      strokeWidth="1.5"
                    />
                    {/* Box Right Face */}
                    <polygon
                      points="405,230 450,195 450,265 405,300"
                      fill="#92400e"
                      stroke="#78350f"
                      strokeWidth="1.5"
                    />

                    {/* Sealing Tape Across Top & Front */}
                    <polygon points="370,195 385,195 355,230 340,230" fill="#f59e0b" fillOpacity="0.8" />
                    <rect x="348" y="230" width="14" height="70" fill="#f59e0b" fillOpacity="0.8" />

                    {/* White Shipping Label on Box Front */}
                    <rect x="315" y="242" width="48" height="34" rx="1.5" fill="#ffffff" />
                    <line x1="320" y1="248" x2="350" y2="248" stroke="#18181b" strokeWidth="1.5" />
                    <line x1="320" y1="252" x2="340" y2="252" stroke="#71717a" strokeWidth="1" />
                    {/* Barcode on Label */}
                    <line x1="320" y1="262" x2="320" y2="272" stroke="#000000" strokeWidth="1.5" />
                    <line x1="323" y1="262" x2="323" y2="272" stroke="#000000" strokeWidth="1" />
                    <line x1="325" y1="262" x2="325" y2="272" stroke="#000000" strokeWidth="2" />
                    <line x1="329" y1="262" x2="329" y2="272" stroke="#000000" strokeWidth="1" />
                    <line x1="332" y1="262" x2="332" y2="272" stroke="#000000" strokeWidth="1.5" />
                    <line x1="336" y1="262" x2="336" y2="272" stroke="#000000" strokeWidth="1" />
                    <line x1="340" y1="262" x2="340" y2="272" stroke="#000000" strokeWidth="2" />
                    <line x1="344" y1="262" x2="344" y2="272" stroke="#000000" strokeWidth="1" />
                    <line x1="348" y1="262" x2="348" y2="272" stroke="#000000" strokeWidth="1.5" />

                    {/* Fragile / Express Stamp */}
                    <rect
                      x="370"
                      y="248"
                      width="26"
                      height="14"
                      rx="1"
                      fill="#ef4444"
                      fillOpacity="0.15"
                      stroke="#ef4444"
                      strokeWidth="0.75"
                    />
                    <line x1="373" y1="255" x2="393" y2="255" stroke="#ef4444" strokeWidth="1" />
                  </svg>
                </div>

                {/* Camera Viewfinder Overlay Reticles */}
                <div className="pointer-events-none absolute inset-4 border border-white/20">
                  {/* Top-Left Corner */}
                  <div className="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-emerald-400" />
                  {/* Top-Right Corner */}
                  <div className="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-emerald-400" />
                  {/* Bottom-Left Corner */}
                  <div className="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-emerald-400" />
                  {/* Bottom-Right Corner */}
                  <div className="absolute -right-1 -bottom-1 size-3 border-r-2 border-b-2 border-emerald-400" />
                  {/* Center Target Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative size-6">
                      <div className="absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-white/40" />
                      <div className="absolute bottom-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-white/40" />
                      <div className="absolute top-1/2 left-0 h-0.5 w-2 -translate-y-1/2 bg-white/40" />
                      <div className="absolute top-1/2 right-0 h-0.5 w-2 -translate-y-1/2 bg-white/40" />
                      <div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Top Telemetry Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 backdrop-blur-md">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs font-medium text-white/90">OPTICAL PROOF CAPTURED</span>
                </div>

                {/* Bottom Geostamp HUD Banner */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 pt-6 sm:p-4">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="font-mono text-xs font-semibold tracking-tight tabular-nums">
                          34.0522°N, 118.2437°W · Accurate to 3m
                        </span>
                      </div>
                      <p className="font-mono text-xs text-zinc-300">
                        Springfield, OR · Geofence Validated (0.8m delta)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
                        Zebra TC57x
                      </span>
                      <span className="font-mono text-xs text-zinc-400 tabular-nums">14:32:08 PST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Metadata Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Capture Time</p>
                  <p className="text-foreground mt-0.5 font-mono font-medium tabular-nums">14:32:08 PST</p>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Camera Sensor</p>
                  <p className="text-foreground mt-0.5 font-mono font-medium">13 MP AutoFocus</p>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Geofence Delta</p>
                  <p className="mt-0.5 font-mono font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                    0.8m radius
                  </p>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <p className="text-muted-foreground">Integrity Stamp</p>
                  <p className="text-foreground mt-0.5 font-mono font-medium">SHA-256 Valid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Electronic Signature Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Customer Electronic Signature</CardTitle>
                </div>
                <Badge
                  wrap
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                >
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  ID Verified
                </Badge>
              </div>
              <CardDescription>
                Legally binding digital acceptance recorded via courier handheld terminal
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Digital Signature Lined Canvas Readout */}
              <div className="border-border bg-muted/20 relative rounded-lg border border-dashed p-4 sm:p-6">
                {/* Security Watermark Background */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none dark:opacity-[0.06]">
                  <span className="font-mono text-xl font-semibold tracking-widest uppercase sm:text-2xl">
                    VERIFIED DIGITAL SIGNATURE • EPOD-#98421094
                  </span>
                </div>

                {/* Signature SVG Canvas */}
                <div className="relative z-10 flex h-24 w-full items-center justify-center">
                  <svg
                    className="stroke-foreground h-full w-full max-w-md"
                    viewBox="0 0 460 110"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Handwritten signature of Elena Rostova"
                  >
                    {/* Natural Cursive Handwritten Signature Path: Elena Rostova */}
                    <path
                      d="M 35,68 C 42,32 55,24 64,28 C 74,32 78,78 86,76 C 94,74 98,52 108,52 C 118,52 122,68 134,68 C 142,68 146,56 158,56 C 170,56 174,68 186,68 M 205,38 C 208,62 212,80 220,78 C 228,76 238,44 250,44 C 262,44 266,74 278,74 C 286,74 290,62 300,62 C 310,62 316,74 328,74 C 342,74 358,48 372,44 C 388,40 398,62 414,64 C 424,65 435,52 445,48"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Flourish Underline */}
                    <path
                      d="M 50,88 C 110,84 240,88 380,82 C 410,81 430,78 440,74"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                      className="opacity-60"
                    />
                  </svg>
                </div>

                {/* Signer Line Marker */}
                <div className="border-border text-muted-foreground mt-2 flex flex-wrap items-center justify-between border-t pt-2 text-xs">
                  <span className="font-mono">✕ Signer Baseline</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">● Digitally Encrypted</span>
                </div>
              </div>

              {/* Signer Audit Metadata */}
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs">Received By</span>
                  <span className="text-foreground text-xs font-semibold sm:text-sm">Elena Rostova</span>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs">Signer Identity</span>
                  <span className="text-foreground text-xs font-medium">Direct Consignee (Government ID Verified)</span>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs">Timestamp</span>
                  <span className="text-foreground font-mono text-xs tabular-nums">Aug 21, 2026 at 14:32:08 PST</span>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs">Capture Method</span>
                  <span className="text-foreground font-mono text-xs">Capacitive Stylus · Terminal #SCAN-842</span>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs">Cryptographic Seal</span>
                  <button
                    type="button"
                    onClick={copyHash}
                    className="hover:bg-muted focus-visible:ring-ring text-muted-foreground hover:text-foreground inline-flex min-h-6 items-center gap-1 rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                    title="Click to copy SHA-256 seal hash"
                  >
                    <span>SHA-256: 7f83b1...126d9069</span>
                    {copiedHash ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Delivery Address, Courier Metadata, & Package Manifest (lg:col-span-6) */}
        <div className="space-y-6 lg:col-span-6">
          {/* Delivery Address & Locker Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Delivery Destination</CardTitle>
                </div>
                <Badge wrap variant="outline" className="text-xs">
                  Residential
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3.5 text-sm">
              <div className="space-y-1">
                <p className="text-foreground font-semibold">Elena Rostova</p>
                <p className="text-muted-foreground">742 Evergreen Terrace, Apt 4B</p>
                <p className="text-muted-foreground">Springfield, OR 97477</p>
                <p className="text-muted-foreground text-xs">United States • +1 (555) 839-2041</p>
              </div>

              {/* Delivery Instructions Callout */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                <Key className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="font-medium text-amber-900 dark:text-amber-300">Delivery Instruction Recorded:</p>
                  <p className="text-amber-800/90 dark:text-amber-300/80">"Left inside package locker #4B"</p>
                  <p className="text-muted-foreground pt-0.5 text-xs">Electronic latch verified locked at 14:32 PST.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courier & Vehicle Metadata Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Courier & Vehicle Metadata</CardTitle>
                </div>
                <Badge wrap variant="secondary" className="bg-primary/10 text-primary text-xs font-medium">
                  FedEx Express Priority
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Driver Profile Row */}
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="border-border size-10 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground text-sm font-semibold">David Chen</p>
                    <p className="text-muted-foreground text-xs">Van #204 · Ford Transit 350</p>
                  </div>
                </div>
                <Badge wrap variant="outline" className="font-mono text-xs">
                  Rating: 4.99 ★
                </Badge>
              </div>

              <Separator />

              {/* Dispatch & Terminal Grid */}
              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Carrier Service</span>
                  <p className="text-foreground font-medium">FedEx Express Priority</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Handheld Terminal ID</span>
                  <p className="text-foreground font-mono font-medium">#SCAN-842</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Dispatch Hub</span>
                  <p className="text-foreground font-medium">Pacific NW Hub (PDX-04)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Route & Sequence</span>
                  <p className="text-foreground font-mono font-medium">RTE-NW-084 · Stop #42</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Manifest Table Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Package Manifest</CardTitle>
                </div>
                <Badge wrap variant="outline" className="font-mono text-xs">
                  2 Items · 1 Parcel
                </Badge>
              </div>
              <CardDescription>Itemized manifest details and physical cargo specifications</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Manifest Table */}
              <div className="border-border overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs font-semibold">Item Description</TableHead>
                        <TableHead className="text-xs font-semibold">SKU / Ref</TableHead>
                        <TableHead className="text-right text-xs font-semibold">Qty</TableHead>
                        <TableHead className="text-right text-xs font-semibold">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-foreground py-2.5 text-xs font-medium">
                          Pro Wireless Studio Headphones X9
                        </TableCell>
                        <TableCell className="text-muted-foreground py-2.5 font-mono text-xs">SKU-AUD-9821</TableCell>
                        <TableCell className="text-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                          1
                        </TableCell>
                        <TableCell className="text-muted-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                          5.6 lbs
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-foreground py-2.5 text-xs font-medium">
                          Braided Balanced XLR Cable (Pair, 3m)
                        </TableCell>
                        <TableCell className="text-muted-foreground py-2.5 font-mono text-xs">SKU-CBL-4482</TableCell>
                        <TableCell className="text-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                          1
                        </TableCell>
                        <TableCell className="text-muted-foreground py-2.5 text-right font-mono text-xs tabular-nums">
                          2.8 lbs
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Physical Specs Summary Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Total Weight</span>
                  <p className="text-foreground mt-0.5 font-mono font-semibold tabular-nums">8.4 lbs (3.81 kg)</p>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Dimensions</span>
                  <p className="text-foreground mt-0.5 font-mono font-semibold tabular-nums">14" × 10" × 6"</p>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Handling</span>
                  <p className="text-foreground mt-0.5 font-medium">Fragile Express</p>
                </div>
                <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                  <span className="text-muted-foreground">Tamper Seal</span>
                  <p className="mt-0.5 font-mono font-medium text-emerald-600 dark:text-emerald-400">#SEAL-9842</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security & Chain of Custody Audit Strip */}
      <Card className="border-border bg-muted/20 border shadow-xs">
        <CardContent className="flex flex-col gap-3 p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Chain of Custody Verified · Cryptographically Timestamped & Geofence Locked</span>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 font-mono">
            <span className="text-muted-foreground/80">GPS Lock:</span>
            <button
              type="button"
              onClick={copyGps}
              className="hover:bg-muted focus-visible:ring-ring bg-muted/60 text-foreground inline-flex min-h-6 items-center gap-1 rounded px-1.5 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
              title="Click to copy GPS coordinates"
            >
              <span className="tabular-nums">34.0522°N, 118.2437°W</span>
              {copiedGps ? (
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeliveryProofCard
