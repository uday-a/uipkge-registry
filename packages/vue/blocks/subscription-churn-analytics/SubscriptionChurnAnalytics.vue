<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  PhoneCall,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserMinus,
  UserPlus,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const selectedRange = ref('90d')

const primaryMetrics = [
  {
    id: 'net-mrr',
    label: 'Net MRR Growth',
    value: '+$12,480',
    unit: '/ mo',
    badge: '+8.4%',
    badgeVariant: 'success' as const,
    badgeIcon: TrendingUp,
    description: 'Gross additions outpacing cancellations by 6.8x',
  },
  {
    id: 'user-churn',
    label: 'User Churn Rate',
    value: '1.8%',
    unit: '/ mo',
    badge: 'Below 2% benchmark',
    badgeVariant: 'success' as const,
    badgeIcon: CheckCircle2,
    description: 'Logo churn down 0.4% from previous quarter',
  },
  {
    id: 'revenue-churn',
    label: 'Revenue Churn Rate',
    value: '0.9%',
    unit: '/ mo',
    badge: 'Negative Net Churn',
    badgeVariant: 'outline' as const,
    badgeIcon: TrendingDown,
    description: 'Expansion ($6,450) exceeds total churn ($2,170)',
  },
  {
    id: 'ltv',
    label: 'Customer Lifetime Value',
    value: '$4,850.00',
    unit: '',
    badge: 'CAC Payback 4.2 mo',
    badgeVariant: 'secondary' as const,
    badgeIcon: DollarSign,
    description: '3.4x LTV to CAC ratio across active cohort',
  },
]

const mrrWaterfall = [
  {
    id: 'new',
    label: 'New Subscriptions',
    amount: '+$8,200.00',
    impact: 'positive' as const,
    share: '52.9%',
    count: '38 new accounts',
    colorClass: 'text-success',
    badgeClass: 'bg-success/10 text-success border-success/20',
    barClass: 'bg-success',
    icon: UserPlus,
  },
  {
    id: 'expansion',
    label: 'Expansion / Upgrades',
    amount: '+$6,450.00',
    impact: 'positive' as const,
    share: '41.6%',
    count: '24 accounts expanded',
    colorClass: 'text-success',
    badgeClass: 'bg-success/10 text-success border-success/20',
    barClass: 'bg-success/80',
    icon: ArrowUpRight,
  },
  {
    id: 'contraction',
    label: 'Contraction / Downgrades',
    amount: '-$1,120.00',
    impact: 'warning' as const,
    share: '7.2%',
    count: '9 tier downgrades',
    colorClass: 'text-warning',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
    barClass: 'bg-warning',
    icon: ArrowDownRight,
  },
  {
    id: 'churn',
    label: 'Churn / Cancellations',
    amount: '-$1,050.00',
    impact: 'negative' as const,
    share: '6.8%',
    count: '7 accounts lost',
    colorClass: 'text-destructive',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
    barClass: 'bg-destructive',
    icon: UserMinus,
  },
  {
    id: 'reactivations',
    label: 'Reactivations',
    amount: '+$850.00',
    impact: 'info' as const,
    share: '5.5%',
    count: '4 win-back returns',
    colorClass: 'text-info dark:text-sky-400',
    badgeClass: 'bg-info/10 text-info dark:text-sky-400 border-info/20',
    barClass: 'bg-info dark:bg-sky-400',
    icon: RefreshCw,
  },
]

const churnReasons = [
  {
    id: 'competitor',
    reason: 'Switched to competitor',
    category: 'Product Fit / Competition',
    share: 38,
    lostArr: '-$24,800.00',
    accounts: 19,
    trend: 'Increasing',
    trendDelta: '+12% QoQ',
    trendVariant: 'destructive' as const,
  },
  {
    id: 'budget',
    reason: 'Budget constraints',
    category: 'Economic / Spend Freeze',
    share: 28,
    lostArr: '-$18,300.00',
    accounts: 14,
    trend: 'Decreasing',
    trendDelta: '-8% QoQ',
    trendVariant: 'success' as const,
  },
  {
    id: 'missing-sso',
    reason: 'Missing feature: SAML SSO',
    category: 'Security / Compliance',
    share: 21,
    lostArr: '-$13,750.00',
    accounts: 8,
    trend: 'Decreasing',
    trendDelta: '-15% QoQ',
    trendVariant: 'success' as const,
  },
  {
    id: 'project-ended',
    reason: 'Project ended',
    category: 'Seasonal / Lifecycle',
    share: 13,
    lostArr: '-$8,500.00',
    accounts: 6,
    trend: 'Increasing',
    trendDelta: '+4% QoQ',
    trendVariant: 'warning' as const,
  },
]

const quickActions = [
  {
    id: 'winback',
    title: 'Trigger Discount Win-Back Campaign',
    description: 'Dispatch automated 20% annual renewal incentives to 25 accounts canceled within the last 45 days.',
    impactBadge: 'Est. $4,800 MRR recovered',
    buttonText: 'Trigger Win-Back',
    buttonVariant: 'default' as const,
    icon: Sparkles,
  },
  {
    id: 'interviews',
    title: 'Schedule Exit Discovery Interviews',
    description:
      'Book 15-minute product alignment calls with churned enterprise accounts ($10k+ ARR) for feature feedback.',
    impactBadge: '3 enterprise accounts flagged',
    buttonText: 'Schedule Interviews',
    buttonVariant: 'outline' as const,
    icon: PhoneCall,
  },
  {
    id: 'health-alerts',
    title: 'Configure Churn Risk Telemetry Alerts',
    description: 'Automate high-priority notifications when weekly active seat engagement drops below 40% threshold.',
    impactBadge: '12 accounts in risk zone',
    buttonText: 'Configure Triggers',
    buttonVariant: 'outline' as const,
    icon: AlertCircle,
  },
]
</script>

<template>
  <div data-uipkge data-slot="subscription-churn-analytics" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Subscription Churn &amp; MRR Analytics
          </h2>
          <Badge variant="outline" class="border-border text-muted-foreground hidden font-mono text-xs sm:inline-flex">
            SaaS Metrics
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Track recurring revenue dynamics, logo retention cohorts, and cancellation root causes.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="w-44">
          <Select v-model="selectedRange">
            <SelectTrigger size="sm" class="w-full">
              <Calendar class="text-muted-foreground mr-1 size-3.5" aria-hidden="true" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button aria-label="Download attachment" size="sm" variant="outline" class="gap-2 shadow-xs">
          <Download class="text-muted-foreground size-4" aria-hidden="true" />
          <span>Export Retention Report</span>
        </Button>
      </div>
    </div>

    <!-- 4 Primary SaaS Metrics Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="metric in primaryMetrics"
        :key="metric.id"
        class="border-border bg-card hover:border-border/80 shadow-xs transition-colors"
      >
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <CardTitle class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              {{ metric.label }}
            </CardTitle>
            <Badge :variant="metric.badgeVariant" class="gap-1 font-medium tabular-nums">
              <component :is="metric.badgeIcon" class="size-3" aria-hidden="true" />
              <span>{{ metric.badge }}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 pb-4">
          <div class="flex items-baseline gap-1">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
              {{ metric.value }}
            </span>
            <span v-if="metric.unit" class="text-muted-foreground text-xs font-normal">
              {{ metric.unit }}
            </span>
          </div>
          <p class="text-muted-foreground text-xs leading-relaxed">
            {{ metric.description }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- MRR Movement Waterfall Breakdown Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <CardTitle class="text-foreground text-base font-semibold"> MRR Movement Waterfall Breakdown </CardTitle>
              <Badge variant="outline" class="border-border bg-muted/30 text-xs font-medium"> ChartMogul Bridge </Badge>
            </div>
            <CardDescription class="mt-1 text-xs">
              Decomposition of new customer revenue, expansion, contractions, logo churn, and reactivations.
            </CardDescription>
          </div>
          <div
            class="border-border/80 bg-muted/20 flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 sm:self-auto"
          >
            <span class="text-muted-foreground text-xs font-medium">Net MRR Change:</span>
            <span class="text-success text-sm font-bold tabular-nums">+$13,330.00</span>
            <Badge variant="success" class="ml-1 text-xs"> +9.3% </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Visual Waterfall Proportional Bar -->
        <div class="space-y-2">
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>Starting MRR: <strong class="text-foreground font-semibold tabular-nums">$142,500.00</strong></span>
            <span>Ending MRR: <strong class="text-foreground font-semibold tabular-nums">$155,830.00</strong></span>
          </div>
          <div class="bg-muted/60 flex h-3 w-full overflow-hidden rounded-full p-0.5 shadow-inner">
            <div
              class="h-full rounded-l-full bg-emerald-500 transition-all duration-300"
              style="width: 48%"
              title="New Subscriptions (+$8,200.00)"
            />
            <div
              class="h-full bg-emerald-400/90 transition-all duration-300"
              style="width: 38%"
              title="Expansion (+$6,450.00)"
            />
            <div
              class="h-full bg-sky-500 transition-all duration-300"
              style="width: 5%"
              title="Reactivations (+$850.00)"
            />
            <div
              class="h-full bg-amber-500 transition-all duration-300"
              style="width: 5%"
              title="Contraction (-$1,120.00)"
            />
            <div
              class="h-full rounded-r-full bg-rose-500 transition-all duration-300"
              style="width: 4%"
              title="Churn (-$1,050.00)"
            />
          </div>
          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="inline-block size-2 rounded-full bg-emerald-500" />
              <span>New (+$8.2k)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-block size-2 rounded-full bg-emerald-400" />
              <span>Expansion (+$6.45k)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-block size-2 rounded-full bg-sky-500" />
              <span>Reactivation (+$850)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-block size-2 rounded-full bg-amber-500" />
              <span>Contraction (-$1.12k)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-block size-2 rounded-full bg-rose-500" />
              <span>Churn (-$1.05k)</span>
            </div>
          </div>
        </div>

        <Separator class="border-border" />

        <!-- Detailed Waterfall Grid -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in mrrWaterfall"
            :key="item.id"
            class="border-border bg-card/60 hover:bg-muted/20 flex items-start justify-between rounded-lg border p-3.5 shadow-xs transition-colors"
          >
            <div class="flex items-start gap-3">
              <div
                class="border-border flex size-9 shrink-0 items-center justify-center rounded-md border shadow-xs"
                :class="item.badgeClass"
              >
                <component :is="item.icon" class="size-4" aria-hidden="true" />
              </div>
              <div class="space-y-0.5">
                <p class="text-foreground text-xs font-semibold">{{ item.label }}</p>
                <p class="text-muted-foreground text-xs">{{ item.count }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold tabular-nums" :class="item.colorClass">
                {{ item.amount }}
              </p>
              <span class="text-muted-foreground text-xs tabular-nums"> {{ item.share }} gross </span>
            </div>
          </div>

          <!-- Net Summary Tile -->
          <div
            class="border-success/30 bg-success/5 flex items-start justify-between rounded-lg border p-3.5 shadow-xs"
          >
            <div class="flex items-start gap-3">
              <div
                class="border-success/30 bg-success/15 text-success flex size-9 shrink-0 items-center justify-center rounded-md border shadow-xs"
              >
                <TrendingUp class="size-4" aria-hidden="true" />
              </div>
              <div class="space-y-0.5">
                <p class="text-foreground text-xs font-semibold">Net MRR Movement</p>
                <p class="text-muted-foreground text-xs">All streams combined</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-success text-sm font-bold tabular-nums">+$13,330.00</p>
              <Badge variant="success" class="text-xs tabular-nums"> Net Positive </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Churn Reason Distribution Table -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-foreground text-base font-semibold">
              Churn Reason Distribution &amp; Lost ARR Attribution
            </CardTitle>
            <CardDescription class="mt-1 text-xs">
              Primary cancellation drivers captured via post-cancellation exit surveys and customer success logs.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground text-xs">Total Lost ARR:</span>
            <span class="text-destructive text-sm font-bold tabular-nums">-$65,350.00</span>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow class="border-border hover:bg-transparent">
                <TableHead class="text-foreground text-xs font-semibold">Cancellation Reason</TableHead>
                <TableHead class="text-foreground text-xs font-semibold">Distribution Share</TableHead>
                <TableHead class="text-foreground text-right text-xs font-semibold">Lost ARR ($)</TableHead>
                <TableHead class="text-foreground text-right text-xs font-semibold">Impacted Accounts</TableHead>
                <TableHead class="text-foreground text-right text-xs font-semibold">Quarterly Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="row in churnReasons"
                :key="row.id"
                class="border-border hover:bg-muted/30 transition-colors"
              >
                <TableCell class="py-3.5">
                  <div class="text-foreground text-sm font-medium">{{ row.reason }}</div>
                  <div class="text-muted-foreground text-xs">{{ row.category }}</div>
                </TableCell>
                <TableCell class="min-w-[180px] py-3.5">
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-foreground font-medium tabular-nums">{{ row.share }}%</span>
                      <span class="text-muted-foreground text-xs">of total churn</span>
                    </div>
                    <Progress :model-value="row.share" class="bg-muted h-1.5" />
                  </div>
                </TableCell>
                <TableCell class="text-foreground py-3.5 text-right text-sm font-semibold tabular-nums">
                  {{ row.lostArr }}
                </TableCell>
                <TableCell class="text-muted-foreground py-3.5 text-right text-xs tabular-nums">
                  <span class="text-foreground font-medium">{{ row.accounts }}</span> accounts
                </TableCell>
                <TableCell class="py-3.5 text-right">
                  <Badge :variant="row.trendVariant" class="gap-1 text-xs font-medium tabular-nums">
                    <span>{{ row.trend === 'Increasing' ? '↑' : '↓' }}</span>
                    <span>{{ row.trend }}</span>
                    <span class="opacity-75">({{ row.trendDelta }})</span>
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Churn Prevention Quick Actions -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex items-center gap-2">
          <CardTitle class="text-foreground text-base font-semibold">
            Churn Prevention &amp; Win-Back Quick Actions
          </CardTitle>
          <Badge variant="secondary" class="text-xs"> Playbooks </Badge>
        </div>
        <CardDescription class="text-xs">
          High-leverage intervention workflows to stem revenue loss and re-engage churned customer cohorts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            v-for="action in quickActions"
            :key="action.id"
            class="border-border bg-card/60 hover:border-border/80 hover:bg-muted/10 flex flex-col justify-between rounded-lg border p-4 shadow-xs transition-all"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div
                  class="border-border bg-muted/40 text-foreground flex size-9 items-center justify-center rounded-md border shadow-xs"
                >
                  <component :is="action.icon" class="size-4" aria-hidden="true" />
                </div>
                <Badge variant="outline" class="border-border text-muted-foreground font-mono text-xs">
                  {{ action.impactBadge }}
                </Badge>
              </div>
              <div class="space-y-1">
                <h4 class="text-foreground text-sm leading-snug font-semibold">
                  {{ action.title }}
                </h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  {{ action.description }}
                </p>
              </div>
            </div>

            <div class="mt-4 pt-2">
              <Button :variant="action.buttonVariant" size="sm" class="w-full gap-2 shadow-xs">
                <component :is="action.icon" class="size-3.5" aria-hidden="true" />
                <span>{{ action.buttonText }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
