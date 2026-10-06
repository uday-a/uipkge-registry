<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SidebarGroupProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-group"
  data-sidebar="group"
  class={cn('relative flex w-full min-w-0 flex-col p-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
