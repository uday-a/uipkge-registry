<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanColumnHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="kanban-column-header"
  class={cn('flex items-center justify-between gap-2 px-1 py-0.5', className)}
  {...restProps}
>
  {@render children?.()}
</div>
