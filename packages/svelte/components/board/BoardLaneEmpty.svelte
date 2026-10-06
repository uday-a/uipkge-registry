<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BoardLaneEmptyProps extends HTMLAttributes<HTMLDivElement> {
    /** Show only when this is true (consumer wires from `lane.length === 0`). */
    when?: boolean
    /** The empty-state <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, when = undefined, children, ref = $bindable(null), ...restProps }: BoardLaneEmptyProps =
    $props()
</script>

{#if when !== false}
  <div
    bind:this={ref}
    data-uipkge=""
    data-slot="board-lane-empty"
    class={cn(
      'text-muted-foreground/70 border-border/60 rounded-lg border border-dashed py-6 text-center text-xs',
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}
