<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { PanelLeft } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import { cn } from '$lib/utils'
  import { useSidebar } from './utils'

  let { class: className, children, ref = $bindable(null), onclick, ...restProps }: SidebarTriggerProps = $props()

  const sidebar = useSidebar()

  function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    sidebar.toggleSidebar()
    onclick?.(e)
  }
</script>

<Button
  data-sidebar="trigger"
  data-uipkge=""
  data-slot="sidebar-trigger"
  variant="ghost"
  size="icon"
  bind:ref
  class={cn('focus-visible:ring-ring h-7 w-7 focus-visible:ring-2 focus-visible:outline-none', className)}
  onclick={handleClick}
  {...restProps}
>
  <PanelLeft />
  <span class="sr-only">Toggle Sidebar</span>
  {@render children?.()}
</Button>
