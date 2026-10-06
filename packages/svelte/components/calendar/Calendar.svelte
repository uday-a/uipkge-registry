<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { CalendarDate } from '@internationalized/date'
  import type { DateValue } from '@internationalized/date'
  import type { CalendarRange } from './calendar-state.svelte'
  import type { LayoutTypes } from './index'

  export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'placeholder'> {
    /**
     * Selected date (`type="single"`), dates (`type="multiple"`), or range
     * (`type="range"` as `{ start, end }`). Two-way bindable (`bind:value`).
     *
     * INTENTIONAL DIVERGENCE from React: React's DayPicker-based Calendar uses
     * native `Date` (`selected: Date | Date[] | { from, to }`). This Svelte
     * calendar keeps `DateValue` to match the Vue/reka-ui twin. Convert at the
     * boundary with `new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())`.
     */
    value?: DateValue | DateValue[] | CalendarRange
    /** Viewed month. Two-way bindable (`bind:placeholder`). */
    placeholder?: DateValue
    type?: 'single' | 'multiple' | 'range'
    /** React DayPicker-parity alias for `type`. When set, overrides `type`. */
    mode?: 'single' | 'multiple' | 'range'
    /** Whether to render days outside the current month. Mirrors React `showOutsideDays` (default true). When false, outside days render as invisible placeholders. */
    showOutsideDays?: boolean
    numberOfMonths?: number
    pagedNavigation?: boolean
    weekStartsOn?: number
    fixedWeeks?: boolean
    weekdayFormat?: 'narrow' | 'short' | 'long'
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    disabled?: boolean
    readonly?: boolean
    isDateDisabled?: (date: DateValue) => boolean
    isDateUnavailable?: (date: DateValue) => boolean
    layout?: LayoutTypes
    yearRange?: DateValue[]
    onValueChange?: (value: DateValue | DateValue[] | CalendarRange | undefined) => void
    onPlaceholderChange?: (placeholder: DateValue) => void
    /** Overrides the prev/next chevron icons. */
    prevIcon?: Snippet
    nextIcon?: Snippet
    /** Overrides the whole heading area. Receives the viewed date plus month/year jump helpers. */
    heading?: Snippet<
      [
        {
          date: DateValue
          headingValue: string
          months: CalendarDate[]
          years: DateValue[]
          setMonth: (month: number) => void
          setYear: (year: number) => void
        },
      ]
    >
    /** Overrides a day cell's content. */
    cell?: Snippet<[{ day: CalendarDate; month: CalendarDate }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { getLocalTimeZone, today } from '@internationalized/date'
  import { ChevronDown } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { CALENDAR_CONTEXT_KEY, CalendarState } from './calendar-state.svelte'
  import CalendarCell from './CalendarCell.svelte'
  import CalendarCellTrigger from './CalendarCellTrigger.svelte'
  import CalendarGrid from './CalendarGrid.svelte'
  import CalendarGridBody from './CalendarGridBody.svelte'
  import CalendarGridHead from './CalendarGridHead.svelte'
  import CalendarGridRow from './CalendarGridRow.svelte'
  import CalendarHeadCell from './CalendarHeadCell.svelte'
  import CalendarHeader from './CalendarHeader.svelte'
  import CalendarHeading from './CalendarHeading.svelte'
  import CalendarNextButton from './CalendarNextButton.svelte'
  import CalendarPrevButton from './CalendarPrevButton.svelte'

  let {
    class: className,
    value = $bindable<DateValue | DateValue[] | CalendarRange | undefined>(undefined),
    placeholder = $bindable<DateValue | undefined>(undefined),
    type = 'single',
    mode = undefined,
    showOutsideDays = true,
    numberOfMonths = 1,
    pagedNavigation = false,
    weekStartsOn = undefined,
    fixedWeeks = false,
    weekdayFormat = 'narrow',
    locale = 'en',
    minValue = undefined,
    maxValue = undefined,
    disabled = false,
    readonly = false,
    isDateDisabled = undefined,
    isDateUnavailable = undefined,
    layout = undefined,
    yearRange: yearRangeProp = undefined,
    onValueChange,
    onPlaceholderChange,
    prevIcon,
    nextIcon,
    heading,
    cell,
    children,
    ref = $bindable(null),
    ...restProps
  }: CalendarProps = $props()

  // React parity: `mode` overrides `type` when set (`mode="range"` === `type="range"`).
  const effectiveType = $derived(mode ?? type)

  // Initial capture is intentional: props sync into the state via the $effect below.
  // svelte-ignore state_referenced_locally
  const state = new CalendarState(
    {
      type: effectiveType,
      locale,
      weekStartsOn,
      fixedWeeks,
      numberOfMonths,
      pagedNavigation,
      disabled,
      readonly,
      weekdayFormat,
      minValue,
      maxValue,
      isDateDisabled,
      isDateUnavailable,
      showOutsideDays,
      value,
      placeholder,
    },
    {
      onValueChange: (v) => {
        value = v
        onValueChange?.(v)
      },
      onPlaceholderChange: (p) => {
        placeholder = p
        onPlaceholderChange?.(p)
      },
    },
  )
  setContext(CALENDAR_CONTEXT_KEY, state)

  // Inward sync: parent props → state (equality-guarded, never loops with
  // the outward callbacks above).
  $effect(() => {
    state.syncFromProps({
      type: effectiveType,
      locale,
      weekStartsOn,
      fixedWeeks,
      numberOfMonths,
      pagedNavigation,
      disabled,
      readonly,
      weekdayFormat,
      minValue,
      maxValue,
      isDateDisabled,
      isDateUnavailable,
      showOutsideDays,
      value,
      placeholder,
    })
  })

  // The state owns the keyboard-focus root for arrow-key day navigation.
  $effect(() => {
    state.rootEl = ref
  })

  const yearRange = $derived.by((): DateValue[] => {
    if (yearRangeProp) return yearRangeProp
    const base = state.placeholder ?? today(getLocalTimeZone())
    const start = minValue ?? base.subtract({ years: 100 })
    const end = maxValue ?? base.add({ years: 10 })
    const years: DateValue[] = []
    let current = start
    let guard = 0
    while (current.compare(end) <= 0 && guard++ < 500) {
      years.push(current)
      current = current.add({ years: 1 })
    }
    return years
  })

  const monthsOfYear = $derived.by((): CalendarDate[] => {
    const y = state.placeholder.year
    return Array.from({ length: 12 }, (_, i) => new CalendarDate(y, i + 1, 1))
  })

  const monthName = $derived.by(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
    return (d: DateValue) => fmt.format(new Date(d.year, d.month - 1, 1))
  })

  const yearName = $derived.by(() => {
    const fmt = new Intl.DateTimeFormat(locale, { year: 'numeric' })
    return (d: DateValue) => fmt.format(new Date(d.year, d.month - 1, 1))
  })

  /** Clamp the day so Jan 31 → Feb lands on Feb 28/29 instead of overflowing. */
  function clampDay(year: number, month: number, day: number): number {
    return Math.min(day, new Date(year, month, 0).getDate())
  }

  function setMonth(month: number) {
    const p = state.placeholder
    state.setPlaceholder(new CalendarDate(p.year, month, clampDay(p.year, month, p.day)))
  }

  function setYear(year: number) {
    const p = state.placeholder
    state.setPlaceholder(new CalendarDate(year, p.month, clampDay(year, p.month, p.day)))
  }

  function onMonthChange(e: Event) {
    setMonth(Number((e.target as HTMLSelectElement | null)?.value))
  }

  function onYearChange(e: Event) {
    setYear(Number((e.target as HTMLSelectElement | null)?.value))
  }
</script>

{#snippet monthSelect(date: DateValue)}
  <div class="relative inline-flex items-center">
    <select
      data-uipkge
      data-slot="calendar-month-select"
      class="border-input hover:bg-accent/60 text-foreground focus-visible:ring-ring h-8 cursor-pointer appearance-none rounded-md border bg-transparent pr-6 pl-2.5 text-xs font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none"
      value={date.month}
      onchange={onMonthChange}
    >
      {#each monthsOfYear as month (month.toString())}
        <option value={month.month} class="bg-popover text-popover-foreground">
          {monthName(month)}
        </option>
      {/each}
    </select>
    <ChevronDown class="text-muted-foreground pointer-events-none absolute right-1.5 size-3.5 opacity-60" />
  </div>
{/snippet}

{#snippet yearSelect(date: DateValue)}
  <div class="relative inline-flex items-center">
    <select
      data-uipkge
      data-slot="calendar-year-select"
      class="border-input hover:bg-accent/60 text-foreground focus-visible:ring-ring h-8 cursor-pointer appearance-none rounded-md border bg-transparent pr-6 pl-2.5 text-xs font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none"
      value={date.year}
      onchange={onYearChange}
    >
      {#each yearRange as year (year.toString())}
        <option value={year.year} class="bg-popover text-popover-foreground">
          {yearName(year)}
        </option>
      {/each}
    </select>
    <ChevronDown class="text-muted-foreground pointer-events-none absolute right-1.5 size-3.5 opacity-60" />
  </div>
{/snippet}

<div bind:this={ref} data-uipkge data-slot="calendar" class={cn('p-3', className)} {...restProps}>
  <CalendarHeader class="pt-0">
    <nav class="absolute inset-x-0 top-0 flex items-center justify-between gap-1" aria-label="Calendar navigation">
      <CalendarPrevButton icon={prevIcon} />
      <CalendarNextButton icon={nextIcon} />
    </nav>

    {#if heading}
      {@render heading({
        date: state.placeholder,
        headingValue: state.headingValue,
        months: monthsOfYear,
        years: yearRange,
        setMonth,
        setYear,
      })}
    {:else if layout === 'month-and-year'}
      <div class="flex items-center justify-center gap-1">
        {@render monthSelect(state.placeholder)}
        {@render yearSelect(state.placeholder)}
      </div>
    {:else if layout === 'month-only'}
      <div class="flex items-center justify-center gap-1">
        {@render monthSelect(state.placeholder)}
        {yearName(state.placeholder)}
      </div>
    {:else if layout === 'year-only'}
      <div class="flex items-center justify-center gap-1">
        {monthName(state.placeholder)}
        {@render yearSelect(state.placeholder)}
      </div>
    {:else}
      <CalendarHeading />
    {/if}
  </CalendarHeader>

  <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
    {#each state.grids as month (month.value.toString())}
      <CalendarGrid class="motion-safe:animate-[calendar-month-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <CalendarGridHead>
          <CalendarGridRow>
            {#each state.weekDays as day, i (i)}
              <CalendarHeadCell>
                {day}
              </CalendarHeadCell>
            {/each}
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          {#each month.rows as weekDates, index (`weekDate-${index}`)}
            <CalendarGridRow class="mt-2 w-full">
              {#each weekDates as weekDate (weekDate.toString())}
                <CalendarCell date={weekDate}>
                  <CalendarCellTrigger day={weekDate} month={month.value} {cell} />
                </CalendarCell>
              {/each}
            </CalendarGridRow>
          {/each}
        </CalendarGridBody>
      </CalendarGrid>
    {/each}
  </div>

  {@render children?.()}
</div>

<style>
  :global {
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
  }

  @media (prefers-reduced-motion: reduce) {
    :global([data-slot='calendar'] [class*='animate-\[calendar-month']) {
      animation: none !important;
    }
  }
</style>
