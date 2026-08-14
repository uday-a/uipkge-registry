<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Globe,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Terminal,
  Trash2,
  X,
  XCircle,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type JobStatus = 'active' | 'paused' | 'error'

export interface LastExecution {
  status: 'success' | 'error'
  code: string
  duration: string
  timestamp: string
}

export interface CronJob {
  id: string
  name: string
  target: string
  cronExpression: string
  humanSchedule: string
  timezone: string
  status: JobStatus
  nextRun: string
  lastExecution: LastExecution
}

export interface CronStats {
  totalScheduled: number
  activeWorkers: number
  failed24h: number
  executionsToday: string
}

interface Props {
  initialJobs?: CronJob[]
  initialStats?: CronStats
  class?: HTMLAttributes['class']
}

const defaultJobs: CronJob[] = [
  {
    id: 'job-1',
    name: 'daily-billing-reconciliation',
    target: 'POST https://api.acme.corp/v1/billing/reconcile',
    cronExpression: '0 0 * * *',
    humanSchedule: 'Every day at midnight',
    timezone: 'UTC',
    status: 'active',
    nextRun: 'in 4 hours',
    lastExecution: {
      status: 'success',
      code: '200 OK',
      duration: '1.2s',
      timestamp: '20 hours ago',
    },
  },
  {
    id: 'job-2',
    name: 'database-backup-s3',
    target: 'cron/infra::snapshotPostgres',
    cronExpression: '0 */6 * * *',
    humanSchedule: 'Every 6 hours',
    timezone: 'UTC',
    status: 'active',
    nextRun: 'in 1 hour 45 min',
    lastExecution: {
      status: 'success',
      code: '200 OK',
      duration: '45.3s',
      timestamp: '4 hours ago',
    },
  },
  {
    id: 'job-3',
    name: 'cleanup-expired-sessions',
    target: 'POST https://auth.acme.corp/cron/prune-sessions',
    cronExpression: '*/30 * * * *',
    humanSchedule: 'Every 30 minutes',
    timezone: 'UTC',
    status: 'active',
    nextRun: 'in 12 min',
    lastExecution: {
      status: 'success',
      code: '200 OK',
      duration: '380ms',
      timestamp: '18 min ago',
    },
  },
  {
    id: 'job-4',
    name: 'send-digest-emails',
    target: 'notifications::dispatchWeeklyDigest',
    cronExpression: '0 9 * * 1',
    humanSchedule: 'Every Monday at 09:00',
    timezone: 'UTC',
    status: 'paused',
    nextRun: 'Paused',
    lastExecution: {
      status: 'success',
      code: '200 OK',
      duration: '8.4s',
      timestamp: '4 days ago',
    },
  },
  {
    id: 'job-5',
    name: 'sync-crm-contacts',
    target: 'POST https://integrations.acme.corp/hubspot/sync',
    cronExpression: '15 * * * *',
    humanSchedule: 'At minute 15 of every hour',
    timezone: 'UTC',
    status: 'error',
    nextRun: 'in 28 min',
    lastExecution: {
      status: 'error',
      code: '504 Gateway Timeout',
      duration: '30.0s',
      timestamp: '32 min ago',
    },
  },
]

const props = defineProps<Props>()

const stats = computed(
  () =>
    props.initialStats ?? {
      totalScheduled: 14,
      activeWorkers: 12,
      failed24h: 1,
      executionsToday: '48.2k',
    },
)

const jobs = ref<CronJob[]>([...(props.initialJobs ?? defaultJobs)])
const search = ref('')
const statusFilter = ref<'all' | JobStatus>('all')
const bannerMessage = ref<{ type: 'success' | 'info'; text: string } | null>(null)
const runningJobId = ref<string | null>(null)

// Dialogs state
const isCreateOpen = ref(false)
const newJobName = ref('')
const newJobTarget = ref('')
const newJobCron = ref('0 0 * * *')
const newJobTimezone = ref('UTC')

const isLogsOpen = ref(false)
const selectedJobForLogs = ref<CronJob | null>(null)

// Helper / Generator state
type Frequency = 'minute' | 'hour' | 'day' | 'week' | 'month'
const helperFrequency = ref<Frequency>('day')
const helperMinuteInterval = ref('15')
const helperHourlyMinute = ref('0')
const helperDailyHour = ref('0')
const helperDailyMinute = ref('0')
const helperWeekDay = ref('1')
const helperWeekHour = ref('9')
const helperWeekMinute = ref('0')
const helperMonthDay = ref('1')
const helperMonthHour = ref('0')
const helperMonthMinute = ref('0')
const copiedCron = ref(false)

const weekDayNames: Record<string, string> = {
  '0': 'Sunday',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
}

const currentCronExpression = computed(() => {
  switch (helperFrequency.value) {
    case 'minute':
      return helperMinuteInterval.value === '1' ? '* * * * *' : `*/${helperMinuteInterval.value} * * * *`
    case 'hour':
      return `${helperHourlyMinute.value} * * * *`
    case 'day':
      return `${helperDailyMinute.value} ${helperDailyHour.value} * * *`
    case 'week':
      return `${helperWeekMinute.value} ${helperWeekHour.value} * * ${helperWeekDay.value}`
    case 'month':
      return `${helperMonthMinute.value} ${helperMonthHour.value} ${helperMonthDay.value} * *`
    default:
      return '0 0 * * *'
  }
})

const currentHumanTranslation = computed(() => {
  switch (helperFrequency.value) {
    case 'minute':
      return helperMinuteInterval.value === '1'
        ? 'Runs every minute'
        : `Runs every ${helperMinuteInterval.value} minutes`
    case 'hour':
      return helperHourlyMinute.value === '0'
        ? 'Runs at the start of every hour (minute 0)'
        : `Runs at minute ${helperHourlyMinute.value.padStart(2, '0')} of every hour`
    case 'day':
      return `Runs every day at ${helperDailyHour.value.padStart(2, '0')}:${helperDailyMinute.value.padStart(2, '0')} UTC`
    case 'week': {
      const day = weekDayNames[helperWeekDay.value] || 'Monday'
      return `Runs every ${day} at ${helperWeekHour.value.padStart(2, '0')}:${helperWeekMinute.value.padStart(2, '0')} UTC`
    }
    case 'month':
      return `Runs on day ${helperMonthDay.value} of every month at ${helperMonthHour.value.padStart(2, '0')}:${helperMonthMinute.value.padStart(2, '0')} UTC`
    default:
      return 'Every day at midnight'
  }
})

const nextExecutionsPreview = computed(() => {
  const cron = currentCronExpression.value
  if (helperFrequency.value === 'minute') {
    const step = Number(helperMinuteInterval.value) || 1
    return [
      { time: `2026-10-24 14:${String(step).padStart(2, '0')}:00 UTC`, relative: `in ${step} minutes` },
      { time: `2026-10-24 14:${String(step * 2).padStart(2, '0')}:00 UTC`, relative: `in ${step * 2} minutes` },
      { time: `2026-10-24 14:${String(step * 3).padStart(2, '0')}:00 UTC`, relative: `in ${step * 3} minutes` },
    ]
  }
  if (helperFrequency.value === 'hour') {
    const min = helperHourlyMinute.value.padStart(2, '0')
    return [
      { time: `2026-10-24 15:${min}:00 UTC`, relative: 'in 42 minutes' },
      { time: `2026-10-24 16:${min}:00 UTC`, relative: 'in 1 hour 42 min' },
      { time: `2026-10-24 17:${min}:00 UTC`, relative: 'in 2 hours 42 min' },
    ]
  }
  if (helperFrequency.value === 'day') {
    const hr = helperDailyHour.value.padStart(2, '0')
    const min = helperDailyMinute.value.padStart(2, '0')
    return [
      { time: `2026-10-25 ${hr}:${min}:00 UTC`, relative: 'tomorrow' },
      { time: `2026-10-26 ${hr}:${min}:00 UTC`, relative: 'in 2 days' },
      { time: `2026-10-27 ${hr}:${min}:00 UTC`, relative: 'in 3 days' },
    ]
  }
  if (helperFrequency.value === 'week') {
    const hr = helperWeekHour.value.padStart(2, '0')
    const min = helperWeekMinute.value.padStart(2, '0')
    return [
      { time: `2026-10-26 ${hr}:${min}:00 UTC`, relative: 'next Monday' },
      { time: `2026-11-02 ${hr}:${min}:00 UTC`, relative: 'in 9 days' },
      { time: `2026-11-09 ${hr}:${min}:00 UTC`, relative: 'in 16 days' },
    ]
  }
  const dom = helperMonthDay.value.padStart(2, '0')
  const hr = helperMonthHour.value.padStart(2, '0')
  const min = helperMonthMinute.value.padStart(2, '0')
  return [
    { time: `2026-11-${dom} ${hr}:${min}:00 UTC`, relative: 'in 8 days' },
    { time: `2026-12-${dom} ${hr}:${min}:00 UTC`, relative: 'in 38 days' },
    { time: `2027-01-${dom} ${hr}:${min}:00 UTC`, relative: 'in 69 days' },
  ]
})

function applyPreset(cron: string) {
  if (cron === '*/15 * * * *') {
    helperFrequency.value = 'minute'
    helperMinuteInterval.value = '15'
  } else if (cron === '0 * * * *') {
    helperFrequency.value = 'hour'
    helperHourlyMinute.value = '0'
  } else if (cron === '0 0 * * *') {
    helperFrequency.value = 'day'
    helperDailyHour.value = '0'
    helperDailyMinute.value = '0'
  } else if (cron === '0 9 * * 1') {
    helperFrequency.value = 'week'
    helperWeekDay.value = '1'
    helperWeekHour.value = '9'
    helperWeekMinute.value = '0'
  } else if (cron === '0 0 1 * *') {
    helperFrequency.value = 'month'
    helperMonthDay.value = '1'
    helperMonthHour.value = '0'
    helperMonthMinute.value = '0'
  }
}

async function copyExpression(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedCron.value = true
    setTimeout(() => {
      copiedCron.value = false
    }, 2000)
  } catch {
    copiedCron.value = true
    setTimeout(() => {
      copiedCron.value = false
    }, 2000)
  }
}

const filteredJobs = computed(() => {
  const q = search.value.trim().toLowerCase()
  return jobs.value.filter((job) => {
    const matchesStatus = statusFilter.value === 'all' || job.status === statusFilter.value
    const matchesSearch = !q || job.name.toLowerCase().includes(q) || job.target.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })
})

function triggerRun(job: CronJob) {
  runningJobId.value = job.id
  bannerMessage.value = {
    type: 'success',
    text: `Job "${job.name}" queued and running now on cluster edge-worker-01.`,
  }
  setTimeout(() => {
    runningJobId.value = null
    const idx = jobs.value.findIndex((j) => j.id === job.id)
    if (idx !== -1) {
      jobs.value[idx].lastExecution = {
        status: 'success',
        code: '200 OK',
        duration: '0.8s',
        timestamp: 'Just now',
      }
    }
  }, 1200)
}

function togglePause(job: CronJob) {
  const nextStatus: JobStatus = job.status === 'active' ? 'paused' : 'active'
  job.status = nextStatus
  job.nextRun = nextStatus === 'paused' ? 'Paused' : 'in 15 min'
  bannerMessage.value = {
    type: 'info',
    text: `Job "${job.name}" has been ${nextStatus === 'paused' ? 'paused' : 'resumed'}.`,
  }
}

function deleteJob(id: string) {
  const target = jobs.value.find((j) => j.id === id)
  jobs.value = jobs.value.filter((j) => j.id !== id)
  bannerMessage.value = {
    type: 'info',
    text: `Job "${target?.name || id}" removed from scheduler queue.`,
  }
}

function openLogs(job: CronJob) {
  selectedJobForLogs.value = job
  isLogsOpen.value = true
}

function handleCreateJob() {
  if (!newJobName.value.trim()) return
  const newJob: CronJob = {
    id: `job-${Date.now()}`,
    name: newJobName.value.trim().toLowerCase().replace(/\s+/g, '-'),
    target: newJobTarget.value.trim() || 'POST https://api.acme.corp/v1/worker/execute',
    cronExpression: newJobCron.value.trim() || '0 0 * * *',
    humanSchedule: 'Custom scheduled trigger',
    timezone: newJobTimezone.value || 'UTC',
    status: 'active',
    nextRun: 'in 5 min',
    lastExecution: {
      status: 'success',
      code: 'Pending initial run',
      duration: '—',
      timestamp: 'Never',
    },
  }
  jobs.value.unshift(newJob)
  isCreateOpen.value = false
  newJobName.value = ''
  newJobTarget.value = ''
  bannerMessage.value = {
    type: 'success',
    text: `New cron job "${newJob.name}" successfully created and registered in cluster.`,
  }
}
</script>

<template>
  <div data-slot="cron-job-scheduler" :class="cn('w-full space-y-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <CalendarClock class="text-primary size-6" />
          <h1 class="text-foreground text-2xl font-bold tracking-tight">Cron Jobs & Scheduled Tasks</h1>
        </div>
        <p class="text-muted-foreground text-sm">
          Configure automated background workers, recurring tasks, and queue schedules.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button @click="isCreateOpen = true">
          <Plus class="mr-1.5 size-4" />
          New Cron Job
        </Button>
      </div>
    </div>

    <!-- Notification / Action banner -->
    <div
      v-if="bannerMessage"
      class="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs"
    >
      <div class="flex items-center gap-2.5 text-sm">
        <CheckCircle2
          v-if="bannerMessage.type === 'success'"
          class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
        <Zap v-else class="text-primary size-4 shrink-0" />
        <span class="text-foreground font-medium">{{ bannerMessage.text }}</span>
      </div>
      <Button variant="ghost" size="icon" class="size-7" @click="bannerMessage = null">
        <X class="size-3.5" />
        <span class="sr-only">Dismiss</span>
      </Button>
    </div>

    <!-- 4 Stat / KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Total Scheduled</CardTitle>
          <div class="bg-primary/10 text-primary rounded-lg p-2">
            <Clock class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight">{{ stats.totalScheduled }}</div>
          <p class="text-muted-foreground text-xs">Across 4 worker clusters</p>
        </CardContent>
      </Card>

      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Active Workers</CardTitle>
          <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <Cpu class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight">{{ stats.activeWorkers }}</div>
          <p class="text-muted-foreground text-xs">2 currently paused</p>
        </CardContent>
      </Card>

      <Card class="border-amber-500/30 bg-amber-500/5 shadow-xs dark:bg-amber-500/10">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-amber-700 dark:text-amber-300">Failed in 24h</CardTitle>
          <div class="rounded-lg bg-amber-500/20 p-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">{{
              stats.failed24h
            }}</span>
            <Badge variant="warning" class="text-xs">Amber alert</Badge>
          </div>
          <p class="text-xs text-amber-600/90 dark:text-amber-400/90">1 job needs attention</p>
        </CardContent>
      </Card>

      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Executions Today</CardTitle>
          <div class="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <Activity class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight">{{ stats.executionsToday }}</div>
          <p class="text-muted-foreground text-xs">99.8% success rate (18ms avg)</p>
        </CardContent>
      </Card>
    </div>

    <!-- Scheduled Jobs Table Card -->
    <Card class="shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-lg font-semibold">Scheduled Jobs</CardTitle>
            <CardDescription class="text-xs">
              {{ filteredJobs.length }} of {{ jobs.length }} tasks registered in cluster scheduler.
            </CardDescription>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="relative w-full sm:w-64">
              <Search
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input v-model="search" placeholder="Search job name or target..." class="h-8 pl-9 text-xs" />
            </div>

            <Select v-model="statusFilter">
              <SelectTrigger class="h-8 w-32 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" class="hidden h-8 items-center gap-1 font-mono text-xs md:inline-flex">
              <Globe class="size-3" />
              UTC
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="min-w-[240px]">Job Name & Target</TableHead>
                <TableHead class="min-w-[200px]">Schedule</TableHead>
                <TableHead class="w-20">Timezone</TableHead>
                <TableHead class="w-28">Status</TableHead>
                <TableHead class="min-w-[130px]">Next Run</TableHead>
                <TableHead class="min-w-[220px]">Last Execution</TableHead>
                <TableHead class="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="job in filteredJobs" :key="job.id" class="group transition-colors">
                <!-- Job Name & Target -->
                <TableCell class="py-3">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground text-sm font-medium">{{ job.name }}</span>
                      <RefreshCw
                        v-if="runningJobId === job.id"
                        class="text-primary size-3.5 animate-spin"
                        aria-label="Running now"
                      />
                    </div>
                    <p
                      class="text-muted-foreground max-w-[280px] truncate font-mono text-xs sm:max-w-[340px]"
                      :title="job.target"
                    >
                      {{ job.target }}
                    </p>
                  </div>
                </TableCell>

                <!-- Cron Expression & Human Translation -->
                <TableCell class="py-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <code
                        class="border-border bg-muted text-foreground rounded border px-1.5 py-0.5 font-mono text-xs font-semibold"
                      >
                        {{ job.cronExpression }}
                      </code>
                    </div>
                    <p class="text-muted-foreground flex items-center gap-1 text-xs">
                      {{ job.humanSchedule }}
                    </p>
                  </div>
                </TableCell>

                <!-- Timezone -->
                <TableCell class="py-3">
                  <span class="text-muted-foreground font-mono text-xs font-medium">{{ job.timezone }}</span>
                </TableCell>

                <!-- Status Badge -->
                <TableCell class="py-3">
                  <Badge v-if="job.status === 'active'" variant="success" class="gap-1 text-xs">
                    <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Active
                  </Badge>
                  <Badge v-else-if="job.status === 'paused'" variant="secondary" class="gap-1 text-xs">
                    <Pause class="size-3" />
                    Paused
                  </Badge>
                  <Badge v-else variant="destructive" class="gap-1 text-xs">
                    <AlertCircle class="size-3" />
                    Error
                  </Badge>
                </TableCell>

                <!-- Next Run -->
                <TableCell class="py-3">
                  <div class="flex items-center gap-1.5 text-xs">
                    <Clock class="text-muted-foreground size-3.5 shrink-0" />
                    <span :class="job.status === 'paused' ? 'text-muted-foreground' : 'text-foreground font-medium'">
                      {{ job.nextRun }}
                    </span>
                  </div>
                </TableCell>

                <!-- Last Execution -->
                <TableCell class="py-3">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5">
                      <CheckCircle2
                        v-if="job.lastExecution.status === 'success'"
                        class="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                      />
                      <XCircle v-else class="text-destructive size-3.5 shrink-0" />
                      <span
                        :class="
                          cn(
                            'font-mono text-xs font-medium',
                            job.lastExecution.status === 'success'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-destructive',
                          )
                        "
                      >
                        {{ job.lastExecution.code }}
                      </span>
                      <span class="text-muted-foreground font-mono text-xs">· {{ job.lastExecution.duration }}</span>
                    </div>
                    <p class="text-muted-foreground text-xs">
                      {{ job.lastExecution.timestamp }}
                    </p>
                  </div>
                </TableCell>

                <!-- Action Menu -->
                <TableCell class="py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-8">
                        <MoreHorizontal class="size-4" />
                        <span class="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-48">
                      <DropdownMenuLabel>Job Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="triggerRun(job)">
                        <Play class="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                        Run Now
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="togglePause(job)">
                        <Pause v-if="job.status === 'active'" class="mr-2 size-4" />
                        <Play v-else class="mr-2 size-4" />
                        {{ job.status === 'active' ? 'Pause Schedule' : 'Resume Schedule' }}
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="openLogs(job)">
                        <Terminal class="mr-2 size-4" />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="applyPreset(job.cronExpression)">
                        <Pencil class="mr-2 size-4" />
                        Inspect in Helper
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="deleteJob(job.id)">
                        <Trash2 class="mr-2 size-4" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredJobs.length === 0">
                <TableCell colspan="7" class="text-muted-foreground h-28 text-center text-sm">
                  No scheduled jobs found matching the active filter.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Cron Expression Helper Card -->
    <Card class="shadow-xs">
      <CardHeader>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Sparkles class="text-primary size-4" />
              <CardTitle class="text-lg font-semibold">Interactive Cron Expression Helper</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Generate standard 5-part cron syntax with real-time translation and upcoming execution previews.
            </CardDescription>
          </div>

          <!-- Quick Presets -->
          <div class="flex flex-wrap items-center gap-1.5 pt-2 sm:pt-0">
            <span class="text-muted-foreground text-xs">Presets:</span>
            <Button variant="outline" size="sm" class="h-7 font-mono text-xs" @click="applyPreset('*/15 * * * *')">
              */15 * * * *
            </Button>
            <Button variant="outline" size="sm" class="h-7 font-mono text-xs" @click="applyPreset('0 * * * *')">
              0 * * * *
            </Button>
            <Button variant="outline" size="sm" class="h-7 font-mono text-xs" @click="applyPreset('0 0 * * *')">
              0 0 * * *
            </Button>
            <Button variant="outline" size="sm" class="h-7 font-mono text-xs" @click="applyPreset('0 9 * * 1')">
              0 9 * * 1
            </Button>
            <Button variant="outline" size="sm" class="h-7 font-mono text-xs" @click="applyPreset('0 0 1 * *')">
              0 0 1 * *
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Frequency Selector Buttons -->
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="freq in ['minute', 'hour', 'day', 'week', 'month'] as Frequency[]"
            :key="freq"
            :variant="helperFrequency === freq ? 'default' : 'outline'"
            size="sm"
            class="text-xs capitalize"
            @click="helperFrequency = freq"
          >
            Every {{ freq }}
          </Button>
        </div>

        <!-- Dynamic Frequency Inputs Grid -->
        <div
          class="border-border bg-muted/40 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <!-- Minute Controls -->
          <div v-if="helperFrequency === 'minute'" class="space-y-2">
            <label class="text-foreground text-xs font-medium">Interval Interval</label>
            <Select v-model="helperMinuteInterval">
              <SelectTrigger class="bg-card h-9 w-full text-xs">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every 1 minute (* * * * *)</SelectItem>
                <SelectItem value="5">Every 5 minutes (*/5 * * * *)</SelectItem>
                <SelectItem value="10">Every 10 minutes (*/10 * * * *)</SelectItem>
                <SelectItem value="15">Every 15 minutes (*/15 * * * *)</SelectItem>
                <SelectItem value="30">Every 30 minutes (*/30 * * * *)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Hour Controls -->
          <div v-if="helperFrequency === 'hour'" class="space-y-2">
            <label class="text-foreground text-xs font-medium">Minute of the Hour</label>
            <Select v-model="helperHourlyMinute">
              <SelectTrigger class="bg-card h-9 w-full text-xs">
                <SelectValue placeholder="Select minute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">At minute :00 (Top of hour)</SelectItem>
                <SelectItem value="15">At minute :15 (Quarter past)</SelectItem>
                <SelectItem value="30">At minute :30 (Half past)</SelectItem>
                <SelectItem value="45">At minute :45 (Quarter to)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Day Controls -->
          <template v-if="helperFrequency === 'day'">
            <div class="space-y-2">
              <label class="text-foreground text-xs font-medium">Execution Hour (UTC)</label>
              <Select v-model="helperDailyHour">
                <SelectTrigger class="bg-card h-9 w-full text-xs">
                  <SelectValue placeholder="Select hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">00:00 (Midnight)</SelectItem>
                  <SelectItem value="4">04:00 (Early Morning)</SelectItem>
                  <SelectItem value="9">09:00 (Morning)</SelectItem>
                  <SelectItem value="12">12:00 (Noon)</SelectItem>
                  <SelectItem value="18">18:00 (Evening)</SelectItem>
                  <SelectItem value="23">23:00 (Late Night)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <label class="text-foreground text-xs font-medium">Minute (UTC)</label>
              <Select v-model="helperDailyMinute">
                <SelectTrigger class="bg-card h-9 w-full text-xs">
                  <SelectValue placeholder="Select minute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">:00</SelectItem>
                  <SelectItem value="15">:15</SelectItem>
                  <SelectItem value="30">:30</SelectItem>
                  <SelectItem value="45">:45</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </template>

          <!-- Week Controls -->
          <template v-if="helperFrequency === 'week'">
            <div class="space-y-2">
              <label class="text-foreground text-xs font-medium">Day of Week</label>
              <Select v-model="helperWeekDay">
                <SelectTrigger class="bg-card h-9 w-full text-xs">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday (1)</SelectItem>
                  <SelectItem value="2">Tuesday (2)</SelectItem>
                  <SelectItem value="3">Wednesday (3)</SelectItem>
                  <SelectItem value="4">Thursday (4)</SelectItem>
                  <SelectItem value="5">Friday (5)</SelectItem>
                  <SelectItem value="6">Saturday (6)</SelectItem>
                  <SelectItem value="0">Sunday (0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <label class="text-foreground text-xs font-medium">Time (UTC)</label>
              <Select v-model="helperWeekHour">
                <SelectTrigger class="bg-card h-9 w-full text-xs">
                  <SelectValue placeholder="Select hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">00:00 (Midnight)</SelectItem>
                  <SelectItem value="9">09:00 (Morning)</SelectItem>
                  <SelectItem value="12">12:00 (Noon)</SelectItem>
                  <SelectItem value="18">18:00 (Evening)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </template>

          <!-- Month Controls -->
          <template v-if="helperFrequency === 'month'">
            <div class="space-y-2">
              <label class="text-foreground text-xs font-medium">Day of Month</label>
              <Select v-model="helperMonthDay">
                <SelectTrigger class="bg-card h-9 w-full text-xs">
                  <SelectValue placeholder="Select day of month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st of the month</SelectItem>
                  <SelectItem value="15">15th (Mid-month)</SelectItem>
                  <SelectItem value="28">28th of the month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <label class="text-foreground text-xs font-medium">Time (UTC)</label>
              <Select v-model="helperMonthHour">
                <SelectTrigger class="bg-card h-9 w-full text-xs">
                  <SelectValue placeholder="Select hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">00:00 (Midnight)</SelectItem>
                  <SelectItem value="9">09:00 (Morning)</SelectItem>
                  <SelectItem value="12">12:00 (Noon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </template>

          <div class="flex flex-col justify-end space-y-2 sm:col-span-2 lg:col-span-1">
            <label class="text-foreground text-xs font-medium">Target Cluster Timezone</label>
            <div
              class="border-border bg-card text-muted-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-xs"
            >
              <Globe class="text-primary size-3.5" />
              <span>UTC (Coordinated Universal)</span>
            </div>
          </div>
        </div>

        <!-- Generated Syntax & Next 3 Runs Output -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Left: Expression and Humanized Label -->
          <div class="border-border bg-card space-y-3 rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Generated Syntax</span>
              <Button
                variant="outline"
                size="sm"
                class="h-7 gap-1.5 text-xs"
                @click="copyExpression(currentCronExpression)"
              >
                <Check v-if="copiedCron" class="size-3 text-emerald-600 dark:text-emerald-400" />
                <Copy v-else class="size-3" />
                {{ copiedCron ? 'Copied' : 'Copy Cron' }}
              </Button>
            </div>

            <div class="border-border bg-muted/60 rounded-md border p-3">
              <code class="text-foreground font-mono text-lg font-bold">{{ currentCronExpression }}</code>
            </div>

            <div class="text-muted-foreground flex items-center gap-2 text-xs">
              <CalendarClock class="text-primary size-4 shrink-0" />
              <span>{{ currentHumanTranslation }}</span>
            </div>
          </div>

          <!-- Right: Next 3 Runs Preview -->
          <div class="border-border bg-card space-y-3 rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >Next 3 Scheduled Runs (UTC)</span
              >
              <Badge variant="outline" class="font-mono text-xs">Simulated</Badge>
            </div>

            <div class="space-y-2">
              <div
                v-for="(run, idx) in nextExecutionsPreview"
                :key="idx"
                class="border-border bg-muted/40 flex items-center justify-between rounded-md border px-3 py-2 text-xs"
              >
                <div class="flex items-center gap-2">
                  <span class="text-muted-foreground font-mono font-semibold">{{ idx + 1 }}.</span>
                  <span class="text-foreground font-mono font-medium">{{ run.time }}</span>
                </div>
                <Badge variant="secondary" class="text-xs font-normal">
                  {{ run.relative }}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Dialog: Create New Cron Job -->
    <Dialog v-model:open="isCreateOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Cron Job</DialogTitle>
          <DialogDescription>
            Schedule a background worker function or HTTP endpoint target on a recurring cron interval.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <label for="new-job-name" class="text-foreground text-xs font-medium">Job Name / Identifier</label>
            <Input id="new-job-name" v-model="newJobName" placeholder="e.g. sync-stripe-disputes" />
          </div>

          <div class="space-y-1.5">
            <label for="new-job-target" class="text-foreground text-xs font-medium"
              >Target Endpoint / Worker Handler</label
            >
            <Input
              id="new-job-target"
              v-model="newJobTarget"
              placeholder="POST https://api.acme.corp/v1/stripe/disputes"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label for="new-job-cron" class="text-foreground text-xs font-medium">Cron Expression</label>
              <Input id="new-job-cron" v-model="newJobCron" placeholder="0 4 * * *" class="font-mono text-xs" />
            </div>

            <div class="space-y-1.5">
              <label for="new-job-tz" class="text-foreground text-xs font-medium">Timezone</label>
              <Select v-model="newJobTimezone">
                <SelectTrigger id="new-job-tz" class="text-xs">
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isCreateOpen = false">Cancel</Button>
          <Button :disabled="!newJobName.trim()" @click="handleCreateJob">Create Cron Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Dialog: View Execution Logs -->
    <Dialog v-model:open="isLogsOpen">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <Terminal class="text-primary size-5" />
            <DialogTitle class="font-mono text-base">{{ selectedJobForLogs?.name }}</DialogTitle>
          </div>
          <DialogDescription class="font-mono text-xs">
            Target: {{ selectedJobForLogs?.target }} · Schedule: {{ selectedJobForLogs?.cronExpression }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3 py-1">
          <div class="border-border bg-muted/60 flex items-center justify-between rounded-md border px-3 py-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Latest Run:</span>
              <span class="text-foreground font-mono font-medium">{{
                selectedJobForLogs?.lastExecution.timestamp
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Duration:</span>
              <span class="text-foreground font-mono">{{ selectedJobForLogs?.lastExecution.duration }}</span>
            </div>
            <Badge
              :variant="selectedJobForLogs?.lastExecution.status === 'success' ? 'success' : 'destructive'"
              class="font-mono text-xs"
            >
              {{ selectedJobForLogs?.lastExecution.code }}
            </Badge>
          </div>

          <!-- Terminal Output Simulation -->
          <div
            class="border-border space-y-1.5 overflow-x-auto rounded-lg border bg-black/90 p-4 font-mono text-xs text-emerald-400 dark:bg-black"
          >
            <p class="text-muted-foreground">
              ❯ [scheduler] Initializing invocation container for {{ selectedJobForLogs?.name }}...
            </p>
            <p class="text-muted-foreground">❯ [network] Dispatching HTTP POST to target endpoint</p>
            <p class="text-emerald-400">
              ✓ [worker] Request acknowledged with HTTP {{ selectedJobForLogs?.lastExecution.code }}
            </p>
            <p v-if="selectedJobForLogs?.lastExecution.status === 'error'" class="text-destructive">
              ✖ [error] Endpoint returned 504 Gateway Timeout after 30.0s threshold. Retrying with exponential backoff
              (attempt 1/3).
            </p>
            <p v-else class="text-emerald-400">
              ✓ [worker] Processed 1,420 queue records in {{ selectedJobForLogs?.lastExecution.duration }}. Exit status
              code: 0.
            </p>
            <p class="text-muted-foreground">
              ❯ [scheduler] Next scheduled execution: {{ selectedJobForLogs?.nextRun }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isLogsOpen = false">Close Logs</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
