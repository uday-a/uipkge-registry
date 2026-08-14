'use client'

import * as React from 'react'
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Code2,
  Droplets,
  Flame,
  Footprints,
  Plus,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Trophy,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export type HabitCategory = 'Engineering' | 'Health' | 'Learning' | 'Mindset' | string

export interface HabitItem {
  id: string
  title: string
  description: string
  category: HabitCategory
  icon: 'code' | 'terminal' | 'steps' | 'book' | 'water' | 'sparkles' | string
  streakDays: number
  completionRate: number
  weekHistory: boolean[] // 7 days: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
}

export interface DayHeatmapCell {
  date: string
  formattedDate: string
  dayName: string
  dayIndex: number
  weekIndex: number
  count: number
  level: number
  month: string
}

export interface MonthLabel {
  name: string
  weekIndex: number
}

export interface HabitStreakTrackerProps {
  initialStreak?: number
  longestStreak?: string
  consistencyRate?: number
  activeHabitsCount?: number
  monthTitle?: string
  habits?: HabitItem[]
  className?: string
}

const defaultHabits: HabitItem[] = [
  {
    id: 'habit-1',
    title: 'Ship 1 Component to Registry',
    description: 'Author, test, and register a new UI block or primitive',
    category: 'Engineering',
    icon: 'code',
    streakDays: 24,
    completionRate: 96,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: 'habit-2',
    title: '1 Hour Deep Work / Code Review',
    description: 'Uninterrupted architecture focus & PR review rounds',
    category: 'Engineering',
    icon: 'terminal',
    streakDays: 19,
    completionRate: 92,
    weekHistory: [true, true, true, true, true, false, true],
  },
  {
    id: 'habit-3',
    title: '10,000 Steps Walking',
    description: 'Daily outdoor walk & cardiovascular activity',
    category: 'Health',
    icon: 'steps',
    streakDays: 24,
    completionRate: 100,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: 'habit-4',
    title: 'Read 20 Pages Tech Book',
    description: 'Systems design, TypeScript craft, or CS fundamentals',
    category: 'Learning',
    icon: 'book',
    streakDays: 12,
    completionRate: 85,
    weekHistory: [true, true, false, true, true, true, false],
  },
  {
    id: 'habit-5',
    title: 'Drink 2.5L Water',
    description: 'Optimal hydration tracking throughout the working day',
    category: 'Health',
    icon: 'water',
    streakDays: 30,
    completionRate: 98,
    weekHistory: [true, true, true, true, true, true, true],
  },
]

function generate52WeekHeatmap(baseStreakDays: number = 24): {
  weeks: DayHeatmapCell[][]
  monthLabels: MonthLabel[]
  totalCompletions: number
} {
  const weeks: DayHeatmapCell[][] = []
  const monthLabels: MonthLabel[] = []
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const endDate = new Date(2026, 7, 23)
  let lastMonth = ''
  let totalCompletions = 0

  let seed = 1337
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let w = 0; w < 52; w++) {
    const weekDays: DayHeatmapCell[] = []
    for (let d = 0; d < 7; d++) {
      const daysAgo = (51 - w) * 7 + (6 - d)
      const dateObj = new Date(endDate)
      dateObj.setDate(endDate.getDate() - daysAgo)

      const monthName = months[dateObj.getMonth()]
      const formattedDate = `${monthName} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
      const dateStr = dateObj.toISOString().split('T')[0]

      let count = 0
      if (daysAgo <= baseStreakDays && daysAgo >= 0) {
        count = pseudoRandom() > 0.3 ? 5 : 4
      } else if (daysAgo >= 90 && daysAgo <= 138) {
        count = pseudoRandom() > 0.2 ? 5 : 4
      } else {
        const rand = pseudoRandom()
        if (rand > 0.82) count = 5
        else if (rand > 0.48) count = 4
        else if (rand > 0.22) count = 3
        else if (rand > 0.08) count = 2
        else if (rand > 0.03) count = 1
        else count = 0
      }

      totalCompletions += count

      let level = 0
      if (count >= 5) level = 4
      else if (count === 4) level = 3
      else if (count === 3) level = 2
      else if (count >= 1) level = 1
      else level = 0

      const cell: DayHeatmapCell = {
        date: dateStr,
        formattedDate,
        dayName: dayNames[d],
        dayIndex: d,
        weekIndex: w,
        count,
        level,
        month: monthName,
      }

      weekDays.push(cell)

      if (d === 0 && monthName !== lastMonth) {
        monthLabels.push({ name: monthName, weekIndex: w })
        lastMonth = monthName
      }
    }
    weeks.push(weekDays)
  }

  return { weeks, monthLabels, totalCompletions }
}

const weekDayColumns = [
  { short: 'Mon', num: '17' },
  { short: 'Tue', num: '18' },
  { short: 'Wed', num: '19' },
  { short: 'Thu', num: '20' },
  { short: 'Fri', num: '21' },
  { short: 'Sat', num: '22' },
  { short: 'Sun', num: '23' },
]

function getHabitIcon(icon: string): React.ComponentType<{ className?: string }> {
  switch (icon) {
    case 'code':
      return Code2
    case 'terminal':
      return Terminal
    case 'steps':
      return Footprints
    case 'book':
      return BookOpen
    case 'water':
      return Droplets
    default:
      return Sparkles
  }
}

function getCategoryBadgeClass(category: HabitCategory) {
  switch (category) {
    case 'Engineering':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25'
    case 'Health':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
    case 'Learning':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25'
    case 'Mindset':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

const levelClassMap: Record<number, string> = {
  0: 'bg-muted/60 dark:bg-muted/30 border border-border/30 hover:ring-1 hover:ring-foreground/20',
  1: 'bg-emerald-500/25 dark:bg-emerald-500/30 border border-emerald-500/20 hover:ring-1 hover:ring-emerald-500/50',
  2: 'bg-emerald-500/50 dark:bg-emerald-500/60 border border-emerald-500/30 hover:ring-1 hover:ring-emerald-500/70',
  3: 'bg-emerald-500/75 dark:bg-emerald-500/80 border border-emerald-500/40 hover:ring-1 hover:ring-emerald-500/90',
  4: 'bg-emerald-500 dark:bg-emerald-400 border border-emerald-400/60 hover:ring-1 hover:ring-emerald-300',
}

export function HabitStreakTracker({
  initialStreak = 24,
  longestStreak = '48 Days in Q2',
  consistencyRate = 94.2,
  activeHabitsCount = 5,
  monthTitle = 'August 2026',
  habits = defaultHabits,
  className,
}: HabitStreakTrackerProps) {
  const [habitsList, setHabitsList] = React.useState<HabitItem[]>(() => JSON.parse(JSON.stringify(habits)))
  const [activeCategory, setActiveCategory] = React.useState<string>('All')
  const [showNewHabitModal, setShowNewHabitModal] = React.useState<boolean>(false)
  const [hoveredCell, setHoveredCell] = React.useState<DayHeatmapCell | null>(null)

  const [newHabitTitle, setNewHabitTitle] = React.useState('')
  const [newHabitDescription, setNewHabitDescription] = React.useState('')
  const [newHabitCategory, setNewHabitCategory] = React.useState<HabitCategory>('Engineering')
  const [newHabitIcon, setNewHabitIcon] = React.useState('code')

  const heatmapData = React.useMemo(() => generate52WeekHeatmap(initialStreak), [initialStreak])

  const categories = React.useMemo(() => {
    const cats = ['All']
    habitsList.forEach((h) => {
      if (!cats.includes(h.category)) cats.push(h.category)
    })
    return cats
  }, [habitsList])

  const filteredHabits = React.useMemo(() => {
    if (activeCategory === 'All') return habitsList
    return habitsList.filter((h) => h.category === activeCategory)
  }, [habitsList, activeCategory])

  const todayCompletedCount = habitsList.filter((h) => h.weekHistory[6]).length
  const totalHabitsCount = habitsList.length

  const toggleDay = (habitId: string, dayIndex: number) => {
    setHabitsList((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit
        const nextWeekHistory = [...habit.weekHistory]
        nextWeekHistory[dayIndex] = !nextWeekHistory[dayIndex]
        const completedInWeek = nextWeekHistory.filter(Boolean).length
        const completionRate = Math.min(100, Math.round((completedInWeek / 7) * 100))
        let streakDays = habit.streakDays
        if (dayIndex === 6) {
          streakDays = nextWeekHistory[6] ? streakDays + 1 : Math.max(0, streakDays - 1)
        }
        return {
          ...habit,
          weekHistory: nextWeekHistory,
          completionRate,
          streakDays,
        }
      }),
    )
  }

  const toggleToday = (habitId: string) => {
    toggleDay(habitId, 6)
  }

  const handleAddHabit = () => {
    if (!newHabitTitle.trim()) return
    const newHabit: HabitItem = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle.trim(),
      description: newHabitDescription.trim() || 'Daily tracked routine',
      category: newHabitCategory,
      icon: newHabitIcon,
      streakDays: 1,
      completionRate: 100,
      weekHistory: [false, false, false, false, false, false, true],
    }
    setHabitsList((prev) => [...prev, newHabit])
    setNewHabitTitle('')
    setNewHabitDescription('')
    setShowNewHabitModal(false)
  }

  return (
    <div className={cn('w-full space-y-6', className)} data-slot="habit-streak-tracker">
      {/* Header Section */}
      <div className="border-border/80 bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-4 shadow-xs sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5 sm:items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 shadow-xs dark:text-amber-400">
            <Flame className="size-5.5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-base leading-none font-semibold tracking-tight sm:text-lg">
                Daily Habits & Consistency Matrix
              </h1>
              <Badge
                wrap
                variant="warning"
                className="gap-1 border-amber-500/30 bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-300"
              >
                <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                <span className="font-mono tabular-nums">🔥 {initialStreak}-Day Streak · Personal Best!</span>
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {monthTitle} · Real-time habit adherence, 52-week GitHub matrix, and routine tracker.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          <div className="border-border/70 bg-muted/40 text-muted-foreground flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium">
            <Calendar className="size-3.5" />
            <span>{monthTitle}</span>
          </div>
          <Button
            aria-label="Close new habit dialog"
            size="sm"
            className="gap-1.5 shadow-xs"
            onClick={() => setShowNewHabitModal(!showNewHabitModal)}
          >
            <Plus className="size-4" />
            <span>New Habit</span>
          </Button>
        </div>
      </div>

      {/* Quick Add Inline Card (Collapsible) */}
      {showNewHabitModal && (
        <div className="border-border/80 bg-card text-card-foreground space-y-3 rounded-xl border p-4 shadow-xs sm:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-foreground text-sm font-semibold">Create New Habit Routine</p>
              <p className="text-muted-foreground text-xs">
                Define a daily target to track against your annual matrix.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7"
              aria-label="Close new habit dialog"
              onClick={() => setShowNewHabitModal(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <label className="text-foreground mb-1 block text-xs font-medium">Habit Title</label>
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder="e.g. Write 500 Words Technical Notes"
                className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddHabit()
                }}
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-foreground mb-1 block text-xs font-medium">Description</label>
              <input
                type="text"
                value={newHabitDescription}
                onChange={(e) => setNewHabitDescription(e.target.value)}
                placeholder="e.g. Daily engineering documentation"
                className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddHabit()
                }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-foreground mb-1 block text-xs font-medium">Category</label>
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value as HabitCategory)}
                className="border-border bg-background text-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
                <option value="Mindset">Mindset</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-foreground mb-1 block text-xs font-medium">Icon</label>
              <select
                value={newHabitIcon}
                onChange={(e) => setNewHabitIcon(e.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value="code">Code</option>
                <option value="terminal">Terminal</option>
                <option value="steps">Steps</option>
                <option value="book">Book</option>
                <option value="water">Water</option>
                <option value="sparkles">Sparkles</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              aria-label="Close new habit dialog"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setShowNewHabitModal(false)}
            >
              Cancel
            </Button>
            <Button size="sm" className="text-xs" disabled={!newHabitTitle.trim()} onClick={handleAddHabit}>
              Add Routine
            </Button>
          </div>
        </div>
      )}

      {/* 4 Streak Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Current Streak */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Current Streak</span>
              <div className="flex size-7 items-center justify-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame className="size-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                {initialStreak} Days
              </span>
              <Badge wrap variant="warning" className="text-xs font-medium">
                Active
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">Active since Jul 29 · On track today</p>
          </CardContent>
        </Card>

        {/* Card 2: Longest Streak */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Longest Streak</span>
              <div className="flex size-7 items-center justify-center rounded-md border border-purple-500/25 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Trophy className="size-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                {longestStreak}
              </span>
              <Badge wrap variant="secondary" className="text-xs font-medium">
                Record
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">48 continuous days set May 14, 2026</p>
          </CardContent>
        </Card>

        {/* Card 3: Overall Consistency */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Overall Consistency</span>
              <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                {consistencyRate}%
              </span>
              <Badge wrap variant="success" className="text-xs font-medium">
                +3.1% MoM
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {heatmapData.totalCompletions} targets completed in 52 weeks
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Total Habits Active */}
        <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Total Habits Active</span>
              <div className="flex size-7 items-center justify-center rounded-md border border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Target className="size-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                {totalHabitsCount} Daily Habits
              </span>
              <Badge
                wrap
                variant={todayCompletedCount === totalHabitsCount ? 'success' : 'secondary'}
                className="text-xs font-medium"
              >
                {todayCompletedCount}/{totalHabitsCount} Done
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {todayCompletedCount === totalHabitsCount
                ? 'All daily targets logged!'
                : `${totalHabitsCount - todayCompletedCount} remaining for today`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 52-Week Contribution Grid / Heatmap Matrix */}
      <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">52-Week Habit Consistency Matrix</CardTitle>
              <CardDescription className="text-xs">
                Annual contribution heatmap across all daily registered routines.
              </CardDescription>
            </div>

            {/* Heatmap dynamic summary or hover inspector */}
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              {hoveredCell ? (
                <div className="text-foreground bg-muted/60 border-border flex items-center gap-1.5 rounded-md border px-2 py-1 font-medium">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>{hoveredCell.formattedDate} · </span>
                  <span className="font-mono font-semibold">{hoveredCell.count}/5 habits</span>
                  <span className="text-muted-foreground">({Math.round((hoveredCell.count / 5) * 100)}%)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-500" />
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {heatmapData.totalCompletions}
                  </span>
                  <span>completions logged</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4 pt-1 sm:p-5 sm:pt-1">
          {/* Scrollable Heatmap Viewport */}
          <div className="overflow-x-auto pb-2">
            <div className="max-w-[740px] min-w-full space-y-1.5">
              {/* Month Labels Top Row */}
              <div className="text-muted-foreground flex pl-8 text-xs font-medium select-none">
                {heatmapData.monthLabels.map((label) => (
                  <div
                    key={`${label.name}-${label.weekIndex}`}
                    className="truncate"
                    style={{ width: `${(52 / 12) * 13.8}px` }}
                  >
                    {label.name}
                  </div>
                ))}
              </div>

              {/* Matrix Rows with Day Labels on Left */}
              <div className="flex gap-2">
                {/* Left Day-of-week labels */}
                <div className="text-muted-foreground flex w-6 shrink-0 flex-col justify-between py-[1px] text-xs font-medium select-none">
                  <span>Mon</span>
                  <span className="opacity-0">Tue</span>
                  <span>Wed</span>
                  <span className="opacity-0">Thu</span>
                  <span>Fri</span>
                  <span className="opacity-0">Sat</span>
                  <span>Sun</span>
                </div>

                {/* 52 Columns Grid */}
                <div className="flex flex-1 gap-[3px]">
                  {heatmapData.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-1 flex-col gap-[3px]">
                      {week.map((cell) => (
                        <button
                          key={cell.date}
                          type="button"
                          aria-label={`${cell.formattedDate}: ${cell.count} habits completed`}
                          title={`${cell.formattedDate}: ${cell.count} habits completed`}
                          className={cn(
                            'size-3 cursor-pointer rounded-[2px] transition-all duration-150 sm:size-3.5',
                            levelClassMap[cell.level],
                          )}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onFocus={() => setHoveredCell(cell)}
                          onBlur={() => setHoveredCell(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Footer: Legend & Summary */}
          <div className="border-border/50 text-muted-foreground flex flex-col gap-2 border-t pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground font-mono font-semibold tabular-nums">94.2%</span>
              <span>consistency baseline · 52 continuous weeks tracked</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span>Less</span>
              <div className="flex gap-1">
                <span
                  className="bg-muted/60 dark:bg-muted/30 border-border/40 size-3 rounded-[2px] border"
                  title="0 habits"
                />
                <span
                  className="size-3 rounded-[2px] border border-emerald-500/20 bg-emerald-500/25"
                  title="1-2 habits"
                />
                <span
                  className="size-3 rounded-[2px] border border-emerald-500/30 bg-emerald-500/50"
                  title="3 habits"
                />
                <span
                  className="size-3 rounded-[2px] border border-emerald-500/40 bg-emerald-500/75"
                  title="4 habits"
                />
                <span className="size-3 rounded-[2px] border border-emerald-400/60 bg-emerald-500" title="5 habits" />
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Habits Checklist Table Section */}
      <Card className="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold tracking-tight">Today's Habit Checklist</CardTitle>
              <CardDescription className="text-xs">
                Interactive 7-day strip. Mark today or previous days to maintain your active flame streaks.
              </CardDescription>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-2.5 text-xs font-medium"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-border/60 divide-y">
            {filteredHabits.map((habit) => {
              const HabitIcon = getHabitIcon(habit.icon)
              return (
                <div
                  key={habit.id}
                  className="hover:bg-muted/20 flex flex-col gap-4 p-4 transition-colors sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* Col 1: Habit Details */}
                  <div className="flex items-start gap-3 lg:w-1/3">
                    <div className="bg-muted text-muted-foreground border-border/60 flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                      <HabitIcon className="size-4.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-foreground text-sm leading-none font-semibold">{habit.title}</p>
                        <Badge className={cn('border text-xs font-medium', getCategoryBadgeClass(habit.category))}>
                          {habit.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">{habit.description}</p>
                    </div>
                  </div>

                  {/* Col 2: Streak Metric */}
                  <div className="flex items-center gap-2 lg:w-28">
                    <div className="flex size-6.5 shrink-0 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-foreground font-mono text-xs font-bold tabular-nums">
                        {habit.streakDays}d streak
                      </p>
                      <p className="text-muted-foreground text-xs">unbroken</p>
                    </div>
                  </div>

                  {/* Col 3: 7-Day Mini Checkbox Strip */}
                  <div className="space-y-1 lg:w-56">
                    <div className="text-muted-foreground flex items-center justify-between px-0.5 text-xs font-medium">
                      {weekDayColumns.map((day, dIdx) => (
                        <span
                          key={dIdx}
                          className={cn('w-6 text-center', dIdx === 6 && 'text-foreground font-semibold')}
                        >
                          {day.short[0]}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      {weekDayColumns.map((day, dIdx) => (
                        <button
                          key={dIdx}
                          type="button"
                          aria-label={`${habit.title} on ${day.short}: ${habit.weekHistory[dIdx] ? 'Completed' : 'Incomplete'}`}
                          className={cn(
                            'focus-visible:ring-ring flex size-6 cursor-pointer items-center justify-center rounded-md text-xs transition-all focus-visible:ring-2 focus-visible:outline-none',
                            habit.weekHistory[dIdx]
                              ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
                              : 'border-border/80 bg-muted/40 text-muted-foreground/30 hover:bg-muted/80 hover:text-muted-foreground border',
                            dIdx === 6 && !habit.weekHistory[dIdx] && 'border-amber-500/50 bg-amber-500/5',
                          )}
                          onClick={() => toggleDay(habit.id, dIdx)}
                        >
                          {habit.weekHistory[dIdx] ? (
                            <Check className="size-3.5 stroke-[2.5]" />
                          ) : (
                            <span className="text-xs">{day.num}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 4: Completion Rate Progress */}
                  <div className="space-y-1.5 lg:w-36">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="text-foreground font-mono font-semibold tabular-nums">
                        {habit.completionRate}%
                      </span>
                    </div>
                    <Progress value={habit.completionRate} className="h-1.5" />
                  </div>

                  {/* Col 5: Action Button */}
                  <div className="flex items-center justify-end lg:w-32">
                    {habit.weekHistory[6] ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 shadow-xs hover:bg-emerald-500/20 sm:w-auto dark:text-emerald-400"
                        onClick={() => toggleToday(habit.id)}
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        <span>Done Today</span>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 w-full gap-1.5 text-xs font-medium shadow-xs sm:w-auto"
                        onClick={() => toggleToday(habit.id)}
                      >
                        <Check className="size-3.5" />
                        <span>Check Today</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
