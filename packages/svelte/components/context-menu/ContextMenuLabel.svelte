<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuLabelProps extends HTMLAttributes<HTMLDivElement> {
    inset?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    inset = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: ContextMenuLabelProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-label"
  data-inset={inset ? '' : undefined}
  class={cn('text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
  {...restProps}
>
  {@render children?.()}
</div>
