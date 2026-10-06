<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: Snippet
    ref?: HTMLHeadingElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanColumnTitleProps = $props()
</script>

<h3
  bind:this={ref}
  data-slot="kanban-column-title"
  class={cn('text-foreground text-sm font-semibold tracking-tight', className)}
  {...restProps}
>
  {@render children?.()}
</h3>
