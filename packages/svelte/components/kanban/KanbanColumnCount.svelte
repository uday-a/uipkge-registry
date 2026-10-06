<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnCountProps extends HTMLAttributes<HTMLSpanElement> {
    count?: number | string
    children?: Snippet
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, count, children, ref = $bindable(null), ...restProps }: KanbanColumnCountProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="kanban-column-count"
  class={cn('bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums', className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    {count}
  {/if}
</span>
