<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnEmptyProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanColumnEmptyProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="kanban-column-empty"
  class={cn(
    'border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-xs',
    className,
  )}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    No cards
  {/if}
</div>
