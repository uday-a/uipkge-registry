'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface CronJobSchedulerProps {
  initialJobs?: CronJob[]
  initialStats?: CronStats
  className?: string
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

const defaultStats: CronStats = {
  totalScheduled: 14,
  activeWorkers: 12,
  failed24h: 1,
  executionsToday: '48.2k',
}

type Frequency = 'minute' | 'hour' | 'day' | 'week' | 'month'

const weekDayNames: Record<string, string> = {
  '0': 'Sunday',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
}

export function CronJobScheduler({
  initialJobs = defaultJobs,
  initialStats = defaultStats,
  className,
}: CronJobSchedulerProps) {
  const [jobs, setJobs] = React.useState<CronJob[]>(initialJobs)
  const [search, setSearch] = React.useState<string>('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | JobStatus>('all')
  const [bannerMessage, setBannerMessage] = React.useState<{ type: 'success' | 'info'; text: string } | null>(null)
  const [runningJobId, setRunningJobId] = React.useState<string | null>(null)

  // Dialogs
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false)
  const [newJobName, setNewJobName] = React.useState<string>('')
  const [newJobTarget, setNewJobTarget] = React.useState<string>('')
  const [newJobCron, setNewJobCron] = React.useState<string>('0 0 * * *')
  const [newJobTimezone, setNewJobTimezone] = React.useState<string>('UTC')

  const [isLogsOpen, setIsLogsOpen] = React.useState<boolean>(false)
  const [selectedJobForLogs, setSelectedJobForLogs] = React.useState<CronJob | null>(null)

  // Helper State
  const [helperFrequency, setHelperFrequency] = React.useState<Frequency>('day')
  const [helperMinuteInterval, setHelperMinuteInterval] = React.useState<string>('15')
  const [helperHourlyMinute, setHelperHourlyMinute] = React.useState<string>('0')
  const [helperDailyHour, setHelperDailyHour] = React.useState<string>('0')
  const [helperDailyMinute, setHelperDailyMinute] = React.useState<string>('0')
  const [helperWeekDay, setHelperWeekDay] = React.useState<string>('1')
  const [helperWeekHour, setHelperWeekHour] = React.useState<string>('9')
  const [helperWeekMinute, setHelperWeekMinute] = React.useState<string>('0')
  const [helperMonthDay, setHelperMonthDay] = React.useState<string>('1')
  const [helperMonthHour, setHelperMonthHour] = React.useState<string>('0')
  const [helperMonthMinute, setHelperMonthMinute] = React.useState<string>('0')
  const [copiedCron, setCopiedCron] = React.useState<boolean>(false)

  const currentCronExpression = React.useMemo(() => {
    switch (helperFrequency) {
      case 'minute':
        return helperMinuteInterval === '1' ? '* * * * *' : `*/${helperMinuteInterval} * * * *`
      case 'hour':
        return `${helperHourlyMinute} * * * *`
      case 'day':
        return `${helperDailyMinute} ${helperDailyHour} * * *`
      case 'week':
        return `${helperWeekMinute} ${helperWeekHour} * * ${helperWeekDay}`
      case 'month':
        return `${helperMonthMinute} ${helperMonthHour} ${helperMonthDay} * *`
      default:
        return '0 0 * * *'
    }
  }, [
    helperFrequency,
    helperMinuteInterval,
    helperHourlyMinute,
    helperDailyHour,
    helperDailyMinute,
    helperWeekDay,
    helperWeekHour,
    helperWeekMinute,
    helperMonthDay,
    helperMonthHour,
    helperMonthMinute,
  ])

  const currentHumanTranslation = React.useMemo(() => {
    switch (helperFrequency) {
      case 'minute':
        return helperMinuteInterval === '1' ? 'Runs every minute' : `Runs every ${helperMinuteInterval} minutes`
      case 'hour':
        return helperHourlyMinute === '0'
          ? 'Runs at the start of every hour (minute 0)'
          : `Runs at minute ${helperHourlyMinute.padStart(2, '0')} of every hour`
      case 'day':
        return `Runs every day at ${helperDailyHour.padStart(2, '0')}:${helperDailyMinute.padStart(2, '0')} UTC`
      case 'week': {
        const day = weekDayNames[helperWeekDay] || 'Monday'
        return `Runs every ${day} at ${helperWeekHour.padStart(2, '0')}:${helperWeekMinute.padStart(2, '0')} UTC`
      }
      case 'month':
        return `Runs on day ${helperMonthDay} of every month at ${helperMonthHour.padStart(2, '0')}:${helperMonthMinute.padStart(2, '0')} UTC`
      default:
        return 'Every day at midnight'
    }
  }, [
    helperFrequency,
    helperMinuteInterval,
    helperHourlyMinute,
    helperDailyHour,
    helperDailyMinute,
    helperWeekDay,
    helperWeekHour,
    helperWeekMinute,
    helperMonthDay,
    helperMonthHour,
    helperMonthMinute,
  ])

  const nextExecutionsPreview = React.useMemo(() => {
    if (helperFrequency === 'minute') {
      const step = Number(helperMinuteInterval) || 1
      return [
        { time: `2026-10-24 14:${String(step).padStart(2, '0')}:00 UTC`, relative: `in ${step} minutes` },
        { time: `2026-10-24 14:${String(step * 2).padStart(2, '0')}:00 UTC`, relative: `in ${step * 2} minutes` },
        { time: `2026-10-24 14:${String(step * 3).padStart(2, '0')}:00 UTC`, relative: `in ${step * 3} minutes` },
      ]
    }
    if (helperFrequency === 'hour') {
      const min = helperHourlyMinute.padStart(2, '0')
      return [
        { time: `2026-10-24 15:${min}:00 UTC`, relative: 'in 42 minutes' },
        { time: `2026-10-24 16:${min}:00 UTC`, relative: 'in 1 hour 42 min' },
        { time: `2026-10-24 17:${min}:00 UTC`, relative: 'in 2 hours 42 min' },
      ]
    }
    if (helperFrequency === 'day') {
      const hr = helperDailyHour.padStart(2, '0')
      const min = helperDailyMinute.padStart(2, '0')
      return [
        { time: `2026-10-25 ${hr}:${min}:00 UTC`, relative: 'tomorrow' },
        { time: `2026-10-26 ${hr}:${min}:00 UTC`, relative: 'in 2 days' },
        { time: `2026-10-27 ${hr}:${min}:00 UTC`, relative: 'in 3 days' },
      ]
    }
    if (helperFrequency === 'week') {
      const hr = helperWeekHour.padStart(2, '0')
      const min = helperWeekMinute.padStart(2, '0')
      return [
        { time: `2026-10-26 ${hr}:${min}:00 UTC`, relative: 'next Monday' },
        { time: `2026-11-02 ${hr}:${min}:00 UTC`, relative: 'in 9 days' },
        { time: `2026-11-09 ${hr}:${min}:00 UTC`, relative: 'in 16 days' },
      ]
    }
    const dom = helperMonthDay.padStart(2, '0')
    const hr = helperMonthHour.padStart(2, '0')
    const min = helperMonthMinute.padStart(2, '0')
    return [
      { time: `2026-11-${dom} ${hr}:${min}:00 UTC`, relative: 'in 8 days' },
      { time: `2026-12-${dom} ${hr}:${min}:00 UTC`, relative: 'in 38 days' },
      { time: `2027-01-${dom} ${hr}:${min}:00 UTC`, relative: 'in 69 days' },
    ]
  }, [
    helperFrequency,
    helperMinuteInterval,
    helperHourlyMinute,
    helperDailyHour,
    helperDailyMinute,
    helperWeekHour,
    helperWeekMinute,
    helperMonthDay,
    helperMonthHour,
    helperMonthMinute,
  ])

  const applyPreset = (cron: string) => {
    if (cron === '*/15 * * * *') {
      setHelperFrequency('minute')
      setHelperMinuteInterval('15')
    } else if (cron === '0 * * * *') {
      setHelperFrequency('hour')
      setHelperHourlyMinute('0')
    } else if (cron === '0 0 * * *') {
      setHelperFrequency('day')
      setHelperDailyHour('0')
      setHelperDailyMinute('0')
    } else if (cron === '0 9 * * 1') {
      setHelperFrequency('week')
      setHelperWeekDay('1')
      setHelperWeekHour('9')
      setHelperWeekMinute('0')
    } else if (cron === '0 0 1 * *') {
      setHelperFrequency('month')
      setHelperMonthDay('1')
      setHelperMonthHour('0')
      setHelperMonthMinute('0')
    }
  }

  const copyExpression = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCron(true)
      setTimeout(() => setCopiedCron(false), 2000)
    } catch {
      setCopiedCron(true)
      setTimeout(() => setCopiedCron(false), 2000)
    }
  }

  const filteredJobs = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return jobs.filter((job) => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      const matchesSearch = !q || job.name.toLowerCase().includes(q) || job.target.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [jobs, search, statusFilter])

  const triggerRun = (job: CronJob) => {
    setRunningJobId(job.id)
    setBannerMessage({
      type: 'success',
      text: `Job "${job.name}" queued and running now on cluster edge-worker-01.`,
    })
    setTimeout(() => {
      setRunningJobId(null)
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                lastExecution: {
                  status: 'success',
                  code: '200 OK',
                  duration: '0.8s',
                  timestamp: 'Just now',
                },
              }
            : j,
        ),
      )
    }, 1200)
  }

  const togglePause = (job: CronJob) => {
    const nextStatus: JobStatus = job.status === 'active' ? 'paused' : 'active'
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? {
              ...j,
              status: nextStatus,
              nextRun: nextStatus === 'paused' ? 'Paused' : 'in 15 min',
            }
          : j,
      ),
    )
    setBannerMessage({
      type: 'info',
      text: `Job "${job.name}" has been ${nextStatus === 'paused' ? 'paused' : 'resumed'}.`,
    })
  }

  const deleteJob = (id: string) => {
    const target = jobs.find((j) => j.id === id)
    setJobs((prev) => prev.filter((j) => j.id !== id))
    setBannerMessage({
      type: 'info',
      text: `Job "${target?.name || id}" removed from scheduler queue.`,
    })
  }

  const openLogs = (job: CronJob) => {
    setSelectedJobForLogs(job)
    setIsLogsOpen(true)
  }

  const handleCreateJob = () => {
    if (!newJobName.trim()) return
    const newJob: CronJob = {
      id: `job-${Date.now()}`,
      name: newJobName.trim().toLowerCase().replace(/\s+/g, '-'),
      target: newJobTarget.trim() || 'POST https://api.acme.corp/v1/worker/execute',
      cronExpression: newJobCron.trim() || '0 0 * * *',
      humanSchedule: 'Custom scheduled trigger',
      timezone: newJobTimezone || 'UTC',
      status: 'active',
      nextRun: 'in 5 min',
      lastExecution: {
        status: 'success',
        code: 'Pending initial run',
        duration: '—',
        timestamp: 'Never',
      },
    }
    setJobs((prev) => [newJob, ...prev])
    setIsCreateOpen(false)
    setNewJobName('')
    setNewJobTarget('')
    setBannerMessage({
      type: 'success',
      text: `New cron job "${newJob.name}" successfully created and registered in cluster.`,
    })
  }

  return (
    <div data-slot="cron-job-scheduler" className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-primary size-6" />
            <h1 className="text-foreground text-2xl font-bold tracking-tight">Cron Jobs & Scheduled Tasks</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Configure automated background workers, recurring tasks, and queue schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            New Cron Job
          </Button>
        </div>
      </div>

      {/* Notification / Action banner */}
      {bannerMessage && (
        <div className="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm">
            {bannerMessage.type === 'success' ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Zap className="text-primary size-4 shrink-0" />
            )}
            <span className="text-foreground font-medium">{bannerMessage.text}</span>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={() => setBannerMessage(null)}>
            <X className="size-3.5" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      )}

      {/* 4 Stat / KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Scheduled</CardTitle>
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight">{initialStats.totalScheduled}</div>
            <p className="text-muted-foreground text-xs">Across 4 worker clusters</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Active Workers</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Cpu className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight">{initialStats.activeWorkers}</div>
            <p className="text-muted-foreground text-xs">2 currently paused</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs dark:bg-amber-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Failed in 24h</CardTitle>
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
                {initialStats.failed24h}
              </span>
              <Badge variant="warning" className="text-xs">
                Amber alert
              </Badge>
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90">1 job needs attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Executions Today</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <Activity className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight">{initialStats.executionsToday}</div>
            <p className="text-muted-foreground text-xs">99.8% success rate (18ms avg)</p>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Jobs Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Scheduled Jobs</CardTitle>
              <CardDescription className="text-xs">
                {filteredJobs.length} of {jobs.length} tasks registered in cluster scheduler.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search job name or target..."
                  className="h-8 pl-9 text-xs"
                />
              </div>

              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as 'all' | JobStatus)}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="hidden h-8 items-center gap-1 font-mono text-xs md:inline-flex">
                <Globe className="size-3" />
                UTC
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[240px]">Job Name & Target</TableHead>
                  <TableHead className="min-w-[200px]">Schedule</TableHead>
                  <TableHead className="w-20">Timezone</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="min-w-[130px]">Next Run</TableHead>
                  <TableHead className="min-w-[220px]">Last Execution</TableHead>
                  <TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} className="group transition-colors">
                    {/* Job Name & Target */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground text-sm font-medium">{job.name}</span>
                          {runningJobId === job.id && (
                            <RefreshCw className="text-primary size-3.5 animate-spin" aria-label="Running now" />
                          )}
                        </div>
                        <p
                          className="text-muted-foreground max-w-[280px] truncate font-mono text-xs sm:max-w-[340px]"
                          title={job.target}
                        >
                          {job.target}
                        </p>
                      </div>
                    </TableCell>

                    {/* Cron Expression & Human Translation */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <code className="border-border bg-muted text-foreground rounded border px-1.5 py-0.5 font-mono text-xs font-semibold">
                            {job.cronExpression}
                          </code>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1 text-xs">{job.humanSchedule}</p>
                      </div>
                    </TableCell>

                    {/* Timezone */}
                    <TableCell className="py-3">
                      <span className="text-muted-foreground font-mono text-xs font-medium">{job.timezone}</span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3">
                      {job.status === 'active' && (
                        <Badge variant="success" className="gap-1 text-xs">
                          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                          Active
                        </Badge>
                      )}
                      {job.status === 'paused' && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Pause className="size-3" />
                          Paused
                        </Badge>
                      )}
                      {job.status === 'error' && (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <AlertCircle className="size-3" />
                          Error
                        </Badge>
                      )}
                    </TableCell>

                    {/* Next Run */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="text-muted-foreground size-3.5 shrink-0" />
                        <span
                          className={job.status === 'paused' ? 'text-muted-foreground' : 'text-foreground font-medium'}
                        >
                          {job.nextRun}
                        </span>
                      </div>
                    </TableCell>

                    {/* Last Execution */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          {job.lastExecution.status === 'success' ? (
                            <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <XCircle className="text-destructive size-3.5 shrink-0" />
                          )}
                          <span
                            className={cn(
                              'font-mono text-xs font-medium',
                              job.lastExecution.status === 'success'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-destructive',
                            )}
                          >
                            {job.lastExecution.code}
                          </span>
                          <span className="text-muted-foreground font-mono text-xs">
                            · {job.lastExecution.duration}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">{job.lastExecution.timestamp}</p>
                      </div>
                    </TableCell>

                    {/* Action Menu */}
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Job Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => triggerRun(job)}>
                            <Play className="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePause(job)}>
                            {job.status === 'active' ? (
                              <>
                                <Pause className="mr-2 size-4" />
                                Pause Schedule
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 size-4" />
                                Resume Schedule
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openLogs(job)}>
                            <Terminal className="mr-2 size-4" />
                            View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => applyPreset(job.cronExpression)}>
                            <Pencil className="mr-2 size-4" />
                            Inspect in Helper
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteJob(job.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredJobs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground h-28 text-center text-sm">
                      No scheduled jobs found matching the active filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cron Expression Helper Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary size-4" />
                <CardTitle className="text-lg font-semibold">Interactive Cron Expression Helper</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Generate standard 5-part cron syntax with real-time translation and upcoming execution previews.
              </CardDescription>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 sm:pt-0">
              <span className="text-muted-foreground text-xs">Presets:</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 font-mono text-xs"
                onClick={() => applyPreset('*/15 * * * *')}
              >
                */15 * * * *
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 font-mono text-xs"
                onClick={() => applyPreset('0 * * * *')}
              >
                0 * * * *
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 font-mono text-xs"
                onClick={() => applyPreset('0 0 * * *')}
              >
                0 0 * * *
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 font-mono text-xs"
                onClick={() => applyPreset('0 9 * * 1')}
              >
                0 9 * * 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 font-mono text-xs"
                onClick={() => applyPreset('0 0 1 * *')}
              >
                0 0 1 * *
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Frequency Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['minute', 'hour', 'day', 'week', 'month'] as Frequency[]).map((freq) => (
              <Button
                key={freq}
                variant={helperFrequency === freq ? 'default' : 'outline'}
                size="sm"
                className="text-xs capitalize"
                onClick={() => setHelperFrequency(freq)}
              >
                Every {freq}
              </Button>
            ))}
          </div>

          {/* Dynamic Frequency Inputs Grid */}
          <div className="border-border bg-muted/40 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Minute Controls */}
            {helperFrequency === 'minute' && (
              <div className="space-y-2">
                <label className="text-foreground text-xs font-medium">Interval Interval</label>
                <Select value={helperMinuteInterval} onValueChange={setHelperMinuteInterval}>
                  <SelectTrigger className="bg-card h-9 w-full text-xs">
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
            )}

            {/* Hour Controls */}
            {helperFrequency === 'hour' && (
              <div className="space-y-2">
                <label className="text-foreground text-xs font-medium">Minute of the Hour</label>
                <Select value={helperHourlyMinute} onValueChange={setHelperHourlyMinute}>
                  <SelectTrigger className="bg-card h-9 w-full text-xs">
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
            )}

            {/* Day Controls */}
            {helperFrequency === 'day' && (
              <>
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-medium">Execution Hour (UTC)</label>
                  <Select value={helperDailyHour} onValueChange={setHelperDailyHour}>
                    <SelectTrigger className="bg-card h-9 w-full text-xs">
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
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-medium">Minute (UTC)</label>
                  <Select value={helperDailyMinute} onValueChange={setHelperDailyMinute}>
                    <SelectTrigger className="bg-card h-9 w-full text-xs">
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
              </>
            )}

            {/* Week Controls */}
            {helperFrequency === 'week' && (
              <>
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-medium">Day of Week</label>
                  <Select value={helperWeekDay} onValueChange={setHelperWeekDay}>
                    <SelectTrigger className="bg-card h-9 w-full text-xs">
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
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-medium">Time (UTC)</label>
                  <Select value={helperWeekHour} onValueChange={setHelperWeekHour}>
                    <SelectTrigger className="bg-card h-9 w-full text-xs">
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
              </>
            )}

            {/* Month Controls */}
            {helperFrequency === 'month' && (
              <>
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-medium">Day of Month</label>
                  <Select value={helperMonthDay} onValueChange={setHelperMonthDay}>
                    <SelectTrigger className="bg-card h-9 w-full text-xs">
                      <SelectValue placeholder="Select day of month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st of the month</SelectItem>
                      <SelectItem value="15">15th (Mid-month)</SelectItem>
                      <SelectItem value="28">28th of the month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-medium">Time (UTC)</label>
                  <Select value={helperMonthHour} onValueChange={setHelperMonthHour}>
                    <SelectTrigger className="bg-card h-9 w-full text-xs">
                      <SelectValue placeholder="Select hour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">00:00 (Midnight)</SelectItem>
                      <SelectItem value="9">09:00 (Morning)</SelectItem>
                      <SelectItem value="12">12:00 (Noon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex flex-col justify-end space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="text-foreground text-xs font-medium">Target Cluster Timezone</label>
              <div className="border-border bg-card text-muted-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-xs">
                <Globe className="text-primary size-3.5" />
                <span>UTC (Coordinated Universal)</span>
              </div>
            </div>
          </div>

          {/* Generated Syntax & Next 3 Runs Output */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left: Expression and Humanized Label */}
            <div className="border-border bg-card space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Generated Syntax
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => copyExpression(currentCronExpression)}
                >
                  {copiedCron ? (
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  {copiedCron ? 'Copied' : 'Copy Cron'}
                </Button>
              </div>

              <div className="border-border bg-muted/60 rounded-md border p-3">
                <code className="text-foreground font-mono text-lg font-bold">{currentCronExpression}</code>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <CalendarClock className="text-primary size-4 shrink-0" />
                <span>{currentHumanTranslation}</span>
              </div>
            </div>

            {/* Right: Next 3 Runs Preview */}
            <div className="border-border bg-card space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Next 3 Scheduled Runs (UTC)
                </span>
                <Badge variant="outline" className="font-mono text-xs">
                  Simulated
                </Badge>
              </div>

              <div className="space-y-2">
                {nextExecutionsPreview.map((run, idx) => (
                  <div
                    key={idx}
                    className="border-border bg-muted/40 flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono font-semibold">{idx + 1}.</span>
                      <span className="text-foreground font-mono font-medium">{run.time}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {run.relative}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Create New Cron Job */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Cron Job</DialogTitle>
            <DialogDescription>
              Schedule a background worker function or HTTP endpoint target on a recurring cron interval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="new-job-name-react" className="text-foreground text-xs font-medium">
                Job Name / Identifier
              </label>
              <Input
                id="new-job-name-react"
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
                placeholder="e.g. sync-stripe-disputes"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-job-target-react" className="text-foreground text-xs font-medium">
                Target Endpoint / Worker Handler
              </label>
              <Input
                id="new-job-target-react"
                value={newJobTarget}
                onChange={(e) => setNewJobTarget(e.target.value)}
                placeholder="POST https://api.acme.corp/v1/stripe/disputes"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="new-job-cron-react" className="text-foreground text-xs font-medium">
                  Cron Expression
                </label>
                <Input
                  id="new-job-cron-react"
                  value={newJobCron}
                  onChange={(e) => setNewJobCron(e.target.value)}
                  placeholder="0 4 * * *"
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="new-job-tz-react" className="text-foreground text-xs font-medium">
                  Timezone
                </label>
                <Select value={newJobTimezone} onValueChange={setNewJobTimezone}>
                  <SelectTrigger id="new-job-tz-react" className="text-xs">
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
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!newJobName.trim()} onClick={handleCreateJob}>
              Create Cron Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: View Execution Logs */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Terminal className="text-primary size-5" />
              <DialogTitle className="font-mono text-base">{selectedJobForLogs?.name}</DialogTitle>
            </div>
            <DialogDescription className="font-mono text-xs">
              Target: {selectedJobForLogs?.target} · Schedule: {selectedJobForLogs?.cronExpression}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="border-border bg-muted/60 flex items-center justify-between rounded-md border px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Latest Run:</span>
                <span className="text-foreground font-mono font-medium">
                  {selectedJobForLogs?.lastExecution.timestamp}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground font-mono">{selectedJobForLogs?.lastExecution.duration}</span>
              </div>
              <Badge
                variant={selectedJobForLogs?.lastExecution.status === 'success' ? 'success' : 'destructive'}
                className="font-mono text-xs"
              >
                {selectedJobForLogs?.lastExecution.code}
              </Badge>
            </div>

            {/* Terminal Output Simulation */}
            <div className="border-border space-y-1.5 overflow-x-auto rounded-lg border bg-black/90 p-4 font-mono text-xs text-emerald-400 dark:bg-black">
              <p className="text-muted-foreground">
                ❯ [scheduler] Initializing invocation container for {selectedJobForLogs?.name}...
              </p>
              <p className="text-muted-foreground">❯ [network] Dispatching HTTP POST to target endpoint</p>
              <p className="text-emerald-400">
                ✓ [worker] Request acknowledged with HTTP {selectedJobForLogs?.lastExecution.code}
              </p>
              {selectedJobForLogs?.lastExecution.status === 'error' ? (
                <p className="text-destructive">
                  ✖ [error] Endpoint returned 504 Gateway Timeout after 30.0s threshold. Retrying with exponential
                  backoff (attempt 1/3).
                </p>
              ) : (
                <p className="text-emerald-400">
                  ✓ [worker] Processed 1,420 queue records in {selectedJobForLogs?.lastExecution.duration}. Exit status
                  code: 0.
                </p>
              )}
              <p className="text-muted-foreground">
                ❯ [scheduler] Next scheduled execution: {selectedJobForLogs?.nextRun}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogsOpen(false)}>
              Close Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CronJobScheduler
