<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeCalendarCellProps extends HTMLAttributes<HTMLTableCellElement> {
    children?: Snippet
    ref?: HTMLTableCellElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: RangeCalendarCellProps = $props()
</script>

<td
  bind:this={ref}
  data-uipkge=""
  data-slot="range-calendar-cell"
  class={cn(
    '[&:has([data-selected])]:bg-accent [&:has([data-highlighted])]:bg-accent relative p-0 text-center text-sm focus-within:relative focus-within:z-20 first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</td>
