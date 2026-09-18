<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { HTMLAttributes } from 'vue'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { CalendarView, CalendarCategory, CalendarEvent, TimeClickPayload, PositionedEvent } from './types'
import {
  parseDate,
  formatDateKey,
  formatTime,
  formatHourLabel,
  isSameDay,
  isToday,
  getMonthDays,
  getWeekDays,
  getWorkWeekDays,
  calculateTimedEventPositions,
  getCurrentTimePosition,
  getEventMinutes,
} from './date-utils'
import { calendarEventVariants } from './event-calendar.variants'

interface Props {
  modelValue?: string | Date
  view?: CalendarView
  events?: CalendarEvent[]
  categories?: (string | CalendarCategory)[]
  weekStartsOn?: 0 | 1
  firstInterval?: number
  intervalCount?: number
  intervalMinutes?: number
  intervalHeight?: number
  timeFormat?: '12h' | '24h'
  maxEventsPerDay?: number
  showNowIndicator?: boolean
  showHeader?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => new Date(),
  view: 'month',
  events: () => [],
  categories: () => [],
  weekStartsOn: 0,
  firstInterval: 0,
  intervalCount: 24,
  intervalMinutes: 60,
  intervalHeight: 52,
  timeFormat: '12h',
  maxEventsPerDay: 3,
  showNowIndicator: true,
  showHeader: true,
})

const emit = defineEmits<{
  'update:modelValue': [date: Date]
  'update:view': [view: CalendarView]
  'click:event': [event: CalendarEvent]
  'click:date': [date: string]
  'click:time': [payload: TimeClickPayload]
  'click:more': [payload: { date: string; events: CalendarEvent[] }]
}>()

// Active date cursor
const activeDate = computed(() => parseDate(props.modelValue))

function setDate(d: Date) {
  emit('update:modelValue', d)
}

function setView(v: CalendarView) {
  emit('update:view', v)
}

// Normalized categories
const normalizedCategories = computed<CalendarCategory[]>(() => {
  return props.categories.map((c, idx) => {
    if (typeof c === 'string') {
      return { id: c, name: c }
    }
    return { id: c.id || `cat-${idx}`, name: c.name || `Category ${idx + 1}`, color: c.color }
  })
})

// Current time line update timer
const nowPosition = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

function updateNow() {
  if (!props.showNowIndicator) {
    nowPosition.value = null
    return
  }
  nowPosition.value = getCurrentTimePosition(props.firstInterval, props.intervalCount, props.intervalMinutes)
}

onMounted(() => {
  updateNow()
  timer = setInterval(updateNow, 30000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// Navigation controls
function handlePrev() {
  const d = new Date(activeDate.value)
  if (props.view === 'month') {
    d.setMonth(d.getMonth() - 1)
  } else if (props.view === 'week') {
    d.setDate(d.getDate() - 7)
  } else if (props.view === 'work-week') {
    d.setDate(d.getDate() - 7)
  } else if (props.view === 'day' || props.view === 'category') {
    d.setDate(d.getDate() - 1)
  }
  setDate(d)
}

function handleNext() {
  const d = new Date(activeDate.value)
  if (props.view === 'month') {
    d.setMonth(d.getMonth() + 1)
  } else if (props.view === 'week') {
    d.setDate(d.getDate() + 7)
  } else if (props.view === 'work-week') {
    d.setDate(d.getDate() + 7)
  } else if (props.view === 'day' || props.view === 'category') {
    d.setDate(d.getDate() + 1)
  }
  setDate(d)
}

function handleToday() {
  setDate(new Date())
}

// Header title calculation
const formattedTitle = computed(() => {
  const d = activeDate.value
  if (props.view === 'month') {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  if (props.view === 'week') {
    const days = getWeekDays(d, props.weekStartsOn)
    const first = days[0]
    const last = days[6]
    if (first.getMonth() === last.getMonth()) {
      return `${first.toLocaleDateString('en-US', { month: 'short' })} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`
    }
    return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  if (props.view === 'work-week') {
    const days = getWorkWeekDays(d)
    const first = days[0]
    const last = days[4]
    return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  // day / category
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
})

// Month View Data
const monthDays = computed(() => getMonthDays(activeDate.value, props.weekStartsOn))

function getEventsForDay(dateKey: string): CalendarEvent[] {
  return props.events.filter((e) => {
    const startStr =
      typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
        ? e.start.slice(0, 10)
        : formatDateKey(parseDate(e.start))
    return startStr === dateKey
  })
}

// Interval array for time grid
const intervals = computed(() => {
  const list: { hour: number; label: string; time: string }[] = []
  for (let i = 0; i < props.intervalCount; i++) {
    const hour = (props.firstInterval + Math.floor((i * props.intervalMinutes) / 60)) % 24
    const min = (i * props.intervalMinutes) % 60
    const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    const label = min === 0 ? formatHourLabel(hour, props.timeFormat) : ''
    list.push({ hour, label, time })
  }
  return list
})

// Week Days
const weekDays = computed(() => getWeekDays(activeDate.value, props.weekStartsOn))
// Work Week Days
const workWeekDays = computed(() => getWorkWeekDays(activeDate.value))

// All day events for a day
function getAllDayEventsForDay(dayDate: Date): CalendarEvent[] {
  const dayKey = formatDateKey(dayDate)
  return props.events.filter((e) => {
    if (!e.allDay) return false
    const sKey =
      typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
        ? e.start.slice(0, 10)
        : formatDateKey(parseDate(e.start))
    return sKey === dayKey
  })
}

// Day header formatters
const weekdayHeaderLabels = computed(() => {
  if (props.weekStartsOn === 1) {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
})

function getEventVariant(event: CalendarEvent): any {
  if (
    event.color === 'primary' ||
    event.color === 'secondary' ||
    event.color === 'success' ||
    event.color === 'warning' ||
    event.color === 'destructive' ||
    event.color === 'info' ||
    event.color === 'purple' ||
    event.color === 'rose'
  ) {
    return event.color
  }
  return 'default'
}

function handleEventClick(event: CalendarEvent, evt: MouseEvent) {
  evt.stopPropagation()
  emit('click:event', event)
}

function handleDateClick(dateKey: string) {
  emit('click:date', dateKey)
}

function handleTimeClick(dayDate: Date, hour: number, minute: number, category?: string) {
  const dateStr = formatDateKey(dayDate)
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  emit('click:time', {
    date: dateStr,
    time: timeStr,
    hour,
    minute,
    category,
  })
}

function handleMoreClick(dateKey: string, events: CalendarEvent[], evt: MouseEvent) {
  evt.stopPropagation()
  emit('click:more', { date: dateKey, events })
}
</script>

<template>
  <div
    data-slot="event-calendar"
    :class="
      cn(
        'border-border bg-card text-foreground flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
        props.class,
      )
    "
  >
    <!-- Built-in Header Toolbar -->
    <slot
      v-if="showHeader"
      name="header"
      :current-date="activeDate"
      :view="view"
      :title="formattedTitle"
      :prev="handlePrev"
      :next="handleNext"
      :today="handleToday"
      :set-view="setView"
    >
      <header
        class="border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xs"
      >
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="h-8 px-2.5 text-xs font-medium" @click="handleToday">
            Today
          </Button>
          <div class="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" class="size-8" aria-label="Previous period" @click="handlePrev">
              <ChevronLeft class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Next period" @click="handleNext">
              <ChevronRight class="size-4" />
            </Button>
          </div>
          <h2 class="text-foreground ml-1 text-base font-semibold tracking-tight sm:text-lg">
            {{ formattedTitle }}
          </h2>
        </div>

        <div class="flex items-center gap-1.5">
          <slot name="header-actions" />
          <div class="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
            <button
              type="button"
              :class="
                cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  view === 'month'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="setView('month')"
            >
              Month
            </button>
            <button
              type="button"
              :class="
                cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  view === 'week'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="setView('week')"
            >
              Week
            </button>
            <button
              type="button"
              :class="
                cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  view === 'work-week'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="setView('work-week')"
            >
              Work
            </button>
            <button
              type="button"
              :class="
                cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  view === 'day'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="setView('day')"
            >
              Day
            </button>
            <button
              v-if="normalizedCategories.length > 0"
              type="button"
              :class="
                cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                  view === 'category'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="setView('category')"
            >
              Category
            </button>
          </div>
        </div>
      </header>
    </slot>

    <!-- VIEW 1: MONTH VIEW -->
    <div v-if="view === 'month'" class="flex flex-1 flex-col">
      <!-- Weekday headers -->
      <div
        class="border-border bg-muted/20 text-muted-foreground grid grid-cols-7 border-b text-center text-xs font-medium"
      >
        <div
          v-for="(dayName, idx) in weekdayHeaderLabels"
          :key="idx"
          class="border-border/40 border-r py-2 last:border-r-0"
        >
          {{ dayName }}
        </div>
      </div>

      <!-- 6-week month grid -->
      <div class="divide-border/40 grid min-h-[580px] flex-1 grid-cols-7 grid-rows-6 divide-x divide-y">
        <div
          v-for="cell in monthDays"
          :key="cell.dateKey"
          :class="
            cn(
              'group relative flex min-h-[96px] cursor-pointer flex-col p-1.5 transition-colors',
              cell.inMonth ? 'bg-card hover:bg-muted/15' : 'bg-muted/10 text-muted-foreground/50 hover:bg-muted/20',
            )
          "
          @click="handleDateClick(cell.dateKey)"
        >
          <!-- Cell Header: Day Number -->
          <div class="mb-1 flex items-center justify-between">
            <span
              :class="
                cn(
                  'inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium transition-colors',
                  cell.isToday
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : cell.inMonth
                      ? 'text-foreground/90'
                      : 'text-muted-foreground/60',
                )
              "
            >
              {{ cell.date.getDate() }}
            </span>
          </div>

          <!-- Events in Day Cell -->
          <div class="flex flex-1 flex-col gap-1 overflow-hidden">
            <template v-for="(evt, idx) in getEventsForDay(cell.dateKey)" :key="evt.id || idx">
              <!-- If within maxEventsPerDay or second-to-last before +more -->
              <template v-if="getEventsForDay(cell.dateKey).length <= maxEventsPerDay || idx < maxEventsPerDay - 1">
                <slot name="event" :event="evt" :view="'month'" :is-all-day="Boolean(evt.allDay)">
                  <div
                    data-slot="event-card"
                    :class="cn(calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }), 'w-full truncate')"
                    @click="handleEventClick(evt, $event)"
                  >
                    <div class="flex items-center gap-1 truncate font-medium">
                      <span v-if="!evt.allDay" class="shrink-0 font-mono text-[10px] opacity-75">
                        {{ formatTime(getEventMinutes(evt.start, 540), timeFormat) }}
                      </span>
                      <span class="truncate">{{ evt.title }}</span>
                    </div>
                  </div>
                </slot>
              </template>
            </template>

            <!-- +N more button with popover -->
            <div v-if="getEventsForDay(cell.dateKey).length > maxEventsPerDay" class="mt-auto pt-0.5">
              <Popover>
                <PopoverTrigger as-child>
                  <button
                    type="button"
                    class="text-primary hover:text-primary/80 hover:bg-primary/10 flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-semibold transition-colors hover:underline"
                    @click="handleMoreClick(cell.dateKey, getEventsForDay(cell.dateKey), $event)"
                  >
                    +{{ getEventsForDay(cell.dateKey).length - (maxEventsPerDay - 1) }} more
                  </button>
                </PopoverTrigger>
                <PopoverContent class="w-64 p-2 shadow-lg" align="start">
                  <div
                    class="border-border mb-1.5 flex items-center justify-between border-b pb-1.5 text-xs font-semibold"
                  >
                    <span>{{
                      cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
                    }}</span>
                    <span class="text-muted-foreground text-[11px] font-normal">
                      {{ getEventsForDay(cell.dateKey).length }} events
                    </span>
                  </div>
                  <div class="flex max-h-48 flex-col gap-1 overflow-y-auto">
                    <div
                      v-for="(evt, idx) in getEventsForDay(cell.dateKey)"
                      :key="evt.id || idx"
                      :class="cn(calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }), 'w-full')"
                      @click="handleEventClick(evt, $event)"
                    >
                      <div class="flex items-center gap-1 truncate font-medium">
                        <span v-if="!evt.allDay" class="shrink-0 font-mono text-[10px] opacity-75">
                          {{ formatTime(getEventMinutes(evt.start, 540), timeFormat) }}
                        </span>
                        <span class="truncate">{{ evt.title }}</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2 & 3 & 4: WEEK, WORK-WEEK, DAY VIEWS -->
    <div
      v-else-if="view === 'week' || view === 'work-week' || view === 'day'"
      class="flex flex-1 flex-col overflow-hidden"
    >
      <!-- Top Columns Header (Sticky) -->
      <div class="border-border bg-muted/20 flex border-b select-none">
        <!-- Time gutter header spacer -->
        <div
          class="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium"
        >
          <Clock class="mx-auto size-3.5 opacity-60" />
        </div>

        <!-- Columns (7 for week, 5 for work-week, 1 for day) -->
        <div
          class="divide-border/50 grid flex-1 divide-x"
          :class="view === 'week' ? 'grid-cols-7' : view === 'work-week' ? 'grid-cols-5' : 'grid-cols-1'"
        >
          <div
            v-for="d in view === 'week' ? weekDays : view === 'work-week' ? workWeekDays : [activeDate]"
            :key="formatDateKey(d)"
            :class="
              cn(
                'hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center py-2 transition-colors',
                isToday(d) && 'bg-primary/5',
              )
            "
            @click="handleDateClick(formatDateKey(d))"
          >
            <slot name="day-header" :date="d" :date-key="formatDateKey(d)" :is-today="isToday(d)" :view="view">
              <span class="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                {{ d.toLocaleDateString('en-US', { weekday: view === 'day' ? 'long' : 'short' }) }}
              </span>
              <span
                :class="
                  cn(
                    'mt-0.5 inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    isToday(d) ? 'bg-primary text-primary-foreground shadow-xs' : 'text-foreground',
                  )
                "
              >
                {{ d.getDate() }}
              </span>
            </slot>
          </div>
        </div>
      </div>

      <!-- Pinned All-Day Section (if all-day events exist) -->
      <div class="border-border bg-muted/10 flex border-b text-xs">
        <div
          class="border-border/50 text-muted-foreground w-16 shrink-0 border-r p-2 text-right text-[10px] font-semibold tracking-wider uppercase"
        >
          All-day
        </div>
        <div
          class="divide-border/50 grid flex-1 divide-x"
          :class="view === 'week' ? 'grid-cols-7' : view === 'work-week' ? 'grid-cols-5' : 'grid-cols-1'"
        >
          <div
            v-for="d in view === 'week' ? weekDays : view === 'work-week' ? workWeekDays : [activeDate]"
            :key="formatDateKey(d)"
            class="flex min-h-[32px] flex-col gap-1 p-1"
          >
            <slot name="all-day" :date="d" :date-key="formatDateKey(d)" :events="getAllDayEventsForDay(d)">
              <div
                v-for="evt in getAllDayEventsForDay(d)"
                :key="evt.id || evt.title"
                data-slot="event-card"
                :class="
                  cn(calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }), 'w-full truncate py-0.5')
                "
                @click="handleEventClick(evt, $event)"
              >
                <span class="truncate font-medium">{{ evt.title }}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>

      <!-- Scrollable Time Intervals Grid -->
      <div class="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
        <!-- Time Gutter -->
        <div class="border-border/50 bg-card w-16 shrink-0 border-r select-none">
          <div
            v-for="interval in intervals"
            :key="interval.time"
            :style="{ height: `${intervalHeight}px` }"
            class="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
          >
            <slot name="interval" :hour="interval.hour" :time="interval.time" :label="interval.label">
              <span v-if="interval.label" class="relative -top-2 block">
                {{ interval.label }}
              </span>
            </slot>
          </div>
        </div>

        <!-- Day Columns Grid -->
        <div
          class="divide-border/50 relative grid flex-1 divide-x"
          :class="view === 'week' ? 'grid-cols-7' : view === 'work-week' ? 'grid-cols-5' : 'grid-cols-1'"
        >
          <div
            v-for="d in view === 'week' ? weekDays : view === 'work-week' ? workWeekDays : [activeDate]"
            :key="formatDateKey(d)"
            class="relative flex flex-col"
          >
            <!-- Interval Rows (Clickable for time click) -->
            <div
              v-for="interval in intervals"
              :key="interval.time"
              :style="{ height: `${intervalHeight}px` }"
              class="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
              @click="handleTimeClick(d, interval.hour, 0)"
            />

            <!-- Timed Events Container (Absolute Overlay) -->
            <div class="pointer-events-none absolute inset-0 p-0.5">
              <div
                v-for="item in calculateTimedEventPositions(events, d, firstInterval, intervalCount, intervalMinutes)"
                :key="item.event.id || item.event.title"
                :style="{
                  top: `${item.top}%`,
                  height: `${item.height}%`,
                  left: `calc(${item.left}% + 2px)`,
                  width: `calc(${item.width}% - 4px)`,
                }"
                class="pointer-events-auto absolute z-10"
              >
                <slot name="event" :event="item.event" :view="view" :is-all-day="false">
                  <div
                    data-slot="event-card"
                    :class="
                      cn(
                        calendarEventVariants({ variant: getEventVariant(item.event) }),
                        'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
                      )
                    "
                    @click="handleEventClick(item.event, $event)"
                  >
                    <span class="truncate text-xs font-semibold">{{ item.event.title }}</span>
                    <span class="truncate font-mono text-[10px] opacity-80">
                      {{ formatTime(item.startMinutes, timeFormat) }} – {{ formatTime(item.endMinutes, timeFormat) }}
                    </span>
                    <span v-if="item.event.location" class="mt-auto truncate text-[10px] opacity-70">
                      📍 {{ item.event.location }}
                    </span>
                  </div>
                </slot>
              </div>

              <!-- Live Current Time Indicator -->
              <div
                v-if="isToday(d) && nowPosition !== null"
                :style="{ top: `${nowPosition}%` }"
                class="pointer-events-none absolute right-0 left-0 z-20"
              >
                <div class="relative w-full border-t-2 border-red-500 dark:border-red-400">
                  <div
                    class="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 5: CATEGORY / RESOURCE VIEW -->
    <div v-else-if="view === 'category'" class="flex flex-1 flex-col overflow-hidden">
      <!-- Category Columns Header -->
      <div class="border-border bg-muted/20 flex border-b select-none">
        <div
          class="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium"
        >
          <Clock class="mx-auto size-3.5 opacity-60" />
        </div>

        <div
          class="divide-border/50 grid flex-1 divide-x"
          :style="{ gridTemplateColumns: `repeat(${Math.max(1, normalizedCategories.length)}, minmax(0, 1fr))` }"
        >
          <div
            v-for="cat in normalizedCategories"
            :key="cat.id"
            class="text-foreground flex items-center justify-center gap-1.5 px-2 py-2.5 text-center text-xs font-semibold"
          >
            <span v-if="cat.color" class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: cat.color }" />
            <span class="truncate">{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <!-- Category Intervals Grid -->
      <div class="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
        <!-- Time Gutter -->
        <div class="border-border/50 bg-card w-16 shrink-0 border-r select-none">
          <div
            v-for="interval in intervals"
            :key="interval.time"
            :style="{ height: `${intervalHeight}px` }"
            class="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
          >
            <span v-if="interval.label" class="relative -top-2 block">
              {{ interval.label }}
            </span>
          </div>
        </div>

        <!-- Category Columns -->
        <div
          class="divide-border/50 relative grid flex-1 divide-x"
          :style="{ gridTemplateColumns: `repeat(${Math.max(1, normalizedCategories.length)}, minmax(0, 1fr))` }"
        >
          <div v-for="cat in normalizedCategories" :key="cat.id" class="relative flex flex-col">
            <!-- Interval Rows -->
            <div
              v-for="interval in intervals"
              :key="interval.time"
              :style="{ height: `${intervalHeight}px` }"
              class="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
              @click="handleTimeClick(activeDate, interval.hour, 0, cat.id)"
            />

            <!-- Category Timed Events Container -->
            <div class="pointer-events-none absolute inset-0 p-0.5">
              <div
                v-for="item in calculateTimedEventPositions(
                  events.filter((e) => e.category === cat.id || e.category === cat.name),
                  activeDate,
                  firstInterval,
                  intervalCount,
                  intervalMinutes,
                )"
                :key="item.event.id || item.event.title"
                :style="{
                  top: `${item.top}%`,
                  height: `${item.height}%`,
                  left: `calc(${item.left}% + 2px)`,
                  width: `calc(${item.width}% - 4px)`,
                }"
                class="pointer-events-auto absolute z-10"
              >
                <slot name="event" :event="item.event" :view="'category'" :is-all-day="false">
                  <div
                    data-slot="event-card"
                    :class="
                      cn(
                        calendarEventVariants({ variant: getEventVariant(item.event) }),
                        'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
                      )
                    "
                    @click="handleEventClick(item.event, $event)"
                  >
                    <span class="truncate text-xs font-semibold">{{ item.event.title }}</span>
                    <span class="truncate font-mono text-[10px] opacity-80">
                      {{ formatTime(item.startMinutes, timeFormat) }} – {{ formatTime(item.endMinutes, timeFormat) }}
                    </span>
                  </div>
                </slot>
              </div>

              <!-- Live Current Time Indicator -->
              <div
                v-if="isToday(activeDate) && nowPosition !== null"
                :style="{ top: `${nowPosition}%` }"
                class="pointer-events-none absolute right-0 left-0 z-20"
              >
                <div class="relative w-full border-t-2 border-red-500 dark:border-red-400">
                  <div
                    class="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
