<script lang="ts" module>
  import type { DateRange } from '$lib/components/ui/range-calendar'

  export interface DataTableRangeCalendarProps {
    value: DateRange | undefined
    onValueChange: (value: DateRange | undefined) => void
    numberOfMonths?: number
    class?: string
  }
</script>

<script lang="ts">
  import { RangeCalendar } from '$lib/components/ui/range-calendar'

  // Internal bridge used by every DataTable filter surface. The Svelte
  // RangeCalendar keeps an internal copy of the last committed range, so a
  // filter cleared from outside (Clear / Reset / cancel-restore) would keep
  // showing the old selection. Remount the calendar whenever the model is
  // cleared so it always reflects the column filter.
  let { value, onValueChange, numberOfMonths = 1, class: className }: DataTableRangeCalendarProps = $props()

  let epoch = $state(0)
  let hadValue = false
  $effect.pre(() => {
    const hasValue = value !== undefined
    if (hadValue && !hasValue) epoch++
    hadValue = hasValue
  })
</script>

{#key epoch}
  <RangeCalendar {value} {numberOfMonths} class={className} onValueChange={(range) => onValueChange(range)} />
{/key}
