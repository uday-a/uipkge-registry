<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeCalendarHeadCellProps extends HTMLAttributes<HTMLTableCellElement> {
    children?: Snippet
    ref?: HTMLTableCellElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: RangeCalendarHeadCellProps = $props()
</script>

<th
  bind:this={ref}
  data-uipkge=""
  data-slot="range-calendar-head-cell"
  scope="col"
  class={cn('text-muted-foreground w-8 rounded-md text-[0.8rem] font-normal', className)}
  {...restProps}
>
  {@render children?.()}
</th>
