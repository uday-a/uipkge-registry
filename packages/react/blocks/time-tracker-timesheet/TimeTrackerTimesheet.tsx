'use client'

import * as React from 'react'
import {
  Briefcase,
  Calendar,
  CircleDollarSign,
  Clock,
  DollarSign,
  Download,
  Play,
  Plus,
  Square,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ProjectOption {
  id: string
  name: string
  client: string
  rate: number
  rateLabel: string
  color: string
  badgeClass: string
  dotClass: string
}

export interface TimeEntry {
  id: string
  task: string
  projectId: string
  projectName: string
  clientName: string
  projectBadgeClass: string
  date: string
  dateLabel: string
  startTime: string
  endTime: string
  durationSeconds: number
  isBillable: boolean
  rate: number
  amount: number
}

const projects: ProjectOption[] = [
  {
    id: 'acme',
    name: 'Acme Corp',
    client: 'Acme Enterprises',
    rate: 150,
    rateLabel: '$150/hr',
    color: 'blue',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
  {
    id: 'stripe',
    name: 'Stripe Retainer',
    client: 'Stripe, Inc.',
    rate: 175,
    rateLabel: '$175/hr',
    color: 'purple',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    dotClass: 'bg-purple-500',
  },
  {
    id: 'linear',
    name: 'Linear Sync',
    client: 'Linear Orbit',
    rate: 160,
    rateLabel: '$160/hr',
    color: 'indigo',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    dotClass: 'bg-indigo-500',
  },
  {
    id: 'uipkge',
    name: 'UIPKGE Core',
    client: 'Internal OSS',
    rate: 0,
    rateLabel: 'Internal · $0/hr',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
]

const initialEntries: TimeEntry[] = [
  {
    id: 'entry-1',
    task: 'Refactoring OKLCH Color Engine & AST Parser',
    projectId: 'acme',
    projectName: 'Acme Corp',
    clientName: 'Acme Enterprises',
    projectBadgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    date: '2026-08-21',
    dateLabel: 'Today · Friday, Aug 21',
    startTime: '09:00',
    endTime: '11:30',
    durationSeconds: 9000,
    isBillable: true,
    rate: 150,
    amount: 375,
  },
  {
    id: 'entry-2',
    task: 'Webhook idempotency retry queue architecture',
    projectId: 'stripe',
    projectName: 'Stripe Retainer',
    clientName: 'Stripe, Inc.',
    projectBadgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    date: '2026-08-21',
    dateLabel: 'Today · Friday, Aug 21',
    startTime: '13:00',
    endTime: '15:45',
    durationSeconds: 9900,
    isBillable: true,
    rate: 175,
    amount: 481.25,
  },
  {
    id: 'entry-3',
    task: 'Weekly sprint retrospective & design token review',
    projectId: 'uipkge',
    projectName: 'UIPKGE Core',
    clientName: 'Internal OSS',
    projectBadgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    date: '2026-08-21',
    dateLabel: 'Today · Friday, Aug 21',
    startTime: '16:00',
    endTime: '17:30',
    durationSeconds: 5400,
    isBillable: false,
    rate: 0,
    amount: 0,
  },
  {
    id: 'entry-4',
    task: 'Bidirectional GraphQL sync engine & schema migrations',
    projectId: 'linear',
    projectName: 'Linear Sync',
    clientName: 'Linear Orbit',
    projectBadgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    date: '2026-08-20',
    dateLabel: 'Yesterday · Thursday, Aug 20',
    startTime: '09:30',
    endTime: '14:00',
    durationSeconds: 16200,
    isBillable: true,
    rate: 160,
    amount: 720,
  },
  {
    id: 'entry-5',
    task: 'Design system Figma token export automation',
    projectId: 'acme',
    projectName: 'Acme Corp',
    clientName: 'Acme Enterprises',
    projectBadgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    date: '2026-08-20',
    dateLabel: 'Yesterday · Thursday, Aug 20',
    startTime: '14:45',
    endTime: '17:30',
    durationSeconds: 9900,
    isBillable: true,
    rate: 150,
    amount: 412.5,
  },
]

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val)
}

export interface TimeTrackerTimesheetProps {
  title?: string
  subtitle?: string
  className?: string
}

export function TimeTrackerTimesheet({
  title = 'Time Tracker & Timesheet',
  subtitle = 'Track live project hours, calculate client billing rates, and review weekly activity.',
  className,
}: TimeTrackerTimesheetProps) {
  const [entries, setEntries] = React.useState<TimeEntry[]>(initialEntries)
  const [activeTask, setActiveTask] = React.useState('Refactoring OKLCH Color Engine & AST Parser')
  const [selectedProjectId, setSelectedProjectId] = React.useState('acme')
  const [isBillable, setIsBillable] = React.useState(true)
  const [isRunning, setIsRunning] = React.useState(true)
  const [timerSeconds, setTimerSeconds] = React.useState(6138) // 01:42:18

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const toggleTimer = () => {
    setIsRunning((prev) => !prev)
  }

  const resumeEntry = (entry: TimeEntry) => {
    setActiveTask(entry.task)
    setSelectedProjectId(entry.projectId)
    setIsBillable(entry.isBillable)
    setIsRunning(true)
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const groupedEntries = React.useMemo(() => {
    const groups: Record<
      string,
      { label: string; date: string; entries: TimeEntry[]; totalSeconds: number; totalAmount: number }
    > = {}

    for (const entry of entries) {
      if (!groups[entry.date]) {
        groups[entry.date] = {
          label: entry.dateLabel,
          date: entry.date,
          entries: [],
          totalSeconds: 0,
          totalAmount: 0,
        }
      }
      groups[entry.date].entries.push(entry)
      groups[entry.date].totalSeconds += entry.durationSeconds
      groups[entry.date].totalAmount += entry.amount
    }

    return Object.values(groups)
  }, [entries])

  const totalWeeklySeconds = React.useMemo(() => entries.reduce((acc, e) => acc + e.durationSeconds, 0), [entries])
  const totalWeeklyAmount = React.useMemo(() => entries.reduce((acc, e) => acc + e.amount, 0), [entries])

  const formattedTimer = formatDuration(timerSeconds)

  return (
    <div data-slot="time-tracker-timesheet" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            <Badge variant="outline" className="border-border hidden text-xs font-medium sm:inline-flex">
              Toggl Engine
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button aria-label="Download attachment" variant="outline" size="sm" className="h-9 gap-1.5 shadow-xs">
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button size="sm" className="h-9 gap-1.5 shadow-xs">
            <Plus className="size-4" aria-hidden="true" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Live Running Stopwatch Hero Bar */}
      <Card className="border-border bg-card overflow-hidden shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Task description & Project Tag Select */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {/* Task Description Input */}
              <div className="relative flex-1">
                <Input
                  value={activeTask}
                  onChange={(e) => setActiveTask(e.target.value)}
                  type="text"
                  placeholder="What are you working on?"
                  className="h-10 text-sm font-medium focus-visible:ring-2"
                />
              </div>

              {/* Project / Client Tag Select */}
              <div className="w-full shrink-0 sm:w-64">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Select client/project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        <div className="flex items-center gap-2">
                          <span className={cn('size-2 shrink-0 rounded-full', proj.dotClass)} />
                          <span className="text-foreground font-medium">{proj.name}</span>
                          <span className="text-muted-foreground text-xs">· {proj.rateLabel}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Controls: Billable Switch, Live Stopwatch, Primary Action Button */}
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-3 sm:border-t-0 sm:pt-0 lg:justify-end">
              {/* Billable Switch */}
              <div className="flex items-center gap-2">
                <Switch id="billable-toggle-react" checked={isBillable} onCheckedChange={setIsBillable} size="sm" />
                <label
                  htmlFor="billable-toggle-react"
                  className="flex cursor-pointer items-center gap-1.5 text-xs font-medium select-none"
                >
                  <DollarSign
                    className={cn(
                      'size-3.5',
                      isBillable ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                    )}
                    aria-hidden="true"
                  />
                  <span className={isBillable ? 'text-foreground font-medium' : 'text-muted-foreground'}>Billable</span>
                </label>
              </div>

              <Separator orientation="vertical" className="hidden h-7 sm:block" />

              {/* Live Running Stopwatch Timer */}
              <div className="flex items-center gap-2.5">
                <div className="border-border/80 bg-muted/50 dark:bg-muted/30 flex items-center gap-2.5 rounded-lg border px-3.5 py-1.5 shadow-xs">
                  <div className="relative flex size-2.5 items-center justify-center">
                    {isRunning && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span
                      className={cn(
                        'relative inline-flex size-2.5 rounded-full',
                        isRunning ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                      )}
                    />
                  </div>
                  <span className="text-foreground font-mono text-xl font-bold tracking-tight tabular-nums sm:text-2xl">
                    {formattedTimer}
                  </span>
                </div>

                {/* Primary Start / Stop Button */}
                <Button
                  variant={isRunning ? 'destructive' : 'default'}
                  size="default"
                  className="h-10 gap-2 px-4 font-medium shadow-xs"
                  onClick={toggleTimer}
                >
                  {isRunning ? (
                    <Square className="size-4 fill-current" aria-hidden="true" />
                  ) : (
                    <Play className="size-4 fill-current" aria-hidden="true" />
                  )}
                  <span>{isRunning ? 'Stop' : 'Start'}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Timesheet Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Hours This Week */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Total Hours This Week</p>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Clock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">38.5 hrs</p>
              <span className="text-muted-foreground text-xs tabular-nums">/ 40.0 target</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="mr-0.5 size-3.5" aria-hidden="true" />
                96%
              </span>
              <span>of weekly target logged</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Billable Hours */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Billable Hours</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CircleDollarSign className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">32.0 hrs</p>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">83% billable ratio</span>
              <span>6.5 hrs internal</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. Total Earnings */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Total Earnings</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <DollarSign className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$4,800.00</p>
            <p className="text-muted-foreground text-xs">Avg $150.00/hr effective rate</p>
          </CardContent>
        </Card>

        {/* 4. Active Clients */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm font-medium">Active Clients</p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Briefcase className="size-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">3 active clients</p>
            <p className="text-muted-foreground truncate text-xs">Acme Corp · Stripe · Linear</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timesheet & Daily Activity Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-border/60 border-b pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Weekly Timesheet & Daily Activity</CardTitle>
              <CardDescription className="text-xs">
                Detailed time entries for the current billing cycle (Aug 17 – Aug 23, 2026).
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-border font-mono text-xs font-medium">
                Week 34 · 38h 30m · $4,800.00
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="min-w-[160px]">Project & Client</TableHead>
                  <TableHead className="min-w-[280px]">Task Description</TableHead>
                  <TableHead className="min-w-[130px]">Billable</TableHead>
                  <TableHead className="min-w-[130px]">Time Range</TableHead>
                  <TableHead className="min-w-[110px] text-right">Duration</TableHead>
                  <TableHead className="min-w-[110px] text-right">Amount</TableHead>
                  <TableHead className="w-24 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedEntries.map((group) => (
                  <React.Fragment key={group.date}>
                    {/* Day Group Header Subrow */}
                    <TableRow className="border-border bg-muted/20 hover:bg-muted/30 border-y font-medium">
                      <TableCell colSpan={4} className="text-foreground py-2.5 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground size-3.5" aria-hidden="true" />
                          <span>{group.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground py-2.5 text-right font-mono text-xs font-semibold tabular-nums">
                        {formatDuration(group.totalSeconds)}
                      </TableCell>
                      <TableCell className="text-foreground py-2.5 text-right font-mono text-xs font-semibold tabular-nums">
                        {formatCurrency(group.totalAmount)}
                      </TableCell>
                      <TableCell className="py-2.5" />
                    </TableRow>

                    {/* Entries for this day */}
                    {group.entries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/50 transition-colors">
                        {/* Project Badge & Client */}
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant="outline"
                              className={cn('w-fit text-xs font-normal', entry.projectBadgeClass)}
                            >
                              {entry.projectName}
                            </Badge>
                            <span className="text-muted-foreground text-xs">{entry.clientName}</span>
                          </div>
                        </TableCell>

                        {/* Task description */}
                        <TableCell>
                          <p className="text-foreground text-sm font-medium">{entry.task}</p>
                        </TableCell>

                        {/* Billable Status */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {entry.isBillable ? (
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                              >
                                <DollarSign className="mr-0.5 size-3" />
                                Billable (${entry.rate}/h)
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-border bg-muted/60 text-muted-foreground text-xs font-normal"
                              >
                                Non-billable
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Time Range */}
                        <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap tabular-nums">
                          {entry.startTime} – {entry.endTime}
                        </TableCell>

                        {/* Duration */}
                        <TableCell className="text-foreground text-right font-mono text-sm font-medium whitespace-nowrap tabular-nums">
                          {formatDuration(entry.durationSeconds)}
                        </TableCell>

                        {/* Billable Amount */}
                        <TableCell className="text-right font-mono text-sm font-semibold whitespace-nowrap tabular-nums">
                          <span className={entry.isBillable ? 'text-foreground' : 'text-muted-foreground'}>
                            {formatCurrency(entry.amount)}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-foreground size-8"
                              title="Resume Timer"
                              onClick={() => resumeEntry(entry)}
                            >
                              <Play className="size-3.5 fill-current" aria-hidden="true" />
                              <span className="sr-only">Resume timer for {entry.task}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive size-8"
                              title="Delete Entry"
                              onClick={() => deleteEntry(entry.id)}
                            >
                              <Trash2 className="size-3.5" aria-hidden="true" />
                              <span className="sr-only">Delete entry</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}

                {/* Empty state */}
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-1.5">
                        <Clock className="text-muted-foreground/60 size-6" aria-hidden="true" />
                        <p className="text-foreground text-sm font-medium">No time entries recorded for this week</p>
                        <p className="text-xs">Start the live timer above to log your hours.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Timesheet Table Footer Strip */}
          <div className="border-border bg-card text-muted-foreground flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-xs sm:flex-row">
            <p className="tabular-nums">
              Showing <span className="text-foreground font-medium">{entries.length}</span> time entries across{' '}
              <span className="text-foreground font-medium">{groupedEntries.length}</span> days
            </p>
            <div className="flex items-center gap-3">
              <span className="text-foreground font-mono text-xs font-medium tabular-nums">
                Total: {formatDuration(totalWeeklySeconds)} ({formatCurrency(totalWeeklyAmount)})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
