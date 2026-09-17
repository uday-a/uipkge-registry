<script setup lang="ts">
import { ref } from 'vue'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'

const range = ref({ start: new CalendarDate(2026, 5, 10), end: new CalendarDate(2026, 5, 17) })
const constrainedRange = ref()
const fixedWeeksRange = ref()
const mondayRange = ref()

const tz = getLocalTimeZone()
const todayD = today(tz)
const minValue = todayD.subtract({ days: 14 })
const maxValue = todayD.add({ days: 60 })

const presetRange = ref({
  start: todayD,
  end: todayD.add({ days: 6 }),
})
</script>

<template>
  <Story title="Default" description="Calendar that selects a start and end date inclusive of the range between them.">
    <RangeCalendar v-model="range" class="rounded-md border" />
  </Story>

  <Story title="Min / max" description="Constrain the selectable window — here, 14 days back through 60 days forward.">
    <RangeCalendar v-model="constrainedRange" :min-value="minValue" :max-value="maxValue" class="rounded-md border" />
  </Story>

  <Story
    title="Fixed weeks"
    description="fixed-weeks always renders 6 rows so the calendar height never shifts month-to-month."
  >
    <RangeCalendar v-model="fixedWeeksRange" fixed-weeks class="rounded-md border" />
  </Story>

  <Story
    title="Week starts Monday"
    description="weekStartsOn=1 (Monday) for ISO/EU calendars instead of the default Sunday start."
  >
    <RangeCalendar v-model="mondayRange" :week-starts-on="1" class="rounded-md border" />
  </Story>

  <Story
    title="Pre-selected range"
    description="Initialize v-model with a {start, end} pair to highlight a default range on mount."
  >
    <RangeCalendar v-model="presetRange" class="rounded-md border" />
  </Story>
</template>
