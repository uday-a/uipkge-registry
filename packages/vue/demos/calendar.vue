<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { CalendarDate, today, getLocalTimeZone, type DateValue } from '@internationalized/date'

const date = ref(new CalendarDate(2026, 5, 15))
const restrictedDate = ref<CalendarDate>()
const usDate = ref<CalendarDate>()
const jaDate = ref<CalendarDate>()
const sideBySideA = ref<CalendarDate>()
const sideBySideB = ref<CalendarDate>()
const todayDate = ref(today(getLocalTimeZone()))
const multiDates = ref<DateValue[]>([
  new CalendarDate(2026, 5, 10),
  new CalendarDate(2026, 5, 15),
  new CalendarDate(2026, 5, 20),
])
const layoutDate = ref(new CalendarDate(2026, 5, 15))
const multiMonthDate = ref(new CalendarDate(2026, 5, 15))
const unavailableDate = ref<CalendarDate>()

const tz = getLocalTimeZone()
const minValue = today(tz).subtract({ days: 7 })
const maxValue = today(tz).add({ days: 30 })

/** Weekends unavailable — keyboard and click both honor isDateUnavailable. */
function isWeekend(d: DateValue) {
  const js = new Date(d.year, d.month - 1, d.day)
  const day = js.getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <Story title="Default" description="Single-date calendar bound to a CalendarDate value.">
    <Calendar v-model="date" class="rounded-md border" />
  </Story>

  <Story title="Min / max" description="Restrict selection to a window — here, 7 days back through 30 days forward.">
    <Calendar v-model="restrictedDate" :min-value="minValue" :max-value="maxValue" class="rounded-md border" />
  </Story>

  <Story
    title="Disabled dates"
    description="isDateUnavailable disables specific days (weekends here). Unavailable cells stay focusable for a11y but cannot be selected."
  >
    <Calendar v-model="unavailableDate" :is-date-unavailable="isWeekend" class="rounded-md border" />
  </Story>

  <Story
    title="Multiple selection"
    description="type='multiple' lets users pick several individual days. Value is an array of DateValue."
  >
    <Calendar v-model="multiDates" type="multiple" class="rounded-md border" />
    <p class="text-muted-foreground mt-2 text-xs">
      Selected:
      {{
        multiDates
          ?.map((d) => `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`)
          .join(', ') || 'none'
      }}
    </p>
  </Story>

  <Story
    title="Two months"
    description="numberOfMonths=2 shows consecutive months in one calendar root (true multi-month, not two separate instances)."
  >
    <Calendar v-model="multiMonthDate" :number-of-months="2" class="rounded-md border" />
  </Story>

  <Story
    title="Month and year layout"
    description="layout='month-and-year' turns the heading into native selects for fast jumps."
  >
    <Calendar v-model="layoutDate" layout="month-and-year" class="rounded-md border" />
  </Story>

  <Story
    title="Side-by-side months"
    description="Render two Calendar instances next to each other for parallel month browsing."
  >
    <div class="flex flex-col gap-4 sm:flex-row">
      <Calendar v-model="sideBySideA" class="rounded-md border" />
      <Calendar v-model="sideBySideB" class="rounded-md border" />
    </div>
  </Story>

  <Story
    title="Locale variants"
    description="Pass locale to localize weekday labels, month names, and first day of week."
  >
    <div class="flex flex-col gap-4 sm:flex-row">
      <Calendar v-model="usDate" locale="en-US" class="rounded-md border" />
      <Calendar v-model="jaDate" locale="ja-JP" class="rounded-md border" />
    </div>
  </Story>

  <Story
    title="Pre-selected today"
    description="Initialize v-model with today() to mark today's cell as selected on mount."
  >
    <Calendar v-model="todayDate" class="rounded-md border" />
  </Story>

  <Story
    title="Keyboard"
    description="Focus the grid and use arrow keys to move, Space/Enter to select, PageUp/PageDown for months. Screen readers get the date name from reka-ui."
  >
    <Calendar v-model="date" class="rounded-md border" />
  </Story>
</template>
