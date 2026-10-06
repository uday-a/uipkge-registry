<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanCardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanCardFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="kanban-card-footer"
  class={cn('text-muted-foreground mt-1 flex items-center justify-between gap-2 pt-1 text-xs', className)}
  {...restProps}
>
  {@render children?.()}
</div>
