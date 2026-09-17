'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

const defaultPrescriptions: Prescription[] = [
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

export function PrescriptionRefillManager({ className }: { className?: string }) {
  const [prescriptions] = React.useState<Prescription[]>(defaultPrescriptions)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'ready' | 'needs_auth' | 'in_transit'>('all')
  const [activePharmacy, setActivePharmacy] = React.useState<Pharmacy>(availablePharmacies[0])

  // Refill Modal state
  const [isRefillOpen, setIsRefillOpen] = React.useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = React.useState<string>('rx-1')
  const [supplyDuration, setSupplyDuration] = React.useState<'30' | '90'>('90')
  const [deliveryMethod, setDeliveryMethod] = React.useState<'pickup' | 'delivery'>('delivery')
  const [orderSubmitted, setOrderSubmitted] = React.useState(false)

  // Tracking Modal state
  const [isTrackingOpen, setIsTrackingOpen] = React.useState(false)
  const [trackingPrescription, setTrackingPrescription] = React.useState<Prescription | null>(null)

  // Transfer Modal state
  const [isTransferOpen, setIsTransferOpen] = React.useState(false)
  const [transferForm, setTransferForm] = React.useState({
    pharmacyName: '',
    phone: '',
    rxNumber: '',
    medicationName: '',
    notes: '',
  })
  const [transferSubmitted, setTransferSubmitted] = React.useState(false)

  // Change Pharmacy state
  const [isChangePharmacyOpen, setIsChangePharmacyOpen] = React.useState(false)
  const [tempSelectedPharmacyId, setTempSelectedPharmacyId] = React.useState(activePharmacy.id)

  // Prescribing MD Auth Request state
  const [isAuthRequestOpen, setIsAuthRequestOpen] = React.useState(false)
  const [authRequestedRx, setAuthRequestedRx] = React.useState<Prescription | null>(null)
  const [authRequestSubmitted, setAuthRequestSubmitted] = React.useState(false)

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.genericFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.prescriber.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter === 'all') return true
    return rx.status === statusFilter
  })

  const selectedPrescription = prescriptions.find((rx) => rx.id === selectedPrescriptionId) || prescriptions[0]

  const estimatedCopay = supplyDuration === '90' ? 20.0 : selectedPrescription.copayEst
  const estimatedInsuranceSavings = supplyDuration === '90' ? 75.0 : 35.0

  const openRefillModal = (prescriptionId?: string) => {
    if (prescriptionId) {
      setSelectedPrescriptionId(prescriptionId)
    } else {
      const readyMed = prescriptions.find((r) => r.status === 'ready')
      setSelectedPrescriptionId(readyMed ? readyMed.id : prescriptions[0].id)
    }
    setOrderSubmitted(false)
    setIsRefillOpen(true)
  }

  const handleOpenTracking = (rx: Prescription) => {
    setTrackingPrescription(rx)
    setIsTrackingOpen(true)
  }

  const handleOpenAuthRequest = (rx: Prescription) => {
    setAuthRequestedRx(rx)
    setAuthRequestSubmitted(false)
    setIsAuthRequestOpen(true)
  }

  const handleOpenTransfer = () => {
    setTransferForm({
      pharmacyName: '',
      phone: '',
      rxNumber: '',
      medicationName: '',
      notes: '',
    })
    setTransferSubmitted(false)
    setIsTransferOpen(true)
  }

  const handleChangePharmacy = () => {
    setTempSelectedPharmacyId(activePharmacy.id)
    setIsChangePharmacyOpen(true)
  }

  const savePharmacyChange = () => {
    const chosen = availablePharmacies.find((p) => p.id === tempSelectedPharmacyId)
    if (chosen) {
      setActivePharmacy(chosen)
    }
    setIsChangePharmacyOpen(false)
  }

  return (
    <div
      data-slot="prescription-refill-manager"
      className={cn('bg-background text-foreground w-full space-y-6', className)}
    >
      {/* Header Section */}
      <header className="bg-card border-border flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs sm:p-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Pill className="size-4" />
            </div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Prescriptions & Medications
            </h1>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs font-medium">
              Active Care Plan
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage recurring refills, dosage schedules, and home delivery tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" className="gap-1.5 text-xs font-medium" onClick={handleOpenTransfer}>
            <ArrowLeftRight className="size-3.5" />
            Transfer Prescription
          </Button>
          <Button variant="default" className="gap-1.5 text-xs font-medium shadow-xs" onClick={() => openRefillModal()}>
            <Plus className="size-3.5" />
            Request Refill
          </Button>
        </div>
      </header>

      {/* 3 Medication Status Metric Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Active Prescriptions */}
        <Card className="shadow-xs">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Active Prescriptions</p>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">4</span>
                <span className="text-muted-foreground text-xs">Total on file</span>
              </div>
              <p className="text-muted-foreground text-xs">All active maintenance therapies</p>
            </div>
            <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Pill className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Refills Ready for Order */}
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs dark:bg-amber-500/10">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Refills Ready for Order</p>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/15 text-xs font-medium text-amber-700 dark:text-amber-300"
                >
                  2 Action Needed
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-amber-700 tabular-nums dark:text-amber-300">
                  2
                </span>
                <span className="text-xs text-amber-700/80 dark:text-amber-400/80">Meds eligible now</span>
              </div>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80">Metformin HCl & Lisinopril due</p>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* In Delivery / Transit */}
        <Card className="shadow-xs sm:col-span-2 lg:col-span-1">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <p className="text-muted-foreground text-xs font-medium">In Delivery / Transit</p>
                <Badge
                  variant="outline"
                  className="gap-1 border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />1 En Route
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">1</span>
                <span className="text-muted-foreground text-xs">Package tracked</span>
              </div>
              <p className="text-muted-foreground text-xs">Atorvastatin 40mg · USPS Priority</p>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Truck className="size-5" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Preferred Pharmacy Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-muted text-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border">
                <Store className="text-primary size-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base font-semibold">
                    {activePharmacy.name} · {activePharmacy.subtitle}
                  </CardTitle>
                  <Badge variant="secondary" className="gap-1 text-xs font-medium">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    Preferred Pharmacy
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    {activePharmacy.hours}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Default location for prescription fulfillment, drive-thru pick-ups, and transfers.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-xs font-medium"
              onClick={handleChangePharmacy}
            >
              <Building2 className="size-3.5" />
              Change Pharmacy
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3">
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="text-primary size-3.5 shrink-0" />
              <span className="text-foreground truncate font-medium">{activePharmacy.address}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Phone className="text-primary size-3.5 shrink-0" />
              <span>
                Phone: <strong className="text-foreground font-medium">{activePharmacy.phone}</strong>
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="text-primary size-3.5 shrink-0" />
              <span>
                Rx Counter: <strong className="text-foreground font-medium">Ready in 2 hrs</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List Table Section */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Active Prescriptions ({filteredPrescriptions.length})</CardTitle>
              <CardDescription className="text-xs">
                Review remaining refills, dosage instructions, and ordering eligibility.
              </CardDescription>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medication, Rx#, doctor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-input bg-background text-foreground focus-visible:ring-ring h-8 w-full rounded-md border pr-3 pl-8 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 text-xs font-medium',
                    statusFilter === 'all' && 'bg-accent text-accent-foreground',
                  )}
                  onClick={() => setStatusFilter('all')}
                >
                  All ({prescriptions.length})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 text-xs font-medium',
                    statusFilter === 'ready' && 'bg-accent text-accent-foreground text-amber-600 dark:text-amber-400',
                  )}
                  onClick={() => setStatusFilter('ready')}
                >
                  Ready for Refill (2)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 text-xs font-medium',
                    statusFilter === 'in_transit' && 'bg-accent text-accent-foreground',
                  )}
                  onClick={() => setStatusFilter('in_transit')}
                >
                  In Transit (1)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 text-xs font-medium',
                    statusFilter === 'needs_auth' &&
                      'bg-accent text-accent-foreground text-rose-600 dark:text-rose-400',
                  )}
                  onClick={() => setStatusFilter('needs_auth')}
                >
                  Needs Auth (1)
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[220px] text-xs font-semibold">Medication & Rx#</TableHead>
                <TableHead className="min-w-[240px] text-xs font-semibold">Directions & Dosage</TableHead>
                <TableHead className="min-w-[170px] text-xs font-semibold">Refill Status</TableHead>
                <TableHead className="min-w-[160px] text-xs font-semibold">Fill Dates / Schedule</TableHead>
                <TableHead className="min-w-[180px] text-xs font-semibold">Prescribing Doctor</TableHead>
                <TableHead className="min-w-[150px] text-right text-xs font-semibold">Quick Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((rx) => (
                <TableRow
                  key={rx.id}
                  className={cn(
                    'transition-colors',
                    rx.status === 'ready' && 'bg-amber-500/[0.02] dark:bg-amber-500/[0.04]',
                  )}
                >
                  {/* Medication Name & Rx# */}
                  <TableCell className="py-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground text-sm font-semibold">{rx.name}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">{rx.genericFor}</p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                          {rx.rxNumber}
                        </span>
                        <span className="text-muted-foreground text-xs">NDC: {rx.ndc}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Directions & Dosage */}
                  <TableCell className="py-4 align-top">
                    <div className="space-y-1">
                      <p className="text-foreground text-xs leading-relaxed font-medium">{rx.instructions}</p>
                      <p className="text-muted-foreground text-xs">
                        Form: <span className="text-foreground font-medium">{rx.dosageForm}</span> · Qty:{' '}
                        <span className="font-mono tabular-nums">{rx.daysSupply} Days</span>
                      </p>
                    </div>
                  </TableCell>

                  {/* Refill Status Badge */}
                  <TableCell className="py-4 align-top">
                    <div className="space-y-1.5">
                      {rx.status === 'ready' && (
                        <div>
                          <Badge
                            variant="outline"
                            className="gap-1 border-amber-500/40 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                          >
                            <AlertCircle className="size-3" />
                            {rx.refillsRemaining} refills remaining
                          </Badge>
                        </div>
                      )}
                      {rx.status === 'needs_auth' && (
                        <div>
                          <Badge
                            variant="destructive"
                            className="bg-destructive/15 text-destructive dark:text-destructive-foreground dark:bg-destructive/30 gap-1 border-transparent text-xs font-medium"
                          >
                            <ShieldAlert className="size-3" />0 refills - Needs MD authorization
                          </Badge>
                        </div>
                      )}
                      {rx.status === 'in_transit' && (
                        <div>
                          <Badge
                            variant="outline"
                            className="gap-1 border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                          >
                            <Truck className="size-3" />
                            In Transit · Est. Arrival Today
                          </Badge>
                        </div>
                      )}
                      {rx.status === 'active' && (
                        <div>
                          <Badge variant="secondary" className="text-xs font-medium">
                            {rx.refillsRemaining} of {rx.totalRefills} remaining
                          </Badge>
                        </div>
                      )}

                      <p className="text-muted-foreground text-xs tabular-nums">
                        Est. Copay: <strong className="text-foreground">${rx.copayEst}.00</strong>
                      </p>
                    </div>
                  </TableCell>

                  {/* Fill Dates / Schedule */}
                  <TableCell className="py-4 align-top text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3 shrink-0" />
                        <span>
                          Last Filled:{' '}
                          <strong className="text-foreground font-medium tabular-nums">{rx.lastFilledDate}</strong>
                        </span>
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-1.5 font-medium tabular-nums',
                          rx.isDue ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-muted-foreground',
                        )}
                      >
                        <Clock className="size-3 shrink-0" />
                        <span>Next Due: {rx.nextDueDate}</span>
                      </div>
                      {rx.isDue && (
                        <span className="inline-block text-xs font-medium text-amber-600 dark:text-amber-400">
                          Refill window open
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Prescribing Doctor */}
                  <TableCell className="py-4 align-top text-xs">
                    <div className="space-y-0.5">
                      <p className="text-foreground font-medium">{rx.prescriber.name}</p>
                      <p className="text-muted-foreground">{rx.prescriber.specialty}</p>
                      <p className="text-muted-foreground truncate text-xs">{rx.prescriber.clinic}</p>
                    </div>
                  </TableCell>

                  {/* Quick Action & Dropdown Menu */}
                  <TableCell className="py-4 text-right align-top">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Ready state: Order Refill Button */}
                      {rx.status === 'ready' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 gap-1 text-xs font-medium shadow-xs"
                          onClick={() => openRefillModal(rx.id)}
                        >
                          <RefreshCw className="size-3" />
                          Order Refill
                        </Button>
                      )}

                      {/* Needs Auth State: Request MD Auth */}
                      {rx.status === 'needs_auth' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs font-medium"
                          onClick={() => handleOpenAuthRequest(rx)}
                        >
                          <Clock className="size-3" />
                          Request Auth
                        </Button>
                      )}

                      {/* In Transit State: Track Package */}
                      {rx.status === 'in_transit' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 gap-1 text-xs font-medium"
                          onClick={() => handleOpenTracking(rx)}
                        >
                          <Truck className="size-3 text-blue-500" />
                          Track
                        </Button>
                      )}

                      {/* Row Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8" aria-label="Prescription options">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel className="text-xs font-semibold">Rx Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {rx.status === 'ready' && (
                            <DropdownMenuItem className="gap-2 text-xs" onClick={() => openRefillModal(rx.id)}>
                              <RefreshCw className="text-primary size-3.5" />
                              Order Refill (30/90 Days)
                            </DropdownMenuItem>
                          )}
                          {rx.status === 'needs_auth' && (
                            <DropdownMenuItem
                              className="text-destructive gap-2 text-xs"
                              onClick={() => handleOpenAuthRequest(rx)}
                            >
                              <ShieldAlert className="size-3.5" />
                              Request MD Renewal
                            </DropdownMenuItem>
                          )}
                          {rx.packageTracking && (
                            <DropdownMenuItem className="gap-2 text-xs" onClick={() => handleOpenTracking(rx)}>
                              <Truck className="size-3.5 text-blue-500" />
                              Track USPS Delivery
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2 text-xs" onClick={handleOpenTransfer}>
                            <ArrowLeftRight className="size-3.5" />
                            Transfer to Another Pharmacy
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-xs">
                            <FileText className="text-muted-foreground size-3.5" />
                            View Full Drug Monograph
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-xs">
                            <Phone className="text-muted-foreground size-3.5" />
                            Call Prescriber ({rx.prescriber.phone})
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <CardFooter className="bg-muted/30 border-border text-muted-foreground flex flex-col justify-between gap-3 border-t p-4 text-xs sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Info className="text-primary size-3.5 shrink-0" />
            <span>Refills requested before 3:00 PM are processed same-day by our clinical pharmacy team.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Automatic Refill Program: <strong className="text-foreground font-medium">Enabled</strong>
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Refill Request Modal / Dialog */}
      <Dialog open={isRefillOpen} onOpenChange={setIsRefillOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <RefreshCw className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Request Prescription Refill</DialogTitle>
                <DialogDescription className="text-xs">
                  Select your supply duration, delivery method, and confirm your copay.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* If order submitted success view */}
          {orderSubmitted ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-700 dark:text-emerald-300">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-base font-bold">Refill Order Successfully Placed!</h3>
                <p className="mx-auto max-w-md text-xs text-emerald-700/90 dark:text-emerald-300/90">
                  Your order for <strong>{selectedPrescription.name}</strong> ({supplyDuration}-day supply) has been
                  sent to {activePharmacy.name}.
                </p>
                <p className="pt-1 font-mono text-xs font-medium">Order Ref: #ORD-849302</p>
              </div>

              <div className="bg-muted/40 text-muted-foreground space-y-1.5 rounded-lg border p-3 text-xs">
                <div className="flex justify-between">
                  <span>Fulfillment Method:</span>
                  <strong className="text-foreground">
                    {deliveryMethod === 'delivery' ? 'Express Home Delivery (1-2 Days)' : 'In-Store Pickup'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Copay:</span>
                  <strong className="text-foreground font-mono tabular-nums">${estimatedCopay.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Refills After This Order:</span>
                  <strong className="text-foreground tabular-nums">
                    {Math.max(0, selectedPrescription.refillsRemaining - 1)}
                  </strong>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="default" className="w-full" onClick={() => setIsRefillOpen(false)}>
                  Done & Return to Prescriptions
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-5 py-2">
              {/* Medication Selector / Summary Box */}
              <div className="bg-muted/40 border-border space-y-3 rounded-xl border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-xs font-semibold">Selected Prescription</p>
                    <h4 className="text-foreground text-sm font-bold">{selectedPrescription.name}</h4>
                    <p className="text-muted-foreground text-xs">{selectedPrescription.genericFor}</p>
                  </div>
                  <div className="space-y-0.5 text-left sm:text-right">
                    <span className="bg-background rounded border px-2 py-0.5 font-mono text-xs font-medium">
                      {selectedPrescription.rxNumber}
                    </span>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {selectedPrescription.refillsRemaining} refills remaining
                    </p>
                  </div>
                </div>

                <div className="text-muted-foreground flex items-center justify-between border-t pt-2.5 text-xs">
                  <span>
                    Prescriber:{' '}
                    <strong className="text-foreground font-medium">{selectedPrescription.prescriber.name}</strong>
                  </span>
                  <span>
                    Directions:{' '}
                    <strong className="text-foreground font-medium">{selectedPrescription.instructions}</strong>
                  </span>
                </div>
              </div>

              {/* Quantity / Supply Selector */}
              <div className="space-y-2.5">
                <label className="text-foreground flex items-center justify-between text-xs font-semibold">
                  <span>Choose Supply Quantity</span>
                  <span className="text-muted-foreground font-normal">Insurance Tier 1 Preferred</span>
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* 30-Day Supply Option */}
                  <button
                    type="button"
                    className={cn(
                      'flex cursor-pointer flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-150',
                      supplyDuration === '30'
                        ? 'border-primary bg-primary/5 ring-primary ring-1'
                        : 'border-border bg-card hover:bg-muted/50',
                    )}
                    onClick={() => setSupplyDuration('30')}
                  >
                    <div className="mb-1 flex w-full items-center justify-between">
                      <span className="text-foreground text-xs font-bold">30-Day Supply</span>
                      <span className="text-foreground font-mono text-xs font-bold tabular-nums">$10.00</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Standard monthly bottle (30 tablets)</p>
                    <span className="text-muted-foreground mt-2 text-xs">Local pickup or standard mail</span>
                  </button>

                  {/* 90-Day Supply Option (Recommended) */}
                  <button
                    type="button"
                    className={cn(
                      'relative flex cursor-pointer flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-150',
                      supplyDuration === '90'
                        ? 'border-primary bg-primary/5 ring-primary ring-1'
                        : 'border-border bg-card hover:bg-muted/50',
                    )}
                    onClick={() => setSupplyDuration('90')}
                  >
                    <div className="mb-1 flex w-full items-center justify-between">
                      <span className="text-foreground text-xs font-bold">90-Day Mail Order</span>
                      <span className="text-foreground font-mono text-xs font-bold tabular-nums">$20.00</span>
                    </div>
                    <p className="text-muted-foreground text-xs">3-Month Supply (90 tablets)</p>
                    <Badge
                      variant="outline"
                      className="mt-2 border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      Save $10 on Copay
                    </Badge>
                  </button>
                </div>
              </div>

              {/* Delivery Method Selector */}
              <div className="space-y-2.5">
                <label className="text-foreground text-xs font-semibold">Select Delivery & Fulfillment Method</label>

                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(val) => setDeliveryMethod(val as 'pickup' | 'delivery')}
                  className="gap-2.5"
                >
                  {/* Free Express Home Delivery */}
                  <label
                    htmlFor="delivery-option"
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all',
                      deliveryMethod === 'delivery'
                        ? 'border-primary bg-primary/5 ring-primary ring-1'
                        : 'border-border bg-card hover:bg-muted/30',
                    )}
                  >
                    <RadioGroupItem value="delivery" id="delivery-option" className="mt-0.5" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                          <Truck className="text-primary size-3.5" />
                          Free Express Home Delivery
                        </span>
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                          FREE 2-Day
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Ships to: <strong>1420 Ocean Ave, Apt 4B, Santa Monica, CA</strong>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Estimated arrival in 1–2 business days via USPS Priority
                      </p>
                    </div>
                  </label>

                  {/* Pharmacy Pickup */}
                  <label
                    htmlFor="pickup-option"
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all',
                      deliveryMethod === 'pickup'
                        ? 'border-primary bg-primary/5 ring-primary ring-1'
                        : 'border-border bg-card hover:bg-muted/30',
                    )}
                  >
                    <RadioGroupItem value="pickup" id="pickup-option" className="mt-0.5" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                          <Store className="text-primary size-3.5" />
                          In-Store / Drive-Thru Pickup
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ready Today</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {activePharmacy.name} · {activePharmacy.address}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Ready for pickup in ~2 hours. 24-Hour drive-thru accessible.
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Copay and Cost Breakdown */}
              <div className="bg-muted/50 space-y-2 rounded-xl border p-3.5 text-xs">
                <div className="text-muted-foreground flex justify-between">
                  <span>Medication Retail Cost:</span>
                  <span className="font-mono tabular-nums line-through">
                    ${(estimatedCopay + estimatedInsuranceSavings).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Insurance Coverage (Aetna Choice POS II):</span>
                  <span className="font-mono tabular-nums">-${estimatedInsuranceSavings.toFixed(2)}</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">FREE</span>
                </div>
                <Separator />
                <div className="text-foreground flex items-center justify-between pt-0.5 text-sm font-bold">
                  <span>Estimated Out-of-Pocket:</span>
                  <span className="text-primary font-mono text-base tabular-nums">${estimatedCopay.toFixed(2)}</span>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between gap-2 pt-2 sm:justify-end">
                <Button variant="outline" onClick={() => setIsRefillOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" className="gap-1.5 shadow-xs" onClick={() => setOrderSubmitted(true)}>
                  <Check className="size-4" />
                  Submit Refill Order
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tracking Modal / Dialog */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent className="sm:max-w-lg">
          {trackingPrescription && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Truck className="size-4" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold">Delivery & Tracking Status</DialogTitle>
                    <DialogDescription className="text-xs">
                      Tracking details for {trackingPrescription.name}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {trackingPrescription.packageTracking && (
                <div className="space-y-4 py-2 text-xs">
                  {/* Tracking Header Banner */}
                  <div className="bg-muted/40 border-border space-y-2 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Carrier & Service:</span>
                      <strong className="text-foreground">{trackingPrescription.packageTracking.carrier}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tracking Number:</span>
                      <strong className="text-foreground font-mono">
                        {trackingPrescription.packageTracking.trackingNumber}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-600 dark:text-blue-400"
                      >
                        {trackingPrescription.packageTracking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between border-t pt-1">
                      <span className="text-muted-foreground">Estimated Delivery:</span>
                      <strong className="text-foreground font-bold">
                        {trackingPrescription.packageTracking.estimatedArrival}
                      </strong>
                    </div>
                  </div>

                  {/* Step Timeline Tracker */}
                  <div className="space-y-3 pl-2">
                    <p className="text-foreground text-xs font-semibold">Package History Timeline</p>
                    <div className="border-border relative ml-2 space-y-4 border-l pl-4">
                      {trackingPrescription.packageTracking.steps.map((step, idx) => (
                        <div key={idx} className="relative space-y-0.5">
                          <div
                            className={cn(
                              'ring-background absolute top-0.5 -left-[23px] flex size-3.5 items-center justify-center rounded-full ring-2',
                              step.current
                                ? 'animate-pulse bg-blue-500 ring-blue-500'
                                : step.done
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted border',
                            )}
                          />
                          <p
                            className={cn(
                              'text-xs font-semibold',
                              step.current ? 'text-blue-600 dark:text-blue-400' : 'text-foreground',
                            )}
                          >
                            {step.title}
                          </p>
                          <p className="text-muted-foreground text-xs tabular-nums">{step.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsTrackingOpen(false)}>
                  Close Tracking
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Transfer Prescription Modal / Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <ArrowLeftRight className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Transfer Prescription</DialogTitle>
                <DialogDescription className="text-xs">
                  Move an existing prescription from another pharmacy to {activePharmacy.name}.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {transferSubmitted ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-700 dark:text-emerald-300">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-base font-bold">Transfer Request Submitted!</h3>
                <p className="mx-auto max-w-sm text-xs text-emerald-700/90 dark:text-emerald-300/90">
                  Our clinical pharmacy team will contact your previous pharmacy to transfer the prescription. This
                  typically takes 24–48 hours.
                </p>
              </div>
              <DialogFooter>
                <Button variant="default" className="w-full" onClick={() => setIsTransferOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="space-y-1">
                <label className="text-foreground text-xs font-medium">Current / Previous Pharmacy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Walgreens, Rite Aid, Walmart..."
                  value={transferForm.pharmacyName}
                  onChange={(e) => setTransferForm({ ...transferForm, pharmacyName: e.target.value })}
                  className="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-foreground text-xs font-medium">Pharmacy Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={transferForm.phone}
                    onChange={(e) => setTransferForm({ ...transferForm, phone: e.target.value })}
                    className="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-foreground text-xs font-medium">Existing Rx Number (if known)</label>
                  <input
                    type="text"
                    placeholder="e.g. RX-123456"
                    value={transferForm.rxNumber}
                    onChange={(e) => setTransferForm({ ...transferForm, rxNumber: e.target.value })}
                    className="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 font-mono text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-foreground text-xs font-medium">Medication Name & Strength</label>
                <input
                  type="text"
                  placeholder="e.g. Lipitor 20mg or Levothyroxine 50mcg"
                  value={transferForm.medicationName}
                  onChange={(e) => setTransferForm({ ...transferForm, medicationName: e.target.value })}
                  className="border-input bg-background text-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground text-xs font-medium">
                  Special Instructions / Prescriber Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any additional notes for the receiving pharmacist..."
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  className="border-input bg-background text-foreground focus-visible:ring-ring w-full rounded-md border p-2 text-xs shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" className="gap-1.5 shadow-xs" onClick={() => setTransferSubmitted(true)}>
                  <ArrowLeftRight className="size-3.5" />
                  Initiate Transfer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Preferred Pharmacy Modal / Dialog */}
      <Dialog open={isChangePharmacyOpen} onOpenChange={setIsChangePharmacyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Select Preferred Pharmacy</DialogTitle>
                <DialogDescription className="text-xs">
                  Choose the location where your local orders and drive-thru pickups are routed.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {availablePharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className={cn(
                  'flex cursor-pointer items-start justify-between rounded-xl border p-3.5 transition-all',
                  tempSelectedPharmacyId === pharmacy.id
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
                onClick={() => setTempSelectedPharmacyId(pharmacy.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold">{pharmacy.name}</span>
                    {pharmacy.id === activePharmacy.id && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{pharmacy.address}</p>
                  <div className="text-muted-foreground flex items-center gap-3 pt-1">
                    <span>
                      Phone: <strong className="text-foreground font-medium">{pharmacy.phone}</strong>
                    </span>
                    <span>{pharmacy.hours}</span>
                  </div>
                </div>
                <div className="pt-0.5">
                  <div
                    className={cn(
                      'flex size-4 items-center justify-center rounded-full border',
                      tempSelectedPharmacyId === pharmacy.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40',
                    )}
                  >
                    {tempSelectedPharmacyId === pharmacy.id && <div className="bg-background size-1.5 rounded-full" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsChangePharmacyOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={savePharmacyChange}>
              Save Preferred Pharmacy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request MD Authorization Modal / Dialog */}
      <Dialog open={isAuthRequestOpen} onOpenChange={setIsAuthRequestOpen}>
        <DialogContent className="sm:max-w-md">
          {authRequestedRx && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-destructive/10 text-destructive flex size-8 items-center justify-center rounded-lg">
                    <ShieldAlert className="size-4" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold">Request Prescriber Authorization</DialogTitle>
                    <DialogDescription className="text-xs">
                      Renew zero-refill prescription with your physician.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {authRequestSubmitted ? (
                <div className="space-y-3 py-4 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h3 className="text-foreground text-sm font-bold">Authorization Request Sent!</h3>
                  <p className="text-muted-foreground text-xs">
                    A renewal request for <strong>{authRequestedRx.name}</strong> has been electronically transmitted to{' '}
                    <strong>{authRequestedRx.prescriber.name}</strong>.
                  </p>
                  <DialogFooter className="pt-2">
                    <Button variant="default" className="w-full" onClick={() => setIsAuthRequestOpen(false)}>
                      Done
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4 py-2 text-xs">
                  <div className="bg-muted/40 space-y-1.5 rounded-xl border p-3.5">
                    <p className="text-foreground font-bold">{authRequestedRx.name}</p>
                    <p className="text-muted-foreground">{authRequestedRx.genericFor}</p>
                    <p className="text-muted-foreground">
                      Prescribing Physician:{' '}
                      <strong className="text-foreground">{authRequestedRx.prescriber.name}</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Clinic: {authRequestedRx.prescriber.clinic} ({authRequestedRx.prescriber.phone})
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Because this prescription has 0 refills remaining, we will send an electronic request
                    (e-Prescription Renewal) directly to your doctor&apos;s office.
                  </p>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAuthRequestOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="default" className="gap-1.5" onClick={() => setAuthRequestSubmitted(true)}>
                      <Check className="size-3.5" />
                      Send Renewal Request
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
