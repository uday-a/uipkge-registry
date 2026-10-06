<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanCardHeaderProps = $props()
</script>

<div bind:this={ref} data-slot="kanban-card-header" class={cn('flex flex-col gap-1', className)} {...restProps}>
  {@render children?.()}
</div>
