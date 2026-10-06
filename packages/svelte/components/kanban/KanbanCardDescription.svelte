<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanCardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanCardDescriptionProps = $props()
</script>

<p
  bind:this={ref}
  data-slot="kanban-card-description"
  class={cn('text-muted-foreground line-clamp-2 text-xs', className)}
  {...restProps}
>
  {@render children?.()}
</p>
