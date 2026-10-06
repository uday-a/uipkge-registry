<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarMenuProps extends HTMLAttributes<HTMLUListElement> {
    ref?: HTMLUListElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarMenuProps = $props()
</script>

<ul
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-menu"
  data-sidebar="menu"
  class={cn('flex w-full min-w-0 flex-col gap-1', className)}
  {...restProps}
>
  {@render children?.()}
</ul>
