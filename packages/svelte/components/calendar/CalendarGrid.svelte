<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CalendarGridProps extends HTMLAttributes<HTMLTableElement> {
    ref?: HTMLTableElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CalendarGridProps = $props()
</script>

<table bind:this={ref} data-uipkge data-slot="calendar-grid" class={cn('w-full border-collapse', className)} {...restProps}>
  {@render children?.()}
</table>
