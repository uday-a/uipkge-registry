'use client'

import * as React from 'react'
import {
  Boxes,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  DollarSign,
  Download,
  Laptop,
  Layers,
  Lock,
  Monitor,
  Plus,
  Send,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export type WorkstationChoice = 'macbook' | 'thinkpad'

export interface OnboardingEquipmentProvisioningProps {
  className?: string
  initialWorkstation?: WorkstationChoice
  onOrderCustom?: () => void
  onExportManifest?: () => void
}

const WORKSTATION_PRICES: Record<WorkstationChoice, number> = {
  macbook: 3499,
  thinkpad: 2850,
}

const softwareLicenses = [
  {
    name: 'GitHub Enterprise',
    tier: 'Copilot Enterprise + CodeQL',
    seatId: 'GH-ENG-8402',
    category: 'Engineering',
    status: 'Provisioned',
    sso: 'Okta SCIM',
  },
  {
    name: 'Figma Professional',
    tier: 'Design System Editor + Dev Mode',
    seatId: 'FG-DS-1940',
    category: 'Design & UI',
    status: 'Provisioned',
    sso: 'Okta SCIM',
  },
  {
    name: '1Password Business',
    tier: 'Enterprise Vault + Infra Keys',
    seatId: '1P-CORP-9921',
    category: 'Security',
    status: 'Provisioned',
    sso: 'MDM Enrolled',
  },
  {
    name: 'Slack Pro',
    tier: 'Enterprise Grid (acme-eng)',
    seatId: 'SLK-88301',
    category: 'Comms',
    status: 'Provisioned',
    sso: 'SAML 2.0',
  },
  {
    name: 'Datadog APM',
    tier: 'Staff Observability & Traces',
    seatId: 'DD-APM-4109',
    category: 'DevOps',
    status: 'Provisioned',
    sso: 'Okta SCIM',
  },
  {
    name: 'JetBrains All Products',
    tier: 'Ultimate Suite (IntelliJ/CLion/GoLand)',
    seatId: 'JB-ALL-7740',
    category: 'Engineering',
    status: 'Provisioned',
    sso: 'Corp Pool',
  },
]

const trackingSteps = [
  {
    title: 'Order Approved',
    date: 'Aug 24, 2026',
    time: '09:00 AM',
    completed: true,
    current: false,
  },
  {
    title: 'IT Staged & Imaged',
    date: 'Aug 25, 2026',
    time: '02:30 PM',
    completed: true,
    current: false,
  },
  {
    title: 'Shipped via FedEx',
    date: 'Aug 26, 2026',
    time: '06:15 PM',
    completed: true,
    current: true,
  },
  {
    title: 'Out for Delivery',
    date: 'Aug 28, 2026',
    time: 'Est. 08:00 AM',
    completed: false,
    current: false,
  },
  {
    title: 'Delivered to Home',
    date: 'Aug 28, 2026',
    time: 'Est. 10:30 AM',
    completed: false,
    current: false,
  },
]

export function OnboardingEquipmentProvisioning({
  className,
  initialWorkstation = 'macbook',
  onOrderCustom,
  onExportManifest,
}: OnboardingEquipmentProvisioningProps) {
  // State
  const [selectedWorkstation, setSelectedWorkstation] = React.useState<WorkstationChoice>(initialWorkstation)
  const [includeDisplay, setIncludeDisplay] = React.useState(true)
  const [includeInputBundle, setIncludeInputBundle] = React.useState(true)
  const [includeDeskMat, setIncludeDeskMat] = React.useState(true)
  const [includeYubikey, setIncludeYubikey] = React.useState(true)
  const [includeHardwareToken, setIncludeHardwareToken] = React.useState(true)

  const [copiedTracking, setCopiedTracking] = React.useState(false)
  const [copiedEmpId, setCopiedEmpId] = React.useState(false)
  const [showCustomOrderModal, setShowCustomOrderModal] = React.useState(false)
  const [customRequestSubmitted, setCustomRequestSubmitted] = React.useState(false)
  const [customItemName, setCustomItemName] = React.useState('')
  const [customItemJustification, setCustomItemJustification] = React.useState('')

  // Costs
  const workstationCost = WORKSTATION_PRICES[selectedWorkstation]
  const displayCost = includeDisplay ? 1499 : 0
  const inputBundleCost = includeInputBundle ? 249 : 0
  const deskMatCost = includeDeskMat ? 49 : 0
  const yubikeyCost = includeYubikey ? 75 : 0
  const hardwareTokenCost = includeHardwareToken ? 49 : 0

  const peripheralsTotal = displayCost + inputBundleCost + deskMatCost
  const securityTotal = yubikeyCost + hardwareTokenCost
  const totalInvestment = workstationCost + peripheralsTotal + securityTotal

  const copyTrackingNumber = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('TRK-8492019')
      setCopiedTracking(true)
      setTimeout(() => {
        setCopiedTracking(false)
      }, 2000)
    }
  }, [])

  const copyEmployeeId = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('EMP-88291')
      setCopiedEmpId(true)
      setTimeout(() => {
        setCopiedEmpId(false)
      }, 2000)
    }
  }, [])

  const handleOpenCustomOrder = React.useCallback(() => {
    setShowCustomOrderModal(true)
    onOrderCustom?.()
  }, [onOrderCustom])

  const handleCloseCustomOrder = React.useCallback(() => {
    setShowCustomOrderModal(false)
    setCustomRequestSubmitted(false)
    setCustomItemName('')
    setCustomItemJustification('')
  }, [])

  const submitCustomRequest = React.useCallback(() => {
    if (customItemName.trim()) {
      setCustomRequestSubmitted(true)
      setTimeout(() => {
        handleCloseCustomOrder()
      }, 2000)
    }
  }, [customItemName, handleCloseCustomOrder])

  return (
    <div data-slot="onboarding-equipment-provisioning" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title & Hire Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                <Boxes className="text-primary size-3.5" aria-hidden="true" />
                IT Asset Provisioning
              </Badge>
              {/* Emerald Status Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Hardware Assigned · Shipped via FedEx
              </div>
            </div>

            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              New Hire Hardware &amp; IT Provisioning
            </h1>

            {/* New Hire Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
              <span className="text-foreground font-semibold">Elena Rostova</span>
              <span className="text-muted-foreground hidden sm:inline">&bull;</span>
              <span className="text-muted-foreground">Senior Staff Engineer</span>
              <span className="text-muted-foreground hidden sm:inline">&bull;</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                Start Date: <strong className="text-foreground font-medium">Sep 01, 2026</strong>
              </span>
              <span className="text-muted-foreground hidden sm:inline">&bull;</span>
              <button
                type="button"
                className="hover:bg-muted focus-visible:ring-ring border-border bg-muted/40 text-foreground inline-flex min-h-6 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                title="Click to copy employee ID"
                onClick={copyEmployeeId}
              >
                EMP-88291
                {copiedEmpId ? (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs shadow-xs"
              onClick={onExportManifest}
            >
              <Download className="size-3.5" aria-hidden="true" />
              <span>Export Manifest</span>
            </Button>

            <Button size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handleOpenCustomOrder}>
              <Plus className="size-3.5" aria-hidden="true" />
              <span>Order Custom Hardware</span>
            </Button>
          </div>
        </div>

        {/* Financial & Overview Summary Band */}
        <Separator />
        <div className="grid grid-cols-2 gap-4 pt-1 sm:grid-cols-4">
          <div className="border-border/60 bg-muted/20 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <DollarSign className="text-primary size-3.5" aria-hidden="true" />
              <span>Total IT Investment</span>
            </div>
            <p className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums sm:text-xl">
              ${totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs">Total Assigned Value</p>
          </div>

          <div className="border-border/60 bg-muted/20 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Laptop className="text-primary size-3.5" aria-hidden="true" />
              <span>Primary Workstation</span>
            </div>
            <p className="text-foreground mt-1 truncate text-xs font-semibold sm:text-sm">
              {selectedWorkstation === 'macbook' ? 'MacBook Pro 16" M3 Max' : 'ThinkPad P1 Gen 6 i9'}
            </p>
            <p className="text-muted-foreground font-mono text-xs tabular-nums">${workstationCost.toFixed(2)}</p>
          </div>

          <div className="border-border/60 bg-muted/20 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Layers className="text-primary size-3.5" aria-hidden="true" />
              <span>Cloud SaaS Seats</span>
            </div>
            <p className="text-foreground mt-1 text-xs font-semibold sm:text-sm">6 Enterprise Licenses</p>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">All Provisioned</p>
          </div>

          <div className="border-border/60 bg-muted/20 rounded-lg border p-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Truck className="text-primary size-3.5" aria-hidden="true" />
              <span>FedEx Priority</span>
            </div>
            <p className="text-foreground mt-1 text-xs font-semibold sm:text-sm">Est. Aug 28, 2026</p>
            <p className="text-muted-foreground font-mono text-xs">#TRK-8492019</p>
          </div>
        </div>
      </div>

      {/* 4 IT Provisioning Pillar Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pillar 1: Primary Workstation Selection */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Laptop className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">1. Primary Workstation</CardTitle>
                  <CardDescription>Select standard issue macOS or Linux developer laptop</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Pillar 01
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <RadioGroup
              value={selectedWorkstation}
              onValueChange={(val) => setSelectedWorkstation(val as WorkstationChoice)}
              className="grid grid-cols-1 gap-3"
            >
              {/* Choice A: MacBook Pro 16" */}
              <label
                htmlFor="ws-macbook-react"
                className={cn(
                  'relative flex cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all',
                  selectedWorkstation === 'macbook'
                    ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <RadioGroupItem id="ws-macbook-react" value="macbook" className="mt-1" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-foreground text-sm font-bold">
                          MacBook Pro 16" (M3 Max · 64GB RAM · 1TB SSD)
                        </span>
                        <Badge variant="default" className="text-xs">
                          Selected Spec
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Apple M3 Max (16-core CPU, 40-core GPU) &bull; 64GB Unified Memory &bull; 1TB Fast NVMe &bull;
                        Liquid Retina XDR (Space Black)
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge wrap variant="secondary" className="font-mono text-xs">
                          <ShieldCheck
                            className="mr-1 size-3 text-emerald-600 dark:text-emerald-400"
                            aria-hidden="true"
                          />
                          AppleCare+ Enterprise (3-Year Full Accidental Damage)
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground font-mono text-sm font-bold tabular-nums">$3,499.00</span>
                  </div>
                </div>
              </label>

              {/* Choice B: ThinkPad P1 Gen 6 */}
              <label
                htmlFor="ws-thinkpad-react"
                className={cn(
                  'relative flex cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all',
                  selectedWorkstation === 'thinkpad'
                    ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <RadioGroupItem id="ws-thinkpad-react" value="thinkpad" className="mt-1" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-foreground text-sm font-bold">
                          ThinkPad P1 Gen 6 (Intel i9 · 64GB RAM · Ubuntu Linux)
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Linux Spec
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Intel Core i9-13900H &bull; NVIDIA RTX 4080 (12GB) &bull; 64GB DDR5 &bull; 1TB NVMe &bull; 16"
                        WQXGA OLED &bull; Ubuntu 24.04 LTS
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge wrap variant="secondary" className="font-mono text-xs">
                          <ShieldCheck
                            className="mr-1 size-3 text-emerald-600 dark:text-emerald-400"
                            aria-hidden="true"
                          />
                          Lenovo Premier Support (3-Year Next-Day Onsite)
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground font-mono text-sm font-bold tabular-nums">$2,850.00</span>
                  </div>
                </div>
              </label>
            </RadioGroup>
          </CardContent>

          <CardFooter className="border-border/60 bg-muted/20 flex items-center justify-between border-t py-2.5 text-xs">
            <span className="text-muted-foreground">Workstation Subtotal:</span>
            <span className="text-foreground font-mono font-bold tabular-nums">${workstationCost.toFixed(2)}</span>
          </CardFooter>
        </Card>

        {/* Pillar 2: Display & Peripherals */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Monitor className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">2. Display &amp; Peripherals</CardTitle>
                  <CardDescription>High-resolution retina display and ergonomic peripherals</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Pillar 02
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Item 1: Studio Display */}
            <div
              className={cn(
                'border-border flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors',
                includeDisplay ? 'bg-card' : 'bg-muted/30 opacity-70',
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="react-periph-display"
                  checked={includeDisplay}
                  onCheckedChange={(c) => setIncludeDisplay(Boolean(c))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <label
                    htmlFor="react-periph-display"
                    className="text-foreground cursor-pointer text-sm font-semibold"
                  >
                    Studio Display 27" 5K Retina
                  </label>
                  <p className="text-muted-foreground text-xs">
                    5120×2880 Retina &bull; 600 nits &bull; 12MP Center Stage Camera &bull; Studio Mics &bull;
                    Tilt-adjustable Stand
                  </p>
                  <div className="pt-1">
                    <Badge variant="secondary" className="text-xs">
                      Thunderbolt 3 Host Pass-Through
                    </Badge>
                  </div>
                </div>
              </div>
              <span className="text-foreground font-mono text-sm font-bold tabular-nums">$1,499.00</span>
            </div>

            {/* Item 2: Magic Keyboard & Trackpad */}
            <div
              className={cn(
                'border-border flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors',
                includeInputBundle ? 'bg-card' : 'bg-muted/30 opacity-70',
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="react-periph-inputs"
                  checked={includeInputBundle}
                  onCheckedChange={(c) => setIncludeInputBundle(Boolean(c))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <label htmlFor="react-periph-inputs" className="text-foreground cursor-pointer text-sm font-semibold">
                    Magic Keyboard &amp; Trackpad Bundle
                  </label>
                  <p className="text-muted-foreground text-xs">
                    Touch ID Wireless Keyboard &bull; Force Touch Multi-Touch Glass Trackpad &bull; Space Black finish
                  </p>
                  <div className="pt-1">
                    <Badge variant="secondary" className="text-xs">
                      USB-C Braided Woven Cable
                    </Badge>
                  </div>
                </div>
              </div>
              <span className="text-foreground font-mono text-sm font-bold tabular-nums">$249.00</span>
            </div>

            {/* Item 3: Ergonomic Desk Mat */}
            <div
              className={cn(
                'border-border flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors',
                includeDeskMat ? 'bg-card' : 'bg-muted/30 opacity-70',
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="react-periph-mat"
                  checked={includeDeskMat}
                  onCheckedChange={(c) => setIncludeDeskMat(Boolean(c))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <label htmlFor="react-periph-mat" className="text-foreground cursor-pointer text-sm font-semibold">
                    Ergonomic Standing Desk Mat
                  </label>
                  <p className="text-muted-foreground text-xs">
                    24" × 36" Anti-fatigue high-density polyurethane core &bull; Contoured active standing terrain
                  </p>
                </div>
              </div>
              <span className="text-foreground font-mono text-sm font-bold tabular-nums">$49.00</span>
            </div>
          </CardContent>

          <CardFooter className="border-border/60 bg-muted/20 flex items-center justify-between border-t py-2.5 text-xs">
            <span className="text-muted-foreground">Peripherals Subtotal:</span>
            <span className="text-foreground font-mono font-bold tabular-nums">${peripheralsTotal.toFixed(2)}</span>
          </CardFooter>
        </Card>

        {/* Pillar 3: Security & Authentication Hardware */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">3. Security &amp; Authentication Hardware</CardTitle>
                  <CardDescription>Zero-trust physical tokens and cryptographic hardware keys</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Pillar 03
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Item 1: YubiKey 5C NFC */}
            <div
              className={cn(
                'border-border flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors',
                includeYubikey ? 'bg-card' : 'bg-muted/30 opacity-70',
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="react-sec-yubikey"
                  checked={includeYubikey}
                  onCheckedChange={(c) => setIncludeYubikey(Boolean(c))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="react-sec-yubikey" className="text-foreground cursor-pointer text-sm font-semibold">
                      YubiKey 5C NFC (2-Pack · Primary &amp; Backup)
                    </label>
                    <Badge variant="outline" className="font-mono text-xs">
                      FIDO2 / WebAuthn
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Dual-key pair for primary keychain and secure home backup &bull; USB-C &bull; Contactless NFC &bull;
                    IP68 water resistant
                  </p>
                  <p className="text-muted-foreground pt-0.5 font-mono text-xs">
                    Pre-enrolled Serials: <span className="text-foreground font-medium">#YB-90281-A / #YB-90281-B</span>
                  </p>
                </div>
              </div>
              <span className="text-foreground font-mono text-sm font-bold tabular-nums">$75.00</span>
            </div>

            {/* Item 2: Encrypted Hardware Token */}
            <div
              className={cn(
                'border-border flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors',
                includeHardwareToken ? 'bg-card' : 'bg-muted/30 opacity-70',
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="react-sec-token"
                  checked={includeHardwareToken}
                  onCheckedChange={(c) => setIncludeHardwareToken(Boolean(c))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="react-sec-token" className="text-foreground cursor-pointer text-sm font-semibold">
                      Encrypted Hardware Token
                    </label>
                    <Badge variant="outline" className="font-mono text-xs">
                      FIPS 140-3 Level 3
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    AES-256 hardware cryptographic security token with PIN pad &bull; Corporate Root CA Certificate
                    pre-loaded
                  </p>
                  <p className="text-muted-foreground pt-0.5 font-mono text-xs">
                    Device Serial: <span className="text-foreground font-medium">#ET-78392-X</span>
                  </p>
                </div>
              </div>
              <span className="text-foreground font-mono text-sm font-bold tabular-nums">$49.00</span>
            </div>

            {/* Compliance Strip */}
            <div className="border-border/60 bg-muted/20 flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>SOC 2 Type II &amp; FedRAMP High compliant hardware assignment</span>
              </div>
              <span className="font-medium text-emerald-700 dark:text-emerald-400">Enforced</span>
            </div>
          </CardContent>

          <CardFooter className="border-border/60 bg-muted/20 flex items-center justify-between border-t py-2.5 text-xs">
            <span className="text-muted-foreground">Security Hardware Subtotal:</span>
            <span className="text-foreground font-mono font-bold tabular-nums">${securityTotal.toFixed(2)}</span>
          </CardFooter>
        </Card>

        {/* Pillar 4: Cloud Software & License Seats */}
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Layers className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">4. Cloud Software &amp; License Seats</CardTitle>
                  <CardDescription>6 assigned SaaS enterprise licenses auto-synced via Okta</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Pillar 04
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {softwareLicenses.map((license) => (
                <div
                  key={license.name}
                  className="border-border bg-card flex flex-col justify-between rounded-lg border p-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="text-foreground text-xs font-bold">{license.name}</span>
                      <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <Check className="size-3" aria-hidden="true" />
                        <span>{license.status}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-tight">{license.tier}</p>
                  </div>

                  <div className="border-border/60 mt-2 flex items-center justify-between border-t pt-1.5 text-xs">
                    <span className="text-muted-foreground font-mono text-xs">{license.seatId}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {license.sso}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="border-border/60 bg-muted/20 flex items-center justify-between border-t py-2.5 text-xs">
            <span className="text-muted-foreground">Software Licensing Cost:</span>
            <span className="text-foreground font-mono font-bold tabular-nums">
              Enterprise Corp Pool ($0.00 Direct)
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* Shipping & Delivery Tracking Card */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded-lg p-2">
                <Truck className="size-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Shipping &amp; Delivery Tracking</CardTitle>
                <CardDescription>Direct-to-home courier transit with signature required on delivery</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Carrier: FedEx Priority
              </Badge>
              <button
                type="button"
                className="hover:bg-muted focus-visible:ring-ring border-border bg-muted/40 text-foreground inline-flex min-h-6 items-center gap-1.5 rounded border px-2 py-1 font-mono text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                title="Click to copy tracking number"
                onClick={copyTrackingNumber}
              >
                #TRK-8492019
                {copiedTracking ? (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Address & Courier Info Banner */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
              <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                Shipment Recipient
              </span>
              <p className="text-foreground text-sm font-bold">Elena Rostova</p>
              <p className="text-muted-foreground text-xs">Senior Staff Engineer &bull; Distributed Systems</p>
              <p className="text-muted-foreground text-xs">elena.rostova@acme.corp</p>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
              <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                Destination Address
              </span>
              <p className="text-foreground text-sm font-bold">4820 Grand Avenue, Apt 14B</p>
              <p className="text-muted-foreground text-xs">Seattle, WA 98101-2294</p>
              <p className="text-muted-foreground text-xs">Direct In-Person Signature Required</p>
            </div>

            <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5 sm:col-span-2 lg:col-span-1">
              <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                Estimated Delivery
              </span>
              <p className="text-foreground text-sm font-bold">Thursday, Aug 28, 2026</p>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Estimated by 10:30 AM (Morning Delivery)
              </p>
              <p className="text-muted-foreground text-xs">FedEx Express Priority Overnight</p>
            </div>
          </div>

          {/* 5-Step Progress Stepper */}
          <div className="space-y-2 pt-2">
            <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
              Logistics Timeline Status
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              {trackingSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className={cn(
                    'border-border flex flex-col justify-between rounded-lg border p-3 transition-colors',
                    step.current
                      ? 'border-emerald-500/40 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                      : step.completed
                        ? 'bg-card'
                        : 'bg-muted/20 opacity-60',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground font-mono text-xs">0{idx + 1}</span>
                    {step.completed && !step.current ? (
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : step.current ? (
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                      </span>
                    ) : (
                      <Circle className="text-muted-foreground/50 size-3.5" aria-hidden="true" />
                    )}
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <p
                      className={cn(
                        'text-xs font-bold',
                        step.current
                          ? 'font-bold text-emerald-800 dark:text-emerald-300'
                          : step.completed
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                      )}
                    >
                      {{ ...step }.title}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">{step.date}</p>
                    <p className="text-muted-foreground text-xs">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Hardware Order Modal Dialog */}
      {showCustomOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-hardware-title-react"
        >
          <div className="border-border bg-card animate-in fade-in zoom-in-95 w-full max-w-lg space-y-4 rounded-xl border p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Laptop className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="custom-hardware-title-react" className="text-foreground text-base font-bold">
                    Order Custom Hardware
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Request specialized hardware or accessories for Elena Rostova
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Close dialog"
                onClick={handleCloseCustomOrder}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <Separator />

            {!customRequestSubmitted ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Equipment / Item Name</label>
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="e.g. Ergonomic Split Mechanical Keyboard, 4K Webcam, eGPU"
                    className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Business Justification</label>
                  <textarea
                    value={customItemJustification}
                    onChange={(e) => setCustomItemJustification(e.target.value)}
                    rows={3}
                    placeholder="Provide engineering justification or project requirements..."
                    className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-none rounded-md border px-3 py-2 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                  />
                </div>

                <div className="border-border bg-muted/20 text-muted-foreground rounded-lg border p-3 text-xs">
                  <p>
                    Custom requests are automatically routed to Engineering Management &amp; IT Procurement for budget
                    sign-off.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    aria-label="Close dialog"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={handleCloseCustomOrder}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs"
                    disabled={!customItemName.trim()}
                    onClick={submitCustomRequest}
                  >
                    <Send className="size-3.5" aria-hidden="true" />
                    <span>Submit Request</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-foreground text-sm font-bold">Custom Hardware Request Submitted</h3>
                <p className="text-muted-foreground text-xs">
                  Request for <strong className="text-foreground">{customItemName}</strong> has been forwarded to IT
                  Procurement.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default OnboardingEquipmentProvisioning
