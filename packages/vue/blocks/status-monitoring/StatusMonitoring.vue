<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SectionCard } from '@/components/ui/section-card'

type DayStatus = 'up' | 'degraded' | 'down' | 'maintenance' | 'none'

type IncidentSeverity = 'minor' | 'major' | 'critical'

interface ServiceStatus {
  name: string
  /** One entry per day, oldest first. Expected length: 90. */
  days: DayStatus[]
}

interface MonitoringIncident {
  id: string
  date: Date
  title: string
  description: string
  duration: string
  severity: IncidentSeverity
  resolved?: boolean
}

const props = defineProps<{
  services?: ServiceStatus[]
  incidents?: MonitoringIncident[]
  class?: HTMLAttributes['class']
}>()

const DAY_COUNT = 90

// Deterministic stubs (no Math.random) so SSR and client markup match exactly.
function buildDays(blips: Array<{ ago: number; length: number; status: DayStatus }> = []): DayStatus[] {
  const days: DayStatus[] = Array.from({ length: DAY_COUNT }, () => 'up')
  for (const blip of blips) {
    for (let k = 0; k < blip.length; k++) {
      const idx = DAY_COUNT - 1 - blip.ago - k
      if (idx >= 0 && idx < DAY_COUNT) days[idx] = blip.status
    }
  }
  return days
}

const stubServices: ServiceStatus[] = [
  {
    name: 'API Gateway',
    days: buildDays([
      { ago: 34, length: 1, status: 'down' },
      { ago: 33, length: 1, status: 'degraded' },
    ]),
  },
  { name: 'Web application', days: buildDays() },
  { name: 'Webhooks', days: buildDays([{ ago: 61, length: 1, status: 'degraded' }]) },
]

const now = new Date()
const daysAgoDate = (d: number) => new Date(now.getTime() - d * 86_400_000)

const stubIncidents: MonitoringIncident[] = [
  {
    id: 'i1',
    date: daysAgoDate(33),
    title: 'Elevated error rates on API Gateway',
    description: 'A bad deploy caused intermittent 502s for roughly forty minutes. Rolled back; error rates recovered.',
    duration: 'Lasted 42 minutes',
    severity: 'major',
    resolved: true,
  },
  {
    id: 'i2',
    date: daysAgoDate(34),
    title: 'API Gateway unavailable',
    description: 'Provider network maintenance dropped traffic between 02:14 and 02:51 UTC.',
    duration: 'Lasted 37 minutes',
    severity: 'critical',
    resolved: true,
  },
  {
    id: 'i3',
    date: daysAgoDate(61),
    title: 'Delayed webhook deliveries',
    description: 'A queue backlog delayed deliveries by up to six minutes. The backlog drained on its own.',
    duration: 'Lasted 1 hour, 12 minutes',
    severity: 'minor',
    resolved: true,
  },
]

const services = computed(() => props.services ?? stubServices)

const incidentList = computed(() =>
  [...(props.incidents ?? stubIncidents)].sort((a, b) => b.date.getTime() - a.date.getTime()),
)

type OverallState = 'operational' | 'degraded' | 'outage'

const overall = computed<OverallState>(() => {
  const latest = services.value.map((s) => [...s.days].reverse().find((d) => d !== 'none'))
  if (latest.includes('down')) return 'outage'
  if (latest.includes('degraded')) return 'degraded'
  return 'operational'
})

const bannerMeta: Record<OverallState, { label: string; box: string; text: string; dot: string }> = {
  operational: {
    label: 'All systems operational',
    box: 'border-success/25 bg-success/10',
    text: 'text-success',
    dot: 'bg-success',
  },
  degraded: {
    label: 'Degraded performance',
    box: 'border-warning/25 bg-warning/10',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  outage: {
    label: 'Partial outage',
    box: 'border-destructive/25 bg-destructive/10',
    text: 'text-destructive',
    dot: 'bg-destructive',
  },
}

const dayClass: Record<DayStatus, string> = {
  up: 'bg-success',
  degraded: 'bg-warning',
  down: 'bg-destructive',
  maintenance: 'bg-info',
  none: 'bg-muted',
}

const dayLabel: Record<DayStatus, string> = {
  up: 'Operational',
  degraded: 'Degraded',
  down: 'Outage',
  maintenance: 'Maintenance',
  none: 'No data',
}

// Built once per mount so 90 segments × N services never rebuild Date objects during render.
const dayStamps = Array.from({ length: DAY_COUNT }, (_, i) =>
  daysAgoDate(DAY_COUNT - 1 - i).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
)

const updatedStamp = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

function tooltipFor(days: DayStatus[], i: number): string {
  return `${dayStamps[i]} · ${dayLabel[days[i]]}`
}

function uptimePct(days: DayStatus[]): string {
  const counted = days.filter((d) => d !== 'none')
  if (counted.length === 0) return '—'
  const up = counted.filter((d) => d === 'up').length
  return `${((up / counted.length) * 100).toFixed(2)}%`
}

function formatDay(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const severityVariant: Record<IncidentSeverity, 'info' | 'warning' | 'destructive'> = {
  minor: 'info',
  major: 'warning',
  critical: 'destructive',
}

const legend = (Object.keys(dayLabel) as DayStatus[]).map((status) => ({ status, label: dayLabel[status] }))
</script>

<template>
  <div :class="cn('space-y-4', props.class)" data-slot="status-monitoring">
    <div role="status" :class="['flex items-center gap-3 rounded-xl border px-4 py-3', bannerMeta[overall].box]">
      <span class="relative flex size-2.5 shrink-0">
        <span :class="['absolute inline-flex h-full w-full rounded-full opacity-60', bannerMeta[overall].dot]" />
        <span :class="['relative inline-flex size-2.5 rounded-full', bannerMeta[overall].dot]" />
      </span>
      <p :class="['text-sm font-medium', bannerMeta[overall].text]">{{ bannerMeta[overall].label }}</p>
      <span class="text-muted-foreground ml-auto text-xs whitespace-nowrap">Updated {{ updatedStamp }}</span>
    </div>

    <SectionCard title="Service status" description="Daily availability over the last 90 days.">
      <template #header-action>
        <ul class="text-muted-foreground hidden flex-wrap items-center gap-3 text-xs md:flex">
          <li v-for="item in legend" :key="item.status" class="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <span :class="['size-2 rounded-full', dayClass[item.status]]" />
            {{ item.label }}
          </li>
        </ul>
      </template>
      <ul class="divide-y">
        <li v-for="(s, si) in services" :key="s.name" :class="['space-y-2 py-4', si === 0 ? 'pt-0' : '']">
          <div class="flex flex-wrap items-baseline justify-between gap-4">
            <p class="text-sm font-medium">{{ s.name }}</p>
            <p class="text-muted-foreground text-sm tabular-nums">{{ uptimePct(s.days) }}</p>
          </div>
          <div
            class="flex w-full gap-px overflow-hidden sm:gap-[2px]"
            role="img"
            :aria-label="`${s.name} uptime ${uptimePct(s.days)} over the last 90 days`"
          >
            <span
              v-for="(d, di) in s.days"
              :key="di"
              :class="['h-6 w-full min-w-px flex-1 rounded-sm transition-transform hover:scale-y-125', dayClass[d]]"
              :title="tooltipFor(s.days, di)"
            />
          </div>
        </li>
      </ul>
      <p class="text-muted-foreground mt-4 flex justify-between text-xs">
        <span>90 days ago</span>
        <span>Today</span>
      </p>
    </SectionCard>

    <SectionCard title="Incident history" description="Reported incidents over the same period.">
      <ul v-if="incidentList.length" class="divide-y">
        <li v-for="(inc, ii) in incidentList" :key="inc.id" :class="['py-4', ii === 0 ? 'pt-0' : '']">
          <p class="text-muted-foreground text-xs font-medium">{{ formatDay(inc.date) }}</p>
          <div class="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge :variant="inc.resolved ? 'success' : severityVariant[inc.severity]" class="capitalize">
              {{ inc.resolved ? 'Resolved' : inc.severity }}
            </Badge>
            <p class="text-sm font-medium">{{ inc.title }}</p>
            <span class="text-muted-foreground ml-auto text-xs whitespace-nowrap">{{ inc.duration }}</span>
          </div>
          <p class="text-muted-foreground mt-1 text-sm leading-relaxed">{{ inc.description }}</p>
        </li>
      </ul>
      <div v-else class="flex flex-col items-center justify-center px-6 py-10 text-center">
        <p class="text-sm font-medium">No incidents reported</p>
        <p class="text-muted-foreground mt-0.5 text-xs">Every day in this window has been quiet.</p>
      </div>
    </SectionCard>
  </div>
</template>
