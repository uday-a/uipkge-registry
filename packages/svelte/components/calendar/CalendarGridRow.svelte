<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CalendarGridRowProps extends HTMLAttributes<HTMLTableRowElement> {
    ref?: HTMLTableRowElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CalendarGridRowProps = $props()
</script>

<tr bind:this={ref} data-uipkge data-slot="calendar-grid-row" class={cn('flex', className)} {...restProps}>
  {@render children?.()}
</tr>
