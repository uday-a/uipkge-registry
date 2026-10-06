<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-header"
  data-sidebar="header"
  class={cn('flex flex-col gap-2 p-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
