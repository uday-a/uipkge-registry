'use client'

import * as React from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Barcode,
  Box,
  CheckCircle2,
  Clock,
  CornerDownLeft,
  CreditCard,
  Download,
  FileCheck,
  Package,
  PackageCheck,
  Printer,
  Radio,
  RotateCcw,
  ScanLine,
  Sparkles,
  Tag,
  UserCheck,
  Warehouse,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export type ConditionGrade = 'grade-a' | 'grade-b' | 'grade-c' | 'grade-d'
export type RefundAction = 'full-refund' | 'store-credit' | 'restock-fee'

export interface InspectionChecklist {
  tagsAttached: boolean
  originalBox: boolean
  allAccessories: boolean
  odorStainFree: boolean
}

export interface ReturnInspectionData {
  rmaNumber: string
  stationId: string
  inspectorName: string
  returnReason: string
  item: {
    name: string
    variant: string
    msrp: number
    sku: string
    upc: string
    verified: boolean
  }
  grade: ConditionGrade
  checklist: InspectionChecklist
  refundAction: RefundAction
  qcNotes: string
  dispositionOutcome: {
    route: string
    destinationBin: string
    lpnCode: string
    priority: string
  }
}

export interface ReturnMerchandiseInspectionProps {
  initialRma?: string
  initialGrade?: ConditionGrade
  initialRefundAction?: RefundAction
  initialSubmitted?: boolean
  inspectorName?: string
  stationName?: string
  className?: string
  onComplete?: (data: ReturnInspectionData) => void
}

const itemData = {
  name: 'Aero Minimalist Runner · Size 10.5 · Matte Black',
  variant: 'Matte Black / US 10.5 M',
  sku: 'AMR-BLK-105',
  upc: 'UPC-018249',
  msrp: 145.0,
  orderRef: '#ORD-98421',
  carrier: 'FedEx Return Express',
  trackingNumber: '7946 1102 9842',
  returnReason: 'Customer reported wrong size ordered',
}

const gradeDefinitions: Record<
  ConditionGrade,
  {
    id: ConditionGrade
    code: string
    title: string
    conditionLabel: string
    summary: string
    route: string
    targetBin: string
    lpnCode: string
    priority: string
    badgeClasses: string
    activeBorderBg: string
    indicatorColor: string
    statusText: string
  }
> = {
  'grade-a': {
    id: 'grade-a',
    code: 'Grade A',
    title: 'Grade A: Brand New / Unopened',
    conditionLabel: 'Brand New / Pristine',
    summary: 'Original tags & packaging intact',
    route: 'Restock to Primary Inventory',
    targetBin: 'Aisle 04-B · Bin #04-B-12',
    lpnCode: 'LPN-849201-RESTOCK-A',
    priority: 'High · Inventory Replenishment',
    badgeClasses: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold',
    activeBorderBg:
      'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500/20',
    indicatorColor: 'bg-emerald-500',
    statusText: 'Primary Inventory Restock Approved',
  },
  'grade-b': {
    id: 'grade-b',
    code: 'Grade B',
    title: 'Grade B: Open Box / Minor Cosmetic',
    conditionLabel: 'Open Box / Inspected',
    summary: 'No functional damage, packaging opened',
    route: 'Route to Outlet / Refurbished Store',
    targetBin: 'Secondary Channel · Pallet #03',
    lpnCode: 'LPN-849201-OUTLET-B',
    priority: 'Standard · Secondary Routing',
    badgeClasses: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold',
    activeBorderBg: 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20 shadow-xs ring-1 ring-amber-500/20',
    indicatorColor: 'bg-amber-500',
    statusText: 'Secondary Channel Re-routing',
  },
  'grade-c': {
    id: 'grade-c',
    code: 'Grade C',
    title: 'Grade C: Worn / Used',
    conditionLabel: 'Worn / Blemished',
    summary: 'Minor wear on soles, visible creasing',
    route: 'Liquidation Batch #LQ-409',
    targetBin: 'Bulk Liquidation Pallet #C-88',
    lpnCode: 'LPN-849201-LIQUIDATE-C',
    priority: 'Batch Weekly Dispatch',
    badgeClasses: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400 font-semibold',
    activeBorderBg: 'border-orange-500/40 bg-orange-500/5 dark:bg-orange-950/20 shadow-xs ring-1 ring-orange-500/20',
    indicatorColor: 'bg-orange-500',
    statusText: 'Wholesale Liquidation Staging',
  },
  'grade-d': {
    id: 'grade-d',
    code: 'Grade D',
    title: 'Grade D: Damaged / Defective',
    conditionLabel: 'Defective / Damaged',
    summary: 'Torn fabric, seam defect, structural flaw',
    route: 'Quarantine / Return to Vendor (RTV)',
    targetBin: 'Quarantine Bay Q-08 (Vendor Claims)',
    lpnCode: 'LPN-849201-QUARANTINE-D',
    priority: 'Urgent · Vendor RTV Credit Hold',
    badgeClasses: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold',
    activeBorderBg: 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20 shadow-xs ring-1 ring-rose-500/20',
    indicatorColor: 'bg-rose-500',
    statusText: 'Quarantine Hold & Vendor Credit Claim',
  },
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val)
}

export function ReturnMerchandiseInspection({
  initialRma = '#RMA-849201',
  initialGrade = 'grade-a',
  initialRefundAction = 'full-refund',
  initialSubmitted = false,
  inspectorName = 'Alex Rivera · QC Lead',
  stationName = 'Warehouse Returns Intake & Grading Station #02',
  className,
  onComplete,
}: ReturnMerchandiseInspectionProps) {
  const [rmaNumber, setRmaNumber] = React.useState(initialRma)
  const [selectedGrade, setSelectedGrade] = React.useState<ConditionGrade>(initialGrade)
  const [selectedRefundAction, setSelectedRefundAction] = React.useState<RefundAction>(initialRefundAction)
  const [submitted, setSubmitted] = React.useState(initialSubmitted)
  const [qcNotes, setQcNotes] = React.useState(
    'Outer packaging opened by customer. All interior packaging materials, extra shoelaces, and brand care card verified in pristine condition. Zero sole wear detected.',
  )

  const [checklist, setChecklist] = React.useState<InspectionChecklist>({
    tagsAttached: true,
    originalBox: true,
    allAccessories: true,
    odorStainFree: true,
  })

  React.useEffect(() => {
    setSelectedGrade(initialGrade)
  }, [initialGrade])

  React.useEffect(() => {
    setSelectedRefundAction(initialRefundAction)
  }, [initialRefundAction])

  React.useEffect(() => {
    setSubmitted(initialSubmitted)
  }, [initialSubmitted])

  const currentGrade = gradeDefinitions[selectedGrade]

  const totalChecklistCount = 4
  const checkedChecklistCount = React.useMemo(() => {
    let count = 0
    if (checklist.tagsAttached) count++
    if (checklist.originalBox) count++
    if (checklist.allAccessories) count++
    if (checklist.odorStainFree) count++
    return count
  }, [checklist])

  const allChecksPassed = checkedChecklistCount === totalChecklistCount

  const refundCalculations = React.useMemo(() => {
    const msrp = itemData.msrp
    if (selectedRefundAction === 'store-credit') {
      const bonus = msrp * 0.1
      return {
        subtotal: msrp,
        adjustmentLabel: 'Store Credit Bonus (+10%)',
        adjustmentAmount: bonus,
        isBonus: true,
        totalRefund: msrp + bonus,
        methodLabel: 'Digital Gift Card (sarah.c@example.com)',
        payoutSpeed: 'Instant email delivery upon grading',
      }
    }

    if (selectedRefundAction === 'restock-fee') {
      const fee = 15.0
      return {
        subtotal: msrp,
        adjustmentLabel: 'Restocking & Repacking Fee',
        adjustmentAmount: fee,
        isBonus: false,
        totalRefund: msrp - fee,
        methodLabel: 'Net Credit to Visa •••• 4242',
        payoutSpeed: '3–5 business days to card',
      }
    }

    return {
      subtotal: msrp,
      adjustmentLabel: 'Restocking Fee Waived',
      adjustmentAmount: 0,
      isBonus: false,
      totalRefund: msrp,
      methodLabel: 'Full Refund to Visa •••• 4242',
      payoutSpeed: '3–5 business days to card',
    }
  }, [selectedRefundAction])

  const selectAllChecklist = (pass: boolean) => {
    setChecklist({
      tagsAttached: pass,
      originalBox: pass,
      allAccessories: pass,
      odorStainFree: pass,
    })
  }

  const applyPresetNote = (note: string) => {
    if (!qcNotes.includes(note)) {
      setQcNotes(qcNotes ? `${qcNotes} ${note}` : note)
    }
  }

  const handleCompleteInspection = () => {
    setSubmitted(true)
    onComplete?.({
      rmaNumber,
      stationId: 'STATION-02-B',
      inspectorName,
      returnReason: itemData.returnReason,
      item: {
        name: itemData.name,
        variant: itemData.variant,
        msrp: itemData.msrp,
        sku: itemData.sku,
        upc: itemData.upc,
        verified: true,
      },
      grade: selectedGrade,
      checklist: { ...checklist },
      refundAction: selectedRefundAction,
      qcNotes,
      dispositionOutcome: {
        route: currentGrade.route,
        destinationBin: currentGrade.targetBin,
        lpnCode: currentGrade.lpnCode,
        priority: currentGrade.priority,
      },
    })
  }

  const handleReset = () => {
    setSubmitted(false)
    setSelectedGrade('grade-a')
    setSelectedRefundAction('full-refund')
    selectAllChecklist(true)
    setQcNotes(
      'Outer packaging opened by customer. All interior packaging materials, extra shoelaces, and brand care card verified in pristine condition. Zero sole wear detected.',
    )
  }

  return (
    <div
      data-slot="return-merchandise-inspection"
      className={cn('text-foreground mx-auto w-full max-w-6xl space-y-6', className)}
    >
      {/* ================================================================= */}
      {/* POST-SUBMISSION CONFIRMATION RECEIPT VIEW                         */}
      {/* ================================================================= */}
      {submitted ? (
        <div className="space-y-6">
          <Card className="border-border overflow-hidden shadow-xs">
            <div
              className={cn(
                'border-b p-6 text-center sm:p-8',
                selectedGrade === 'grade-d'
                  ? 'border-rose-500/30 bg-rose-500/10 dark:bg-rose-950/20'
                  : 'border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20',
              )}
            >
              <div className="relative mx-auto mb-4 size-16">
                <span
                  className={cn(
                    'absolute inset-0 rounded-full blur-xl',
                    selectedGrade === 'grade-d' ? 'bg-rose-500/30' : 'bg-emerald-500/30',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'relative flex size-16 items-center justify-center rounded-full border shadow-xs',
                    selectedGrade === 'grade-d'
                      ? 'border-rose-500/40 bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
                  )}
                >
                  {selectedGrade !== 'grade-d' ? (
                    <PackageCheck className="size-8" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="size-8" aria-hidden="true" />
                  )}
                </span>
              </div>

              <Badge
                variant={selectedGrade === 'grade-d' ? 'destructive' : 'outline'}
                className={cn(
                  'mb-2 font-mono text-xs tracking-wider uppercase',
                  selectedGrade !== 'grade-d' &&
                    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                )}
              >
                RMA Disposition Manifest Dispatched
              </Badge>

              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                {selectedGrade === 'grade-d'
                  ? 'RMA Inspection Flagged · Quarantine RTV Initiated'
                  : 'Inspection Complete · Automated Routing Logged'}
              </h2>
              <p className="text-muted-foreground mx-auto mt-1.5 max-w-2xl text-xs sm:text-sm">
                Disposition for <span className="text-foreground font-medium">{itemData.name}</span> has been recorded.
                Warehouse routing slip and automated customer refund authorization have been queued.
              </p>

              <div className="border-border bg-background/80 mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border px-3.5 py-1 text-xs backdrop-blur-xs">
                <span className="text-muted-foreground font-medium">RMA Reference:</span>
                <span className="text-foreground font-mono font-bold">{rmaNumber}</span>
                <span className="text-muted-foreground font-medium">LPN:</span>
                <span className="text-foreground font-mono font-bold">{currentGrade.lpnCode}</span>
              </div>
            </div>

            <CardContent className="space-y-6 p-6">
              {/* Disposition Summary Meta Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
                  <span className="text-muted-foreground block text-xs font-medium">Condition Grade</span>
                  <span className="text-foreground block text-sm font-semibold">{currentGrade.title}</span>
                  <span className="text-muted-foreground text-xs">{currentGrade.summary}</span>
                </div>

                <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
                  <span className="text-muted-foreground block text-xs font-medium">Warehouse Destination</span>
                  <span className="text-foreground block text-sm font-semibold">{currentGrade.targetBin}</span>
                  <span className="text-muted-foreground text-xs">{currentGrade.route}</span>
                </div>

                <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
                  <span className="text-muted-foreground block text-xs font-medium">Customer Resolution</span>
                  <span className="text-foreground block text-sm font-semibold tabular-nums">
                    {formatCurrency(refundCalculations.totalRefund)}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">{refundCalculations.methodLabel}</span>
                </div>

                <div className="border-border bg-muted/20 space-y-1 rounded-lg border p-3.5">
                  <span className="text-muted-foreground block text-xs font-medium">QC Inspector</span>
                  <span className="text-foreground block text-sm font-semibold">{inspectorName}</span>
                  <span className="text-muted-foreground text-xs">Station #02 · Timestamped</span>
                </div>
              </div>

              {/* LPN Barcode & Routing Pass Box */}
              <div className="border-border bg-muted/15 space-y-3 rounded-xl border p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Barcode className="text-primary size-4" />
                    <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
                      Pallet / Tote License Plate Number (LPN)
                    </span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    READY FOR PUTAWAY
                  </Badge>
                </div>

                <div className="border-border bg-card flex flex-col items-center justify-center space-y-2 rounded-lg border p-4 text-center">
                  {/* Barcode SVG visualization */}
                  <svg
                    className="text-foreground h-12 w-full max-w-sm"
                    viewBox="0 0 280 48"
                    fill="currentColor"
                    aria-label="LPN Warehouse Barcode"
                  >
                    <rect x="0" y="0" width="4" height="48" />
                    <rect x="7" y="0" width="2" height="48" />
                    <rect x="12" y="0" width="5" height="48" />
                    <rect x="20" y="0" width="2" height="48" />
                    <rect x="25" y="0" width="6" height="48" />
                    <rect x="34" y="0" width="3" height="48" />
                    <rect x="40" y="0" width="2" height="48" />
                    <rect x="45" y="0" width="5" height="48" />
                    <rect x="53" y="0" width="3" height="48" />
                    <rect x="60" y="0" width="6" height="48" />
                    <rect x="69" y="0" width="2" height="48" />
                    <rect x="74" y="0" width="4" height="48" />
                    <rect x="81" y="0" width="3" height="48" />
                    <rect x="88" y="0" width="5" height="48" />
                    <rect x="96" y="0" width="2" height="48" />
                    <rect x="101" y="0" width="6" height="48" />
                    <rect x="110" y="0" width="3" height="48" />
                    <rect x="116" y="0" width="4" height="48" />
                    <rect x="123" y="0" width="2" height="48" />
                    <rect x="128" y="0" width="5" height="48" />
                    <rect x="136" y="0" width="3" height="48" />
                    <rect x="142" y="0" width="6" height="48" />
                    <rect x="151" y="0" width="2" height="48" />
                    <rect x="156" y="0" width="4" height="48" />
                    <rect x="163" y="0" width="3" height="48" />
                    <rect x="170" y="0" width="5" height="48" />
                    <rect x="178" y="0" width="2" height="48" />
                    <rect x="183" y="0" width="6" height="48" />
                    <rect x="192" y="0" width="4" height="48" />
                    <rect x="199" y="0" width="2" height="48" />
                    <rect x="204" y="0" width="5" height="48" />
                    <rect x="212" y="0" width="3" height="48" />
                    <rect x="218" y="0" width="6" height="48" />
                    <rect x="227" y="0" width="2" height="48" />
                    <rect x="232" y="0" width="4" height="48" />
                    <rect x="239" y="0" width="3" height="48" />
                    <rect x="245" y="0" width="5" height="48" />
                    <rect x="253" y="0" width="2" height="48" />
                    <rect x="258" y="0" width="6" height="48" />
                    <rect x="267" y="0" width="3" height="48" />
                    <rect x="273" y="0" width="4" height="48" />
                  </svg>
                  <div className="flex items-center gap-3 font-mono text-xs font-bold">
                    <span className="text-foreground tracking-wider">{currentGrade.lpnCode}</span>
                    <span className="text-muted-foreground font-normal">{currentGrade.targetBin}</span>
                  </div>
                </div>

                {/* Inspector Notes Display */}
                {qcNotes && (
                  <div className="space-y-1 pt-1 text-xs">
                    <span className="text-muted-foreground font-medium">Logged Inspector Notes:</span>
                    <p className="border-border bg-card text-foreground rounded-md border p-3 leading-relaxed italic">
                      “{qcNotes}”
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={handleReset}>
                  <RotateCcw className="size-3.5" />
                  Start Next RMA Inspection
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                    <Printer className="size-3.5" />
                    Print LPN Tote Label
                  </Button>
                  <Button aria-label="Download attachment" size="sm" className="gap-1.5 text-xs font-medium">
                    <Download className="size-3.5" />
                    Download Disposition PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* ================================================================= */
        /* ACTIVE INSPECTION WORKBENCH VIEW                                  */
        /* ================================================================= */
        <div className="space-y-6">
          {/* Top Station Header Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary gap-1.5 py-0.5 text-xs"
                    >
                      <Warehouse className="size-3.5" />
                      Station #02 · Returns Intake & Grading
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 py-0.5 font-mono text-xs">
                      <Tag className="size-3" />
                      {rmaNumber}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-xs text-emerald-700 dark:text-emerald-400"
                    >
                      <Radio className="size-3 text-emerald-600 dark:text-emerald-400" />
                      Scanner Online
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                      Warehouse Returns Intake & Grading Station #02
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      RMA intake verification, physical condition evaluation, restock/quarantine disposition routing,
                      and customer refund action.
                    </CardDescription>
                  </div>
                </div>

                {/* Primary Header CTA */}
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    size="default"
                    className="gap-2 text-xs font-semibold sm:text-sm"
                    onClick={handleCompleteInspection}
                  >
                    <FileCheck className="size-4" />
                    Complete Inspection & Disposition
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Metadata Ribbon Bar */}
            <CardContent className="pt-0 pb-4">
              <div className="border-border bg-muted/20 grid gap-3 rounded-lg border p-3.5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-0.5">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Tag className="text-primary size-3.5" />
                    <span>RMA Reference</span>
                  </div>
                  <p className="text-foreground font-mono text-xs font-semibold">{rmaNumber}</p>
                  <p className="text-muted-foreground text-xs">Order: {itemData.orderRef}</p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <UserCheck className="text-primary size-3.5" />
                    <span>Inspector / Station</span>
                  </div>
                  <p className="text-foreground text-xs font-semibold">{inspectorName}</p>
                  <p className="text-muted-foreground text-xs">Terminal Station #02</p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <CornerDownLeft className="text-primary size-3.5" />
                    <span>Customer Return Reason</span>
                  </div>
                  <p className="text-foreground truncate text-xs font-semibold">{itemData.returnReason}</p>
                  <p className="text-muted-foreground text-xs">Carrier: {itemData.carrier}</p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Clock className="text-primary size-3.5" />
                    <span>Intake Status</span>
                  </div>
                  <p className="text-foreground text-xs font-semibold">In Progress · Pending Disposition</p>
                  <p className="text-muted-foreground font-mono text-xs">{itemData.trackingNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* =============================================================== */}
          {/* 2-COLUMN INSPECTION WORKBENCH                                   */}
          {/* =============================================================== */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* LEFT COLUMN: Item Verification & Condition Grading (7 Cols) */}
            <div className="space-y-6 lg:col-span-7">
              {/* 1. Scanned Item Verification Card */}
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <ScanLine className="text-primary size-4" />
                      <CardTitle className="text-sm font-semibold">Intake Item Scanned</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="size-3" />
                      Match Verified
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center">
                    <div className="border-border bg-muted/60 text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-lg border">
                      <Package className="text-primary size-7" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-foreground text-sm leading-tight font-semibold">{itemData.name}</h4>
                          <p className="text-muted-foreground text-xs">
                            {itemData.variant} · SKU: <span className="font-mono font-medium">{itemData.sku}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground text-base font-bold tabular-nums">
                            {formatCurrency(itemData.msrp)}
                          </span>
                          <span className="text-muted-foreground block text-xs">MSRP</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <div className="text-muted-foreground flex items-center gap-1.5 font-mono">
                          <Barcode className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-foreground font-semibold">{itemData.upc}</span>
                          <Badge
                            variant="outline"
                            className="h-4 px-1.5 py-0 text-xs text-emerald-700 dark:text-emerald-400"
                          >
                            UPC OK
                          </Badge>
                        </div>
                        <Separator orientation="vertical" className="h-3.5" />
                        <span className="text-muted-foreground">Order: {itemData.orderRef}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Condition Grading Radio Cards */}
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-sm font-semibold">Condition Grading Assessment</CardTitle>
                      <CardDescription className="text-xs">
                        Select physical grading level to trigger automated warehouse routing rules.
                      </CardDescription>
                    </div>
                    <Badge className={currentGrade.badgeClasses}>{currentGrade.code}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <RadioGroup
                    value={selectedGrade}
                    onValueChange={(val) => setSelectedGrade(val as ConditionGrade)}
                    className="grid grid-cols-1 gap-2.5"
                  >
                    {/* Grade A */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                        selectedGrade === 'grade-a'
                          ? gradeDefinitions['grade-a'].activeBorderBg
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedGrade('grade-a')}
                    >
                      <RadioGroupItem id="grade-a" value="grade-a" className="mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="grade-a"
                            className="text-foreground cursor-pointer text-xs font-semibold sm:text-sm"
                          >
                            Grade A: Brand New / Unopened
                          </label>
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                          >
                            Primary Restock
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Original factory tags & packaging intact. No cosmetic or functional flaws.
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                          <ArrowRight className="text-primary size-3" />
                          <span>
                            Target:{' '}
                            <strong className="text-foreground font-medium">
                              Restock to Primary Inventory (Aisle 04-B)
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grade B */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                        selectedGrade === 'grade-b'
                          ? gradeDefinitions['grade-b'].activeBorderBg
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedGrade('grade-b')}
                    >
                      <RadioGroupItem id="grade-b" value="grade-b" className="mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="grade-b"
                            className="text-foreground cursor-pointer text-xs font-semibold sm:text-sm"
                          >
                            Grade B: Open Box / Minor Cosmetic
                          </label>
                          <Badge
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                          >
                            Outlet Store
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Box opened or minor package scuffs, but product is 100% unworn and fully functional.
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                          <ArrowRight className="text-primary size-3" />
                          <span>
                            Target:{' '}
                            <strong className="text-foreground font-medium">Route to Outlet / Refurbished Store</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grade C */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                        selectedGrade === 'grade-c'
                          ? gradeDefinitions['grade-c'].activeBorderBg
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedGrade('grade-c')}
                    >
                      <RadioGroupItem id="grade-c" value="grade-c" className="mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="grade-c"
                            className="text-foreground cursor-pointer text-xs font-semibold sm:text-sm"
                          >
                            Grade C: Worn / Used
                          </label>
                          <Badge
                            variant="outline"
                            className="border-orange-500/30 bg-orange-500/10 text-xs text-orange-700 dark:text-orange-400"
                          >
                            Liquidation
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Visible wear on soles, minor creasing or cosmetic stains. Not suitable for retail shelves.
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                          <ArrowRight className="text-primary size-3" />
                          <span>
                            Target:{' '}
                            <strong className="text-foreground font-medium">
                              Liquidation Batch #LQ-409 (Wholesale Lot)
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grade D */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all select-none',
                        selectedGrade === 'grade-d'
                          ? gradeDefinitions['grade-d'].activeBorderBg
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedGrade('grade-d')}
                    >
                      <RadioGroupItem id="grade-d" value="grade-d" className="mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="grade-d"
                            className="text-foreground cursor-pointer text-xs font-semibold sm:text-sm"
                          >
                            Grade D: Damaged / Defective
                          </label>
                          <Badge variant="destructive" className="text-xs">
                            Quarantine RTV
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Torn fabric, broken seam, outsole separation, or manufacturing defect.
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                          <ArrowRight className="text-primary size-3" />
                          <span>
                            Target:{' '}
                            <strong className="text-foreground font-medium">
                              Quarantine Bay Q-08 / Return to Vendor (RTV)
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* 3. Physical Inspection Checklist */}
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-sm font-semibold">Physical Inspection Checklist</CardTitle>
                      <CardDescription className="text-xs">
                        Verify all physical criteria before approving final warehouse putaway.
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {checkedChecklistCount}/{totalChecklistCount} Passed
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground h-7 text-xs"
                        onClick={() => selectAllChecklist(!allChecksPassed)}
                      >
                        {allChecksPassed ? 'Uncheck All' : 'Pass All'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2.5">
                  {/* Item 1: Tags Attached */}
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      checklist.tagsAttached ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                    )}
                  >
                    <Checkbox
                      id="chk-tags"
                      checked={checklist.tagsAttached}
                      onCheckedChange={(val) => setChecklist((prev) => ({ ...prev, tagsAttached: Boolean(val) }))}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor="chk-tags"
                        className="text-foreground cursor-pointer text-xs font-semibold select-none"
                      >
                        Tags attached
                      </label>
                      <p className="text-muted-foreground text-xs">
                        Factory hangtags, barcode UPC stickers, and care labels intact.
                      </p>
                    </div>
                  </div>

                  {/* Item 2: Original Box Present */}
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      checklist.originalBox ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                    )}
                  >
                    <Checkbox
                      id="chk-box"
                      checked={checklist.originalBox}
                      onCheckedChange={(val) => setChecklist((prev) => ({ ...prev, originalBox: Boolean(val) }))}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor="chk-box"
                        className="text-foreground cursor-pointer text-xs font-semibold select-none"
                      >
                        Original box present
                      </label>
                      <p className="text-muted-foreground text-xs">
                        Manufacturer shoebox present with readable SKU and size label.
                      </p>
                    </div>
                  </div>

                  {/* Item 3: Accessories in Box */}
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      checklist.allAccessories ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                    )}
                  >
                    <Checkbox
                      id="chk-acc"
                      checked={checklist.allAccessories}
                      onCheckedChange={(val) => setChecklist((prev) => ({ ...prev, allAccessories: Boolean(val) }))}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor="chk-acc"
                        className="text-foreground cursor-pointer text-xs font-semibold select-none"
                      >
                        All accessories in box
                      </label>
                      <p className="text-muted-foreground text-xs">
                        Extra pair of laces, dust bag, and product manual verified.
                      </p>
                    </div>
                  </div>

                  {/* Item 4: Odor and Stain Free */}
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                      checklist.odorStainFree ? 'border-border bg-card' : 'border-amber-500/30 bg-amber-500/5',
                    )}
                  >
                    <Checkbox
                      id="chk-odor"
                      checked={checklist.odorStainFree}
                      onCheckedChange={(val) => setChecklist((prev) => ({ ...prev, odorStainFree: Boolean(val) }))}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-0.5">
                      <label
                        htmlFor="chk-odor"
                        className="text-foreground cursor-pointer text-xs font-semibold select-none"
                      >
                        Odor & stain free
                      </label>
                      <p className="text-muted-foreground text-xs">
                        Free from perfume scent, tobacco smoke, pet hair, dirt, or cosmetic scuffs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Disposition & Customer Refund Action Card (5 Cols) */}
            <div className="space-y-6 lg:col-span-5">
              {/* 1. Selected Automated Warehouse Disposition Card */}
              <Card className="border-border overflow-hidden shadow-xs">
                <CardHeader className="bg-muted/15 border-border border-b pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Warehouse className="text-primary size-4" />
                      <CardTitle className="text-sm font-semibold">Warehouse Routing Outcome</CardTitle>
                    </div>
                    <Badge className={currentGrade.badgeClasses}>{currentGrade.code}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-4">
                  {/* Active Outcome Card Banner */}
                  <div className={cn('rounded-lg border p-4 transition-all', currentGrade.activeBorderBg)}>
                    <div className="flex items-start gap-3">
                      <div className="border-border bg-background/80 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                        <Box className="text-primary size-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground text-xs font-bold sm:text-sm">{currentGrade.route}</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Destination Bin:{' '}
                          <strong className="text-foreground font-mono font-semibold">{currentGrade.targetBin}</strong>
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Priority: <span className="text-foreground font-medium">{currentGrade.priority}</span>
                        </p>
                      </div>
                    </div>

                    <div className="border-border/60 mt-3.5 flex items-center justify-between border-t pt-3 text-xs">
                      <span className="text-muted-foreground font-mono">LPN: {currentGrade.lpnCode}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        READY FOR SCAN
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Customer Refund Action Card */}
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-sm font-semibold">Customer Refund Action</CardTitle>
                      <CardDescription className="text-xs">
                        Choose financial settlement for RMA {rmaNumber}.
                      </CardDescription>
                    </div>
                    <CreditCard className="text-muted-foreground size-4" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <RadioGroup
                    value={selectedRefundAction}
                    onValueChange={(val) => setSelectedRefundAction(val as RefundAction)}
                    className="grid grid-cols-1 gap-2.5"
                  >
                    {/* Option 1: Full Refund */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors select-none',
                        selectedRefundAction === 'full-refund'
                          ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedRefundAction('full-refund')}
                    >
                      <RadioGroupItem id="ref-full" value="full-refund" className="mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="ref-full" className="text-foreground cursor-pointer text-xs font-semibold">
                            Authorize Full Refund
                          </label>
                          <span className="text-foreground text-xs font-semibold tabular-nums">
                            {formatCurrency(itemData.msrp)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          100% refund to <span className="text-foreground font-medium">Visa •••• 4242</span>. 3–5
                          business days.
                        </p>
                      </div>
                    </div>

                    {/* Option 2: Store Credit (+10% Bonus) */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors select-none',
                        selectedRefundAction === 'store-credit'
                          ? 'border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-1 ring-emerald-500/20 dark:bg-emerald-950/20'
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedRefundAction('store-credit')}
                    >
                      <RadioGroupItem id="ref-credit" value="store-credit" className="mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
                            <label
                              htmlFor="ref-credit"
                              className="text-foreground cursor-pointer text-xs font-semibold"
                            >
                              Issue Store Credit (+10%)
                            </label>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                            {formatCurrency(itemData.msrp * 1.1)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Includes{' '}
                          <span className="text-foreground font-medium">+{formatCurrency(itemData.msrp * 0.1)}</span>{' '}
                          bonus credit. Delivered instantly by email.
                        </p>
                      </div>
                    </div>

                    {/* Option 3: Charge Restocking Fee */}
                    <div
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors select-none',
                        selectedRefundAction === 'restock-fee'
                          ? 'border-primary bg-primary/[0.03] dark:bg-primary/10 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedRefundAction('restock-fee')}
                    >
                      <RadioGroupItem id="ref-fee" value="restock-fee" className="mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="ref-fee" className="text-foreground cursor-pointer text-xs font-semibold">
                            Charge Restocking Fee (-$15)
                          </label>
                          <span className="text-foreground text-xs font-semibold tabular-nums">
                            {formatCurrency(itemData.msrp - 15)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          $15.00 repackaging & inspection deduction. Net to{' '}
                          <span className="text-foreground font-medium">Visa •••• 4242</span>.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Settlement Calculation Summary Box */}
                  <div className="border-border bg-muted/30 space-y-1.5 rounded-lg border p-3 text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Item MSRP</span>
                      <span className="text-foreground font-mono font-medium">
                        {formatCurrency(refundCalculations.subtotal)}
                      </span>
                    </div>
                    {selectedRefundAction === 'store-credit' ? (
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                        <span>{refundCalculations.adjustmentLabel}</span>
                        <span className="font-mono font-medium">
                          +{formatCurrency(refundCalculations.adjustmentAmount)}
                        </span>
                      </div>
                    ) : selectedRefundAction === 'restock-fee' ? (
                      <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                        <span>{refundCalculations.adjustmentLabel}</span>
                        <span className="font-mono font-medium">
                          -{formatCurrency(refundCalculations.adjustmentAmount)}
                        </span>
                      </div>
                    ) : null}
                    <div className="border-border text-foreground flex items-center justify-between border-t pt-1.5 font-bold">
                      <span>Authorized Net Settlement</span>
                      <span
                        className={cn(
                          'font-mono text-sm font-bold tabular-nums',
                          selectedRefundAction === 'store-credit' && 'text-emerald-600 dark:text-emerald-400',
                        )}
                      >
                        {formatCurrency(refundCalculations.totalRefund)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Internal QC Inspection Notes */}
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-sm font-semibold">Internal QC Inspection Notes</CardTitle>
                      <CardDescription className="text-xs">
                        Station audit log appended to inventory history.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Textarea
                    value={qcNotes}
                    onValueChange={setQcNotes}
                    rows={3}
                    placeholder="Enter internal inspection notes, physical defect description, or warehouse packaging details..."
                    className="text-xs"
                  />

                  {/* Quick Tag Helpers */}
                  <div className="space-y-1.5">
                    <span className="text-muted-foreground block text-xs font-medium">Quick Preset Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        className="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                        onClick={() => applyPresetNote('Pristine unworn condition.')}
                      >
                        + Pristine Condition
                      </button>
                      <button
                        type="button"
                        className="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                        onClick={() => applyPresetNote('Minor outer box scuff; shoes mint.')}
                      >
                        + Box Scuffed
                      </button>
                      <button
                        type="button"
                        className="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                        onClick={() => applyPresetNote('Slight sole friction detected.')}
                      >
                        + Sole Friction
                      </button>
                      <button
                        type="button"
                        className="border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 cursor-pointer rounded-md border px-2 py-0.5 text-xs transition-colors"
                        onClick={() => applyPresetNote('Factory seam defect identified - Flagged RTV.')}
                      >
                        + Flagged RTV
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-border bg-muted/15 flex items-center justify-between border-t p-4">
                  <span className="text-muted-foreground text-xs">
                    Audit sign-off: <strong className="text-foreground font-medium">{inspectorName}</strong>
                  </span>
                  <Button size="sm" className="gap-1.5 text-xs font-semibold" onClick={handleCompleteInspection}>
                    <FileCheck className="size-3.5" />
                    Complete Inspection
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
