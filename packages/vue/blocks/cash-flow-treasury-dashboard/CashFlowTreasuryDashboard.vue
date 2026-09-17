<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Flame,
  Landmark,
  Lock,
  RefreshCw,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  deposit: []
  transfer: [accountName?: string]
  manageSweep: []
}>()

const activeTab = ref<'30d' | '60d' | '90d'>('30d')
const activeMilestone = ref<number | null>(null)
const actionFeedback = ref<string | null>(null)
const isAutoSweepActive = ref(true)

interface HealthCard {
  title: string
  value: string
  highlight?: string
  badgeText: string
  badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive'
  badgeClass?: string
  description: string
  metricFootnote: string
  progressValue: number
  icon: any
}

const healthCards: HealthCard[] = [
  {
    title: 'Total Cash Runway',
    value: '28.4 Months Runway',
    badgeText: 'Optimal Runway',
    badgeVariant: 'outline',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'At current net burn rate ($170.8k/mo)',
    metricFootnote: 'Zero dilution horizon through Q4 2028',
    progressValue: 94,
    icon: ShieldCheck,
  },
  {
    title: 'Net Monthly Burn',
    value: '-$170,800.00 / mo',
    badgeText: '-12% vs budget',
    badgeVariant: 'outline',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Gross outflow $415.8k offset by $245.0k inflow',
    metricFootnote: '$23,200 under monthly board approved cap',
    progressValue: 74,
    icon: Flame,
  },
  {
    title: 'Projected 30-Day Inflow',
    value: '+$245,000.00',
    badgeText: '+18.4% YoY',
    badgeVariant: 'outline',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'From customer subscriptions & ARR renewals',
    metricFootnote: '96.2% contracted recurring enterprise revenue',
    progressValue: 88,
    icon: TrendingUp,
  },
  {
    title: 'Yield on Treasury Funds',
    value: '5.14% APY',
    highlight: '$20,800/mo interest earned',
    badgeText: 'Yield Active',
    badgeVariant: 'outline',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: '$2.85M deployed in US Treasury bills & sweeps',
    metricFootnote: '$249,600 annualized passive treasury income',
    progressValue: 98,
    icon: Sparkles,
  },
]

interface InflowItem {
  id: string
  name: string
  amount: string
  rawAmount: number
  percentage: number
  category: string
  detail: string
  color: string
}

const inflowBreakdown: InflowItem[] = [
  {
    id: 'in-arr',
    name: 'Customer ARR',
    amount: '+$210,000.00',
    rawAmount: 210000,
    percentage: 85.7,
    category: 'Subscription ARR',
    detail: 'Enterprise multi-seat renewals and monthly cloud subscriptions',
    color: 'bg-emerald-500',
  },
  {
    id: 'in-yield',
    name: 'Treasury Yield',
    amount: '+$20,800.00',
    rawAmount: 20800,
    percentage: 8.5,
    category: 'Money Market Sweep',
    detail: 'Accrued interest from 5.14% APY government sweeps & T-Bills',
    color: 'bg-teal-500',
  },
  {
    id: 'in-rebates',
    name: 'Partner Rebates',
    amount: '+$14,200.00',
    rawAmount: 14200,
    percentage: 5.8,
    category: 'Interchange & Cashback',
    detail: 'Corporate card cashback and cloud partner referral volume',
    color: 'bg-cyan-500',
  },
]

interface OutflowItem {
  id: string
  name: string
  amount: string
  rawAmount: number
  percentage: number
  category: string
  detail: string
  color: string
}

const outflowBreakdown: OutflowItem[] = [
  {
    id: 'out-payroll',
    name: 'Payroll & Benefits',
    amount: '-$138,400.00',
    rawAmount: 138400,
    percentage: 81.0,
    category: 'Compensation',
    detail: '42 full-time employees, health insurance, and 401(k) matching',
    color: 'bg-rose-500',
  },
  {
    id: 'out-infra',
    name: 'Cloud Infrastructure',
    amount: '-$24,800.00',
    rawAmount: 24800,
    percentage: 14.5,
    category: 'Hosting & AI APIs',
    detail: 'AWS compute clusters, Vercel edge deployment, & OpenAI inference',
    color: 'bg-amber-500',
  },
  {
    id: 'out-office',
    name: 'Office & Taxes',
    amount: '-$7,600.00',
    rawAmount: 7600,
    percentage: 4.5,
    category: 'G&A and Compliance',
    detail: 'San Francisco hub lease, state registrations & tax prep reserves',
    color: 'bg-slate-500 dark:bg-slate-400',
  },
]

interface BankAccount {
  id: string
  name: string
  institution: string
  accountType: string
  accountMask: string
  routingMask: string
  purpose: string
  apy: string
  balance: string
  balanceRaw: number
  status: 'Active' | 'Yield Sweeping' | 'Ringfenced' | 'Reserve Locked'
  statusType: 'success' | 'info' | 'warning'
  isSweepAccount?: boolean
}

const bankAccounts: BankAccount[] = [
  {
    id: 'acc-operating',
    name: 'Chase Corporate Operating',
    institution: 'JPMorgan Chase Bank',
    accountType: 'Operating Checking',
    accountMask: '•••• 4892',
    routingMask: '•••• 0210',
    purpose: 'Primary AP, vendor payouts & incoming customer wires',
    apy: '0.05% APY',
    balance: '$1,420,500.00',
    balanceRaw: 1420500,
    status: 'Active',
    statusType: 'success',
  },
  {
    id: 'acc-sweep',
    name: 'Morgan Stanley Treasury Sweep',
    institution: 'Morgan Stanley Private Bank',
    accountType: 'High-Yield Treasury Sweep',
    accountMask: '•••• 9210',
    routingMask: '•••• 0119',
    purpose: 'Automated daily sweep of cash over $1.0M into 4-week US T-Bills',
    apy: '5.14% APY',
    balance: '$2,850,000.00',
    balanceRaw: 2850000,
    status: 'Yield Sweeping',
    statusType: 'success',
    isSweepAccount: true,
  },
  {
    id: 'acc-payroll',
    name: 'SVB Payroll Escrow',
    institution: 'Silicon Valley Bank',
    accountType: 'Payroll Escrow',
    accountMask: '•••• 1049',
    routingMask: '•••• 1211',
    purpose: 'Ringfenced 2-cycle buffer for bi-weekly employee compensation',
    apy: '1.20% APY',
    balance: '$380,240.00',
    balanceRaw: 380240,
    status: 'Ringfenced',
    statusType: 'info',
  },
  {
    id: 'acc-tax',
    name: 'Citi Corporate Tax Reserve',
    institution: 'Citibank N.A.',
    accountType: 'Tax Reserve',
    accountMask: '•••• 8832',
    routingMask: '•••• 0008',
    purpose: 'Q3 estimated federal/state taxes & corporate franchise reserves',
    apy: '2.10% APY',
    balance: '$199,500.00',
    balanceRaw: 199500,
    status: 'Reserve Locked',
    statusType: 'warning',
  },
]

const trajectoryMilestones = [
  {
    day: 'Day 1',
    date: 'Aug 21',
    title: 'Starting Liquidity',
    amount: '$4,850,240.00',
    note: 'Base cash balance',
    cx: 50,
    cy: 130,
  },
  {
    day: 'Day 7',
    date: 'Aug 28',
    title: 'Weekly ARR Inflow',
    amount: '+$52,500.00',
    note: 'SaaS recurring billing',
    cx: 180,
    cy: 123,
  },
  {
    day: 'Day 15',
    date: 'Sep 05',
    title: 'Mid-Month Payroll Run',
    amount: '-$69,200.00',
    note: 'Bi-weekly payroll disbursal',
    cx: 330,
    cy: 144,
  },
  {
    day: 'Day 22',
    date: 'Sep 12',
    title: 'Enterprise ARR Renewals',
    amount: '+$185,000.00',
    note: 'Annual contract renewals',
    cx: 490,
    cy: 89,
  },
  {
    day: 'Day 30',
    date: 'Sep 20',
    title: 'Projected Ending Balance',
    amount: '$4,924,440.00',
    note: '+$74,200 net increase',
    cx: 650,
    cy: 108,
  },
]

function triggerNotification(msg: string) {
  actionFeedback.value = msg
  setTimeout(() => {
    if (actionFeedback.value === msg) {
      actionFeedback.value = null
    }
  }, 4000)
}

function handleDeposit() {
  emit('deposit')
  triggerNotification('Deposit modal opened. Direct ACH & Wire instructions ready for UIPKGE Technologies Inc.')
}

function handleTransfer(accountName?: string) {
  emit('transfer', accountName)
  triggerNotification(
    accountName
      ? `Transfer interface initiated from ${accountName}. Real-time settlement active.`
      : 'Initiating wire & multi-account transfer portal.',
  )
}

function handleManageSweep() {
  emit('manageSweep')
  isAutoSweepActive.value = !isAutoSweepActive.value
  triggerNotification(
    isAutoSweepActive.value
      ? 'Auto-Sweep rule ACTIVE: Daily excess over $1.0M swept into 5.14% APY Treasury Bills.'
      : 'Auto-Sweep rule PAUSED. Funds will remain in standard operating checking.',
  )
}
</script>

<template>
  <div data-slot="cash-flow-treasury-dashboard" :class="cn('w-full space-y-6', props.class)">
    <!-- Top Action Feedback Banner -->
    <div
      v-if="actionFeedback"
      class="bg-primary/10 border-primary/20 text-foreground flex flex-wrap items-center justify-between gap-x-2 rounded-lg border px-4 py-3 text-xs shadow-xs"
    >
      <div class="flex items-center gap-2.5">
        <Sparkles class="text-primary size-4 shrink-0" aria-hidden="true" />
        <span class="font-medium">{{ actionFeedback }}</span>
      </div>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground inline-flex size-5 items-center justify-center rounded-sm"
        @click="actionFeedback = null"
      >
        <span class="sr-only">Close message</span>
        &times;
      </button>
    </div>

    <!-- Header Section -->
    <div class="bg-card border-border relative overflow-hidden rounded-xl border p-6 shadow-xs">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <!-- Company & Title -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
              UIPKGE Technologies Inc.
            </span>
            <Badge
              variant="outline"
              class="gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              Live FDIC Insured Sweeps ($5M Aggregate)
            </Badge>
          </div>

          <div>
            <h1 class="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
              Treasury &amp; Cash Flow Management
            </h1>
            <p class="text-muted-foreground mt-0.5 text-xs sm:text-sm">
              Real-time liquidity monitoring, 30-day runway projection, and automated 5.14% APY yield sweep desk.
            </p>
          </div>
        </div>

        <!-- Header Action Controls -->
        <div class="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" class="gap-2 text-xs font-medium sm:text-sm" @click="handleDeposit">
            <ArrowDownLeft class="size-4" aria-hidden="true" />
            Deposit Funds
          </Button>
          <Button class="gap-2 text-xs font-medium sm:text-sm" @click="handleTransfer()">
            <ArrowUpRight class="size-4" aria-hidden="true" />
            Initiate Wire / Transfer
          </Button>
        </div>
      </div>

      <Separator class="my-5" />

      <!-- Net Total Liquidity Hero Metric Row -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
        <div class="space-y-1.5 md:col-span-6 lg:col-span-5">
          <div class="text-muted-foreground text-xs font-medium">Net Total Liquidity</div>
          <div class="flex flex-wrap items-baseline gap-3">
            <span class="text-foreground text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
              $4,850,240.00
            </span>
            <Badge
              variant="outline"
              class="gap-1 border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
            >
              <TrendingUp class="size-3" aria-hidden="true" />
              +$74,200.00 (+1.55%) this month
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">Aggregated across 4 corporate custody &amp; sweep accounts</p>
        </div>

        <!-- Liquidity Allocation Mini Pills -->
        <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3 md:col-span-6 lg:col-span-7">
          <div class="border-border bg-muted/40 rounded-lg border p-2.5">
            <span class="text-muted-foreground block text-xs">Available Cash</span>
            <span class="text-foreground font-mono text-sm font-semibold tabular-nums">$1,420,500.00</span>
            <span class="text-muted-foreground mt-0.5 block text-xs">29.3% in Operating</span>
          </div>

          <div class="border-border bg-muted/40 rounded-lg border p-2.5">
            <div class="flex flex-wrap items-center justify-between gap-x-2">
              <span class="text-muted-foreground block text-xs">Yield Sweep</span>
              <Badge
                variant="outline"
                class="border-emerald-500/30 px-1 py-0 text-xs font-normal text-emerald-600 dark:text-emerald-400"
              >
                5.14% APY
              </Badge>
            </div>
            <span class="text-foreground font-mono text-sm font-semibold tabular-nums">$2,850,000.00</span>
            <span class="text-muted-foreground mt-0.5 block text-xs">58.8% in T-Bills</span>
          </div>

          <div class="border-border bg-muted/40 rounded-lg border p-2.5">
            <span class="text-muted-foreground block text-xs">Escrow &amp; Reserves</span>
            <span class="text-foreground font-mono text-sm font-semibold tabular-nums">$579,740.00</span>
            <span class="text-muted-foreground mt-0.5 block text-xs">11.9% Ringfenced</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Treasury Health Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="card in healthCards"
        :key="card.title"
        class="border-border relative flex flex-col justify-between overflow-hidden shadow-xs"
      >
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium tracking-tight">
            {{ card.title }}
          </CardTitle>
          <Badge :variant="card.badgeVariant" :class="cn('text-xs font-medium', card.badgeClass)">
            {{ card.badgeText }}
          </Badge>
        </CardHeader>

        <CardContent class="space-y-3">
          <div>
            <div
              :class="
                cn(
                  'text-foreground text-2xl font-semibold tracking-tight tabular-nums',
                  card.title === 'Yield on Treasury Funds' && 'text-emerald-600 dark:text-emerald-400',
                )
              "
            >
              {{ card.value }}
            </div>
            <p v-if="card.highlight" class="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {{ card.highlight }}
            </p>
            <p class="text-muted-foreground mt-1 text-xs leading-normal">
              {{ card.description }}
            </p>
          </div>

          <div class="space-y-1.5 border-t pt-2.5">
            <Progress :model-value="card.progressValue" class="h-1.5" />
            <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span>{{ card.metricFootnote }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 30-Day Cash Flow Projection & Inflow/Outflow Breakdown Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- 30-Day Cash Flow Projection Chart (7 Cols on LG) -->
      <Card class="border-border flex flex-col justify-between shadow-xs lg:col-span-7">
        <CardHeader class="border-b pb-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <CardTitle class="text-base font-semibold tracking-tight"> 30-Day Cash Flow Projection </CardTitle>
                <Badge
                  variant="outline"
                  class="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  95% Confidence Band
                </Badge>
              </div>
              <CardDescription class="text-xs">
                Trajectory from <strong class="text-foreground">$4,850,240.00</strong> to projected
                <strong class="text-foreground">$4,924,440.00</strong> balance.
              </CardDescription>
            </div>

            <!-- Timeframe selector -->
            <div class="flex items-center rounded-lg border p-0.5 text-xs">
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    activeTab === '30d'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="activeTab = '30d'"
              >
                30D Projection
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    activeTab === '60d'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="activeTab = '60d'"
              >
                60D
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    activeTab === '90d'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="activeTab = '90d'"
              >
                90D
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 pt-5">
          <!-- Responsive Projection SVG Curve with Confidence Corridor -->
          <div class="bg-muted/10 relative w-full overflow-x-auto rounded-lg border p-2">
            <svg
              viewBox="0 0 700 220"
              class="h-56 w-full max-w-[560px] min-w-full overflow-visible"
              preserveAspectRatio="none"
              aria-label="30-day corporate cash projection graph"
            >
              <defs>
                <linearGradient id="cfBandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10B981" stop-opacity="0.22" />
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0.02" />
                </linearGradient>
                <linearGradient id="cfLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#10B981" />
                  <stop offset="45%" stop-color="#06B6D4" />
                  <stop offset="100%" stop-color="#10B981" />
                </linearGradient>
              </defs>

              <!-- Horizontal Grid Guidelines -->
              <g stroke="currentColor" class="text-border/60" stroke-width="1" stroke-dasharray="3 3">
                <line x1="40" y1="55" x2="670" y2="55" />
                <line x1="40" y1="115" x2="670" y2="115" />
                <line x1="40" y1="175" x2="670" y2="175" />
              </g>

              <!-- Guideline Labels -->
              <g class="fill-muted-foreground font-mono text-xs" font-size="12">
                <text x="4" y="58">$5.10M</text>
                <text x="4" y="118">$4.85M</text>
                <text x="4" y="178">$4.60M</text>
              </g>

              <!-- 95% Confidence Band Polygon Area -->
              <path
                d="M 50,120 C 110,110 140,95 180,90 C 240,85 280,105 330,105 C 390,105 430,55 490,55 C 550,55 590,75 650,75 L 650,140 C 590,140 550,125 490,125 C 430,125 390,175 330,175 C 280,175 240,155 180,155 C 140,155 110,140 50,140 Z"
                fill="url(#cfBandGradient)"
              />

              <!-- Upper Confidence Bound Line (Dashed) -->
              <path
                d="M 50,120 C 110,110 140,95 180,90 C 240,85 280,105 330,105 C 390,105 430,55 490,55 C 550,55 590,75 650,75"
                fill="none"
                stroke="#10B981"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                opacity="0.6"
              />

              <!-- Lower Confidence Bound Line (Dashed) -->
              <path
                d="M 50,140 C 110,140 140,155 180,155 C 240,155 280,175 330,175 C 390,175 430,125 490,125 C 550,125 590,140 650,140"
                fill="none"
                stroke="#10B981"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                opacity="0.4"
              />

              <!-- Median Expected Trajectory Main Curve -->
              <path
                d="M 50,130 C 110,128 140,123 180,123 C 240,123 280,144 330,144 C 390,144 430,89 490,89 C 550,89 590,108 650,108"
                fill="none"
                stroke="url(#cfLineGradient)"
                stroke-width="3"
                stroke-linecap="round"
              />

              <!-- Milestone Markers on Curve -->
              <g
                v-for="(m, idx) in trajectoryMilestones"
                :key="m.day"
                class="cursor-pointer"
                @mouseenter="activeMilestone = idx"
              >
                <circle :cx="m.cx" :cy="m.cy" r="6" class="fill-background stroke-emerald-500" stroke-width="3" />
                <circle
                  v-if="activeMilestone === idx"
                  :cx="m.cx"
                  :cy="m.cy"
                  r="11"
                  class="fill-emerald-500/20 stroke-emerald-400"
                  stroke-width="1"
                />
              </g>
            </svg>

            <!-- Bottom X-Axis Milestone Labels -->
            <div class="mt-2 grid max-w-[560px] min-w-full grid-cols-5 gap-1 border-t pt-2 text-center">
              <div
                v-for="(m, idx) in trajectoryMilestones"
                :key="m.day"
                :class="
                  cn(
                    'rounded-md p-1 transition-all',
                    activeMilestone === idx ? 'bg-muted ring-border/80 ring-1' : 'hover:bg-muted/40',
                  )
                "
                @mouseenter="activeMilestone = idx"
              >
                <span class="text-foreground block text-xs font-semibold">{{ m.day }}</span>
                <span class="text-muted-foreground block text-xs">{{ m.date }}</span>
                <span
                  :class="
                    cn(
                      'font-mono text-xs font-medium tabular-nums',
                      m.amount.startsWith('+')
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : m.amount.startsWith('-')
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-foreground',
                    )
                  "
                >
                  {{ m.amount }}
                </span>
              </div>
            </div>
          </div>

          <!-- Chart Key Legend & Milestone Detail Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-1.5">
                <span class="size-2.5 rounded-full bg-emerald-500" />
                <span class="text-foreground font-medium">Expected Trajectory</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="h-2 w-4 rounded-xs border border-dashed border-emerald-500 bg-emerald-500/20" />
                <span class="text-muted-foreground">95% Confidence Corridor</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="bg-background size-2 rounded-full border-2 border-emerald-500" />
                <span class="text-muted-foreground">Cash Events</span>
              </div>
            </div>

            <div class="text-muted-foreground font-mono">
              Net 30-Day Delta: <strong class="text-emerald-600 dark:text-emerald-400">+$74,200.00</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Inflow & Outflow Breakdown Side Column (5 Cols on LG) -->
      <div class="space-y-4 lg:col-span-5">
        <!-- Inflow Breakdown Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between gap-x-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <ArrowDownLeft class="size-4" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold tracking-tight">Projected 30D Inflow</CardTitle>
                  <CardDescription class="text-xs">Total incoming cash: +$245,000.00</CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                class="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                100%
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3">
            <div v-for="item in inflowBreakdown" :key="item.id" class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-x-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-foreground font-medium">{{ item.name }}</span>
                  <span class="text-muted-foreground font-mono text-xs">({{ item.percentage }}%)</span>
                </div>
                <span class="font-mono font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ item.amount }}
                </span>
              </div>
              <Progress :model-value="item.percentage" class="h-2" />
              <p class="text-muted-foreground text-xs">{{ item.detail }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Outflow Breakdown Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between gap-x-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400"
                >
                  <ArrowUpRight class="size-4" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold tracking-tight">Projected 30D Outflow</CardTitle>
                  <CardDescription class="text-xs">Total operational burn: -$170,800.00</CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                class="border-rose-500/20 bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400"
              >
                100%
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3">
            <div v-for="item in outflowBreakdown" :key="item.id" class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-x-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-foreground font-medium">{{ item.name }}</span>
                  <span class="text-muted-foreground font-mono text-xs">({{ item.percentage }}%)</span>
                </div>
                <span class="font-mono font-semibold text-rose-600 tabular-nums dark:text-rose-400">
                  {{ item.amount }}
                </span>
              </div>
              <Progress :model-value="item.percentage" class="h-2" />
              <p class="text-muted-foreground text-xs">{{ item.detail }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Connected Corporate Bank Accounts Table -->
    <div class="bg-card border-border overflow-hidden rounded-xl border shadow-xs">
      <div class="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5">
            <Landmark class="text-muted-foreground size-5" aria-hidden="true" />
            <h3 class="text-foreground text-base font-semibold tracking-tight sm:text-lg">
              Connected Corporate Bank &amp; Treasury Accounts
            </h3>
          </div>
          <p class="text-muted-foreground text-xs">
            4 institutional accounts connected via real-time Open Banking / Plaid Exchange
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            :class="
              cn(
                'gap-1.5 text-xs',
                isAutoSweepActive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground',
              )
            "
            @click="handleManageSweep"
          >
            <Sparkles class="size-3.5" aria-hidden="true" />
            <span>Auto-Sweep Rule: {{ isAutoSweepActive ? 'Active (5.14% APY)' : 'Paused' }}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            class="gap-1.5 text-xs"
            @click="triggerNotification('Bank balances refreshed from Federal Reserve Fedwire & NACHA feeds.')"
          >
            <RefreshCw class="size-3.5" aria-hidden="true" />
            Refresh Balances
          </Button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/40 hover:bg-muted/40">
              <TableHead class="min-w-[240px]">Institution &amp; Account</TableHead>
              <TableHead class="min-w-[220px]">Purpose &amp; Routing</TableHead>
              <TableHead class="text-center">APY / Yield</TableHead>
              <TableHead class="text-right">Available Balance</TableHead>
              <TableHead class="text-center">Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="account in bankAccounts" :key="account.id" class="hover:bg-muted/30">
              <!-- Account & Institution -->
              <TableCell>
                <div class="flex items-center gap-3">
                  <div
                    class="border-border/80 bg-background flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  >
                    <!-- Chase -->
                    <svg
                      v-if="account.id === 'acc-operating'"
                      viewBox="0 0 24 24"
                      class="size-5 shrink-0 text-[#117ACA]"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2.5L7.5 7h4.8L16.2 3.1 12 2.5zm9.5 9.5L17 7.5v4.8l3.9 3.9.6-4.2zm-9.5 9.5L16.5 17h-4.8L7.8 20.9l4.2.6zm-9.5-9.5L7 16.5v-4.8L3.1 7.8 2.5 12z"
                      />
                    </svg>
                    <!-- Morgan Stanley Sweep -->
                    <svg v-else-if="account.id === 'acc-sweep'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                      <rect width="24" height="24" rx="4" fill="#002D62" />
                      <path d="M4 17V7l5 5-5 5zm8 0V7l5 5-5 5z" fill="#00A3E0" />
                      <circle cx="18" cy="12" r="2" fill="#FFFFFF" />
                    </svg>
                    <!-- SVB -->
                    <svg
                      v-else-if="account.id === 'acc-payroll'"
                      viewBox="0 0 24 24"
                      class="size-5 shrink-0"
                      fill="none"
                    >
                      <rect width="24" height="24" rx="4" fill="#005587" />
                      <path d="M6 15l6-9 6 9-3 1.5-3-4.5-3 4.5L6 15z" fill="#FFFFFF" />
                      <path d="M9 16.5l3-4.5 3 4.5-3 1.5-3-1.5z" fill="#00A3E0" />
                    </svg>
                    <!-- Citibank -->
                    <svg v-else-if="account.id === 'acc-tax'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                      <path
                        d="M12 4.5C8 4.5 4.5 6.8 4 9.5h2.5c.5-1.5 3-2.5 5.5-2.5s5 1 5.5 2.5H20c-.5-2.7-4-5-8-5z"
                        fill="#EC111A"
                      />
                      <rect x="4" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
                      <circle cx="12" cy="15" r="4" fill="#003B70" />
                      <rect x="17" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
                    </svg>
                    <Building2 v-else class="text-muted-foreground size-5" />
                  </div>

                  <div class="min-w-0 space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground truncate text-sm font-semibold">{{ account.name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-muted-foreground truncate text-xs">{{ account.institution }}</span>
                      <span class="text-muted-foreground font-mono text-xs">{{ account.accountMask }}</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              <!-- Purpose -->
              <TableCell>
                <div class="space-y-0.5">
                  <span class="text-foreground block text-xs font-medium">{{ account.accountType }}</span>
                  <span class="text-muted-foreground block text-xs leading-tight">{{ account.purpose }}</span>
                </div>
              </TableCell>

              <!-- APY Rate -->
              <TableCell class="text-center">
                <Badge
                  v-if="account.isSweepAccount"
                  variant="outline"
                  class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  {{ account.apy }}
                </Badge>
                <span v-else class="text-muted-foreground font-mono text-xs">
                  {{ account.apy }}
                </span>
              </TableCell>

              <!-- Balance -->
              <TableCell class="text-right">
                <span class="text-foreground font-mono text-sm font-semibold tabular-nums">
                  {{ account.balance }}
                </span>
              </TableCell>

              <!-- Status -->
              <TableCell class="text-center">
                <Badge
                  v-if="account.statusType === 'success'"
                  variant="outline"
                  class="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <span class="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {{ account.status }}
                </Badge>
                <Badge
                  v-else-if="account.statusType === 'info'"
                  variant="outline"
                  class="gap-1 border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  <span class="size-1.5 rounded-full bg-blue-500" aria-hidden="true" />
                  {{ account.status }}
                </Badge>
                <Badge
                  v-else
                  variant="outline"
                  class="gap-1 border-amber-500/20 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400"
                >
                  <Lock class="size-3" aria-hidden="true" />
                  {{ account.status }}
                </Badge>
              </TableCell>

              <!-- Actions -->
              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <Button
                    v-if="account.isSweepAccount"
                    size="sm"
                    variant="outline"
                    class="h-8 gap-1 text-xs"
                    @click="handleManageSweep"
                  >
                    <Sparkles class="size-3 text-emerald-500" aria-hidden="true" />
                    Configure Sweep
                  </Button>
                  <Button v-else size="sm" variant="outline" class="h-8 text-xs" @click="handleTransfer(account.name)">
                    Transfer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Table Summary Footer -->
      <div class="bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row">
        <div class="flex items-center gap-2">
          <Shield class="text-muted-foreground size-4" aria-hidden="true" />
          <p class="text-muted-foreground text-xs">
            Custody verified through Member FINRA / SIPC &amp; FDIC depository institutions.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground font-mono text-xs">
            Net Liquidity: <strong class="text-foreground">$4,850,240.00</strong>
          </span>
          <Button size="sm" class="h-8 text-xs font-medium" @click="handleTransfer()">
            <Send class="mr-1.5 size-3.5" aria-hidden="true" />
            Transfer Between Accounts
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
