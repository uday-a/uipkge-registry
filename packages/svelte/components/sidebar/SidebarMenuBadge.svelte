<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarMenuBadgeProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarMenuBadgeProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-menu-badge"
  data-sidebar="menu-badge"
  class={cn(
    'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
    'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
    'peer-data-[size=sm]/menu-button:top-1',
    'peer-data-[size=default]/menu-button:top-1.5',
    'peer-data-[size=lg]/menu-button:top-2',
    'group-data-[collapsible=icon]:hidden',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
