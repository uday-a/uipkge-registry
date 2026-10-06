<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BoardLaneHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** The header <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: BoardLaneHeaderProps = $props()
</script>

<div bind:this={ref} data-uipkge="" data-slot="board-lane-header" class={cn('flex items-center justify-between gap-2', className)} {...restProps}>
  {@render children?.()}
</div>
