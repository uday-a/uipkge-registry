<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnDotProps extends HTMLAttributes<HTMLSpanElement> {
    color?: string
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, color = 'bg-primary', ref = $bindable(null), ...restProps }: KanbanColumnDotProps = $props()
</script>

<span bind:this={ref} data-slot="kanban-column-dot" class={cn('size-2 shrink-0 rounded-full', color, className)} {...restProps}></span>
