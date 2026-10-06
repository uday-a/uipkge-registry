<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanCardTitleProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: KanbanCardTitleProps = $props()
</script>

<p
  bind:this={ref}
  data-slot="kanban-card-title"
  class={cn('text-foreground text-sm leading-snug font-medium', className)}
  {...restProps}
>
  {@render children?.()}
</p>
