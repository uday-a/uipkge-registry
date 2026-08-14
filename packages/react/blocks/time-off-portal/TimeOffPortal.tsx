'use client'

import * as React from 'react'
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartPulse,
  Info,
  Palmtree,
  Plus,
  Send,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export interface TimeOffPortalProps {
  title?: string
  subtitle?: string
  className?: string
}

interface PendingRequest {
  id: string
  name: string
  role: string
  avatar: string
  dateRange: string
  duration: string
  type: string
  typeBadgeClass: string
  notes: string
  status: 'pending' | 'approved' | 'declined'
}

interface TeamMemberOOO {
  id: string
  name: string
  role: string
  avatar: string
  type: string
  typeClass: string
  dates: string
  returnNote: string
}

interface CompanyHoliday {
  id: string
  name: string
  date: string
  duration: string
  isLongWeekend?: boolean
}

const ptoBalances = [
  {
    id: 'pto',
    name: 'Paid Time Off (PTO)',
    available: 18,
    total: 25,
    unit: 'days',
    progress: 72,
    note: '+2.08 days accrued monthly',
    subtext: '18 of 25 days annual',
    icon: Palmtree,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    available: 8,
    total: 10,
    unit: 'days',
    progress: 80,
    note: 'Resets Jan 1, 2027',
    subtext: '8 of 10 days annual',
    icon: HeartPulse,
    colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
  },
  {
    id: 'personal',
    name: 'Personal / Wellness Days',
    available: 3,
    total: 4,
    unit: 'days',
    progress: 75,
    note: '1 day used this year',
    subtext: '3 of 4 days annual',
    icon: Sparkles,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  {
    id: 'volunteer',
    name: 'Volunteer & Compassionate',
    available: 2,
    total: 2,
    unit: 'days',
    progress: 100,
    note: 'Fully available',
    subtext: '2 days annual allowance',
    icon: UserCheck,
    colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
  },
]

const calendarDays = [
  { dateKey: '2026-08-31', dayNumber: 31, inMonth: false, eventType: null, label: '' },
  { dateKey: '2026-09-01', dayNumber: 1, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-02', dayNumber: 2, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-03', dayNumber: 3, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-04', dayNumber: 4, inMonth: true, eventType: 'team', label: 'Team OOO' },
  { dateKey: '2026-09-05', dayNumber: 5, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-06', dayNumber: 6, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-07', dayNumber: 7, inMonth: true, eventType: 'holiday', label: 'Labor Day' },
  { dateKey: '2026-09-08', dayNumber: 8, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-09', dayNumber: 9, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-10', dayNumber: 10, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-11', dayNumber: 11, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-12', dayNumber: 12, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-13', dayNumber: 13, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-14', dayNumber: 14, inMonth: true, eventType: 'approved', label: 'Vacation' },
  { dateKey: '2026-09-15', dayNumber: 15, inMonth: true, eventType: 'approved', label: 'Vacation' },
  { dateKey: '2026-09-16', dayNumber: 16, inMonth: true, eventType: 'approved', label: 'Vacation' },
  { dateKey: '2026-09-17', dayNumber: 17, inMonth: true, eventType: 'approved', label: 'Vacation' },
  { dateKey: '2026-09-18', dayNumber: 18, inMonth: true, eventType: 'approved', label: 'Vacation' },
  { dateKey: '2026-09-19', dayNumber: 19, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-20', dayNumber: 20, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-21', dayNumber: 21, inMonth: true, eventType: 'pending', label: 'Pending' },
  { dateKey: '2026-09-22', dayNumber: 22, inMonth: true, eventType: 'pending', label: 'Pending' },
  { dateKey: '2026-09-23', dayNumber: 23, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-24', dayNumber: 24, inMonth: true, eventType: 'team', label: 'Team OOO' },
  { dateKey: '2026-09-25', dayNumber: 25, inMonth: true, eventType: 'team', label: 'Team OOO' },
  { dateKey: '2026-09-26', dayNumber: 26, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-27', dayNumber: 27, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-28', dayNumber: 28, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-29', dayNumber: 29, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-09-30', dayNumber: 30, inMonth: true, eventType: null, label: '' },
  { dateKey: '2026-10-01', dayNumber: 1, inMonth: false, eventType: null, label: '' },
  { dateKey: '2026-10-02', dayNumber: 2, inMonth: false, eventType: null, label: '' },
  { dateKey: '2026-10-03', dayNumber: 3, inMonth: false, eventType: null, label: '' },
  { dateKey: '2026-10-04', dayNumber: 4, inMonth: false, eventType: null, label: '' },
]

const initialPendingRequests: PendingRequest[] = [
  {
    id: 'req-1',
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    avatar: 'SC',
    dateRange: 'Sep 14 – Sep 18, 2026',
    duration: '5 working days',
    type: 'Vacation',
    typeBadgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    notes: 'Annual family camping trip. Design handoff completed in Figma.',
    status: 'pending',
  },
  {
    id: 'req-2',
    name: 'Marcus Vance',
    role: 'Backend Engineer',
    avatar: 'MV',
    dateRange: 'Sep 22, 2026',
    duration: '1 day',
    type: 'Personal Day',
    typeBadgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    notes: 'Apartment move and utilities setup. Reached out to on-call secondary.',
    status: 'pending',
  },
]

const teamMembersOOO: TeamMemberOOO[] = [
  {
    id: 'tm-1',
    name: 'Elena Rostova',
    role: 'Frontend Lead',
    avatar: 'ER',
    type: 'Vacation',
    typeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dates: 'Sep 1 – Sep 8',
    returnNote: 'Returns Sep 9',
  },
  {
    id: 'tm-2',
    name: 'David Kim',
    role: 'DevOps Engineer',
    avatar: 'DK',
    type: 'Sick Leave',
    typeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    dates: 'Sep 4 – Sep 5',
    returnNote: 'Returns Sep 8',
  },
  {
    id: 'tm-3',
    name: 'Aisha Patel',
    role: 'Engineering Manager',
    avatar: 'AP',
    type: 'Personal Day',
    typeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dates: 'Sep 11',
    returnNote: 'Returns Sep 12',
  },
  {
    id: 'tm-4',
    name: 'Lucas Meyer',
    role: 'QA Analyst',
    avatar: 'LM',
    type: 'Volunteer',
    typeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    dates: 'Sep 18',
    returnNote: 'Returns Sep 21',
  },
]

const companyHolidays: CompanyHoliday[] = [
  {
    id: 'h-1',
    name: 'Labor Day',
    date: 'Mon, Sep 7, 2026',
    duration: 'Office Closed',
    isLongWeekend: true,
  },
  {
    id: 'h-2',
    name: 'Thanksgiving Break',
    date: 'Thu, Nov 26 – Fri, Nov 27, 2026',
    duration: '2 Days',
    isLongWeekend: true,
  },
  {
    id: 'h-3',
    name: 'Winter Holidays',
    date: 'Thu, Dec 24 – Fri, Dec 25, 2026',
    duration: '2 Days',
    isLongWeekend: true,
  },
  {
    id: 'h-4',
    name: "New Year's Day",
    date: 'Fri, Jan 1, 2027',
    duration: 'Office Closed',
    isLongWeekend: true,
  },
]

export function TimeOffPortal({
  title = 'Time Off & Leave',
  subtitle = 'Manage PTO, submit vacation requests, and check team availability.',
  className,
}: TimeOffPortalProps) {
  const currentMonth = 'September 2026'
  const [selectedDate, setSelectedDate] = React.useState('2026-09-14')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [formLeaveType, setFormLeaveType] = React.useState('vacation')
  const [formStartDate, setFormStartDate] = React.useState('2026-09-14')
  const [formEndDate, setFormEndDate] = React.useState('2026-09-18')
  const [formNotes, setFormNotes] = React.useState('Annual family trip. Liam Vance is available for emergency support.')
  const [formSubmitted, setFormSubmitted] = React.useState(false)
  const [pendingRequests, setPendingRequests] = React.useState<PendingRequest[]>(initialPendingRequests)

  const calculatedDays = React.useMemo(() => {
    if (!formStartDate || !formEndDate) return 0
    const start = new Date(formStartDate)
    const end = new Date(formEndDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0
    let count = 0
    const cur = new Date(start)
    while (cur <= end) {
      const day = cur.getDay()
      if (day !== 0 && day !== 6) count++
      cur.setDate(cur.getDate() + 1)
    }
    return count
  }, [formStartDate, formEndDate])

  const remainingAfterRequest = React.useMemo(() => {
    const currentAvailable = ptoBalances[0]?.available ?? 18
    return Math.max(0, currentAvailable - calculatedDays)
  }, [calculatedDays])

  const handleSubmitRequest = () => {
    setFormSubmitted(true)
    setIsDialogOpen(false)
  }

  const handleResetForm = () => {
    setFormLeaveType('vacation')
    setFormStartDate('2026-09-14')
    setFormEndDate('2026-09-18')
    setFormNotes('')
    setFormSubmitted(false)
  }

  const approveRequest = (id: string) => {
    setPendingRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
  }

  const declineRequest = (id: string) => {
    setPendingRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)))
  }

  return (
    <div data-slot="time-off-portal" className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <Badge variant="outline" className="hidden sm:inline-flex">
              HR Portal
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        </div>

        {/* Request Time Off Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-xs">
              <Plus className="size-4 shrink-0" />
              Request Time Off
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
              <DialogDescription>Submit your leave request for manager approval.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Leave Type</label>
                <Select value={formLeaveType} onValueChange={setFormLeaveType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Paid Time Off (PTO) — 18 days available</SelectItem>
                    <SelectItem value="sick">Sick Leave — 8 days available</SelectItem>
                    <SelectItem value="personal">Personal / Wellness Day — 3 days available</SelectItem>
                    <SelectItem value="volunteer">Volunteer & Compassionate — 2 days available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">Start Date</label>
                  <Input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">End Date</label>
                  <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Working Days</span>
                  <span className="font-semibold tabular-nums">
                    {calculatedDays} working days ({calculatedDays * 8} hrs)
                  </span>
                </div>
                <div className="text-muted-foreground mt-1.5 flex items-center justify-between text-xs">
                  <span>Remaining balance preview</span>
                  <span className="font-medium tabular-nums">{remainingAfterRequest} days remaining</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Notes & Coverage Plan</label>
                <Textarea
                  value={formNotes}
                  onValueChange={(v) => setFormNotes(v)}
                  placeholder="Mention project coverage or emergency contact details..."
                  className="min-h-[5rem]"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gap-1.5" onClick={handleSubmitRequest}>
                <Send className="size-3.5 shrink-0" />
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 4 PTO Balance Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ptoBalances.map((balance) => {
          const Icon = balance.icon
          return (
            <Card key={balance.id} className="shadow-xs">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-medium">{balance.name}</p>
                  <div className={cn('flex size-8 items-center justify-center rounded-md', balance.colorClass)}>
                    <Icon className="size-4 shrink-0" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight tabular-nums">{balance.available}</span>
                    <span className="text-muted-foreground text-xs">days available</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">{balance.subtext}</p>
                </div>

                <Progress value={balance.progress} className="h-1.5" />

                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Info className="size-3 shrink-0" />
                  <span className="truncate">{balance.note}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel: Month Calendar View & Leave Request Form */}
        <div className="space-y-6 lg:col-span-7">
          {/* Month Calendar View */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold">Leave & Out-of-Office Calendar</CardTitle>
                  <CardDescription className="text-xs">
                    Visual calendar of team availability, approved PTO, and public holidays.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon-sm" className="size-7 shrink-0">
                    <ChevronLeft className="size-3.5 shrink-0" />
                    <span className="sr-only">Previous month</span>
                  </Button>
                  <span className="px-2 text-xs font-semibold tabular-nums">{currentMonth}</span>
                  <Button variant="outline" size="icon-sm" className="size-7 shrink-0">
                    <ChevronRight className="size-3.5 shrink-0" />
                    <span className="sr-only">Next month</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Weekday Row */}
              <div className="text-muted-foreground grid grid-cols-7 text-center text-xs font-medium tracking-wider uppercase">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((cell) => (
                  <button
                    key={cell.dateKey}
                    type="button"
                    className={cn(
                      'focus-visible:ring-ring relative flex min-h-[4.25rem] flex-col justify-between rounded-md border p-1.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                      cell.inMonth ? 'bg-card' : 'bg-muted/20 text-muted-foreground/40 border-dashed',
                      selectedDate === cell.dateKey && 'ring-primary border-transparent ring-2',
                      cell.eventType === 'approved' &&
                        'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
                      cell.eventType === 'holiday' &&
                        'border-purple-500/30 bg-purple-500/10 text-purple-900 dark:text-purple-200',
                      cell.eventType === 'pending' &&
                        'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200',
                      cell.eventType === 'team' && 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-200',
                    )}
                    onClick={() => setSelectedDate(cell.dateKey)}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-xs font-medium tabular-nums',
                          cell.dateKey === '2026-09-14' &&
                            'bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          !cell.inMonth && 'text-muted-foreground/40',
                        )}
                      >
                        {cell.dayNumber}
                      </span>
                      {cell.eventType && (
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            cell.eventType === 'approved' && 'bg-emerald-500',
                            cell.eventType === 'holiday' && 'bg-purple-500',
                            cell.eventType === 'pending' && 'bg-amber-500',
                            cell.eventType === 'team' && 'bg-sky-500',
                          )}
                        />
                      )}
                    </div>

                    {cell.label && (
                      <div className="mt-1 truncate">
                        <span
                          className={cn(
                            'inline-block truncate rounded px-1 py-0.5 text-xs leading-none font-medium',
                            cell.eventType === 'approved' && 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
                            cell.eventType === 'holiday' && 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
                            cell.eventType === 'pending' && 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
                            cell.eventType === 'team' && 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
                          )}
                        >
                          {cell.label}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Calendar Legend */}
              <div className="border-border/60 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                  <span>Approved Leave</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 shrink-0 rounded-full bg-amber-500" />
                  <span>Pending Approval</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 shrink-0 rounded-full bg-purple-500" />
                  <span>Company Holiday</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 shrink-0 rounded-full bg-sky-500" />
                  <span>Team OOO</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Leave Request Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">New Leave Request</CardTitle>
                  <CardDescription className="text-xs">
                    Fill in your planned time off dates and submit for approval.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  18 PTO Days Left
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {formSubmitted && (
                <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-xs">
                    <p className="font-semibold">Leave request submitted successfully!</p>
                    <p className="mt-0.5 text-emerald-700/80 dark:text-emerald-300/80">
                      Your manager (Sarah Connor) has been notified for review.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Leave Category</label>
                <Select value={formLeaveType} onValueChange={setFormLeaveType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Paid Time Off (PTO) — 18 days available</SelectItem>
                    <SelectItem value="sick">Sick Leave — 8 days available</SelectItem>
                    <SelectItem value="personal">Personal / Wellness Day — 3 days available</SelectItem>
                    <SelectItem value="volunteer">Volunteer & Compassionate — 2 days available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">Start Date</label>
                  <Input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">End Date</label>
                  <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                </div>
              </div>

              <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground size-4 shrink-0" />
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold tabular-nums">
                    {calculatedDays} working days ({calculatedDays * 8} hrs)
                  </span>
                </div>
                <Badge variant="outline" className="text-xs tabular-nums">
                  {remainingAfterRequest} days remaining
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Notes & Coverage</label>
                <Textarea
                  value={formNotes}
                  onValueChange={(v) => setFormNotes(v)}
                  placeholder="Mention handover details or team coverage notes..."
                  className="min-h-[4.5rem]"
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-4">
              <Button variant="ghost" size="sm" onClick={handleResetForm}>
                Reset
              </Button>
              <Button size="sm" className="gap-1.5" onClick={handleSubmitRequest}>
                <Send className="size-3.5 shrink-0" />
                Submit Request
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Panel: Pending Approvals, Team OOO & Company Holidays */}
        <div className="space-y-6 lg:col-span-5">
          {/* Pending Approvals Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground size-4 shrink-0" />
                  <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  2 Awaiting Review
                </Badge>
              </div>
              <CardDescription className="text-xs">Direct report requests requiring your confirmation.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-muted/30 hover:bg-muted/50 rounded-lg border p-3.5 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {req.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm leading-none font-medium">{req.name}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{req.role}</p>
                      </div>
                    </div>
                    <Badge className={cn('text-xs capitalize', req.typeBadgeClass)}>{req.type}</Badge>
                  </div>

                  <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
                    <CalendarDays className="size-3.5 shrink-0" />
                    <span className="text-foreground font-medium">{req.dateRange}</span>
                    <span>·</span>
                    <span className="tabular-nums">{req.duration}</span>
                  </div>

                  <p className="text-muted-foreground/90 mt-1.5 text-xs italic">"{req.notes}"</p>

                  <div className="mt-3.5 flex items-center justify-end gap-2 border-t pt-2.5">
                    {req.status === 'pending' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => declineRequest(req.id)}
                        >
                          <X className="size-3 shrink-0" />
                          Decline
                        </Button>
                        <Button size="sm" className="h-7 text-xs" onClick={() => approveRequest(req.id)}>
                          <Check className="size-3 shrink-0" />
                          Approve
                        </Button>
                      </>
                    ) : req.status === 'approved' ? (
                      <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300">
                        <Check className="size-3 shrink-0" />
                        Approved by you
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1 text-xs">
                        <X className="size-3 shrink-0" />
                        Declined
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Team Out-Of-Office Widget */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-muted-foreground size-4 shrink-0" />
                <CardTitle className="text-base font-semibold">Team Out-Of-Office</CardTitle>
              </div>
              <CardDescription className="text-xs">Teammates away this week and upcoming.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {teamMembersOOO.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-foreground truncate font-medium">{member.name}</p>
                      <p className="text-muted-foreground truncate">{member.role}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <Badge className={cn('text-xs font-normal', member.typeClass)}>{member.type}</Badge>
                    <p className="text-muted-foreground mt-1 text-xs font-medium tabular-nums">{member.returnNote}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Company Holidays */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-muted-foreground size-4 shrink-0" />
                <CardTitle className="text-base font-semibold">Company Holidays</CardTitle>
              </div>
              <CardDescription className="text-xs">Paid corporate office closures in 2026–2027.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {companyHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors"
                >
                  <div>
                    <p className="text-foreground font-medium">{holiday.name}</p>
                    <p className="text-muted-foreground mt-0.5">{holiday.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-normal">
                    {holiday.duration}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
