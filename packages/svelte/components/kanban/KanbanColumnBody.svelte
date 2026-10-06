<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnBodyProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanColumnBodyProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="kanban-column-body"
  class={cn('flex flex-1 flex-col gap-2 overflow-y-auto py-1', className)}
  {...restProps}
>
  {@render children?.()}
</div>
