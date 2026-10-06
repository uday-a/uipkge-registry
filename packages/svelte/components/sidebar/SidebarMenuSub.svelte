<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarMenuSubProps extends HTMLAttributes<HTMLUListElement> {
    ref?: HTMLUListElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarMenuSubProps = $props()
</script>

<ul
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-menu-sub"
  data-sidebar="menu-badge"
  class={cn(
    'border-sidebar-border mx-3 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2 py-0.5',
    'group-data-[collapsible=icon]:hidden',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ul>
