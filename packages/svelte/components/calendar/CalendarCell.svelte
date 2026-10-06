<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { CalendarDate } from '@internationalized/date'

  export interface CalendarCellProps extends HTMLAttributes<HTMLTableCellElement> {
    date: CalendarDate
    ref?: HTMLTableCellElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { CALENDAR_CONTEXT_KEY, type CalendarState } from './calendar-state.svelte'

  let { class: className, date, children, ref = $bindable(null), ...restProps }: CalendarCellProps = $props()

  const state = getContext<CalendarState | undefined>(CALENDAR_CONTEXT_KEY)
  const disabledDate = $derived(state?.isDisabledDate(date) ?? false)
  const isRange = $derived(state?.type === 'range')
</script>

<td
  bind:this={ref}
  data-uipkge
  data-slot="calendar-cell"
  data-disabled={disabledDate ? '' : undefined}
  class={cn(
    'relative flex-1 p-0 text-center text-sm focus-within:relative focus-within:z-20',
    isRange &&
      '[&:has([data-selected])]:bg-accent [&:has([data-highlighted])]:bg-accent first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</td>
