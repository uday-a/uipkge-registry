<script setup lang="ts">
/**
 * EventCalendar -- a full month-view event calendar with stats strip,
 * drag/shift range select, side rail (selected day or range summary),
 * upcoming list, and per-event/per-cell context menus.
 *
 * Configurable surface:
 *   - v-model:events  CalendarEvent[]   the source of truth
 *   - :event-types    Record<typeKey, EventTypeMeta>  visual config per type
 *   - :initial-date   YYYY-MM-DD        which month opens first
 *   - :week-starts-on 0 | 1              Sunday vs Monday
 *   - :loading                          skeleton state during fetch
 *   - :title / :description / :show-* toggles per pane
 *
 * Slots:
 *   - #header-actions     extra controls to the right of search/view/new
 *   - #event-dialog       full override of the detail dialog body
 *   - #empty              text shown when a selected day has no events
 *
 * Emits:
 *   - event-click(event)
 *   - event-create(dateKey)             requested from "New event" or
 *                                       the per-cell context menu
 *   - event-edit / event-duplicate / event-delete(event)
 *   - range-change({ lo, hi })          fires when the selection range moves
 */
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Search,
  CalendarDays,
  ListFilter,
  Sparkles,
  Copy,
  X,
  CalendarPlus,
  ArrowRight,
  MousePointer2,
  Pencil,
  Trash2,
  Eye,
  CopyPlus,
} from 'lucide-vue-next'
import { useMonthGrid, dateFromKey } from '@/composables/useMonthGrid'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ContextMenuLabel,
} from '@/components/ui/context-menu'
import type { CalendarEvent, EventTypeMeta } from './types'
import { defaultEventTypes } from './defaults'

const props = withDefaults(
  defineProps<{
    /** Source of truth. Pair with v-model:events. */
    events?: CalendarEvent[]
    /** Visual + semantic theme per event type. Falls back to defaultEventTypes. */
    eventTypes?: Record<string, EventTypeMeta>
    /** YYYY-MM-DD -- month to open first. Defaults to today. */
    initialDate?: string
    /** 0 = Sunday (default), 1 = Monday. */
    weekStartsOn?: 0 | 1
    /** Show the skeleton placeholders instead of cells / rail rows. */
    loading?: boolean
    title?: string
    description?: string
    /** Default = true. Stats strip across the top. */
    showStats?: boolean
    /** Default = true. Side rail to the right of the grid. */
    showSideRail?: boolean
    /** Default = true. Search input in the header. */
    showSearch?: boolean
    /** Default = true. Month/Week/Day select. Week/Day not implemented yet
     *  -- the select is purely visual until you wire up the modes. */
    showViewSelect?: boolean
    /** Default = true. Legend strip under the grid. */
    showLegend?: boolean
    /** Default = true. "Up next" pane under the side rail. */
    showUpcoming?: boolean
  }>(),
  {
    events: () => [],
    eventTypes: () => defaultEventTypes,
    weekStartsOn: 0,
    loading: false,
    title: 'Calendar',
    description: 'Schedule, meetings, and deadlines. Drag or shift-click to select a range.',
    showStats: true,
    showSideRail: true,
    showSearch: true,
    showViewSelect: true,
    showLegend: true,
    showUpcoming: true,
  },
)

const emit = defineEmits<{
  'update:events': [value: CalendarEvent[]]
  'event-click': [event: CalendarEvent]
  'event-create': [dateKey: string]
  'event-edit': [event: CalendarEvent]
  'event-duplicate': [event: CalendarEvent]
  'event-delete': [event: CalendarEvent]
  'range-change': [bounds: { lo: string; hi: string }]
}>()

const view = ref<'month' | 'week' | 'day'>('month')
const eventOpen = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)
const search = ref('')

const {
  todayKey,
  cursor,
  monthLabel,
  gridDays,
  weekdays,
  rangeStart,
  rangeBounds,
  rangeDayCount,
  isRange,
  inRange,
  prevMonth,
  nextMonth,
  goToToday,
  selectWeekOf,
  clearRange,
  onCellMouseDown,
  onCellMouseEnter,
  endDrag,
} = useMonthGrid({ initialDate: props.initialDate, weekStartsOn: props.weekStartsOn })

watch(rangeBounds, (b) => emit('range-change', b))

// Fall through to a neutral style for unknown event types so the calendar
// doesn't crash when a consumer passes a type that's missing from the map.
const neutralMeta: EventTypeMeta = {
  label: 'Event',
  icon: CalendarDays,
  chip: 'bg-muted text-muted-foreground ring-muted-foreground/20',
  bar: 'bg-muted-foreground',
  dot: 'bg-muted-foreground',
  glow: 'bg-muted-foreground/10',
  text: 'text-muted-foreground',
  ring: 'hover:ring-muted-foreground/30',
}
function metaFor(type: string): EventTypeMeta {
  return props.eventTypes[type] ?? neutralMeta
}

const typeKeys = computed(() => Object.keys(props.eventTypes))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.events
  return props.events.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      (e.description ?? '').toLowerCase().includes(q) ||
      (e.location ?? '').toLowerCase().includes(q),
  )
})

const eventsByDate = computed(() => {
  const map = new Map<string, CalendarEvent[]>()
  for (const e of filtered.value) {
    if (!map.has(e.date)) map.set(e.date, [])
    map.get(e.date)!.push(e)
  }
  for (const arr of map.values()) arr.sort((a, b) => a.start.localeCompare(b.start))
  return map
})

const monthCounts = computed(() => {
  const y = cursor.value.getFullYear()
  const m = cursor.value.getMonth()
  const out: Record<string, number> & { total: number } = { total: 0 }
  for (const k of typeKeys.value) out[k] = 0
  for (const e of props.events) {
    const d = new Date(e.date)
    if (d.getFullYear() === y && d.getMonth() === m) {
      if (out[e.type] !== undefined) out[e.type]!++
      out.total++
    }
  }
  return out
})

const typeStats = computed(() => {
  const y = cursor.value.getFullYear()
  const m = cursor.value.getMonth()
  const out: Record<string, { weeks: number[]; next: CalendarEvent | null }> = {}
  for (const k of typeKeys.value) out[k] = { weeks: [0, 0, 0, 0, 0, 0], next: null }
  const firstOffset = new Date(y, m, 1).getDay()

  for (const e of props.events) {
    const d = new Date(e.date)
    if (d.getFullYear() === y && d.getMonth() === m && out[e.type]) {
      const week = Math.floor((d.getDate() - 1 + firstOffset) / 7)
      out[e.type]!.weeks[week]!++
    }
  }
  for (const t of typeKeys.value) {
    const next = props.events
      .filter((e) => e.type === t && e.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))[0]
    out[t]!.next = next ?? null
  }
  return out
})

function fmtNextDate(key: string) {
  if (key === todayKey) return 'Today'
  return dateFromKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const rangeEvents = computed(() => {
  const { lo, hi } = rangeBounds.value
  return filtered.value
    .filter((e) => e.date >= lo && e.date <= hi)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
})

const rangeTypeCounts = computed(() => {
  const init: Record<string, number> = {}
  for (const k of typeKeys.value) init[k] = 0
  for (const e of rangeEvents.value) {
    if (init[e.type] !== undefined) init[e.type]!++
  }
  return init
})

const selectedDayEvents = computed(() => eventsByDate.value.get(rangeStart.value) ?? [])

const upcoming = computed(() =>
  filtered.value
    .filter((e) => e.date > todayKey)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
    .slice(0, 4),
)

function openEvent(e: CalendarEvent) {
  selectedEvent.value = e
  eventOpen.value = true
  emit('event-click', e)
}

function copyDate(key: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(key).catch(() => {
      /* clipboard may be denied; nothing to do */
    })
  }
}

function fmtDayLong(key: string) {
  return dateFromKey(key).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
function fmtDayShort(key: string) {
  return dateFromKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

function cellRangeClass(key: string, inMonth: boolean) {
  const { lo, hi } = rangeBounds.value
  if (!inRange(key)) return inMonth ? 'bg-background hover:bg-accent/40' : 'bg-muted/20 hover:bg-muted/30'
  if (key === lo && key === hi) return 'bg-accent/30 ring-1 ring-inset ring-primary/60'
  let cls = 'bg-primary/10 hover:bg-primary/15'
  if (key === lo) cls += ' ring-1 ring-inset ring-primary/60'
  if (key === hi) cls += ' ring-1 ring-inset ring-primary/60'
  return cls
}

function selectCategoryFilter(key: string) {
  const label = props.eventTypes[key]?.label.toLowerCase() || ''
  search.value = label === search.value.toLowerCase() ? '' : label
}

function handleEditSelected() {
  if (selectedEvent.value) emit('event-edit', selectedEvent.value)
  eventOpen.value = false
}

function handleDeleteSelected() {
  if (selectedEvent.value) emit('event-delete', selectedEvent.value)
  eventOpen.value = false
}

// Window listeners are also used inside useMonthGrid for mouseup; mirror
// them at the block level so the drag also ends when the user releases
// the mouse outside the grid surface.
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('mouseleave', endDrag)
  }
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mouseup', endDrag)
    window.removeEventListener('mouseleave', endDrag)
  }
})
</script>

<template>
  <div data-slot="event-calendar" class="flex flex-col gap-5" @mouseup="endDrag">
    <!-- Header -->
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
        <p v-if="description" class="text-muted-foreground mt-1 text-sm">{{ description }}</p>
      </div>
      <div class="flex items-center gap-2">
        <div v-if="showSearch" class="relative">
          <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input v-model="search" placeholder="Search events" class="h-8 w-56 pl-8 text-xs" />
        </div>
        <Select v-if="showViewSelect" v-model="view">
          <SelectTrigger class="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>
        <slot name="header-actions">
          <Button size="sm" class="gap-1.5" @click="emit('event-create', rangeStart)">
            <Plus class="size-3.5" />
            New event
          </Button>
        </slot>
      </div>
    </header>

    <!-- Stats strip -->
    <div
      v-if="showStats"
      class="grid grid-cols-1 gap-3"
      :class="`sm:grid-cols-2 lg:grid-cols-${Math.min(typeKeys.length, 4)}`"
    >
      <button
        v-for="key in typeKeys"
        :key="key"
        type="button"
        :class="[
          'group bg-card/40 hover:bg-card relative isolate flex flex-col overflow-hidden rounded-xl border p-4 text-left ring-1 ring-transparent backdrop-blur transition-all ring-inset hover:-translate-y-px hover:shadow-lg',
          eventTypes[key]!.ring,
        ]"
        @click="selectCategoryFilter(key)"
      >
        <component
          :is="eventTypes[key]!.icon"
          :class="[
            'pointer-events-none absolute -top-4 -right-4 size-24 opacity-[0.06] transition-opacity group-hover:opacity-[0.12]',
            eventTypes[key]!.text,
          ]"
        />
        <div
          :class="[
            'pointer-events-none absolute -right-12 -bottom-12 size-32 rounded-full blur-2xl',
            eventTypes[key]!.glow,
          ]"
        />

        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span :class="['size-1.5 rounded-full', eventTypes[key]!.dot]" />
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              {{ eventTypes[key]!.label }}
            </p>
          </div>
          <div :class="['flex size-7 items-center justify-center rounded-md ring-1 ring-inset', eventTypes[key]!.chip]">
            <component :is="eventTypes[key]!.icon" class="size-3.5" />
          </div>
        </div>

        <div class="mt-2 flex items-baseline gap-1.5">
          <p class="text-3xl leading-none font-semibold tabular-nums">{{ monthCounts[key] ?? 0 }}</p>
          <p class="text-muted-foreground text-xs tracking-wider uppercase">this month</p>
        </div>

        <div class="mt-3 flex h-6 items-end gap-1">
          <span
            v-for="(n, i) in typeStats[key]!.weeks.slice(0, 6)"
            :key="i"
            :class="[
              'flex-1 rounded-sm transition-colors',
              n > 0 ? eventTypes[key]!.bar : 'bg-muted/40',
              n > 0 && 'opacity-70 group-hover:opacity-100',
            ]"
            :style="{ height: n > 0 ? `${Math.min(100, 30 + n * 35)}%` : '20%' }"
            :title="`Week ${i + 1}: ${n} ${eventTypes[key]!.label.toLowerCase()}${n === 1 ? '' : 's'}`"
          />
        </div>

        <div class="border-border/50 mt-3 min-h-[2.25rem] border-t pt-2">
          <template v-if="typeStats[key]!.next">
            <p class="text-muted-foreground text-xs tracking-wider uppercase">
              Next <span :class="eventTypes[key]!.text">{{ fmtNextDate(typeStats[key]!.next!.date) }}</span>
            </p>
            <p class="mt-0.5 truncate text-xs font-medium">{{ typeStats[key]!.next!.title }}</p>
          </template>
          <template v-else>
            <p class="text-muted-foreground text-xs tracking-wider uppercase">No upcoming</p>
            <p class="text-muted-foreground/70 mt-0.5 text-xs">All clear</p>
          </template>
        </div>
      </button>
    </div>

    <!-- Main: calendar + side rail -->
    <div :class="['grid gap-4', showSideRail && 'lg:grid-cols-[minmax(0,1fr)_320px]']">
      <!-- Month grid -->
      <div class="bg-card/40 overflow-hidden rounded-xl border">
        <div class="bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
          <div class="flex items-center gap-2">
            <Button aria-label="Previous month" variant="outline" size="icon" class="size-7" @click="prevMonth"
              ><ChevronLeft class="size-4"
            /></Button>
            <Button aria-label="Next month" variant="outline" size="icon" class="size-7" @click="nextMonth"
              ><ChevronRight class="size-4"
            /></Button>
            <Button variant="ghost" size="sm" class="h-7 text-xs" @click="goToToday">Today</Button>
            <h2 class="ml-2 text-sm font-semibold">{{ monthLabel }}</h2>
          </div>
          <div class="text-muted-foreground flex items-center gap-3 text-xs">
            <div
              v-if="isRange"
              class="bg-primary/10 text-primary ring-primary/20 flex items-center gap-1.5 rounded-full px-2 py-0.5 ring-1 ring-inset"
            >
              <MousePointer2 class="size-3" />
              <span>{{ rangeDayCount }} days, {{ rangeEvents.length }} events</span>
              <button class="hover:text-foreground ml-0.5" aria-label="Clear date range" @click="clearRange">
                <X class="size-3" />
              </button>
            </div>
            <div class="flex items-center gap-1.5">
              <Sparkles class="size-3" />
              <span>{{ monthCounts.total }} event{{ monthCounts.total === 1 ? '' : 's' }} this month</span>
            </div>
          </div>
        </div>

        <div class="bg-muted/10 text-muted-foreground grid grid-cols-7 border-b text-xs tracking-wider uppercase">
          <div v-for="w in weekdays" :key="w" class="px-2 py-2 font-medium">{{ w }}</div>
        </div>

        <div class="grid grid-cols-7 select-none">
          <template v-if="loading">
            <div v-for="i in 42" :key="i" class="h-24 border-r border-b p-1.5 last:border-r-0">
              <Skeleton class="h-3 w-6" />
              <Skeleton class="mt-2 h-3 w-full" />
            </div>
          </template>
          <template v-else>
            <ContextMenu v-for="(d, i) in gridDays" :key="d.key">
              <ContextMenuTrigger as-child>
                <button
                  type="button"
                  :class="[
                    'group focus-visible:ring-ring relative flex h-24 flex-col gap-1 border-r border-b p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
                    (i + 1) % 7 === 0 && 'border-r-0',
                    i >= 35 && 'border-b-0',
                    cellRangeClass(d.key, d.inMonth),
                    !d.inMonth && !inRange(d.key) && 'text-muted-foreground/60',
                  ]"
                  @mousedown="onCellMouseDown(d.key, $event)"
                  @mouseenter="onCellMouseEnter(d.key)"
                >
                  <div class="flex items-center justify-between">
                    <span
                      :class="[
                        'inline-flex size-5 items-center justify-center rounded-full text-xs tabular-nums',
                        d.key === todayKey && 'bg-primary text-primary-foreground font-semibold',
                        d.key !== todayKey && d.inMonth && 'text-foreground',
                        !d.inMonth && 'text-muted-foreground/60',
                      ]"
                      >{{ d.date.getDate() }}</span
                    >
                    <span
                      v-if="(eventsByDate.get(d.key)?.length ?? 0) > 0"
                      class="text-muted-foreground text-xs tabular-nums"
                    >
                      {{ eventsByDate.get(d.key)!.length }}
                    </span>
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <ContextMenu v-for="e in (eventsByDate.get(d.key) ?? []).slice(0, 2)" :key="e.id">
                      <ContextMenuTrigger as-child>
                        <span
                          :class="[
                            'flex cursor-pointer items-center gap-1 truncate rounded px-1 py-0.5 text-xs ring-1 ring-inset',
                            metaFor(e.type).chip,
                          ]"
                          @mousedown.stop
                          @click.stop="openEvent(e)"
                          @contextmenu.stop
                        >
                          <span class="tabular-nums opacity-70">{{ e.start }}</span>
                          <span class="truncate">{{ e.title }}</span>
                        </span>
                      </ContextMenuTrigger>
                      <ContextMenuContent class="w-52">
                        <ContextMenuLabel class="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span :class="['size-1.5 rounded-full', metaFor(e.type).dot]" />
                          <span class="truncate">{{ e.title }}</span>
                        </ContextMenuLabel>
                        <ContextMenuSeparator />
                        <ContextMenuItem class="gap-2" @select="openEvent(e)">
                          <Eye class="size-3.5" /> View details
                          <ContextMenuShortcut>Enter</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem class="gap-2" @select="emit('event-edit', e)"
                          ><Pencil class="size-3.5" /> Edit</ContextMenuItem
                        >
                        <ContextMenuItem class="gap-2" @select="emit('event-duplicate', e)"
                          ><CopyPlus class="size-3.5" /> Duplicate</ContextMenuItem
                        >
                        <ContextMenuItem class="gap-2" @select="copyDate(e.date)">
                          <Copy class="size-3.5" /> Copy date
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          class="text-destructive focus:text-destructive gap-2"
                          @select="emit('event-delete', e)"
                        >
                          <Trash2 class="size-3.5" /> Cancel event
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                    <span v-if="(eventsByDate.get(d.key)?.length ?? 0) > 2" class="text-muted-foreground px-1 text-xs">
                      +{{ eventsByDate.get(d.key)!.length - 2 }} more
                    </span>
                  </div>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent class="w-56">
                <ContextMenuLabel class="text-muted-foreground text-xs">{{ fmtDayLong(d.key) }}</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem class="gap-2" @select="emit('event-create', d.key)">
                  <CalendarPlus class="size-3.5" /> New event
                  <ContextMenuShortcut>N</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem class="gap-2" @select="selectWeekOf(d.key)">
                  <CalendarDays class="size-3.5" /> Select this week
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem class="gap-2" @select="copyDate(d.key)">
                  <Copy class="size-3.5" /> Copy date
                  <ContextMenuShortcut class="tabular-nums">{{ d.key }}</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem class="gap-2" @select="goToToday">
                  <ArrowRight class="size-3.5" /> Go to today
                </ContextMenuItem>
                <ContextMenuItem
                  v-if="isRange"
                  class="text-destructive focus:text-destructive gap-2"
                  @select="clearRange"
                >
                  <X class="size-3.5" /> Clear range
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </template>
        </div>

        <div
          v-if="showLegend"
          class="bg-muted/20 text-muted-foreground flex flex-wrap items-center gap-3 border-t px-4 py-2 text-xs"
        >
          <ListFilter class="size-3" />
          <div v-for="key in typeKeys" :key="key" class="flex items-center gap-1.5">
            <span :class="['size-2 rounded-full', eventTypes[key]!.dot]" />
            {{ eventTypes[key]!.label }}
          </div>
          <span class="ml-auto text-xs">Tip: drag or shift-click to range. Right-click for actions.</span>
        </div>
      </div>

      <!-- Side rail -->
      <aside v-if="showSideRail" class="flex flex-col gap-4">
        <div v-if="!isRange" class="bg-card/40 overflow-hidden rounded-xl border">
          <div class="bg-muted/30 border-b px-4 py-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-muted-foreground text-xs tracking-wider uppercase">
                  {{ rangeStart === todayKey ? 'Today' : 'Selected' }}
                </p>
                <p class="mt-0.5 text-sm font-semibold">{{ fmtDayLong(rangeStart) }}</p>
              </div>
              <div class="text-right">
                <p class="text-muted-foreground text-xs tracking-wider uppercase">Events</p>
                <p class="text-sm font-semibold tabular-nums">{{ selectedDayEvents.length }}</p>
              </div>
            </div>
          </div>
          <div class="max-h-[26.25rem] overflow-y-auto p-3">
            <template v-if="loading">
              <div v-for="i in 3" :key="i" class="mb-2 space-y-2 rounded-lg border p-3">
                <Skeleton class="h-3 w-32" />
                <Skeleton class="h-2 w-20" />
              </div>
            </template>
            <template v-else-if="selectedDayEvents.length === 0">
              <slot name="empty">
                <div class="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div class="bg-muted flex size-10 items-center justify-center rounded-full">
                    <CalendarDays class="text-muted-foreground size-5" />
                  </div>
                  <p class="text-sm font-medium">Nothing scheduled</p>
                  <p class="text-muted-foreground text-xs">Click a date or add a new event.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    class="mt-1 h-7 gap-1.5 text-xs"
                    @click="emit('event-create', rangeStart)"
                  >
                    <Plus class="size-3" /> New event
                  </Button>
                </div>
              </slot>
            </template>
            <template v-else>
              <ContextMenu v-for="e in selectedDayEvents" :key="e.id">
                <ContextMenuTrigger as-child>
                  <div
                    class="group hover:bg-accent/50 relative flex cursor-pointer gap-3 rounded-lg p-2.5 transition-colors"
                    @click="openEvent(e)"
                  >
                    <div :class="['w-0.5 shrink-0 rounded-full', metaFor(e.type).bar]" />
                    <div class="min-w-0 flex-1 space-y-1">
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-sm leading-tight font-medium">{{ e.title }}</p>
                        <span
                          :class="[
                            'shrink-0 rounded px-1.5 py-0.5 text-xs tracking-wider uppercase ring-1 ring-inset',
                            metaFor(e.type).chip,
                          ]"
                        >
                          {{ metaFor(e.type).label }}
                        </span>
                      </div>
                      <div class="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        <span class="inline-flex items-center gap-1"
                          ><Clock class="size-3" />{{ e.start }}-{{ e.end }}</span
                        >
                        <span v-if="e.location" class="inline-flex items-center gap-1"
                          ><MapPin class="size-3" />{{ e.location }}</span
                        >
                      </div>
                      <div v-if="e.attendees?.length" class="flex items-center -space-x-1.5 pt-0.5">
                        <Avatar
                          v-for="(a, i) in e.attendees.slice(0, 4)"
                          :key="i"
                          class="border-background size-5 border-2"
                        >
                          <AvatarFallback class="bg-primary/10 text-primary text-xs">{{ initials(a) }}</AvatarFallback>
                        </Avatar>
                        <span v-if="e.attendees.length > 4" class="text-muted-foreground pl-2 text-xs"
                          >+{{ e.attendees.length - 4 }}</span
                        >
                      </div>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent class="w-48">
                  <ContextMenuLabel class="text-muted-foreground truncate text-xs">{{ e.title }}</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem class="gap-2" @select="openEvent(e)"
                    ><Eye class="size-3.5" /> View details</ContextMenuItem
                  >
                  <ContextMenuItem class="gap-2" @select="emit('event-edit', e)"
                    ><Pencil class="size-3.5" /> Edit</ContextMenuItem
                  >
                  <ContextMenuItem class="gap-2" @select="emit('event-duplicate', e)"
                    ><CopyPlus class="size-3.5" /> Duplicate</ContextMenuItem
                  >
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    class="text-destructive focus:text-destructive gap-2"
                    @select="emit('event-delete', e)"
                    ><Trash2 class="size-3.5" /> Cancel event</ContextMenuItem
                  >
                </ContextMenuContent>
              </ContextMenu>
            </template>
          </div>
        </div>

        <div v-else class="bg-card/40 overflow-hidden rounded-xl border">
          <div class="from-primary/10 border-b bg-gradient-to-r to-transparent px-4 py-3">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-muted-foreground text-xs tracking-wider uppercase">Range, {{ rangeDayCount }} days</p>
                <p class="mt-0.5 truncate text-sm font-semibold">
                  {{ fmtDayShort(rangeBounds.lo) }} -> {{ fmtDayShort(rangeBounds.hi) }}
                </p>
              </div>
              <Button variant="ghost" size="icon" class="size-7" aria-label="Clear date range" @click="clearRange"
                ><X class="size-3.5"
              /></Button>
            </div>
            <div class="mt-3 grid gap-2" :class="`grid-cols-${Math.min(typeKeys.length, 4)}`">
              <div v-for="key in typeKeys" :key="key" class="bg-background/40 rounded-md border px-2 py-1.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs tracking-wider uppercase">
                  <span :class="['size-1.5 rounded-full', eventTypes[key]!.dot]" />
                  {{ eventTypes[key]!.label }}
                </div>
                <p class="mt-0.5 text-sm font-semibold tabular-nums">{{ rangeTypeCounts[key] ?? 0 }}</p>
              </div>
            </div>
          </div>
          <div class="max-h-[26.25rem] overflow-y-auto">
            <template v-if="rangeEvents.length === 0">
              <p class="text-muted-foreground px-4 py-8 text-center text-xs">No events in range.</p>
            </template>
            <template v-else>
              <div
                v-for="e in rangeEvents"
                :key="e.id"
                class="hover:bg-accent/40 flex cursor-pointer items-start gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0"
                @click="openEvent(e)"
              >
                <div
                  class="bg-background/60 flex w-10 shrink-0 flex-col items-center rounded-md border px-1 py-1 text-center"
                >
                  <span class="text-muted-foreground text-xs uppercase">{{
                    new Date(e.date).toLocaleDateString('en-US', { month: 'short' })
                  }}</span>
                  <span class="text-sm leading-none font-semibold tabular-nums">{{ new Date(e.date).getDate() }}</span>
                </div>
                <div :class="['w-0.5 shrink-0 self-stretch rounded-full', metaFor(e.type).bar]" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-medium">{{ e.title }}</p>
                  <p class="text-muted-foreground mt-0.5 text-xs tabular-nums">
                    {{ e.start }}-{{ e.end }}<span v-if="e.location"> {{ ' ' }} {{ e.location }}</span>
                  </p>
                </div>
                <span
                  :class="[
                    'shrink-0 rounded px-1.5 py-0.5 text-xs tracking-wider uppercase ring-1 ring-inset',
                    metaFor(e.type).chip,
                  ]"
                >
                  {{ metaFor(e.type).label }}
                </span>
              </div>
            </template>
          </div>
        </div>

        <div v-if="showUpcoming" class="bg-card/40 overflow-hidden rounded-xl border">
          <div class="bg-muted/30 border-b px-4 py-2.5">
            <p class="text-sm font-semibold">Up next</p>
            <p class="text-muted-foreground text-xs">After today</p>
          </div>
          <div class="divide-y">
            <template v-if="loading">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3">
                <Skeleton class="size-9 rounded-md" />
                <div class="flex-1 space-y-1">
                  <Skeleton class="h-3 w-32" />
                  <Skeleton class="h-2 w-20" />
                </div>
              </div>
            </template>
            <template v-else-if="upcoming.length === 0">
              <p class="text-muted-foreground px-4 py-6 text-center text-xs">Nothing on the horizon.</p>
            </template>
            <template v-else>
              <button
                v-for="e in upcoming"
                :key="e.id"
                type="button"
                class="group hover:bg-accent/40 flex w-full items-center gap-3 p-3 text-left transition-colors"
                @click="openEvent(e)"
              >
                <div
                  class="bg-background flex size-10 shrink-0 flex-col items-center justify-center rounded-md border text-center"
                >
                  <span class="text-muted-foreground text-xs uppercase">{{
                    new Date(e.date).toLocaleDateString('en-US', { month: 'short' })
                  }}</span>
                  <span class="text-sm leading-none font-semibold tabular-nums">{{ new Date(e.date).getDate() }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <span :class="['size-1.5 rounded-full', metaFor(e.type).dot]" />
                    <p class="truncate text-xs font-medium">{{ e.title }}</p>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs tabular-nums">
                    {{ e.start }}-{{ e.end }}<span v-if="e.location"> {{ ' ' }} {{ e.location }}</span>
                  </p>
                </div>
              </button>
            </template>
          </div>
        </div>
      </aside>
    </div>

    <!-- Event Detail Dialog -->
    <Dialog v-model:open="eventOpen">
      <DialogContent v-if="selectedEvent" class="sm:max-w-md">
        <slot name="event-dialog" :event="selectedEvent">
          <DialogHeader>
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'flex size-8 items-center justify-center rounded-md ring-1 ring-inset',
                  metaFor(selectedEvent.type).chip,
                ]"
              >
                <component :is="metaFor(selectedEvent.type).icon" class="size-4" />
              </div>
              <div>
                <DialogTitle class="text-base">{{ selectedEvent.title }}</DialogTitle>
                <DialogDescription class="text-xs">
                  {{ metaFor(selectedEvent.type).label
                  }}<span v-if="selectedEvent.status"> {{ ' ' }} {{ selectedEvent.status }}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div class="space-y-3 py-2">
            <p v-if="selectedEvent.description" class="text-muted-foreground text-sm">
              {{ selectedEvent.description }}
            </p>
            <Separator />
            <div class="grid gap-2 text-sm">
              <div class="flex items-center gap-2">
                <Clock class="text-muted-foreground size-4" />
                <span>{{ selectedEvent.date }} {{ ' ' }} {{ selectedEvent.start }} - {{ selectedEvent.end }}</span>
              </div>
              <div v-if="selectedEvent.location" class="flex items-center gap-2">
                <MapPin class="text-muted-foreground size-4" />
                <span>{{ selectedEvent.location }}</span>
              </div>
              <div v-if="selectedEvent.attendees?.length" class="flex items-start gap-2">
                <Users class="text-muted-foreground mt-0.5 size-4" />
                <div class="flex flex-wrap items-center gap-1.5">
                  <div
                    v-for="a in selectedEvent.attendees"
                    :key="a"
                    class="bg-muted flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                  >
                    <Avatar class="size-4">
                      <AvatarFallback class="bg-primary/10 text-primary text-xs">{{ initials(a) }}</AvatarFallback>
                    </Avatar>
                    <span>{{ a }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" @click="handleEditSelected">Edit</Button>
            <Button size="sm" variant="destructive" @click="handleDeleteSelected"> Delete </Button>
          </DialogFooter>
        </slot>
      </DialogContent>
    </Dialog>
  </div>
</template>
