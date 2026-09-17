<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Download,
  HeartHandshake,
  Lightbulb,
  MousePointerClick,
  Rocket,
  Share2,
  ShieldAlert,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const selectedTimeframe = ref('30d')
const isExporting = ref(false)
const selectedStageIndex = ref<number | null>(null)

const timeframes = [
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'qtd', label: 'Quarter to Date' },
  { id: 'ytd', label: 'Year to Date' },
]

function handleExport() {
  isExporting.value = true
  setTimeout(() => {
    isExporting.value = false
  }, 1200)
}

interface JourneyStage {
  id: string
  stageNumber: string
  title: string
  subtitle: string
  icon: typeof Compass
  volume: string
  volumeLabel: string
  volumeChange: string
  volumeChangeTrend: 'up' | 'down'
  conversionRate: string
  conversionLabel: string
  primaryAction: {
    icon: typeof MousePointerClick
    text: string
  }
  keyMetrics: {
    label: string
    value: string
    detail?: string
  }[]
  touchpoints: {
    name: string
    channel: string
    type: 'organic' | 'app' | 'email' | 'billing'
  }[]
  sentiment: {
    score: number
    maxScore: number
    label: string
    icon: typeof Smile
    progressColor: string
    gaugeLabel: string
  }
  frictionPoint: string
  opportunity: {
    experiment: string
    expectedImpact: string
  }
  badgeVariant: 'outline' | 'secondary' | 'default' | 'success' | 'info' | 'warning'
}

const stages: JourneyStage[] = [
  {
    id: 'acquisition',
    stageNumber: '01',
    title: 'Acquisition',
    subtitle: 'Traffic & Inbound Discovery',
    icon: Compass,
    volume: '120,000',
    volumeLabel: 'Unique Visitors',
    volumeChange: '+14.2%',
    volumeChangeTrend: 'up',
    conversionRate: '6.8%',
    conversionLabel: 'Visitor to Signup',
    primaryAction: {
      icon: MousePointerClick,
      text: 'Browses docs & visits pricing',
    },
    keyMetrics: [
      { label: 'Top Channel', value: 'Organic Search', detail: '48% of volume' },
      { label: 'Signup Conv.', value: '6.8%', detail: '8,160 accounts' },
      { label: 'Avg. Bounce', value: '41.2%', detail: '-2.4% vs benchmark' },
    ],
    touchpoints: [
      { name: 'SEO landing pages & technical blog', channel: 'Search', type: 'organic' },
      { name: 'Interactive sandbox demo playground', channel: 'Web App', type: 'app' },
      { name: 'Product Hunt launch & GitHub repo', channel: 'Community', type: 'organic' },
      { name: 'Developer search & social ad campaigns', channel: 'Paid Ads', type: 'organic' },
    ],
    sentiment: {
      score: 8.2,
      maxScore: 10,
      label: 'High Intent',
      icon: Smile,
      progressColor: 'bg-chart-1',
      gaugeLabel: '8.2 / 10',
    },
    frictionPoint: 'Technical landing page bounce rate spikes on legacy mobile browsers (54%).',
    opportunity: {
      experiment: 'Optimize hero headline for developer intent to lift bounce rate by 5%',
      expectedImpact: '+420 signups/mo',
    },
    badgeVariant: 'secondary',
  },
  {
    id: 'activation',
    stageNumber: '02',
    title: 'Activation',
    subtitle: 'Onboarding & First Success',
    icon: Rocket,
    volume: '8,160',
    volumeLabel: 'Signups Onboarded',
    volumeChange: '+8.6%',
    volumeChangeTrend: 'up',
    conversionRate: '78.0%',
    conversionLabel: 'Reached Aha Milestone',
    primaryAction: {
      icon: Zap,
      text: 'Runs first CLI query & creates project',
    },
    keyMetrics: [
      { label: 'Key Milestone', value: 'Created 1st Project', detail: '78% completed' },
      { label: 'Time to Value', value: '12 min', detail: 'Median onboarding' },
      { label: 'Stage Drop-off', value: '22.0%', detail: 'Step 3 invite friction' },
    ],
    touchpoints: [
      { name: 'Automated 4-part welcome email sequence', channel: 'Email', type: 'email' },
      { name: 'Interactive 3-step setup checklist', channel: 'In-App Modal', type: 'app' },
      { name: 'Pre-populated template project schemas', channel: 'Workspace', type: 'app' },
      { name: 'CLI quickstart terminal prompt', channel: 'Developer Tool', type: 'app' },
    ],
    sentiment: {
      score: 8.8,
      maxScore: 10,
      label: 'Enthusiastic',
      icon: Smile,
      progressColor: 'bg-chart-2',
      gaugeLabel: '8.8 / 10',
    },
    frictionPoint: 'Drop-off occurs during mandatory colleague invite screen before dashboard access.',
    opportunity: {
      experiment: 'Add single-sign on prompt to reduce drop-off by 8%',
      expectedImpact: '+650 activated teams',
    },
    badgeVariant: 'info',
  },
  {
    id: 'monetization',
    stageNumber: '03',
    title: 'Monetization',
    subtitle: 'Free to Paid Conversion',
    icon: CreditCard,
    volume: '1,420',
    volumeLabel: 'Paid Customers',
    volumeChange: '+22.4%',
    volumeChangeTrend: 'up',
    conversionRate: '17.4%',
    conversionLabel: 'Signup to Paid Rate',
    primaryAction: {
      icon: TrendingUp,
      text: 'Selects Team plan & enters credit card',
    },
    keyMetrics: [
      { label: 'Avg. Order Value', value: '$49/mo', detail: 'Blended Team/Pro' },
      { label: 'Conv. Rate', value: '17.4%', detail: '1,420 total accounts' },
      { label: 'Gross New MRR', value: '+$69,580', detail: 'Paced above target' },
    ],
    touchpoints: [
      { name: 'Feature gate limit trigger modal', channel: 'In-App', type: 'app' },
      { name: 'Self-serve pricing comparison drawer', channel: 'Web App', type: 'app' },
      { name: 'Stripe checkout with annual savings toggle', channel: 'Billing Gateway', type: 'billing' },
      { name: 'Instant VAT receipt & team tax invoice', channel: 'Automated Email', type: 'email' },
    ],
    sentiment: {
      score: 8.4,
      maxScore: 10,
      label: 'ROI Positive',
      icon: Smile,
      progressColor: 'bg-chart-3',
      gaugeLabel: '8.4 / 10',
    },
    frictionPoint: '12% checkout abandonment when international VAT verification requires manual review.',
    opportunity: {
      experiment: 'Introduce annual billing 20% discount badge in checkout to lift ARPU',
      expectedImpact: '+$14.2k MRR expansion',
    },
    badgeVariant: 'warning',
  },
  {
    id: 'retention',
    stageNumber: '04',
    title: 'Retention & Advocacy',
    subtitle: 'Active Renewals & Expansion',
    icon: HeartHandshake,
    volume: '92.0%',
    volumeLabel: 'Net Retention Rate',
    volumeChange: '+3.1%',
    volumeChangeTrend: 'up',
    conversionRate: '92.0%',
    conversionLabel: 'Cohort Net Retention',
    primaryAction: {
      icon: Share2,
      text: 'Shares referral link & invites teammates',
    },
    keyMetrics: [
      { label: 'NPS Score', value: '+68', detail: 'Industry world-class' },
      { label: 'Referral Velocity', value: '1.2 invites', detail: 'Per active user/mo' },
      { label: 'Monthly Logo Churn', value: '0.8%', detail: 'Negative revenue churn' },
    ],
    touchpoints: [
      { name: 'Automated weekly performance digest', channel: 'Email Digest', type: 'email' },
      { name: 'Quarterly proactive CSM review email', channel: 'Success Touch', type: 'email' },
      { name: 'Referral program link inside settings', channel: 'Workspace Settings', type: 'app' },
      { name: 'Changelog notification & release notes', channel: 'In-App Feed', type: 'app' },
    ],
    sentiment: {
      score: 9.4,
      maxScore: 10,
      label: 'Brand Advocates',
      icon: Smile,
      progressColor: 'bg-chart-4',
      gaugeLabel: '9.4 / 10',
    },
    frictionPoint: 'Feature discovery lag for advanced multi-region latency controls on growing teams.',
    opportunity: {
      experiment: 'Launch one-click workspace invite link to increase referral velocity to 1.8',
      expectedImpact: '+35% viral coefficient',
    },
    badgeVariant: 'success',
  },
]

const stageTransitions = [
  {
    from: 'Acquisition',
    to: 'Activation',
    rate: '6.8%',
    description: '120k → 8,160 Signups',
    velocity: '4.2 hrs avg',
  },
  {
    from: 'Activation',
    to: 'Monetization',
    rate: '17.4%',
    description: '8,160 → 1,420 Paid',
    velocity: '6.5 days avg',
  },
  {
    from: 'Monetization',
    to: 'Retention & Advocacy',
    rate: '92.0%',
    description: '1,420 → 1,306 Active Advocates',
    velocity: '30-day renewal cycle',
  },
]

const overallSummary = {
  funnelConversion: '1.18%',
  funnelConversionDetail: '1,420 Paid from 120,000 Visitors',
  timeToValue: '12 min',
  timeToValueDetail: 'Median signup to Aha moment',
  conversionVelocity: '4.2 days',
  conversionVelocityDetail: 'First touch to paid subscription',
  netRetention: '92.0%',
  netRetentionDetail: 'Expansion outpacing churn by 3.8x',
}
</script>

<template>
  <div data-uipkge data-slot="customer-journey-map" :class="cn('space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex min-w-0 items-center gap-2">
          <h2 class="text-foreground text-2xl font-bold tracking-tight">Customer Journey & Growth Lifecycle Map</h2>
          <Badge variant="outline" class="border-primary/30 text-primary bg-primary/5 text-xs font-medium">
            Live Lifecycle
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Analyze conversion velocity, friction points, and retention cohorts across user lifecycle stages.
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="bg-muted/50 border-border inline-flex items-center rounded-lg border p-1">
          <button
            v-for="tf in timeframes"
            :key="tf.id"
            type="button"
            :class="
              cn(
                'focus-visible:ring-ring rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-hidden',
                selectedTimeframe === tf.id
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )
            "
            @click="selectedTimeframe = tf.id"
          >
            {{ tf.label }}
          </button>
        </div>

        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="h-8 gap-1.5 text-xs font-medium"
          :disabled="isExporting"
          @click="handleExport"
        >
          <Download v-if="!isExporting" class="size-3.5" />
          <CheckCircle2 v-else class="text-success size-3.5" />
          <span>{{ isExporting ? 'Exported' : 'Export Journey Map' }}</span>
        </Button>
      </div>
    </div>

    <!-- Connected Horizontal Funnel Flow Ribbon -->
    <div class="border-border bg-card/60 rounded-xl border p-3 shadow-xs backdrop-blur-xs">
      <div class="grid grid-cols-1 gap-2 md:grid-cols-7 md:items-center">
        <!-- Stage 1 Pill -->
        <div class="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border px-3 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <div class="bg-chart-1/15 text-chart-1 flex size-6 items-center justify-center rounded-md">
              <Compass class="size-3.5" />
            </div>
            <div>
              <p class="text-foreground text-xs font-semibold">1. Acquisition</p>
              <p class="text-muted-foreground text-xs tabular-nums">120,000 Visitors</p>
            </div>
          </div>
        </div>

        <!-- Connector 1 -->
        <div class="flex flex-col items-center justify-center py-1 md:py-0">
          <div class="flex items-center gap-1">
            <span class="text-muted-foreground text-xs font-medium tabular-nums">6.8%</span>
            <ArrowRight class="text-muted-foreground size-3.5" />
          </div>
          <span class="text-muted-foreground/70 hidden text-xs md:inline">Signup rate</span>
        </div>

        <!-- Stage 2 Pill -->
        <div class="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border px-3 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <div class="bg-chart-2/15 text-chart-2 flex size-6 items-center justify-center rounded-md">
              <Rocket class="size-3.5" />
            </div>
            <div>
              <p class="text-foreground text-xs font-semibold">2. Activation</p>
              <p class="text-muted-foreground text-xs tabular-nums">8,160 Signups</p>
            </div>
          </div>
        </div>

        <!-- Connector 2 -->
        <div class="flex flex-col items-center justify-center py-1 md:py-0">
          <div class="flex items-center gap-1">
            <span class="text-muted-foreground text-xs font-medium tabular-nums">17.4%</span>
            <ArrowRight class="text-muted-foreground size-3.5" />
          </div>
          <span class="text-muted-foreground/70 hidden text-xs md:inline">Upgrade rate</span>
        </div>

        <!-- Stage 3 Pill -->
        <div class="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border px-3 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <div class="bg-chart-3/15 text-chart-3 flex size-6 items-center justify-center rounded-md">
              <CreditCard class="size-3.5" />
            </div>
            <div>
              <p class="text-foreground text-xs font-semibold">3. Monetization</p>
              <p class="text-muted-foreground text-xs tabular-nums">1,420 Paid</p>
            </div>
          </div>
        </div>

        <!-- Connector 3 -->
        <div class="flex flex-col items-center justify-center py-1 md:py-0">
          <div class="flex items-center gap-1">
            <span class="text-muted-foreground text-xs font-medium tabular-nums">92.0%</span>
            <ArrowRight class="text-muted-foreground size-3.5" />
          </div>
          <span class="text-muted-foreground/70 hidden text-xs md:inline">Retention</span>
        </div>

        <!-- Stage 4 Pill -->
        <div class="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border px-3 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <div class="bg-chart-4/15 text-chart-4 flex size-6 items-center justify-center rounded-md">
              <HeartHandshake class="size-3.5" />
            </div>
            <div>
              <p class="text-foreground text-xs font-semibold">4. Retention</p>
              <p class="text-muted-foreground text-xs tabular-nums">1,306 Advocates</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4-Stage Horizontal Journey Grid -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="(stage, idx) in stages"
        :key="stage.id"
        :class="
          cn(
            'border-border hover:border-primary/40 relative flex flex-col justify-between transition-all duration-200',
            selectedStageIndex === idx && 'ring-primary/40 ring-2',
          )
        "
        @click="selectedStageIndex = selectedStageIndex === idx ? null : idx"
      >
        <CardHeader class="space-y-3 pb-3">
          <!-- Stage Badge & Number -->
          <div class="flex items-center justify-between">
            <Badge :variant="stage.badgeVariant" class="text-xs font-semibold"> Stage {{ stage.stageNumber }} </Badge>
            <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              {{ stage.conversionLabel }}
            </span>
          </div>

          <!-- Stage Icon & Title -->
          <div class="flex items-start gap-3">
            <div
              :class="
                cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs',
                  idx === 0 && 'border-chart-1/30 bg-chart-1/10 text-chart-1',
                  idx === 1 && 'border-chart-2/30 bg-chart-2/10 text-chart-2',
                  idx === 2 && 'border-chart-3/30 bg-chart-3/10 text-chart-3',
                  idx === 3 && 'border-chart-4/30 bg-chart-4/10 text-chart-4',
                )
              "
            >
              <component :is="stage.icon" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <CardTitle class="text-foreground text-base font-bold">{{ stage.title }}</CardTitle>
              <CardDescription class="text-muted-foreground text-xs">{{ stage.subtitle }}</CardDescription>
            </div>
          </div>

          <!-- Stage Volume Metric -->
          <div
            class="bg-muted/40 border-border/60 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 rounded-lg border p-3"
          >
            <div>
              <p class="text-muted-foreground text-xs font-medium">{{ stage.volumeLabel }}</p>
              <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ stage.volume }}</p>
            </div>
            <div class="text-right">
              <Badge variant="outline" class="border-success/30 bg-success/10 text-success gap-1 text-xs font-medium">
                <TrendingUp class="size-3" />
                <span class="tabular-nums">{{ stage.volumeChange }}</span>
              </Badge>
              <p class="text-muted-foreground mt-1 text-xs">
                Conv: <span class="text-foreground font-semibold tabular-nums">{{ stage.conversionRate }}</span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-4 pt-0">
          <!-- Primary Customer Action -->
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs font-medium">Primary Customer Action</p>
            <div
              class="bg-accent/40 border-border/80 text-foreground flex min-w-0 items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium"
            >
              <component :is="stage.primaryAction.icon" class="text-primary size-3.5 shrink-0" />
              <span class="truncate">{{ stage.primaryAction.text }}</span>
            </div>
          </div>

          <!-- Key Metrics Grid -->
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs font-medium">Key Stage Signals</p>
            <div class="grid grid-cols-1 gap-1.5">
              <div
                v-for="(metric, mIdx) in stage.keyMetrics"
                :key="mIdx"
                class="bg-background/60 border-border/60 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
              >
                <span class="text-muted-foreground">{{ metric.label }}</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-foreground font-semibold tabular-nums">{{ metric.value }}</span>
                  <span v-if="metric.detail" class="text-muted-foreground text-xs">({{ metric.detail }})</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Touchpoints List -->
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs font-medium">Active Touchpoints</p>
            <ul class="space-y-1">
              <li
                v-for="(tp, tpIdx) in stage.touchpoints"
                :key="tpIdx"
                class="text-foreground/90 flex items-start gap-2 text-xs"
              >
                <div
                  class="bg-primary/20 text-primary mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full"
                >
                  <span class="text-xs">•</span>
                </div>
                <div class="min-w-0 flex-1">
                  <span>{{ tp.name }}</span>
                  <Badge variant="outline" class="text-muted-foreground border-border ml-1.5 px-1 py-0 text-xs">
                    {{ tp.channel }}
                  </Badge>
                </div>
              </li>
            </ul>
          </div>

          <Separator class="my-2" />

          <!-- Sentiment Indicator -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground flex items-center gap-1">
                <Smile class="text-primary size-3.5" />
                Sentiment Score
              </span>
              <span class="text-foreground font-semibold tabular-nums">
                {{ stage.sentiment.gaugeLabel }} ({{ stage.sentiment.label }})
              </span>
            </div>
            <Progress :model-value="(stage.sentiment.score / stage.sentiment.maxScore) * 100" class="h-1.5" />
          </div>

          <!-- Friction / Drop-off Point Note -->
          <div class="bg-destructive/5 border-destructive/20 rounded-md border p-2.5">
            <div class="flex items-start gap-2">
              <ShieldAlert class="text-destructive mt-0.5 size-3.5 shrink-0" />
              <div class="text-xs">
                <span class="text-destructive font-semibold">Friction Point: </span>
                <span class="text-foreground/80">{{ stage.frictionPoint }}</span>
              </div>
            </div>
          </div>

          <!-- Opportunity / Next Experiment Box -->
          <div class="bg-primary/5 border-primary/20 rounded-md border p-2.5">
            <div class="flex items-start gap-2">
              <Lightbulb class="text-primary mt-0.5 size-3.5 shrink-0" />
              <div class="min-w-0 flex-1 space-y-0.5 text-xs">
                <div class="flex flex-wrap items-center justify-between gap-1">
                  <span class="text-primary font-semibold">Growth Experiment:</span>
                  <Badge
                    variant="outline"
                    class="border-primary/30 text-primary bg-primary/10 text-xs font-semibold tabular-nums"
                  >
                    {{ stage.opportunity.expectedImpact }}
                  </Badge>
                </div>
                <p class="text-foreground/80 leading-relaxed">{{ stage.opportunity.experiment }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Cross-Stage Conversion Velocity & Funnel Health Summary -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-foreground text-lg font-bold"
              >Lifecycle Conversion Velocity & Health Diagnostics</CardTitle
            >
            <CardDescription class="text-muted-foreground text-xs">
              End-to-end efficiency metrics tracking user progression speed from initial acquisition to retained
              advocacy.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            class="border-success/30 bg-success/10 text-success w-fit gap-1 text-xs font-semibold"
          >
            <CheckCircle2 class="size-3.5" />
            Healthy Velocity (+18% QoQ)
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-5">
        <!-- Metric Cards Strip -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="bg-muted/30 border-border/70 rounded-lg border p-3">
            <div class="flex items-center gap-1.5">
              <TrendingUp class="text-chart-1 size-3.5" />
              <span class="text-muted-foreground text-xs font-medium">Overall Conversion</span>
            </div>
            <p class="text-foreground mt-1 text-2xl font-bold tracking-tight tabular-nums">
              {{ overallSummary.funnelConversion }}
            </p>
            <p class="text-muted-foreground text-xs">{{ overallSummary.funnelConversionDetail }}</p>
          </div>

          <div class="bg-muted/30 border-border/70 rounded-lg border p-3">
            <div class="flex items-center gap-1.5">
              <Zap class="text-chart-2 size-3.5" />
              <span class="text-muted-foreground text-xs font-medium">Time to Value (TTV)</span>
            </div>
            <p class="text-foreground mt-1 text-2xl font-bold tracking-tight tabular-nums">
              {{ overallSummary.timeToValue }}
            </p>
            <p class="text-muted-foreground text-xs">{{ overallSummary.timeToValueDetail }}</p>
          </div>

          <div class="bg-muted/30 border-border/70 rounded-lg border p-3">
            <div class="flex items-center gap-1.5">
              <Clock class="text-chart-3 size-3.5" />
              <span class="text-muted-foreground text-xs font-medium">Avg. Conversion Velocity</span>
            </div>
            <p class="text-foreground mt-1 text-2xl font-bold tracking-tight tabular-nums">
              {{ overallSummary.conversionVelocity }}
            </p>
            <p class="text-muted-foreground text-xs">{{ overallSummary.conversionVelocityDetail }}</p>
          </div>

          <div class="bg-muted/30 border-border/70 rounded-lg border p-3">
            <div class="flex items-center gap-1.5">
              <HeartHandshake class="text-chart-4 size-3.5" />
              <span class="text-muted-foreground text-xs font-medium">Net Revenue Retention</span>
            </div>
            <p class="text-foreground mt-1 text-2xl font-bold tracking-tight tabular-nums">
              {{ overallSummary.netRetention }}
            </p>
            <p class="text-muted-foreground text-xs">{{ overallSummary.netRetentionDetail }}</p>
          </div>
        </div>

        <!-- Stage Transition Flow Breakdown Bar -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground font-medium">Lifecycle Pass-Through Velocity</span>
            <span class="text-foreground font-semibold tabular-nums">4 Stages Active • 120,000 Cohort Cohere</span>
          </div>

          <!-- Multi-segment Funnel Bar -->
          <div class="bg-muted/60 flex h-3.5 w-full overflow-hidden rounded-full p-0.5">
            <div class="bg-chart-1 h-full rounded-l-full" style="width: 45%" title="Acquisition (120,000)" />
            <div class="bg-chart-2 h-full" style="width: 25%" title="Activation (8,160)" />
            <div class="bg-chart-3 h-full" style="width: 18%" title="Monetization (1,420)" />
            <div class="bg-chart-4 h-full rounded-r-full" style="width: 12%" title="Retention (92% NRR)" />
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div class="flex items-center gap-1.5">
              <span class="bg-chart-1 size-2 rounded-full" />
              <span class="text-muted-foreground">Acquisition (100%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="bg-chart-2 size-2 rounded-full" />
              <span class="text-muted-foreground">Activation (6.8%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="bg-chart-3 size-2 rounded-full" />
              <span class="text-muted-foreground">Monetization (17.4%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="bg-chart-4 size-2 rounded-full" />
              <span class="text-muted-foreground">Retention (92.0%)</span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Key Strategic Growth Takeaway Callout -->
        <div
          class="bg-muted/40 border-border/80 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-start gap-3">
            <div
              class="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border"
            >
              <Sparkles class="size-4" />
            </div>
            <div class="space-y-1">
              <div class="flex min-w-0 items-center gap-2">
                <p class="text-foreground text-sm font-semibold">Primary Strategic Growth Takeaway</p>
                <Badge variant="outline" class="border-warning/30 bg-warning/10 text-warning text-xs font-medium">
                  High Priority
                </Badge>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                The largest leverage point in the current cohort is the
                <strong class="text-foreground">Activation-to-Monetization conversion gap (17.4%)</strong>. Implementing
                contextual in-app checkout prompts at high-usage milestones and launching annual billing discounts is
                modeled to generate an additional
                <span class="text-foreground font-semibold tabular-nums">+$14,200 / mo</span> in net new MRR.
              </p>
            </div>
          </div>

          <Button size="sm" class="h-8 shrink-0 gap-1.5 text-xs font-semibold">
            <span>Apply Experiments</span>
            <ArrowUpRight class="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
