<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CalendarDate,
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import { toDate } from "reka-ui/date";

// Basic
const date = ref<CalendarDate>();
const multipleDates = ref<CalendarDate[]>();

// Picker types
const weekDate = ref<CalendarDate>();
const monthDate = ref<CalendarDate>();
const quarterDate = ref<CalendarDate>();
const yearDate = ref<CalendarDate>();

// Range
const range = ref();
const weekRange = ref();
const monthRange = ref();
const quarterRange = ref();
const yearRange = ref();

// Time
const timeDate = ref<CalendarDate>();
const timeRange = ref();
const secondsDate = ref<CalendarDate>();

// Format / validation
const formatDate = ref<CalendarDate>();
const rangeDate = ref<CalendarDate>();
const disabledDate = ref<CalendarDate>();
const disabledTimeDate = ref<CalendarDate>();
const confirmDate = ref<CalendarDate>();
const confirmRange = ref();
const statusDate = ref<CalendarDate>();
const statusRange = ref();

// Size
const sizeDate = ref<CalendarDate>();

// Placement
const placementDate = ref<CalendarDate>();

// Mobile sheet composition (pattern — not a DatePicker prop)
const sheetOpen = ref(false);
const sheetDate = ref(today(getLocalTimeZone()));

// Presets
const presetRange = ref();
const presetSingle = ref<CalendarDate>();

const todayD = today(getLocalTimeZone());
const minDate = todayD.subtract({ days: 7 });
const maxDate = todayD.add({ days: 7 });

const customPresets = [
  {
    label: "Today",
    value: { start: todayD.toString(), end: todayD.toString() },
  },
  {
    label: "Last 7 Days",
    value: {
      start: todayD.subtract({ days: 6 }).toString(),
      end: todayD.toString(),
    },
  },
  {
    label: "Last 30 Days",
    value: {
      start: todayD.subtract({ days: 29 }).toString(),
      end: todayD.toString(),
    },
  },
  {
    label: "This Month",
    value: { start: todayD.set({ day: 1 }).toString(), end: todayD.toString() },
  },
];

const categorizedPresets = [
  { label: "Today", value: todayD.toString(), category: "Quick" },
  {
    label: "Tomorrow",
    value: todayD.add({ days: 1 }).toString(),
    category: "Quick",
  },
  {
    label: "Next Week",
    value: todayD.add({ weeks: 1 }).toString(),
    category: "Future",
  },
  {
    label: "Next Month",
    value: todayD.add({ months: 1 }).toString(),
    category: "Future",
  },
];

function disabledDateFn(current: DateValue) {
  const dow = toDate(current).getDay();
  return dow === 0 || dow === 6;
}

function disabledTimeFn(_current?: DateValue) {
  return {
    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23],
    disabledMinutes: (hour: number) => (hour === 12 ? [0, 1, 2, 3, 4, 5] : []),
    disabledSeconds: (hour: number, minute: number) =>
      hour === 12 && minute === 0 ? [0, 1, 2] : [],
  };
}

// Custom cell render — relative to today so dots are visible in the open month
const events = [todayD, todayD.add({ days: 3 }), todayD.add({ days: 7 })];

function hasEvent(day: DateValue) {
  return events.some((e) => e.compare(day) === 0);
}
</script>

<template>
  <!-- BASIC -->
  <Story
    title="Default"
    description="Single-date picker bound to an optional CalendarDate value."
  >
    <DatePicker v-model="date" class="max-w-xs" />
  </Story>

  <Story title="Multiple Dates" description="Select multiple individual dates.">
    <DatePicker v-model="multipleDates" type="multiple" class="max-w-xs" />
  </Story>

  <!-- PICKER TYPES -->
  <Story
    title="Week Picker"
    description="Select an entire week. Value is the week's start date."
  >
    <DatePicker v-model="weekDate" picker="week" class="max-w-xs" />
  </Story>

  <Story title="Month Picker" description="Select a month.">
    <DatePicker v-model="monthDate" picker="month" class="max-w-xs" />
  </Story>

  <Story title="Quarter Picker" description="Select a fiscal quarter.">
    <DatePicker v-model="quarterDate" picker="quarter" class="max-w-xs" />
  </Story>

  <Story title="Year Picker" description="Select a year.">
    <DatePicker v-model="yearDate" picker="year" class="max-w-xs" />
  </Story>

  <!-- DATE RANGE -->
  <Story
    title="Date Range"
    description="Picker for a start and end date in one popover."
  >
    <DatePicker v-model="range" type="range" class="max-w-sm" />
  </Story>

  <Story
    title="Two Months"
    description="Display two months side by side for easier range selection."
  >
    <DatePicker
      v-model="range"
      type="range"
      :number-of-months="2"
      class="max-w-sm"
    />
  </Story>

  <Story title="Week Range" description="Select ranges of full weeks.">
    <DatePicker
      v-model="weekRange"
      type="range"
      picker="week"
      class="max-w-sm"
    />
  </Story>

  <Story title="Month Range" description="Select ranges of months.">
    <DatePicker
      v-model="monthRange"
      type="range"
      picker="month"
      class="max-w-sm"
    />
  </Story>

  <Story title="Quarter Range" description="Select ranges of quarters.">
    <DatePicker
      v-model="quarterRange"
      type="range"
      picker="quarter"
      class="max-w-sm"
    />
  </Story>

  <Story title="Year Range" description="Select ranges of years.">
    <DatePicker
      v-model="yearRange"
      type="range"
      picker="year"
      class="max-w-sm"
    />
  </Story>

  <!-- DATE + TIME -->
  <Story title="Date with Time" description="Pick both date and time.">
    <DatePicker v-model="timeDate" show-time class="max-w-xs" />
  </Story>

  <Story
    title="Date-Time Range"
    description="Range picker with time selection."
  >
    <DatePicker v-model="timeRange" type="range" show-time class="max-w-sm" />
  </Story>

  <Story title="24-Hour Time" description="Time picker in 24-hour format.">
    <DatePicker v-model="timeDate" show-time use24-hour class="max-w-xs" />
  </Story>

  <Story title="Date with Seconds" description="Time picker including seconds.">
    <DatePicker v-model="secondsDate" show-time show-seconds class="max-w-xs" />
  </Story>

  <!-- SIZE -->
  <Story
    title="Size Variants"
    description="Small, middle (default), and large trigger sizes."
  >
    <div class="flex max-w-xs flex-col gap-3">
      <DatePicker v-model="sizeDate" size="small" placeholder="Small" />
      <DatePicker v-model="sizeDate" size="middle" placeholder="Middle" />
      <DatePicker v-model="sizeDate" size="large" placeholder="Large" />
    </div>
  </Story>

  <!-- PLACEMENT -->
  <Story
    title="Placement"
    description="Control where the popover appears relative to the trigger."
  >
    <div class="flex max-w-md flex-wrap gap-3">
      <DatePicker
        v-model="placementDate"
        placement="topLeft"
        placeholder="topLeft"
      />
      <DatePicker v-model="placementDate" placement="top" placeholder="top" />
      <DatePicker
        v-model="placementDate"
        placement="topRight"
        placeholder="topRight"
      />
      <DatePicker
        v-model="placementDate"
        placement="bottomLeft"
        placeholder="bottomLeft"
      />
      <DatePicker
        v-model="placementDate"
        placement="bottom"
        placeholder="bottom"
      />
      <DatePicker
        v-model="placementDate"
        placement="bottomRight"
        placeholder="bottomRight"
      />
      <DatePicker v-model="placementDate" placement="left" placeholder="left" />
      <DatePicker
        v-model="placementDate"
        placement="right"
        placeholder="right"
      />
    </div>
  </Story>

  <!-- PRESETS -->
  <Story
    title="Range with Presets"
    description="Quick-select common date ranges with preset shortcuts."
  >
    <DatePicker
      v-model="presetRange"
      type="range"
      :presets="customPresets"
      class="max-w-sm"
    />
  </Story>

  <Story
    title="Single with Presets"
    description="Preset shortcuts work for single-date mode too."
  >
    <DatePicker
      v-model="presetSingle"
      :presets="categorizedPresets"
      class="max-w-xs"
    />
  </Story>

  <Story
    title="Categorized Presets"
    description="Presets grouped by category labels in the sidebar."
  >
    <DatePicker
      v-model="presetSingle"
      :presets="categorizedPresets"
      class="max-w-xs"
    />
  </Story>

  <!-- FORMAT / VALIDATION -->
  <Story title="Format Options" description="Different date display formats.">
    <div class="flex max-w-xs flex-col gap-3">
      <DatePicker
        v-model="formatDate"
        format="short"
        placeholder="Short format"
      />
      <DatePicker
        v-model="formatDate"
        format="medium"
        placeholder="Medium format"
      />
      <DatePicker
        v-model="formatDate"
        format="long"
        placeholder="Long format"
      />
      <DatePicker
        v-model="formatDate"
        format="full"
        placeholder="Full format"
      />
    </div>
  </Story>

  <Story
    title="Custom Intl Format"
    description="Use Intl.DateTimeFormatOptions for fully custom formatting."
  >
    <DatePicker
      v-model="formatDate"
      :format="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
      placeholder="YYYY-MM-DD style"
      class="max-w-xs"
    />
  </Story>

  <Story
    title="Range Separator"
    description="Custom separator between start and end dates."
  >
    <DatePicker v-model="range" type="range" separator="→" class="max-w-sm" />
  </Story>

  <Story
    title="Min / Max Dates"
    description="Restrict selection to a date range."
  >
    <DatePicker
      v-model="rangeDate"
      :min-value="minDate"
      :max-value="maxDate"
      class="max-w-xs"
    />
  </Story>

  <Story
    title="Disabled Date"
    description="Disable specific dates via a function (weekends disabled here)."
  >
    <DatePicker
      v-model="disabledDate"
      :disabled-date="disabledDateFn"
      class="max-w-xs"
    />
  </Story>

  <Story
    title="Disabled Time"
    description="Disable specific hours, minutes, or seconds."
  >
    <DatePicker
      v-model="disabledTimeDate"
      show-time
      :disabled-time="disabledTimeFn"
      class="max-w-xs"
    />
  </Story>

  <Story title="Disabled" description="Disabled state prevents interaction.">
    <DatePicker v-model="disabledDate" disabled class="max-w-xs" />
  </Story>

  <!-- NEW FEATURES -->
  <Story
    title="Need Confirm"
    description="Selections only apply after clicking OK."
  >
    <DatePicker v-model="confirmDate" need-confirm class="max-w-xs" />
  </Story>

  <Story
    title="Range with Confirm"
    description="Range selections require confirmation."
  >
    <DatePicker
      v-model="confirmRange"
      type="range"
      need-confirm
      class="max-w-sm"
    />
  </Story>

  <Story
    title="Status States"
    description="Error and warning validation states."
  >
    <div class="flex max-w-xs flex-col gap-3">
      <DatePicker
        v-model="statusDate"
        status="error"
        placeholder="Error state"
      />
      <DatePicker
        v-model="statusDate"
        status="warning"
        placeholder="Warning state"
      />
    </div>
  </Story>

  <Story title="Range Status" description="Validation states for range picker.">
    <div class="flex max-w-sm flex-col gap-3">
      <DatePicker
        v-model="statusRange"
        type="range"
        status="error"
        placeholder="Error state"
      />
      <DatePicker
        v-model="statusRange"
        type="range"
        status="warning"
        placeholder="Warning state"
      />
    </div>
  </Story>

  <Story
    title="Custom Cell Render"
    description="Add badges and dots to calendar cells."
  >
    <DatePicker v-model="date" class="max-w-xs">
      <template #cell="{ day }">
        <div class="relative">
          {{ day.day }}
          <span
            v-if="hasEvent(day)"
            class="bg-primary absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full"
          />
        </div>
      </template>
    </DatePicker>
  </Story>

  <Story
    title="Mobile sheet pattern"
    description="On small screens, compose Sheet + Calendar instead of a floating popover. Date Picker stays for desktop; this pattern is the touch-friendly alternative."
  >
    <Sheet v-model:open="sheetOpen">
      <SheetTrigger as-child>
        <Button
          variant="outline"
          class="w-full max-w-xs justify-start font-normal"
        >
          {{
            sheetDate
              ? `${sheetDate.year}-${String(sheetDate.month).padStart(2, "0")}-${String(sheetDate.day).padStart(2, "0")}`
              : "Pick a date"
          }}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" class="rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Select date</SheetTitle>
        </SheetHeader>
        <div class="flex justify-center py-2">
          <Calendar
            v-model="sheetDate"
            class="rounded-md border"
            @update:model-value="sheetOpen = false"
          />
        </div>
      </SheetContent>
    </Sheet>
  </Story>
</template>
