<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CalendarGridBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
    ref?: HTMLTableSectionElement | null
  }
</script>

<script lang="ts">
  let { children, ref = $bindable(null), ...restProps }: CalendarGridBodyProps = $props()
</script>

<tbody bind:this={ref} data-uipkge data-slot="calendar-grid-body" {...restProps}>
  {@render children?.()}
</tbody>
