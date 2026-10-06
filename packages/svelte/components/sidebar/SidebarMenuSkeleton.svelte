<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarMenuSkeletonProps extends HTMLAttributes<HTMLDivElement> {
    showIcon?: boolean
    width?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton'
  import { cn } from '$lib/utils'

  let {
    class: className,
    showIcon = false,
    width = '70%',
    ref = $bindable(null),
    ...restProps
  }: SidebarMenuSkeletonProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-menu-skeleton"
  data-sidebar="menu-skeleton"
  class={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
  {...restProps}
>
  {#if showIcon}
    <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
  {/if}

  <Skeleton class="h-4 max-w-(--skeleton-width) flex-1" data-sidebar="menu-skeleton-text" style="--skeleton-width:{width}" />
</div>
