'use client'

import * as React from 'react'
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

export interface CommuteReimbursementClaimsProps {
  title?: string
  policyText?: string
  claimPeriod?: string
  className?: string
}

const categoryMeta: Record<
  CommuteCategory,
  {
    label: string
    shortLabel: string
    badgeClass: string
    icon: React.ComponentType<{ className?: string }>
    irsLimitInfo: string
  }
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

const initialClaimsData: ExpenseClaim[] = [
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
]

export function CommuteReimbursementClaims({
  title = 'Commute & Transit Expense Claims',
  policyText = 'Monthly Commuter Benefit Program · Up to $315.00/mo IRS pre-tax limit',
  claimPeriod = 'August 2026',
  className,
}: CommuteReimbursementClaimsProps) {
  const [claims, setClaims] = React.useState<ExpenseClaim[]>(initialClaimsData)

  // Form State
  const [formCategory, setFormCategory] = React.useState<CommuteCategory>('transit')
  const [formDate, setFormDate] = React.useState('2026-08-20')
  const [formProvider, setFormProvider] = React.useState('BART Clipper Card')
  const [formDescription, setFormDescription] = React.useState('Monthly BART Clipper Card Pass')
  const [formAmount, setFormAmount] = React.useState('120.00')
  const [formMiles, setFormMiles] = React.useState('45')
  const [formAttachedReceipt, setFormAttachedReceipt] = React.useState<{ name: string; size: string } | null>({
    name: 'clipper-reload-receipt.pdf',
    size: '240 KB',
  })
  const [formSubmittedNotice, setFormSubmittedNotice] = React.useState(false)
  const [recentlySubmittedClaimId, setRecentlySubmittedClaimId] = React.useState('')

  // Filter State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  // Receipt Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false)
  const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim>(initialClaimsData[0])

  const openReceipt = (claim: ExpenseClaim) => {
    setSelectedClaim(claim)
    setIsReceiptModalOpen(true)
  }

  const handleCategoryChange = (val: CommuteCategory) => {
    setFormCategory(val)
    if (val === 'transit') {
      setFormProvider('BART Clipper Card')
      setFormDescription('Monthly BART Clipper Card Pass')
      setFormAmount('120.00')
    } else if (val === 'parking') {
      setFormProvider('Downtown Station Garage')
      setFormDescription('Monthly Station Parking Permit')
      setFormAmount('65.00')
    } else if (val === 'mileage') {
      setFormProvider('Personal Vehicle (IRS Standard Rate)')
      setFormDescription('Commute detour travel to client site')
      const miles = parseFloat(formMiles) || 0
      setFormAmount((miles * 0.67).toFixed(2))
    } else if (val === 'ev_charging') {
      setFormProvider('EVgo Fast Charging')
      setFormDescription('Workplace EV public charging sessions')
      setFormAmount('42.00')
    }
  }

  const handleMilesChange = (val: string) => {
    setFormMiles(val)
    const miles = parseFloat(val) || 0
    setFormAmount((miles * 0.67).toFixed(2))
  }

  const handleAttachSampleReceipt = () => {
    setFormAttachedReceipt({
      name: `receipt-${formCategory}-${Date.now().toString().slice(-4)}.pdf`,
      size: '318 KB',
    })
  }

  const handleRemoveReceipt = () => {
    setFormAttachedReceipt(null)
  }

  const handleSubmitClaim = () => {
    const parsedAmt = parseFloat(formAmount) || 0
    if (parsedAmt <= 0) return

    const meta = categoryMeta[formCategory]
    const newId = `CLM-${Math.floor(8200 + Math.random() * 700)}`
    const newClaim: ExpenseClaim = {
      id: newId,
      date: 'Aug 21, 2026',
      category: formCategory,
      categoryLabel: meta.shortLabel,
      description: formDescription || meta.label,
      provider: formProvider || 'Transit Provider',
      amount: parsedAmt,
      status: 'pending',
      statusLabel: 'Pending Approval',
      receiptFileName: formAttachedReceipt?.name || 'commute-claim-receipt.pdf',
      receiptFileSize: formAttachedReceipt?.size || '290 KB',
      receiptDate: 'Aug 21, 2026 · Just now',
      notes: `Submitted via Commuter Benefit Portal for ${claimPeriod}.`,
    }

    setClaims((prev) => [newClaim, ...prev])
    setRecentlySubmittedClaimId(newId)
    setFormSubmittedNotice(true)

    setTimeout(() => {
      setFormSubmittedNotice(false)
    }, 6000)
  }

  const handleResetForm = () => {
    setFormCategory('transit')
    setFormDate('2026-08-20')
    setFormProvider('BART Clipper Card')
    setFormDescription('Monthly BART Clipper Card Pass')
    setFormAmount('120.00')
    setFormMiles('45')
    setFormAttachedReceipt({
      name: 'clipper-reload-receipt.pdf',
      size: '240 KB',
    })
    setFormSubmittedNotice(false)
  }

  const isFiltered = searchQuery.trim() !== '' || categoryFilter !== 'all' || statusFilter !== 'all'

  const filteredClaims = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return claims.filter((claim) => {
      const matchCat = categoryFilter === 'all' || claim.category === categoryFilter
      const matchStatus = statusFilter === 'all' || claim.status === statusFilter
      const matchQuery =
        !q ||
        claim.id.toLowerCase().includes(q) ||
        claim.description.toLowerCase().includes(q) ||
        claim.provider.toLowerCase().includes(q) ||
        claim.categoryLabel.toLowerCase().includes(q)
      return matchCat && matchStatus && matchQuery
    })
  }, [claims, searchQuery, categoryFilter, statusFilter])

  const resetFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setStatusFilter('all')
  }

  const scrollToSubmitForm = () => {
    const el = document.getElementById('commute-submit-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const selectedCategoryMeta = categoryMeta[selectedClaim.category]
  const SelectedCategoryIcon = selectedCategoryMeta?.icon || Train

  return (
    <div data-slot="commute-reimbursement-claims" className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            <Badge
              wrap
              variant="outline"
              className="border-sky-500/30 bg-sky-500/10 text-xs font-medium text-sky-600 dark:text-sky-400"
            >
              <Calendar className="mr-1 size-3" aria-hidden="true" />
              {claimPeriod}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{policyText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button aria-label="Download attachment" variant="outline" size="sm" className="shadow-xs">
            <Download className="size-4" aria-hidden="true" />
            Export Statement
          </Button>
          <Button size="sm" className="shadow-xs" onClick={scrollToSubmitForm}>
            <Plus className="size-4" aria-hidden="true" />
            Submit New Claim
          </Button>
        </div>
      </div>

      {/* 4 Monthly Benefit Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Monthly Allowance Available */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Monthly Allowance</p>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Wallet className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$315.00 / mo</p>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>IRS Pre-tax limit</span>
              <span className="text-foreground font-medium tabular-nums">$69.50 left</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Claimed This Month */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Claimed This Month</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <TrendingUp className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$245.50</p>
            <div className="space-y-1.5 pt-0.5">
              <Progress value={78} className="h-1.5" />
              <p className="text-muted-foreground text-xs tabular-nums">$245.50 / $315.00 · 78% utilized</p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Reimbursed YTD */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Reimbursed YTD</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$1,890.00</p>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="mr-1 size-3.5" aria-hidden="true" />
                100% Settled
              </span>
              <span>· 6 claims in 2026</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Pending Review */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Pending Review</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
              1 Claim · $65.00
            </p>
            <p className="text-muted-foreground text-xs">Est. payout on Sep 1st payroll</p>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-Column Portal Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Submit Claim Interactive Card & Policy Card */}
        <div className="space-y-6 lg:col-span-5">
          {/* Submit Claim Card */}
          <Card id="commute-submit-form" className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Submit Commute Claim</CardTitle>
                  <CardDescription className="text-xs">
                    File transit pass, parking, mileage, or EV charging for monthly reimbursement.
                  </CardDescription>
                </div>
                <Badge wrap variant="secondary" className="text-xs font-medium">
                  {claimPeriod}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Submission Alert Notice */}
              {formSubmittedNotice && (
                <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-xs">
                    <p className="font-semibold">Claim {recentlySubmittedClaimId} submitted successfully!</p>
                    <p className="mt-0.5 text-emerald-700/90 dark:text-emerald-300/90">
                      Itemized receipt received. Your claim has been added to pending payroll review.
                    </p>
                  </div>
                </div>
              )}

              {/* Category Selector */}
              <div className="space-y-1.5">
                <label htmlFor="commute-category-select" className="text-foreground text-xs font-medium">
                  Expense Category <span className="text-destructive">*</span>
                </label>
                <Select value={formCategory} onValueChange={(v) => handleCategoryChange(v as CommuteCategory)}>
                  <SelectTrigger id="commute-category-select" className="w-full text-xs">
                    <SelectValue placeholder="Select commute category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transit">
                      <span className="flex items-center gap-2">
                        <Train className="size-3.5 text-sky-500" />
                        <span>Public Transit Pass: BART/Metro</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="parking">
                      <span className="flex items-center gap-2">
                        <Building2 className="size-3.5 text-indigo-500" />
                        <span>Parking (Station & Garage)</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="mileage">
                      <span className="flex items-center gap-2">
                        <Car className="size-3.5 text-amber-500" />
                        <span>Mileage (IRS $0.67/mi)</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="ev_charging">
                      <span className="flex items-center gap-2">
                        <Zap className="size-3.5 text-emerald-500" />
                        <span>EV Public Charging</span>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">{categoryMeta[formCategory].irsLimitInfo}</p>
              </div>

              {/* Date & Provider */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="commute-date-input" className="text-foreground text-xs font-medium">
                    Date of Commute <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="commute-date-input"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    type="date"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="commute-provider-input" className="text-foreground text-xs font-medium">
                    Provider / Authority <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="commute-provider-input"
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="e.g. BART, Caltrain, EVgo"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="commute-desc-input" className="text-foreground text-xs font-medium">
                  Claim Description & Route <span className="text-destructive">*</span>
                </label>
                <Input
                  id="commute-desc-input"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Monthly Clipper Pass · Embarcadero to Millbrae"
                  className="h-9 text-xs"
                />
              </div>

              {/* Mileage Calculation helper if mileage selected */}
              {formCategory === 'mileage' && (
                <div className="border-border bg-muted/30 space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">IRS Standard Mileage Rate</span>
                    <Badge wrap variant="outline" className="text-xs font-normal">
                      $0.67 / mile
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label htmlFor="commute-miles-input" className="text-muted-foreground text-xs">
                        Total Miles Driven
                      </label>
                      <Input
                        id="commute-miles-input"
                        value={formMiles}
                        onChange={(e) => handleMilesChange(e.target.value)}
                        type="number"
                        min="1"
                        step="1"
                        className="mt-1 h-8 text-xs tabular-nums"
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <span className="text-muted-foreground text-xs">Calculated Total</span>
                      <p className="text-foreground text-base font-bold tabular-nums">${formAmount}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim Amount Input */}
              <div className="space-y-1.5">
                <label htmlFor="commute-amount-input" className="text-foreground text-xs font-medium">
                  Claim Amount (USD) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
                  <Input
                    id="commute-amount-input"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    type="text"
                    placeholder="0.00"
                    className="h-9 pl-8 text-xs font-semibold tabular-nums"
                  />
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Maximum pre-tax monthly cap: $315.00</span>
                  <span className="font-medium">Direct Payroll Payout</span>
                </div>
              </div>

              {/* Receipt Dropzone Placeholder */}
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">
                  Itemized Receipt Attachment <span className="text-destructive">*</span>
                </label>

                {/* Attached file view */}
                {formAttachedReceipt ? (
                  <div className="border-border bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3 text-xs">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate font-medium">{formAttachedReceipt.name}</p>
                        <p className="text-muted-foreground truncate">
                          {formAttachedReceipt.size} · Itemized proof attached
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        wrap
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        <Check className="mr-1 size-3" />
                        Valid
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground size-7"
                        onClick={handleRemoveReceipt}
                      >
                        <X className="size-3.5" />
                        <span className="sr-only">Remove receipt</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Dropzone container */
                  <button
                    type="button"
                    className="border-border hover:bg-muted/40 hover:border-primary/50 focus-visible:ring-ring flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-4 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    onClick={handleAttachSampleReceipt}
                  >
                    <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
                      <Upload className="size-4" />
                    </div>
                    <p className="text-foreground text-xs font-medium">Click to upload or drag receipt file</p>
                    <p className="text-muted-foreground text-xs">
                      PDF, PNG, or JPG up to 10MB (Itemized proof required)
                    </p>
                  </button>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-border flex items-center justify-between border-t pt-4">
              <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={handleResetForm}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Reset Form
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5 text-xs shadow-xs"
                disabled={!formAmount || parseFloat(formAmount) <= 0}
                onClick={handleSubmitClaim}
              >
                <Send className="size-3.5" />
                Submit Claim
              </Button>
            </CardFooter>
          </Card>

          {/* Compliance & IRS Rules Notice Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold">Commuter Benefit Program Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Expenses are reimbursed under Section 132(f) Qualified Transportation Fringe Benefits. Reimbursements
                are disbursed directly into employee payroll on the 1st of every month.
              </p>
              <div className="border-border/60 text-muted-foreground space-y-1.5 border-t pt-2">
                <div className="flex items-center gap-2">
                  <Check className="size-3 text-emerald-500" />
                  <span>Monthly maximum pre-tax election: $315.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-3 text-emerald-500" />
                  <span>Receipts must reflect date, transit authority, and paid amount</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-3 text-emerald-500" />
                  <span>Deadline for current month submissions: 25th of month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Expense Claims History Table */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Expense Claims History</CardTitle>
                  <CardDescription className="text-xs">
                    Itemized ledger of submitted commuter, transit, and EV expenses.
                  </CardDescription>
                </div>
                <Badge wrap variant="outline" className="text-xs tabular-nums">
                  {claims.length} Total Claims
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Filter & Search Toolbar */}
              <div className="border-border bg-muted/20 flex flex-col gap-2.5 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    placeholder="Search claims, ID, route..."
                    className="h-8 pl-8 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-8 w-36 text-xs">
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

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="reimbursed">Reimbursed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  {isFiltered && (
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={resetFilters}>
                      <RotateCcw className="mr-1 size-3" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="border-border overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="min-w-[95px] text-xs">Claim ID</TableHead>
                        <TableHead className="min-w-[90px] text-xs">Date</TableHead>
                        <TableHead className="min-w-[110px] text-xs">Category</TableHead>
                        <TableHead className="min-w-[190px] text-xs">Description & Provider</TableHead>
                        <TableHead className="min-w-[90px] text-right text-xs">Amount</TableHead>
                        <TableHead className="min-w-[130px] text-xs">Status</TableHead>
                        <TableHead className="min-w-[80px] text-center text-xs">Receipt</TableHead>
                        <TableHead className="w-10 text-right text-xs">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClaims.map((claim) => {
                        const catMeta = categoryMeta[claim.category]
                        const CatIcon = catMeta?.icon || Train
                        return (
                          <TableRow key={claim.id} className="hover:bg-muted/50 transition-colors">
                            {/* Claim ID */}
                            <TableCell className="font-mono text-xs font-medium">{claim.id}</TableCell>

                            {/* Date */}
                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                              {claim.date}
                            </TableCell>

                            {/* Category Badge */}
                            <TableCell>
                              <Badge wrap variant="outline" className={cn('text-xs font-normal', catMeta?.badgeClass)}>
                                <CatIcon className="mr-1 size-3" />
                                {claim.categoryLabel}
                              </Badge>
                            </TableCell>

                            {/* Description & Provider */}
                            <TableCell>
                              <div className="min-w-0">
                                <p className="text-foreground truncate text-xs font-medium">{claim.description}</p>
                                <p className="text-muted-foreground truncate text-xs">{claim.provider}</p>
                              </div>
                            </TableCell>

                            {/* Amount */}
                            <TableCell className="text-foreground text-right text-xs font-semibold whitespace-nowrap tabular-nums">
                              ${claim.amount.toFixed(2)}
                            </TableCell>

                            {/* Status Badge */}
                            <TableCell>
                              <Badge
                                wrap
                                variant="outline"
                                className={cn('text-xs font-medium', statusStyles[claim.status])}
                              >
                                <span
                                  className={cn('mr-1.5 size-1.5 rounded-full', statusDots[claim.status])}
                                  aria-hidden="true"
                                />
                                {claim.statusLabel}
                              </Badge>
                            </TableCell>

                            {/* Receipt Button */}
                            <TableCell className="text-center">
                              <Button
                                aria-label="Attach file"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => openReceipt(claim)}
                              >
                                <Paperclip className="text-muted-foreground mr-1 size-3" />
                                <span>View</span>
                              </Button>
                            </TableCell>

                            {/* Actions Dropdown */}
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-muted-foreground hover:text-foreground size-7"
                                  >
                                    <Eye className="size-3.5" />
                                    <span className="sr-only">Actions for {claim.id}</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem
                                    className="cursor-pointer text-xs"
                                    onClick={() => openReceipt(claim)}
                                  >
                                    <Receipt className="mr-2 size-3.5" />
                                    Inspect Receipt
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer text-xs">
                                    <FileCheck className="mr-2 size-3.5" />
                                    Policy Audit Log
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer text-xs">
                                    <Download className="mr-2 size-3.5" />
                                    Download Voucher
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}

                      {/* Empty state */}
                      {filteredClaims.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              <Search className="text-muted-foreground/50 size-5" />
                              <p className="text-foreground text-xs font-medium">No commute claims found</p>
                              <p className="text-muted-foreground text-xs">
                                Try resetting your category or status filter
                              </p>
                              <Button variant="outline" size="sm" className="mt-1 h-7 text-xs" onClick={resetFilters}>
                                Reset filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Table Summary Footer */}
                <div className="border-border bg-muted/20 text-muted-foreground flex flex-col items-center justify-between gap-2 border-t px-3 py-2 text-xs sm:flex-row">
                  <p className="tabular-nums">
                    Showing <span className="text-foreground font-medium">{filteredClaims.length}</span> of{' '}
                    <span className="text-foreground font-medium">{claims.length}</span> claims
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums">
                      Filtered Total:{' '}
                      <span className="text-foreground font-semibold">
                        ${filteredClaims.reduce((acc, c) => acc + c.amount, 0).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Details Modal Dialog */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <div className="space-y-0.5">
                <DialogTitle className="text-base font-bold">Commute Receipt Voucher</DialogTitle>
                <DialogDescription className="text-xs">
                  IRS-compliant proof of transit and commuter benefit claim.
                </DialogDescription>
              </div>
              <Badge wrap variant="outline" className="font-mono text-xs">
                {selectedClaim.id}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Itemized Receipt Box */}
            <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-3.5">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <SelectedCategoryIcon className="text-primary size-4" />
                  <span className="text-foreground font-semibold">{selectedClaim.provider}</span>
                </div>
                <Badge wrap className={cn('text-xs font-normal', statusStyles[selectedClaim.status])}>
                  {selectedClaim.statusLabel}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground block">Transaction Date</span>
                  <span className="text-foreground font-medium">{selectedClaim.receiptDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Benefit Category</span>
                  <span className="text-foreground font-medium">{selectedClaim.categoryLabel}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block">Line Item Description</span>
                  <span className="text-foreground font-medium">{selectedClaim.description}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block">Employee Commute Note</span>
                  <span className="text-muted-foreground italic">"{selectedClaim.notes}"</span>
                </div>
              </div>

              <Separator />

              {/* Amount Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="text-muted-foreground flex justify-between">
                  <span>Base Fare / Charge</span>
                  <span className="font-mono tabular-nums">${selectedClaim.amount.toFixed(2)}</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Pre-Tax IRS Exemption (IRC § 132f)</span>
                  <span className="font-mono text-emerald-600 tabular-nums dark:text-emerald-400">
                    -$0.00 (Tax Free)
                  </span>
                </div>
                <div className="border-border flex justify-between border-t pt-1.5 text-sm font-bold">
                  <span className="text-foreground">Total Reimbursable Amount</span>
                  <span className="text-foreground font-mono tabular-nums">${selectedClaim.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Attached File Strip */}
              <div className="border-border bg-background flex items-center justify-between rounded-md border p-2 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary size-3.5" />
                  <span className="font-mono text-xs">{selectedClaim.receiptFileName}</span>
                  <span className="text-muted-foreground">({selectedClaim.receiptFileSize})</span>
                </div>
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <ShieldCheck className="mr-1 size-3" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsReceiptModalOpen(false)}>
              Close
            </Button>
            <Button
              aria-label="Download attachment"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setIsReceiptModalOpen(false)}
            >
              <Download className="size-3.5" />
              Download Receipt PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
