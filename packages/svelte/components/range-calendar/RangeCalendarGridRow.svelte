<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeCalendarGridRowProps extends HTMLAttributes<HTMLTableRowElement> {
    children?: Snippet
    ref?: HTMLTableRowElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: RangeCalendarGridRowProps = $props()
</script>

<tr bind:this={ref} data-uipkge="" data-slot="range-calendar-grid-row" class={cn('flex', className)} {...restProps}>
  {@render children?.()}
</tr>
