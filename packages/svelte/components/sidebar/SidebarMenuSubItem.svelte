<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarMenuSubItemProps extends HTMLAttributes<HTMLLIElement> {
    ref?: HTMLLIElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarMenuSubItemProps = $props()
</script>

<li
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-menu-sub-item"
  data-sidebar="menu-sub-item"
  class={cn('group/menu-sub-item relative', className)}
  {...restProps}
>
  {@render children?.()}
</li>
