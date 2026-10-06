<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, ref = $bindable(null), ...restProps }: ContextMenuSeparatorProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-separator"
  role="separator"
  class={cn('bg-border -mx-1 my-1 h-px', className)}
  {...restProps}
></div>
