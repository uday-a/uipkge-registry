<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeCalendarGridProps extends HTMLAttributes<HTMLTableElement> {
    /** Accessible month label, used as the table caption for screen readers. */
    label?: string
    children?: Snippet
    ref?: HTMLTableElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    label = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: RangeCalendarGridProps = $props()
</script>

<table
  bind:this={ref}
  data-uipkge=""
  data-slot="range-calendar-grid"
  role="grid"
  aria-label={label}
  class={cn('w-full border-collapse', className)}
  {...restProps}
>
  {@render children?.()}
</table>
