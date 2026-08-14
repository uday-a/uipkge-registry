<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

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

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

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
</script>

<template>
  <div data-slot="customs-clearance-tracker" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section Card -->
    <Card class="border shadow-xs">
      <CardHeader class="flex flex-col gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <Badge wrap variant="outline" class="gap-1 font-mono text-xs">
              <FileText class="size-3" aria-hidden="true" />
              CBP Form 7501
            </Badge>
            <Badge wrap variant="secondary" class="text-xs font-medium"> Entry Type 01 - Formal Consumption </Badge>
          </div>
          <div class="flex flex-wrap items-baseline gap-2.5">
            <h1 class="text-foreground font-mono text-2xl font-bold tracking-tight break-all sm:text-3xl">
              #CBP-2026-948201
            </h1>
          </div>
          <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span class="flex items-center gap-1">
              <Anchor class="text-primary size-3.5" aria-hidden="true" />
              <span class="text-foreground font-medium">Port of Long Beach</span>
            </span>
            <span>·</span>
            <span>US Customs &amp; Border Protection (Port Code: 2704)</span>
          </div>
        </div>

        <div class="flex flex-col items-start gap-2.5 sm:items-end">
          <div
            class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
          >
            <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Customs Clearance Granted
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button aria-label="Download attachment" variant="outline" size="sm" class="gap-1.5 text-xs shadow-xs">
              <Download class="size-3.5" aria-hidden="true" />
              Download 7501 Form
            </Button>
            <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-foreground gap-1.5 text-xs">
              <Printer class="size-3.5" aria-hidden="true" />
              Print Entry Summary
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <!-- Declaration Meta Grid -->
      <CardContent class="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 sm:gap-6">
        <div>
          <p class="text-muted-foreground text-xs font-medium">Importer of Record</p>
          <p class="text-foreground mt-0.5 text-xs font-semibold sm:text-sm">Apex Global Logistics LLC</p>
          <p class="text-muted-foreground font-mono text-xs">EIN 94-2849102</p>
        </div>

        <div>
          <p class="text-muted-foreground text-xs font-medium">Master Bill of Lading</p>
          <p class="text-foreground mt-0.5 font-mono text-xs font-semibold sm:text-sm">MAEU-928410294</p>
          <p class="text-muted-foreground text-xs">Container: MSKU-839201-4 (40' HC)</p>
        </div>

        <div>
          <p class="text-muted-foreground text-xs font-medium">Customs Broker</p>
          <p class="text-foreground mt-0.5 text-xs font-semibold sm:text-sm">Pacific Rim Customs Brokers</p>
          <p class="text-muted-foreground font-mono text-xs">Filer Code: 894 · Broker #48102</p>
        </div>

        <div>
          <p class="text-muted-foreground text-xs font-medium">Release Clearance Time</p>
          <p class="mt-0.5 text-xs font-semibold text-emerald-700 sm:text-sm dark:text-emerald-400">
            Aug 21, 2026 · 09:30 PST
          </p>
          <p class="text-muted-foreground text-xs">Terminal 140 Gate Ready</p>
        </div>
      </CardContent>
    </Card>

    <!-- Customs Clearance Stepper Card (5-stage progression) -->
    <Card class="border shadow-xs">
      <CardHeader class="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <Ship class="text-primary size-4" aria-hidden="true" />
            <CardTitle class="text-base font-semibold">Customs Clearance Lifecycle</CardTitle>
          </div>
          <CardDescription class="text-xs sm:text-sm">
            5-stage electronic declaration, regulatory inspection, and duty settlement progress via ACE.
          </CardDescription>
        </div>
        <Badge
          wrap
          variant="secondary"
          class="bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        >
          Stage 5 of 5 · Clearance Complete
        </Badge>
      </CardHeader>

      <CardContent class="pt-4">
        <!-- Desktop Stepper (md+) -->
        <div class="hidden md:block">
          <div class="grid grid-cols-5 gap-2">
            <div v-for="(stage, idx) in clearanceStages" :key="stage.id" class="relative flex flex-col">
              <div class="relative flex items-center">
                <!-- Connecting Line before current stage -->
                <div
                  v-if="idx > 0"
                  class="absolute top-1/2 right-1/2 -z-0 h-0.5 w-full -translate-y-1/2"
                  :class="stage.status === 'upcoming' ? 'bg-muted' : 'bg-primary'"
                />

                <!-- Connecting Line after current stage -->
                <div
                  v-if="idx < clearanceStages.length - 1"
                  class="absolute top-1/2 left-1/2 -z-0 h-0.5 w-full -translate-y-1/2"
                  :class="clearanceStages[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary'"
                />

                <!-- Step Indicator Circle -->
                <div class="relative z-10 mx-auto flex items-center justify-center">
                  <div
                    v-if="stage.status === 'completed'"
                    class="bg-primary text-primary-foreground ring-background flex size-8 items-center justify-center rounded-full shadow-2xs ring-4"
                  >
                    <Check class="size-4" aria-hidden="true" />
                  </div>
                  <div
                    v-else-if="stage.status === 'current'"
                    class="ring-background flex size-8 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs ring-4 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400"
                  >
                    <ShieldCheck class="size-4.5" aria-hidden="true" />
                  </div>
                  <div
                    v-else
                    class="border-muted-foreground/30 bg-muted/40 text-muted-foreground ring-background flex size-8 items-center justify-center rounded-full border-2 ring-4"
                  >
                    <span class="text-xs font-semibold tabular-nums">{{ stage.stageNumber }}</span>
                  </div>
                </div>
              </div>

              <!-- Step Content -->
              <div class="mt-3 px-1 text-center">
                <p
                  class="text-xs leading-tight font-semibold sm:text-sm"
                  :class="stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'"
                >
                  {{ stage.title }}
                </p>
                <p class="text-muted-foreground mt-1 font-mono text-xs tabular-nums">{{ stage.date }}</p>
                <p class="text-muted-foreground/80 mt-1 line-clamp-2 text-xs leading-normal">
                  {{ stage.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Stepper (< md) -->
        <div class="space-y-4 md:hidden">
          <div v-for="(stage, idx) in clearanceStages" :key="stage.id" class="flex items-start gap-3">
            <div class="flex flex-col items-center">
              <div
                v-if="stage.status === 'completed'"
                class="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full shadow-2xs"
              >
                <Check class="size-3.5" aria-hidden="true" />
              </div>
              <div
                v-else-if="stage.status === 'current'"
                class="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400"
              >
                <ShieldCheck class="size-4" aria-hidden="true" />
              </div>
              <div
                v-else
                class="border-muted-foreground/30 bg-muted/40 text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border-2"
              >
                <span class="text-xs font-medium tabular-nums">{{ stage.stageNumber }}</span>
              </div>

              <div
                v-if="idx < clearanceStages.length - 1"
                class="mt-1 h-10 w-0.5"
                :class="clearanceStages[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary'"
              />
            </div>

            <div class="min-w-0 flex-1 pt-0.5 pb-2">
              <div class="flex flex-wrap items-center justify-between gap-1">
                <p
                  class="text-xs font-semibold sm:text-sm"
                  :class="stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'"
                >
                  {{ stage.title }}
                </p>
                <span class="text-muted-foreground font-mono text-xs tabular-nums">{{ stage.date }}</span>
              </div>
              <p class="text-muted-foreground mt-0.5 text-xs">{{ stage.description }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="border shadow-xs">
        <CardContent class="p-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium">Total Customs Value</p>
            <div
              class="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
              aria-hidden="true"
            >
              <Receipt class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$124,500.00 USD</p>
            <div class="mt-2 flex items-center gap-2">
              <Badge wrap variant="outline" class="px-1.5 py-0 text-xs font-medium">19 U.S.C. 1401a</Badge>
              <span class="text-muted-foreground truncate text-xs">Declared entered value</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border shadow-xs">
        <CardContent class="p-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium">Total Duty Assessed</p>
            <div
              class="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
              aria-hidden="true"
            >
              <Scale class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$4,233.00</p>
            <div class="mt-2 flex items-center gap-2">
              <Badge wrap variant="secondary" class="px-1.5 py-0 text-xs font-medium">Tariff 3.4%</Badge>
              <span class="text-muted-foreground truncate text-xs">General Column 1 Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border shadow-xs">
        <CardContent class="p-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium">User Fees (MPF + HMF)</p>
            <div
              class="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
              aria-hidden="true"
            >
              <FileCheck2 class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$769.98</p>
            <div class="mt-2 flex items-center gap-2">
              <Badge wrap variant="outline" class="px-1.5 py-0 text-xs font-medium">19 CFR § 24</Badge>
              <span class="text-muted-foreground truncate text-xs">MPF $614.35 + HMF $155.63</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border shadow-xs">
        <CardContent class="p-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium">Total Paid to US Customs</p>
            <div
              class="flex size-8 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-2xs dark:text-emerald-400"
              aria-hidden="true"
            >
              <CreditCard class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$5,002.98</p>
            <div class="mt-2 flex items-center gap-2">
              <Badge wrap variant="success" class="px-1.5 py-0 text-xs font-medium">Paid in Full</Badge>
              <span class="text-muted-foreground truncate font-mono text-xs">ACH •••• 9210</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Duty & Tariff Assessment Breakdown Card -->
    <Card class="border shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle class="text-base font-semibold">Duty &amp; Tariff Assessment Breakdown</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              Statutory tariff computation, user fees, and electronic clearinghouse payment settlement.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="text-xs font-medium"> Electronic Entry Summary · ACE Verified </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <!-- Left Column: Itemized Calculations -->
          <div class="space-y-4 lg:col-span-7">
            <div class="space-y-3 text-sm">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="text-foreground font-medium">Total Customs Value</span>
                  <p class="text-muted-foreground text-xs">FOB Port of Origin basis under 19 U.S.C. 1401a</p>
                </div>
                <span class="text-foreground font-semibold tabular-nums">$124,500.00 USD</span>
              </div>

              <Separator />

              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground font-medium">Total Duty Assessed</span>
                    <Badge wrap variant="secondary" class="px-1.5 py-0 text-xs font-medium">Tariff 3.4%</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">HTSUS Column 1 General Rate (8518 / 8544)</p>
                </div>
                <span class="text-foreground font-medium tabular-nums">$4,233.00</span>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground font-medium">Merchandise Processing Fee (MPF)</span>
                    <Badge wrap variant="outline" class="px-1.5 py-0 text-xs font-medium">Max Capped</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">0.3464% ad valorem (statutory max $614.35 applies)</p>
                </div>
                <span class="text-foreground font-medium tabular-nums">$614.35</span>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground font-medium">Harbor Maintenance Fee (HMF)</span>
                    <Badge wrap variant="outline" class="px-1.5 py-0 text-xs font-medium">Port of Long Beach</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">0.1250% of entered commercial port value</p>
                </div>
                <span class="text-foreground font-medium tabular-nums">$155.63</span>
              </div>

              <Separator />

              <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 pt-1">
                <div>
                  <span class="text-foreground text-base font-bold sm:text-lg">Total Paid to US Customs</span>
                  <p class="text-muted-foreground text-xs">Duty + MPF + HMF full remittance</p>
                </div>
                <span class="text-foreground font-mono text-2xl font-bold tabular-nums sm:text-3xl"> $5,002.98 </span>
              </div>
            </div>
          </div>

          <!-- Right Column: Payment Settlement & Customs Audit Info -->
          <div class="space-y-4 lg:col-span-5">
            <div class="border-border bg-muted/30 space-y-3.5 rounded-lg border p-4 text-xs shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <CreditCard class="text-primary size-4" aria-hidden="true" />
                  <span class="text-foreground text-sm font-semibold">Payment &amp; Settlement</span>
                </div>
                <Badge wrap variant="success" class="gap-1 px-2 py-0.5 text-xs font-semibold">
                  <CheckCircle2 class="size-3" aria-hidden="true" />
                  Settled
                </Badge>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Payment Method:</span>
                  <span class="text-foreground font-mono font-medium">Automated Clearinghouse ACH •••• 9210</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Settlement Date:</span>
                  <span class="text-foreground font-mono font-medium tabular-nums">Aug 19, 2026 · 16:00 EST</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">CBP Statement Ref:</span>
                  <span class="text-foreground font-mono font-medium">CBP-STMT-2026-88319</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Customs Bond:</span>
                  <span class="text-foreground font-medium">Continuous Bond ($50,000)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Surety Code:</span>
                  <span class="text-foreground font-mono font-medium">Surety 892 · Policy #CB-882190</span>
                </div>
              </div>

              <div class="border-border/60 border-t pt-2.5">
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Entry summary transmitted pursuant to 19 CFR § 141.68. Liquidation occurs 314 days from date of entry
                  unless extended by CBP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Declared Commodity Line Items Table Card -->
    <Card class="border shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle class="text-base font-semibold">Declared Commodity Line Items</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              Harmonized Tariff Schedule of the United States (HTSUS) classifications and entered commercial valuation.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="text-xs tabular-nums"> 3 Line Items Declared </Badge>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[8%]">Line</TableHead>
                <TableHead class="w-[18%]">HS Code</TableHead>
                <TableHead class="w-[10%] text-center">Origin</TableHead>
                <TableHead class="w-[30%]">Commodity Description</TableHead>
                <TableHead class="text-right">Quantity</TableHead>
                <TableHead class="text-right">Unit Value</TableHead>
                <TableHead class="text-right">Entered Value</TableHead>
                <TableHead class="text-center">Tariff Rate</TableHead>
                <TableHead class="text-right">Assessed Duty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in commodityLineItems" :key="item.line">
                <TableCell class="text-muted-foreground font-mono text-xs font-semibold">
                  {{ item.line }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1.5">
                    <span class="text-foreground font-mono text-xs font-bold">{{ item.hsCode }}</span>
                  </div>
                </TableCell>
                <TableCell class="text-center">
                  <Badge wrap variant="secondary" class="font-mono text-xs font-semibold">
                    {{ item.origin }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="text-foreground text-xs font-medium sm:text-sm">{{ item.description }}</div>
                </TableCell>
                <TableCell class="text-foreground text-right text-xs font-medium tabular-nums">
                  {{ item.quantity }}
                </TableCell>
                <TableCell class="text-muted-foreground text-right font-mono text-xs tabular-nums">
                  {{ item.unitValue }}
                </TableCell>
                <TableCell class="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                  {{ item.totalValue }}
                </TableCell>
                <TableCell class="text-center">
                  <Badge wrap variant="outline" class="text-xs font-semibold tabular-nums">
                    {{ item.dutyRate }}
                  </Badge>
                </TableCell>
                <TableCell
                  class="text-right font-mono text-xs font-bold text-emerald-700 tabular-nums dark:text-emerald-400"
                >
                  {{ item.dutyAmount }}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow class="font-medium">
                <TableCell colspan="4">Total Declared Line Items (3 Commodities)</TableCell>
                <TableCell class="text-foreground text-right text-xs font-bold tabular-nums"> 5,220 pcs </TableCell>
                <TableCell class="text-muted-foreground text-right text-xs">—</TableCell>
                <TableCell class="text-foreground text-right font-mono text-xs font-bold tabular-nums">
                  $124,500.00
                </TableCell>
                <TableCell class="text-center">
                  <Badge wrap variant="secondary" class="text-xs font-semibold">3.4% Blended</Badge>
                </TableCell>
                <TableCell
                  class="text-right font-mono text-xs font-bold text-emerald-700 tabular-nums dark:text-emerald-400"
                >
                  $4,233.00
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
