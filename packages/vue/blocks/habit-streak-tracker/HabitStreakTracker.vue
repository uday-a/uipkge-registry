<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HTMLAttributes, Component } from 'vue'
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
} from 'lucide-vue-next'
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
  dayIndex: number // 0 = Mon, 6 = Sun
  weekIndex: number // 0 to 51
  count: number // 0 to 5
  level: number // 0 to 4
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
  class?: HTMLAttributes['class']
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

  const endDate = new Date(2026, 7, 23) // Sunday Aug 23, 2026
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

const props = withDefaults(defineProps<HabitStreakTrackerProps>(), {
  initialStreak: 24,
  longestStreak: '48 Days in Q2',
  consistencyRate: 94.2,
  activeHabitsCount: 5,
  monthTitle: 'August 2026',
})

const habitsList = ref<HabitItem[]>(JSON.parse(JSON.stringify(props.habits ?? defaultHabits)))
const activeCategory = ref<string>('All')
const showNewHabitModal = ref<boolean>(false)
const hoveredCell = ref<DayHeatmapCell | null>(null)

const newHabitTitle = ref('')
const newHabitDescription = ref('')
const newHabitCategory = ref<HabitCategory>('Engineering')
const newHabitIcon = ref('code')

const heatmapData = computed(() => generate52WeekHeatmap(props.initialStreak))

const weekDayColumns = [
  { short: 'Mon', num: '17' },
  { short: 'Tue', num: '18' },
  { short: 'Wed', num: '19' },
  { short: 'Thu', num: '20' },
  { short: 'Fri', num: '21' },
  { short: 'Sat', num: '22' },
  { short: 'Sun', num: '23' },
]

const categories = computed(() => {
  const cats = ['All']
  habitsList.value.forEach((h) => {
    if (!cats.includes(h.category)) cats.push(h.category)
  })
  return cats
})

const filteredHabits = computed(() => {
  if (activeCategory.value === 'All') return habitsList.value
  return habitsList.value.filter((h) => h.category === activeCategory.value)
})

const todayCompletedCount = computed(() => habitsList.value.filter((h) => h.weekHistory[6]).length)
const totalHabitsCount = computed(() => habitsList.value.length)

function getHabitIcon(icon: string): Component {
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

function toggleDay(habitId: string, dayIndex: number) {
  const habit = habitsList.value.find((h) => h.id === habitId)
  if (!habit) return
  habit.weekHistory[dayIndex] = !habit.weekHistory[dayIndex]
  const completedInWeek = habit.weekHistory.filter(Boolean).length
  habit.completionRate = Math.min(100, Math.round((completedInWeek / 7) * 100))
  if (dayIndex === 6) {
    if (habit.weekHistory[6]) {
      habit.streakDays += 1
    } else {
      habit.streakDays = Math.max(0, habit.streakDays - 1)
    }
  }
}

function toggleToday(habitId: string) {
  toggleDay(habitId, 6)
}

function handleAddHabit() {
  if (!newHabitTitle.value.trim()) return
  const newHabit: HabitItem = {
    id: `habit-${Date.now()}`,
    title: newHabitTitle.value.trim(),
    description: newHabitDescription.value.trim() || 'Daily tracked routine',
    category: newHabitCategory.value,
    icon: newHabitIcon.value,
    streakDays: 1,
    completionRate: 100,
    weekHistory: [false, false, false, false, false, false, true],
  }
  habitsList.value.push(newHabit)
  newHabitTitle.value = ''
  newHabitDescription.value = ''
  showNewHabitModal.value = false
}
</script>

<template>
  <div :class="cn('w-full space-y-6', props.class)" data-slot="habit-streak-tracker">
    <!-- Header Section -->
    <div
      class="border-border/80 bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-4 shadow-xs sm:p-5 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-start gap-3.5 sm:items-center">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 shadow-xs dark:text-amber-400"
        >
          <Flame class="size-5.5 animate-pulse" />
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="text-foreground text-base leading-none font-semibold tracking-tight sm:text-lg">
              Daily Habits & Consistency Matrix
            </h1>
            <Badge
              wrap
              variant="warning"
              class="gap-1 border-amber-500/30 bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-300"
            >
              <Flame class="size-3.5 fill-amber-500 text-amber-500" />
              <span class="font-mono tabular-nums">🔥 {{ props.initialStreak }}-Day Streak · Personal Best!</span>
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            {{ props.monthTitle }} · Real-time habit adherence, 52-week GitHub matrix, and routine tracker.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
        <div
          class="border-border/70 bg-muted/40 text-muted-foreground flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
        >
          <Calendar class="size-3.5" />
          <span>{{ props.monthTitle }}</span>
        </div>
        <Button
          aria-label="Close new habit dialog"
          size="sm"
          class="gap-1.5 shadow-xs"
          @click="showNewHabitModal = !showNewHabitModal"
        >
          <Plus class="size-4" />
          <span>New Habit</span>
        </Button>
      </div>
    </div>

    <!-- Quick Add Inline Card (Collapsible) -->
    <div
      v-if="showNewHabitModal"
      class="border-border/80 bg-card text-card-foreground space-y-3 rounded-xl border p-4 shadow-xs sm:p-5"
    >
      <div class="flex items-center justify-between">
        <div class="space-y-0.5">
          <p class="text-foreground text-sm font-semibold">Create New Habit Routine</p>
          <p class="text-muted-foreground text-xs">Define a daily target to track against your annual matrix.</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          class="size-7"
          aria-label="Close new habit dialog"
          @click="showNewHabitModal = false"
        >
          <X class="size-4" />
        </Button>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div class="sm:col-span-4">
          <label class="text-foreground mb-1 block text-xs font-medium">Habit Title</label>
          <input
            v-model="newHabitTitle"
            type="text"
            placeholder="e.g. Write 500 Words Technical Notes"
            class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
            @keydown.enter="handleAddHabit"
          />
        </div>

        <div class="sm:col-span-4">
          <label class="text-foreground mb-1 block text-xs font-medium">Description</label>
          <input
            v-model="newHabitDescription"
            type="text"
            placeholder="e.g. Daily engineering documentation"
            class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
            @keydown.enter="handleAddHabit"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="text-foreground mb-1 block text-xs font-medium">Category</label>
          <select
            v-model="newHabitCategory"
            class="border-border bg-background text-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="Engineering">Engineering</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
            <option value="Mindset">Mindset</option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="text-foreground mb-1 block text-xs font-medium">Icon</label>
          <select
            v-model="newHabitIcon"
            class="border-border bg-background text-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
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

      <div class="flex items-center justify-end gap-2 pt-1">
        <Button
          aria-label="Close new habit dialog"
          variant="ghost"
          size="sm"
          class="text-xs"
          @click="showNewHabitModal = false"
        >
          Cancel
        </Button>
        <Button size="sm" class="text-xs" :disabled="!newHabitTitle.trim()" @click="handleAddHabit">
          Add Routine
        </Button>
      </div>
    </div>

    <!-- 4 Streak Metric Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Current Streak -->
      <Card class="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Current Streak</span>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Flame class="size-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-1">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
              {{ props.initialStreak }} Days
            </span>
            <Badge wrap variant="warning" class="text-xs font-medium">Active</Badge>
          </div>
          <p class="text-muted-foreground text-xs">Active since Jul 29 · On track today</p>
        </CardContent>
      </Card>

      <!-- Card 2: Longest Streak -->
      <Card class="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Longest Streak</span>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-purple-500/25 bg-purple-500/10 text-purple-600 dark:text-purple-400"
            >
              <Trophy class="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-1">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
              {{ props.longestStreak }}
            </span>
            <Badge wrap variant="secondary" class="text-xs font-medium">Record</Badge>
          </div>
          <p class="text-muted-foreground text-xs">48 continuous days set May 14, 2026</p>
        </CardContent>
      </Card>

      <!-- Card 3: Overall Consistency -->
      <Card class="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Overall Consistency</span>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <TrendingUp class="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-1">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
              {{ props.consistencyRate }}%
            </span>
            <Badge wrap variant="success" class="text-xs font-medium">+3.1% MoM</Badge>
          </div>
          <p class="text-muted-foreground text-xs">{{ heatmapData.totalCompletions }} targets completed in 52 weeks</p>
        </CardContent>
      </Card>

      <!-- Card 4: Total Habits Active -->
      <Card class="border-border/80 bg-card text-card-foreground shadow-xs">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Total Habits Active</span>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <Target class="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-1 p-4 pt-1">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
              {{ totalHabitsCount }} Daily Habits
            </span>
            <Badge
              :variant="todayCompletedCount === totalHabitsCount ? 'success' : 'secondary'"
              class="text-xs font-medium whitespace-normal"
            >
              {{ todayCompletedCount }}/{{ totalHabitsCount }} Done
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            {{
              todayCompletedCount === totalHabitsCount
                ? 'All daily targets logged!'
                : `${totalHabitsCount - todayCompletedCount} remaining for today`
            }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- 52-Week Contribution Grid / Heatmap Matrix -->
    <Card class="border-border/80 bg-card text-card-foreground shadow-xs">
      <CardHeader class="p-4 pb-3 sm:p-5 sm:pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-sm font-semibold tracking-tight">52-Week Habit Consistency Matrix</CardTitle>
            <CardDescription class="text-xs">
              Annual contribution heatmap across all daily registered routines.
            </CardDescription>
          </div>

          <!-- Heatmap dynamic summary or hover inspector -->
          <div class="text-muted-foreground flex items-center gap-2 text-xs">
            <div
              v-if="hoveredCell"
              class="text-foreground bg-muted/60 border-border flex items-center gap-1.5 rounded-md border px-2 py-1 font-medium"
            >
              <span class="size-2 rounded-full bg-emerald-500" />
              <span>{{ hoveredCell.formattedDate }} · </span>
              <span class="font-mono font-semibold">{{ hoveredCell.count }}/5 habits</span>
              <span class="text-muted-foreground">({{ Math.round((hoveredCell.count / 5) * 100) }}%)</span>
            </div>
            <div v-else class="flex items-center gap-1.5">
              <Sparkles class="size-3.5 text-emerald-500" />
              <span class="text-foreground font-mono font-medium tabular-nums">{{ heatmapData.totalCompletions }}</span>
              <span>completions logged</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-4 p-4 pt-1 sm:p-5 sm:pt-1">
        <!-- Scrollable Heatmap Viewport -->
        <div class="overflow-x-auto pb-2">
          <div class="max-w-[740px] min-w-full space-y-1.5">
            <!-- Month Labels Top Row -->
            <div class="text-muted-foreground flex pl-8 text-xs font-medium select-none">
              <div
                v-for="label in heatmapData.monthLabels"
                :key="label.name + label.weekIndex"
                class="truncate"
                :style="{ width: `${(52 / 12) * 13.8}px` }"
              >
                {{ label.name }}
              </div>
            </div>

            <!-- Matrix Rows with Day Labels on Left -->
            <div class="flex gap-2">
              <!-- Left Day-of-week labels -->
              <div
                class="text-muted-foreground flex w-6 shrink-0 flex-col justify-between py-[1px] text-xs font-medium select-none"
              >
                <span>Mon</span>
                <span class="opacity-0">Tue</span>
                <span>Wed</span>
                <span class="opacity-0">Thu</span>
                <span>Fri</span>
                <span class="opacity-0">Sat</span>
                <span>Sun</span>
              </div>

              <!-- 52 Columns Grid -->
              <div class="flex flex-1 gap-[3px]">
                <div v-for="(week, wIdx) in heatmapData.weeks" :key="wIdx" class="flex flex-1 flex-col gap-[3px]">
                  <button
                    v-for="cell in week"
                    :key="cell.date"
                    type="button"
                    :aria-label="`${cell.formattedDate}: ${cell.count} habits completed`"
                    :title="`${cell.formattedDate}: ${cell.count} habits completed`"
                    :class="[
                      'size-3 cursor-pointer rounded-[2px] transition-all duration-150 sm:size-3.5',
                      levelClassMap[cell.level],
                    ]"
                    @mouseenter="hoveredCell = cell"
                    @mouseleave="hoveredCell = null"
                    @focus="hoveredCell = cell"
                    @blur="hoveredCell = null"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap Footer: Legend & Summary -->
        <div
          class="border-border/50 text-muted-foreground flex flex-col gap-2 border-t pt-3 text-xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-1.5">
            <span class="text-foreground font-mono font-semibold tabular-nums">94.2%</span>
            <span>consistency baseline · 52 continuous weeks tracked</span>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span>Less</span>
            <div class="flex gap-1">
              <span
                class="bg-muted/60 dark:bg-muted/30 border-border/40 size-3 rounded-[2px] border"
                title="0 habits"
              />
              <span class="size-3 rounded-[2px] border border-emerald-500/20 bg-emerald-500/25" title="1-2 habits" />
              <span class="size-3 rounded-[2px] border border-emerald-500/30 bg-emerald-500/50" title="3 habits" />
              <span class="size-3 rounded-[2px] border border-emerald-500/40 bg-emerald-500/75" title="4 habits" />
              <span class="size-3 rounded-[2px] border border-emerald-400/60 bg-emerald-500" title="5 habits" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Daily Habits Checklist Table Section -->
    <Card class="border-border/80 bg-card text-card-foreground shadow-xs">
      <CardHeader class="p-4 pb-3 sm:p-5 sm:pb-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <CardTitle class="text-sm font-semibold tracking-tight">Today's Habit Checklist</CardTitle>
            <CardDescription class="text-xs">
              Interactive 7-day strip. Mark today or previous days to maintain your active flame streaks.
            </CardDescription>
          </div>

          <!-- Category Filter Pills -->
          <div class="flex flex-wrap items-center gap-1.5">
            <Button
              v-for="cat in categories"
              :key="cat"
              :variant="activeCategory === cat ? 'default' : 'ghost'"
              size="sm"
              class="h-7 px-2.5 text-xs font-medium"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="divide-border/60 divide-y">
          <div
            v-for="habit in filteredHabits"
            :key="habit.id"
            class="hover:bg-muted/20 flex flex-col gap-4 p-4 transition-colors sm:p-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <!-- Col 1: Habit Details -->
            <div class="flex items-start gap-3 lg:w-1/3">
              <div
                class="bg-muted text-muted-foreground border-border/60 flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              >
                <component :is="getHabitIcon(habit.icon)" class="size-4.5" />
              </div>
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-foreground text-sm leading-none font-semibold">{{ habit.title }}</p>
                  <Badge wrap :class="cn('border text-xs font-medium', getCategoryBadgeClass(habit.category))">
                    {{ habit.category }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs">{{ habit.description }}</p>
              </div>
            </div>

            <!-- Col 2: Streak Metric -->
            <div class="flex items-center gap-2 lg:w-28">
              <div
                class="flex size-6.5 shrink-0 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              >
                <Flame class="size-3.5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p class="text-foreground font-mono text-xs font-bold tabular-nums">{{ habit.streakDays }}d streak</p>
                <p class="text-muted-foreground text-xs">unbroken</p>
              </div>
            </div>

            <!-- Col 3: 7-Day Mini Checkbox Strip -->
            <div class="space-y-1 lg:w-56">
              <div class="text-muted-foreground flex items-center justify-between px-0.5 text-xs font-medium">
                <span
                  v-for="(day, dIdx) in weekDayColumns"
                  :key="dIdx"
                  :class="cn('w-6 text-center', dIdx === 6 && 'text-foreground font-semibold')"
                >
                  {{ day.short[0] }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-1">
                <button
                  v-for="(day, dIdx) in weekDayColumns"
                  :key="dIdx"
                  type="button"
                  :aria-label="`${habit.title} on ${day.short}: ${habit.weekHistory[dIdx] ? 'Completed' : 'Incomplete'}`"
                  :class="[
                    'focus-visible:ring-ring flex size-6 cursor-pointer items-center justify-center rounded-md text-xs transition-all focus-visible:ring-2 focus-visible:outline-none',
                    habit.weekHistory[dIdx]
                      ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
                      : 'border-border/80 bg-muted/40 text-muted-foreground/30 hover:bg-muted/80 hover:text-muted-foreground border',
                    dIdx === 6 && !habit.weekHistory[dIdx] && 'border-amber-500/50 bg-amber-500/5',
                  ]"
                  @click="toggleDay(habit.id, dIdx)"
                >
                  <Check v-if="habit.weekHistory[dIdx]" class="size-3.5 stroke-[2.5]" />
                  <span v-else class="text-xs">{{ day.num }}</span>
                </button>
              </div>
            </div>

            <!-- Col 4: Completion Rate Progress -->
            <div class="space-y-1.5 lg:w-36">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Rate</span>
                <span class="text-foreground font-mono font-semibold tabular-nums">{{ habit.completionRate }}%</span>
              </div>
              <Progress :model-value="habit.completionRate" class="h-1.5" />
            </div>

            <!-- Col 5: Action Button -->
            <div class="flex items-center justify-end lg:w-32">
              <Button
                v-if="habit.weekHistory[6]"
                variant="outline"
                size="sm"
                class="h-8 w-full gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 shadow-xs hover:bg-emerald-500/20 sm:w-auto dark:text-emerald-400"
                @click="toggleToday(habit.id)"
              >
                <CheckCircle2 class="size-3.5 text-emerald-500" />
                <span>Done Today</span>
              </Button>
              <Button
                v-else
                variant="default"
                size="sm"
                class="h-8 w-full gap-1.5 text-xs font-medium shadow-xs sm:w-auto"
                @click="toggleToday(habit.id)"
              >
                <Check class="size-3.5" />
                <span>Check Today</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
