<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Calendar } from '@svelte-registry/calendar'
  import { DatePicker, type RangeValue, type MultipleValue, type SingleValue } from '@svelte-registry/date-picker'
  import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@svelte-registry/sheet'
  import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'

  let { story }: { story: string } = $props()

  function isoToday(offsetDays = 0) {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function addDays(iso: string, days: number) {
    const d = new Date(iso + 'T12:00:00')
    d.setDate(d.getDate() + days)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function monthStart(iso: string) {
    const d = new Date(iso + 'T12:00:00')
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  }

  const todayD = isoToday()
  const minDate = isoToday(-7)
  const maxDate = isoToday(7)

  let date = $state<SingleValue>(null)
  let multipleDates = $state<MultipleValue>(null)
  let weekDate = $state<SingleValue>(null)
  let monthDate = $state<SingleValue>(null)
  let quarterDate = $state<SingleValue>(null)
  let yearDate = $state<SingleValue>(null)
  let range = $state<RangeValue>(null)
  let weekRange = $state<RangeValue>(null)
  let monthRange = $state<RangeValue>(null)
  let quarterRange = $state<RangeValue>(null)
  let yearRange = $state<RangeValue>(null)
  let timeDate = $state<SingleValue>(null)
  let timeRange = $state<RangeValue>(null)
  let secondsDate = $state<SingleValue>(null)
  let formatDate = $state<SingleValue>(null)
  let rangeDate = $state<SingleValue>(null)
  let disabledDateVal = $state<SingleValue>(null)
  let disabledTimeDate = $state<SingleValue>(null)
  let confirmDate = $state<SingleValue>(null)
  let confirmRange = $state<RangeValue>(null)
  let statusDate = $state<SingleValue>(null)
  let statusRange = $state<RangeValue>(null)
  let sizeDate = $state<SingleValue>(null)
  let placementDate = $state<SingleValue>(null)
  let presetRange = $state<RangeValue>(null)
  let presetSingle = $state<SingleValue>(null)

  const customPresets = [
    { label: 'Today', value: { start: todayD, end: todayD } },
    { label: 'Last 7 Days', value: { start: addDays(todayD, -6), end: todayD } },
    { label: 'Last 30 Days', value: { start: addDays(todayD, -29), end: todayD } },
    { label: 'This Month', value: { start: monthStart(todayD), end: todayD } },
  ]

  const categorizedPresets = [
    { label: 'Today', value: todayD, category: 'Quick' },
    { label: 'Tomorrow', value: addDays(todayD, 1), category: 'Quick' },
    { label: 'Next Week', value: addDays(todayD, 7), category: 'Future' },
    { label: 'Next Month', value: addDays(todayD, 30), category: 'Future' },
  ]

  // Relative to today so dots are visible in the open month
  const events = [isoToday(0), isoToday(3), isoToday(7)]

  function disabledDateFn(current: Date) {
    const dow = current.getDay()
    return dow === 0 || dow === 6
  }

  function disabledTimeFn() {
    return {
      disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23],
      disabledMinutes: (hour: number) => (hour === 12 ? [0, 1, 2, 3, 4, 5] : []),
      disabledSeconds: (hour: number, minute: number) => (hour === 12 && minute === 0 ? [0, 1, 2] : []),
    }
  }

  function hasEvent(day: Date) {
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    return events.includes(iso)
  }

  // Mobile sheet pattern
  let sheetOpen = $state(false)
  let sheetSelected = $state<DateValue | undefined>(today(getLocalTimeZone()))
</script>

{#if story === 'Default'}
  <DatePicker bind:value={date} class="max-w-xs" />
{/if}

{#if story === 'Multiple Dates'}
  <DatePicker bind:value={multipleDates} type="multiple" class="max-w-xs" />
{/if}

{#if story === 'Week Picker'}
  <DatePicker bind:value={weekDate} picker="week" class="max-w-xs" />
{/if}

{#if story === 'Month Picker'}
  <DatePicker bind:value={monthDate} picker="month" class="max-w-xs" />
{/if}

{#if story === 'Quarter Picker'}
  <DatePicker bind:value={quarterDate} picker="quarter" class="max-w-xs" />
{/if}

{#if story === 'Year Picker'}
  <DatePicker bind:value={yearDate} picker="year" class="max-w-xs" />
{/if}

{#if story === 'Date Range'}
  <DatePicker bind:value={range} type="range" class="max-w-sm" />
{/if}

{#if story === 'Two Months'}
  <DatePicker bind:value={range} type="range" numberOfMonths={2} class="max-w-sm" />
{/if}

{#if story === 'Week Range'}
  <DatePicker bind:value={weekRange} type="range" picker="week" class="max-w-sm" />
{/if}

{#if story === 'Month Range'}
  <DatePicker bind:value={monthRange} type="range" picker="month" class="max-w-sm" />
{/if}

{#if story === 'Quarter Range'}
  <DatePicker bind:value={quarterRange} type="range" picker="quarter" class="max-w-sm" />
{/if}

{#if story === 'Year Range'}
  <DatePicker bind:value={yearRange} type="range" picker="year" class="max-w-sm" />
{/if}

{#if story === 'Date with Time'}
  <DatePicker bind:value={timeDate} showTime class="max-w-xs" />
{/if}

{#if story === 'Date-Time Range'}
  <DatePicker bind:value={timeRange} type="range" showTime class="max-w-sm" />
{/if}

{#if story === '24-Hour Time'}
  <DatePicker bind:value={timeDate} showTime use24Hour class="max-w-xs" />
{/if}

{#if story === 'Date with Seconds'}
  <DatePicker bind:value={secondsDate} showTime showSeconds class="max-w-xs" />
{/if}

{#if story === 'Size Variants'}
  <div class="flex max-w-xs flex-col gap-3">
    <DatePicker bind:value={sizeDate} size="small" placeholder="Small" />
    <DatePicker bind:value={sizeDate} size="middle" placeholder="Middle" />
    <DatePicker bind:value={sizeDate} size="large" placeholder="Large" />
  </div>
{/if}

{#if story === 'Placement'}
  <div class="flex max-w-md flex-wrap gap-3">
    <DatePicker bind:value={placementDate} placement="topLeft" placeholder="topLeft" />
    <DatePicker bind:value={placementDate} placement="top" placeholder="top" />
    <DatePicker bind:value={placementDate} placement="topRight" placeholder="topRight" />
    <DatePicker bind:value={placementDate} placement="bottomLeft" placeholder="bottomLeft" />
    <DatePicker bind:value={placementDate} placement="bottom" placeholder="bottom" />
    <DatePicker bind:value={placementDate} placement="bottomRight" placeholder="bottomRight" />
    <DatePicker bind:value={placementDate} placement="left" placeholder="left" />
    <DatePicker bind:value={placementDate} placement="right" placeholder="right" />
  </div>
{/if}

{#if story === 'Range with Presets'}
  <DatePicker bind:value={presetRange} type="range" presets={customPresets} class="max-w-sm" />
{/if}

{#if story === 'Single with Presets'}
  <DatePicker bind:value={presetSingle} presets={categorizedPresets} class="max-w-xs" />
{/if}

{#if story === 'Categorized Presets'}
  <DatePicker bind:value={presetSingle} presets={categorizedPresets} class="max-w-xs" />
{/if}

{#if story === 'Format Options'}
  <div class="flex max-w-xs flex-col gap-3">
    <DatePicker bind:value={formatDate} format="short" placeholder="Short format" />
    <DatePicker bind:value={formatDate} format="medium" placeholder="Medium format" />
    <DatePicker bind:value={formatDate} format="long" placeholder="Long format" />
    <DatePicker bind:value={formatDate} format="full" placeholder="Full format" />
  </div>
{/if}

{#if story === 'Custom Intl Format'}
  <DatePicker
    bind:value={formatDate}
    format={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
    placeholder="YYYY-MM-DD style"
    class="max-w-xs"
  />
{/if}

{#if story === 'Range Separator'}
  <DatePicker bind:value={range} type="range" separator="→" class="max-w-sm" />
{/if}

{#if story === 'Min / Max Dates'}
  <DatePicker bind:value={rangeDate} minValue={minDate} maxValue={maxDate} class="max-w-xs" />
{/if}

{#if story === 'Disabled Date'}
  <DatePicker bind:value={disabledDateVal} disabledDate={disabledDateFn} class="max-w-xs" />
{/if}

{#if story === 'Disabled Time'}
  <DatePicker bind:value={disabledTimeDate} showTime disabledTime={disabledTimeFn} class="max-w-xs" />
{/if}

{#if story === 'Disabled'}
  <DatePicker bind:value={disabledDateVal} disabled class="max-w-xs" />
{/if}

{#if story === 'Need Confirm'}
  <DatePicker bind:value={confirmDate} needConfirm class="max-w-xs" />
{/if}

{#if story === 'Range with Confirm'}
  <DatePicker bind:value={confirmRange} type="range" needConfirm class="max-w-sm" />
{/if}

{#if story === 'Status States'}
  <div class="flex max-w-xs flex-col gap-3">
    <DatePicker bind:value={statusDate} status="error" placeholder="Error state" />
    <DatePicker bind:value={statusDate} status="warning" placeholder="Warning state" />
  </div>
{/if}

{#if story === 'Range Status'}
  <div class="flex max-w-sm flex-col gap-3">
    <DatePicker bind:value={statusRange} type="range" status="error" placeholder="Error state" />
    <DatePicker bind:value={statusRange} type="range" status="warning" placeholder="Warning state" />
  </div>
{/if}

{#if story === 'Custom Cell Render'}
  <DatePicker bind:value={date} class="max-w-xs">
    {#snippet renderCell(day: Date)}
      <div class="relative">
        {day.getDate()}
        {#if hasEvent(day)}
          <span class="bg-primary absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full"></span>
        {/if}
      </div>
    {/snippet}
  </DatePicker>
{/if}

{#if story === 'Mobile sheet pattern'}
  <Sheet bind:open={sheetOpen}>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="w-full max-w-xs justify-start font-normal">
          {sheetSelected
            ? new Date(sheetSelected.year, sheetSelected.month - 1, sheetSelected.day).toLocaleDateString('en-CA')
            : 'Pick a date'}
        </Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-xl">
      <SheetHeader>
        <SheetTitle>Select date</SheetTitle>
      </SheetHeader>
      <div class="flex justify-center py-2">
        <Calendar
          value={sheetSelected}
          onValueChange={(d) => {
            sheetSelected = Array.isArray(d) ? d[0] : d
            if (d) sheetOpen = false
          }}
          class="rounded-md border"
        />
      </div>
    </SheetContent>
  </Sheet>
{/if}
