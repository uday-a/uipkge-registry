<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarContentProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-content"
  data-sidebar="content"
  class={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', className)}
  {...restProps}
>
  {@render children?.()}
</div>
