<script lang="ts">
  import { Calendar, type CalendarRange } from '@svelte-registry/calendar'
  import { CalendarDate, getLocalTimeZone, today, type DateValue } from '@internationalized/date'

  let { story }: { story: string } = $props()

  let date = $state<DateValue | undefined>(new CalendarDate(2026, 5, 15))
  let restrictedDate = $state<DateValue | undefined>(undefined)
  let usDate = $state<DateValue | undefined>(undefined)
  let jaDate = $state<DateValue | undefined>(undefined)
  let sideBySideA = $state<DateValue | undefined>(undefined)
  let sideBySideB = $state<DateValue | undefined>(undefined)
  let todayDate = $state<DateValue | undefined>(today(getLocalTimeZone()))
  let multiDates = $state<DateValue[] | undefined>([
    new CalendarDate(2026, 5, 10),
    new CalendarDate(2026, 5, 15),
    new CalendarDate(2026, 5, 20),
  ])
  let layoutDate = $state<DateValue | undefined>(new CalendarDate(2026, 5, 15))
  let multiMonthDate = $state<DateValue | undefined>(new CalendarDate(2026, 5, 15))
  let unavailableDate = $state<DateValue | undefined>(undefined)
  let rangeValue = $state<CalendarRange | undefined>({
    start: new CalendarDate(2026, 5, 10),
    end: new CalendarDate(2026, 5, 17),
  })

  const tz = getLocalTimeZone()
  const minValue = today(tz).subtract({ days: 7 })
  const maxValue = today(tz).add({ days: 30 })

  /** Weekends unavailable — keyboard and click both honor isDateUnavailable. */
  function isWeekend(d: DateValue) {
    const js = new Date(d.year, d.month - 1, d.day)
    const day = js.getDay()
    return day === 0 || day === 6
  }

  const multiLabel = $derived(
    multiDates?.map((d) => `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`).join(', ') ||
      'none',
  )

  function fmtDate(d: DateValue | undefined): string {
    if (!d) return '—'
    return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
  }

  const rangeLabel = $derived(
    rangeValue?.start ? `${fmtDate(rangeValue.start)} → ${fmtDate(rangeValue.end)}` : 'none',
  )
</script>

{#if story === 'Default'}
  <Calendar bind:value={date} class="rounded-md border" />
{/if}

{#if story === 'Min / max'}
  <Calendar bind:value={restrictedDate} {minValue} {maxValue} class="rounded-md border" />
{/if}

{#if story === 'Disabled dates'}
  <Calendar bind:value={unavailableDate} isDateUnavailable={isWeekend} class="rounded-md border" />
{/if}

{#if story === 'Multiple selection'}
  <Calendar bind:value={multiDates} type="multiple" class="rounded-md border" />
  <p class="text-muted-foreground mt-2 text-xs">
    Selected: {multiLabel}
  </p>
{/if}

{#if story === 'Range selection'}
  <Calendar bind:value={rangeValue} type="range" class="rounded-md border" />
  <p class="text-muted-foreground mt-2 text-xs">
    Selected: {rangeLabel}
  </p>
{/if}

{#if story === 'Two months'}
  <Calendar bind:value={multiMonthDate} numberOfMonths={2} class="rounded-md border" />
{/if}

{#if story === 'Month and year layout'}
  <Calendar bind:value={layoutDate} layout="month-and-year" class="rounded-md border" />
{/if}

{#if story === 'Side-by-side months'}
  <div class="flex flex-col gap-4 sm:flex-row">
    <Calendar bind:value={sideBySideA} class="rounded-md border" />
    <Calendar bind:value={sideBySideB} class="rounded-md border" />
  </div>
{/if}

{#if story === 'Locale variants'}
  <div class="flex flex-col gap-4 sm:flex-row">
    <Calendar bind:value={usDate} locale="en-US" class="rounded-md border" />
    <Calendar bind:value={jaDate} locale="ja-JP" class="rounded-md border" />
  </div>
{/if}

{#if story === 'Pre-selected today'}
  <Calendar bind:value={todayDate} class="rounded-md border" />
{/if}

{#if story === 'Keyboard'}
  <Calendar bind:value={date} class="rounded-md border" />
{/if}
