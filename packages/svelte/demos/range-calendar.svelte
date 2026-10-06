<script lang="ts">
  import { RangeCalendar, type DateRange } from '@svelte-registry/range-calendar'

  let { story }: { story: string } = $props()

  let range = $state<DateRange | undefined>({ start: new Date(2026, 4, 10), end: new Date(2026, 4, 17) })
  let constrainedRange = $state<DateRange | undefined>(undefined)
  let fixedWeeksRange = $state<DateRange | undefined>(undefined)
  let mondayRange = $state<DateRange | undefined>(undefined)

  const today = new Date()
  const minValue = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14)
  const maxValue = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60)

  let presetRange = $state<DateRange | undefined>({
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
  })
</script>

{#if story === 'Default'}
  <RangeCalendar bind:value={range} class="rounded-md border" />
{/if}

{#if story === 'Min / max'}
  <RangeCalendar bind:value={constrainedRange} {minValue} {maxValue} class="rounded-md border" />
{/if}

{#if story === 'Fixed weeks'}
  <RangeCalendar bind:value={fixedWeeksRange} fixedWeeks class="rounded-md border" />
{/if}

{#if story === 'Week starts Monday'}
  <RangeCalendar bind:value={mondayRange} weekStartsOn={1} class="rounded-md border" />
{/if}

{#if story === 'Pre-selected range'}
  <RangeCalendar bind:value={presetRange} class="rounded-md border" />
{/if}
