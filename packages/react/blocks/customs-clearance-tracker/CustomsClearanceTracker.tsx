'use client'

import * as React from 'react'
import {
  Anchor,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Printer,
  Receipt,
  Scale,
  ShieldCheck,
  Ship,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface CustomsClearanceTrackerProps {
  className?: string
}

interface ClearanceStage {
  id: string
  stageNumber: number
  title: string
  date: string
  status: 'completed' | 'current' | 'upcoming'
  description: string
}

interface CommodityLineItem {
  line: string
  hsCode: string
  origin: string
  description: string
  quantity: string
  unitValue: string
  totalValue: string
  dutyRate: string
  dutyAmount: string
}

const clearanceStages: ClearanceStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Commercial Invoice & Manifest Filed',
    date: 'Aug 12, 2026',
    status: 'completed',
    description: 'ACE transmission validated & electronic manifest logged',
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'ISF 10+2 Security Filing Accepted',
    date: 'Aug 14, 2026',
    status: 'completed',
    description: 'Importer Security Filing matched ocean BOL with zero errors',
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'FDA / Regulatory Agency Review',
    date: 'Aug 18, 2026',
    status: 'completed',
    description: 'Partner Government Agency (PGA) May Proceed notice issued',
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Duty & Tariff Assessment Paid',
    date: 'Aug 19, 2026',
    status: 'completed',
    description: 'ACH statement debit confirmed & settled to US Customs',
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Customs Released & Ready for Pickup',
    date: 'Aug 21, 2026 · 09:30 PST',
    status: 'current',
    description: '1C Customs release generated; terminal gate pass issued',
  },
]

const commodityLineItems: CommodityLineItem[] = [
  {
    line: '001',
    hsCode: '8518.30.00',
    origin: 'CN',
    description: 'Wireless ANC Over-Ear Studio Headphones (Model Pro-X9)',
    quantity: '1,200 pcs (50 ctns)',
    unitValue: '$58.50',
    totalValue: '$70,200.00',
    dutyRate: '3.4%',
    dutyAmount: '$2,386.80',
  },
  {
    line: '002',
    hsCode: '8518.21.00',
    origin: 'CN',
    description: 'Compact Bluetooth Desk Monitor Speakers (Pair)',
    quantity: '600 pcs (25 ctns)',
    unitValue: '$62.00',
    totalValue: '$37,200.00',
    dutyRate: '3.4%',
    dutyAmount: '$1,264.80',
  },
  {
    line: '003',
    hsCode: '8544.42.20',
    origin: 'CN',
    description: 'Braided USB-C to USB-C 240W Fast Charge Cables (2m)',
    quantity: '3,420 pcs (30 ctns)',
    unitValue: '$5.00',
    totalValue: '$17,100.00',
    dutyRate: '3.4%',
    dutyAmount: '$581.40',
  },
]

export function CustomsClearanceTracker({ className }: CustomsClearanceTrackerProps) {
  return (
    <div data-slot="customs-clearance-tracker" className={cn('w-full space-y-6', className)}>
      {/* Header Section Card */}
      <Card className="border shadow-xs">
        <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge wrap variant="outline" className="gap-1 font-mono text-xs">
                <FileText className="size-3" aria-hidden="true" />
                CBP Form 7501
              </Badge>
              <Badge wrap variant="secondary" className="text-xs font-medium">
                Entry Type 01 - Formal Consumption
              </Badge>
            </div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-foreground font-mono text-2xl font-bold tracking-tight break-all sm:text-3xl">
                #CBP-2026-948201
              </h1>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <Anchor className="text-primary size-3.5" aria-hidden="true" />
                <span className="text-foreground font-medium">Port of Long Beach</span>
              </span>
              <span>·</span>
              <span>US Customs &amp; Border Protection (Port Code: 2704)</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2.5 sm:items-end">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Customs Clearance Granted
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs shadow-xs"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Download 7501 Form
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <Printer className="size-3.5" aria-hidden="true" />
                Print Entry Summary
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Declaration Meta Grid */}
        <CardContent className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 sm:gap-6">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Importer of Record</p>
            <p className="text-foreground mt-0.5 text-xs font-semibold sm:text-sm">Apex Global Logistics LLC</p>
            <p className="text-muted-foreground font-mono text-xs">EIN 94-2849102</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs font-medium">Master Bill of Lading</p>
            <p className="text-foreground mt-0.5 font-mono text-xs font-semibold sm:text-sm">MAEU-928410294</p>
            <p className="text-muted-foreground text-xs">Container: MSKU-839201-4 (40' HC)</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs font-medium">Customs Broker</p>
            <p className="text-foreground mt-0.5 text-xs font-semibold sm:text-sm">Pacific Rim Customs Brokers</p>
            <p className="text-muted-foreground font-mono text-xs">Filer Code: 894 · Broker #48102</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs font-medium">Release Clearance Time</p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-700 sm:text-sm dark:text-emerald-400">
              Aug 21, 2026 · 09:30 PST
            </p>
            <p className="text-muted-foreground text-xs">Terminal 140 Gate Ready</p>
          </div>
        </CardContent>
      </Card>

      {/* Customs Clearance Stepper Card (5-stage progression) */}
      <Card className="border shadow-xs">
        <CardHeader className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Ship className="text-primary size-4" aria-hidden="true" />
              <CardTitle className="text-base font-semibold">Customs Clearance Lifecycle</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              5-stage electronic declaration, regulatory inspection, and duty settlement progress via ACE.
            </CardDescription>
          </div>
          <Badge
            wrap
            variant="secondary"
            className="bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            Stage 5 of 5 · Clearance Complete
          </Badge>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Desktop Stepper (md+) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 gap-2">
              {clearanceStages.map((stage, idx) => (
                <div key={stage.id} className="relative flex flex-col">
                  <div className="relative flex items-center">
                    {/* Connecting Line before current stage */}
                    {idx > 0 && (
                      <div
                        className={cn(
                          'absolute top-1/2 right-1/2 -z-0 h-0.5 w-full -translate-y-1/2',
                          stage.status === 'upcoming' ? 'bg-muted' : 'bg-primary',
                        )}
                      />
                    )}

                    {/* Connecting Line after current stage */}
                    {idx < clearanceStages.length - 1 && (
                      <div
                        className={cn(
                          'absolute top-1/2 left-1/2 -z-0 h-0.5 w-full -translate-y-1/2',
                          clearanceStages[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary',
                        )}
                      />
                    )}

                    {/* Step Indicator Circle */}
                    <div className="relative z-10 mx-auto flex items-center justify-center">
                      {stage.status === 'completed' ? (
                        <div className="bg-primary text-primary-foreground ring-background flex size-8 items-center justify-center rounded-full shadow-2xs ring-4">
                          <Check className="size-4" aria-hidden="true" />
                        </div>
                      ) : stage.status === 'current' ? (
                        <div className="ring-background flex size-8 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs ring-4 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <ShieldCheck className="size-4.5" aria-hidden="true" />
                        </div>
                      ) : (
                        <div className="border-muted-foreground/30 bg-muted/40 text-muted-foreground ring-background flex size-8 items-center justify-center rounded-full border-2 ring-4">
                          <span className="text-xs font-semibold tabular-nums">{stage.stageNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="mt-3 px-1 text-center">
                    <p
                      className={cn(
                        'text-xs leading-tight font-semibold sm:text-sm',
                        stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                      )}
                    >
                      {stage.title}
                    </p>
                    <p className="text-muted-foreground mt-1 font-mono text-xs tabular-nums">{stage.date}</p>
                    <p className="text-muted-foreground/80 mt-1 line-clamp-2 text-xs leading-normal">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Stepper (< md) */}
          <div className="space-y-4 md:hidden">
            {clearanceStages.map((stage, idx) => (
              <div key={stage.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {stage.status === 'completed' ? (
                    <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full shadow-2xs">
                      <Check className="size-3.5" aria-hidden="true" />
                    </div>
                  ) : stage.status === 'current' ? (
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <ShieldCheck className="size-4" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="border-muted-foreground/30 bg-muted/40 text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border-2">
                      <span className="text-xs font-medium tabular-nums">{stage.stageNumber}</span>
                    </div>
                  )}

                  {idx < clearanceStages.length - 1 && (
                    <div
                      className={cn(
                        'mt-1 h-10 w-0.5',
                        clearanceStages[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary',
                      )}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p
                      className={cn(
                        'text-xs font-semibold sm:text-sm',
                        stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                      )}
                    >
                      {stage.title}
                    </p>
                    <span className="text-muted-foreground font-mono text-xs tabular-nums">{stage.date}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border shadow-xs">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium">Total Customs Value</p>
              <div
                className="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                aria-hidden="true"
              >
                <Receipt className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$124,500.00 USD</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge wrap variant="outline" className="px-1.5 py-0 text-xs font-medium">
                  19 U.S.C. 1401a
                </Badge>
                <span className="text-muted-foreground truncate text-xs">Declared entered value</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium">Total Duty Assessed</p>
              <div
                className="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                aria-hidden="true"
              >
                <Scale className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$4,233.00</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge wrap variant="secondary" className="px-1.5 py-0 text-xs font-medium">
                  Tariff 3.4%
                </Badge>
                <span className="text-muted-foreground truncate text-xs">General Column 1 Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium">User Fees (MPF + HMF)</p>
              <div
                className="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                aria-hidden="true"
              >
                <FileCheck2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$769.98</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge wrap variant="outline" className="px-1.5 py-0 text-xs font-medium">
                  19 CFR § 24
                </Badge>
                <span className="text-muted-foreground truncate text-xs">MPF $614.35 + HMF $155.63</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium">Total Paid to US Customs</p>
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-2xs dark:text-emerald-400"
                aria-hidden="true"
              >
                <CreditCard className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$5,002.98</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge wrap variant="success" className="px-1.5 py-0 text-xs font-medium">
                  Paid in Full
                </Badge>
                <span className="text-muted-foreground truncate font-mono text-xs">ACH •••• 9210</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duty & Tariff Assessment Breakdown Card */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">Duty &amp; Tariff Assessment Breakdown</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Statutory tariff computation, user fees, and electronic clearinghouse payment settlement.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="text-xs font-medium">
              Electronic Entry Summary · ACE Verified
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Itemized Calculations */}
            <div className="space-y-4 lg:col-span-7">
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-foreground font-medium">Total Customs Value</span>
                    <p className="text-muted-foreground text-xs">FOB Port of Origin basis under 19 U.S.C. 1401a</p>
                  </div>
                  <span className="text-foreground font-semibold tabular-nums">$124,500.00 USD</span>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">Total Duty Assessed</span>
                      <Badge wrap variant="secondary" className="px-1.5 py-0 text-xs font-medium">
                        Tariff 3.4%
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">HTSUS Column 1 General Rate (8518 / 8544)</p>
                  </div>
                  <span className="text-foreground font-medium tabular-nums">$4,233.00</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">Merchandise Processing Fee (MPF)</span>
                      <Badge wrap variant="outline" className="px-1.5 py-0 text-xs font-medium">
                        Max Capped
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">0.3464% ad valorem (statutory max $614.35 applies)</p>
                  </div>
                  <span className="text-foreground font-medium tabular-nums">$614.35</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">Harbor Maintenance Fee (HMF)</span>
                      <Badge wrap variant="outline" className="px-1.5 py-0 text-xs font-medium">
                        Port of Long Beach
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">0.1250% of entered commercial port value</p>
                  </div>
                  <span className="text-foreground font-medium tabular-nums">$155.63</span>
                </div>

                <Separator />

                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 pt-1">
                  <div>
                    <span className="text-foreground text-base font-bold sm:text-lg">Total Paid to US Customs</span>
                    <p className="text-muted-foreground text-xs">Duty + MPF + HMF full remittance</p>
                  </div>
                  <span className="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl">
                    $5,002.98
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Settlement & Customs Audit Info */}
            <div className="space-y-4 lg:col-span-5">
              <div className="border-border bg-muted/30 space-y-3.5 rounded-lg border p-4 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-primary size-4" aria-hidden="true" />
                    <span className="text-foreground text-sm font-semibold">Payment &amp; Settlement</span>
                  </div>
                  <Badge wrap variant="success" className="gap-1 px-2 py-0.5 text-xs font-semibold">
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    Settled
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="text-foreground font-mono font-medium">Automated Clearinghouse ACH •••• 9210</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Settlement Date:</span>
                    <span className="text-foreground font-mono font-medium tabular-nums">Aug 19, 2026 · 16:00 EST</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">CBP Statement Ref:</span>
                    <span className="text-foreground font-mono font-medium">CBP-STMT-2026-88319</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customs Bond:</span>
                    <span className="text-foreground font-medium">Continuous Bond ($50,000)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Surety Code:</span>
                    <span className="text-foreground font-mono font-medium">Surety 892 · Policy #CB-882190</span>
                  </div>
                </div>

                <div className="border-border/60 border-t pt-2.5">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Entry summary transmitted pursuant to 19 CFR § 141.68. Liquidation occurs 314 days from date of
                    entry unless extended by CBP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declared Commodity Line Items Table Card */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">Declared Commodity Line Items</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Harmonized Tariff Schedule of the United States (HTSUS) classifications and entered commercial
                valuation.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="text-xs tabular-nums">
              3 Line Items Declared
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[8%]">Line</TableHead>
                  <TableHead className="w-[18%]">HS Code</TableHead>
                  <TableHead className="w-[10%] text-center">Origin</TableHead>
                  <TableHead className="w-[30%]">Commodity Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Value</TableHead>
                  <TableHead className="text-right">Entered Value</TableHead>
                  <TableHead className="text-center">Tariff Rate</TableHead>
                  <TableHead className="text-right">Assessed Duty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commodityLineItems.map((item) => (
                  <TableRow key={item.line}>
                    <TableCell className="text-muted-foreground font-mono text-xs font-semibold">{item.line}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground font-mono text-xs font-bold">{item.hsCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge wrap variant="secondary" className="font-mono text-xs font-semibold">
                        {item.origin}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground text-xs font-medium sm:text-sm">{item.description}</div>
                    </TableCell>
                    <TableCell className="text-foreground text-right text-xs font-medium tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right font-mono text-xs tabular-nums">
                      {item.unitValue}
                    </TableCell>
                    <TableCell className="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                      {item.totalValue}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge wrap variant="outline" className="text-xs font-semibold tabular-nums">
                        {item.dutyRate}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                      {item.dutyAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-medium">
                  <TableCell colSpan={4}>Total Declared Line Items (3 Commodities)</TableCell>
                  <TableCell className="text-foreground text-right text-xs font-bold tabular-nums">5,220 pcs</TableCell>
                  <TableCell className="text-muted-foreground text-right text-xs">—</TableCell>
                  <TableCell className="text-foreground text-right font-mono text-xs font-bold tabular-nums">
                    $124,500.00
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge wrap variant="secondary" className="text-xs font-semibold">
                      3.4% Blended
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                    $4,233.00
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
