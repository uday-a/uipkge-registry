<script lang="ts" setup>
import type { CalendarRootEmits, CalendarRootProps, DateValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { LayoutTypes } from '.'
import { getLocalTimeZone, today } from '@internationalized/date'
import { createReusableTemplate, reactiveOmit } from '@vueuse/core'
import { CalendarRoot, useDateFormatter, useForwardPropsEmits } from 'reka-ui'
import { createYear, toDate } from 'reka-ui/date'
import { computed, ref, toRaw } from 'vue'
import { cn } from '@/lib/utils'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
  NativeSelect,
  NativeSelectOption,
} from '.'

const props = withDefaults(
  defineProps<CalendarRootProps & { class?: HTMLAttributes['class']; layout?: LayoutTypes; yearRange?: DateValue[] }>(),
  {
    modelValue: undefined,
    layout: undefined,
  },
)
const emits = defineEmits<CalendarRootEmits>()

// Fix: Don't pass defaultValue or defaultPlaceholder to reka-ui to avoid .copy() errors
// Only pass the props that reka-ui needs
const delegatedProps = reactiveOmit(props, ['class', 'layout', 'placeholder', 'defaultValue', 'defaultPlaceholder'])

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const formatter = useDateFormatter(props.locale ?? 'en')

const yearRange = computed(() => {
  if (props.yearRange) return props.yearRange
  const base = toRaw(props.placeholder) ?? today(getLocalTimeZone())
  const start = props?.minValue ?? base.add({ years: -100 })
  const end = props?.maxValue ?? base.add({ years: 10 })
  const years: DateValue[] = []
  let current = start
  while (current.compare(end) <= 0) {
    years.push(current)
    current = current.add({ years: 1 })
  }
  return years
})

const [DefineMonthTemplate, ReuseMonthTemplate] = createReusableTemplate<{ date: DateValue }>()
const [DefineYearTemplate, ReuseYearTemplate] = createReusableTemplate<{ date: DateValue }>()

// Fix: Use simple ref for placeholder, not useVModel, to avoid .copy() error in reka-ui
const internalPlaceholder = ref(props.placeholder ?? today(getLocalTimeZone()))

function setMonth(e: Event) {
  const v = Number((e?.target as HTMLSelectElement | null)?.value)
  internalPlaceholder.value = (internalPlaceholder.value as DateValue).set({ month: v })
}
function setYear(e: Event) {
  const v = Number((e?.target as HTMLSelectElement | null)?.value)
  internalPlaceholder.value = (internalPlaceholder.value as DateValue).set({ year: v })
}
</script>

<template>
  <DefineMonthTemplate v-slot="{ date }">
    <div class="**:data-[slot=native-select-icon]:right-1">
      <div class="relative">
        <div class="pointer-events-none absolute inset-0 flex h-full items-center pl-2 text-sm">
          {{ formatter.custom(toDate(date), { month: 'short' }) }}
        </div>
        <NativeSelect class="relative h-8 pr-6 pl-2 text-xs text-transparent" @change="setMonth">
          <NativeSelectOption
            v-for="month in createYear({ dateObj: date })"
            :key="month.toString()"
            :value="month.month"
            :selected="date.month === month.month"
          >
            {{ formatter.custom(toDate(month), { month: 'short' }) }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  </DefineMonthTemplate>

  <DefineYearTemplate v-slot="{ date }">
    <div class="**:data-[slot=native-select-icon]:right-1">
      <div class="relative">
        <div class="pointer-events-none absolute inset-0 flex h-full items-center pl-2 text-sm">
          {{ formatter.custom(toDate(date), { year: 'numeric' }) }}
        </div>
        <NativeSelect class="relative h-8 pr-6 pl-2 text-xs text-transparent" @change="setYear">
          <NativeSelectOption
            v-for="year in yearRange"
            :key="year.toString()"
            :value="year.year"
            :selected="date.year === year.year"
          >
            {{ formatter.custom(toDate(year), { year: 'numeric' }) }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  </DefineYearTemplate>

  <CalendarRoot
    v-slot="{ grid, weekDays, date }"
    v-bind="forwarded"
    :placeholder="internalPlaceholder as DateValue"
    data-uipkge
    data-slot="calendar"
    :class="cn('p-3', props.class)"
    @update:placeholder="
      (val) => {
        internalPlaceholder = val
      }
    "
  >
    <CalendarHeader class="pt-0">
      <nav class="absolute inset-x-0 top-0 flex items-center justify-between gap-1">
        <CalendarPrevButton>
          <slot name="calendar-prev-icon" />
        </CalendarPrevButton>
        <CalendarNextButton>
          <slot name="calendar-next-icon" />
        </CalendarNextButton>
      </nav>

      <slot name="calendar-heading" :date="date" :month="ReuseMonthTemplate" :year="ReuseYearTemplate">
        <template v-if="layout === 'month-and-year'">
          <div class="flex items-center justify-center gap-1">
            <ReuseMonthTemplate :date="date" />
            <ReuseYearTemplate :date="date" />
          </div>
        </template>
        <template v-else-if="layout === 'month-only'">
          <div class="flex items-center justify-center gap-1">
            <ReuseMonthTemplate :date="date" />
            {{ formatter.custom(toDate(date), { year: 'numeric' }) }}
          </div>
        </template>
        <template v-else-if="layout === 'year-only'">
          <div class="flex items-center justify-center gap-1">
            {{ formatter.custom(toDate(date), { month: 'short' }) }}
            <ReuseYearTemplate :date="date" />
          </div>
        </template>
        <template v-else>
          <CalendarHeading />
        </template>
      </slot>
    </CalendarHeader>

    <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="motion-safe:animate-[calendar-month-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]"
      >
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <CalendarCellTrigger :day="weekDate" :month="month.value">
                <slot name="cell" :day="weekDate" :month="month.value">
                  {{ weekDate.day }}
                </slot>
              </CalendarCellTrigger>
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>

<style>
@keyframes calendar-month-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='calendar'] [class*='animate-\\[calendar-month'] {
    animation: none !important;
  }
}
</style>
