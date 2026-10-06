<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'icon' | 'none'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '$lib/components/ui/sheet'
  import { cn } from '$lib/utils'
  import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './utils'

  let {
    class: className,
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    children,
    ref = $bindable(null),
    ...restProps
  }: SidebarProps = $props()

  const sidebar = useSidebar()
</script>

{#if collapsible === 'none'}
  <div
    bind:this={ref}
    data-uipkge=""
    data-slot="sidebar"
    class={cn('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className)}
    {...restProps}
  >
    {@render children?.()}
  </div>
{:else if sidebar.isMobile}
  <Sheet open={sidebar.openMobile} onOpenChange={sidebar.setOpenMobile}>
    <SheetContent
      data-sidebar="sidebar"
      data-uipkge=""
      data-slot="sidebar"
      data-mobile="true"
      {side}
      class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
      style="--sidebar-width:{SIDEBAR_WIDTH_MOBILE}"
      {...restProps}
    >
      <SheetHeader class="sr-only">
        <SheetTitle>Sidebar</SheetTitle>
        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
      </SheetHeader>
      <div class="flex h-full w-full flex-col">
        {@render children?.()}
      </div>
    </SheetContent>
  </Sheet>
{:else}
  <div
    bind:this={ref}
    class="group peer text-sidebar-foreground hidden md:block"
    data-uipkge=""
    data-slot="sidebar"
    data-state={sidebar.state}
    data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
    data-variant={variant}
    data-side={side}
  >
    <!-- This is what handles the sidebar gap on desktop  -->
    <div
      class={cn(
        'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
        'group-data-[collapsible=offcanvas]:w-0',
        'group-data-[side=right]:rotate-180',
        variant === 'floating' || variant === 'inset'
          ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
          : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      )}
    ></div>
    <div
      class={cn(
        'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
        side === 'left'
          ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
          : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
        // Adjust the padding for floating and inset variants (token-aligned with React/shadcn).
        variant === 'floating' || variant === 'inset'
          ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
          : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        className,
      )}
      {...restProps}
    >
      <div
        data-sidebar="sidebar"
        class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
      >
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Push any OverlayScroll thumb inside a sidebar 2.5rem in from the right
     edge so it clears SidebarRail's inside-zone. The CSS variable
     cascades to every descendant, so consumers wrapping their nav in
     OverlayScroll (a common pattern when nav items overflow viewport
     height) get this for free -- no per-call thumb-offset config. */
  [data-slot='sidebar'] {
    --ovs-thumb-right: 2.5rem;
  }
</style>
