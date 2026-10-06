<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeCalendarGridBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
    children?: Snippet
    ref?: HTMLTableSectionElement | null
  }
</script>

<script lang="ts">
  let { children, ref = $bindable(null), ...restProps }: RangeCalendarGridBodyProps = $props()
</script>

<tbody bind:this={ref} data-uipkge="" data-slot="range-calendar-grid-body" {...restProps}>
  {@render children?.()}
</tbody>
