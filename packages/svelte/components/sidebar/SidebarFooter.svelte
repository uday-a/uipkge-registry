<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-footer"
  data-sidebar="footer"
  class={cn('flex flex-col gap-2 p-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
