<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanBoardProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanBoardProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="kanban-board"
  class={cn('flex w-full items-start gap-4 overflow-x-auto pb-4', className)}
  {...restProps}
>
  {@render children?.()}
</div>
