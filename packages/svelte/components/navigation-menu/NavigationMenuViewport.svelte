<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NavigationMenuViewportProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getNavigationMenuRootContext } from './NavigationMenuContext'
  import { navigationMenuContentVariants } from './navigation-menu-content.variants'

  let {
    class: className,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: NavigationMenuViewportProps = $props()

  const root = getNavigationMenuRootContext()

  let viewportEl: HTMLDivElement | null = $state(null)
  let panelEl: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = viewportEl
    root?.setContentEl(panelEl)
  })

  const value = $derived(root?.getValue())
  const active = $derived(value !== undefined ? root?.getContent(value) : undefined)
  const motion = $derived(value !== undefined && root ? root.getMotion(value) : undefined)
  const isOpen = $derived(value !== undefined && active?.snippet !== undefined)

  const LONG_CONTENT_CLASS =
    'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none'
</script>

<div class="absolute top-full left-0 isolate z-50 flex justify-center">
  <div
    bind:this={viewportEl}
    data-uipkge=""
    data-slot="navigation-menu-viewport"
    data-state={isOpen ? 'open' : 'closed'}
    class={cn(
      // NOTE: reka auto-measures `--reka-navigation-menu-viewport-*` geometry;
      // the hand-rolled twin sizes to content instead.
      'origin-top-center bg-popover text-popover-foreground data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:zoom-out-95 data-[state=open]:motion-safe:zoom-in-90 relative mt-1.5 h-auto w-full overflow-hidden rounded-md border shadow md:w-max',
      !isOpen && 'hidden',
      className,
    )}
    onkeydown={(e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        root?.setValue(undefined, true)
      }
      onkeydown?.(e)
    }}
    {...restProps}
  >
    {#if isOpen && active && value !== undefined}
      <div
        bind:this={panelEl}
        id={active.contentId}
        aria-labelledby={active.triggerId}
        data-uipkge=""
        data-slot="navigation-menu-content"
        data-state="open"
        data-motion={motion}
        class={cn(navigationMenuContentVariants(), LONG_CONTENT_CLASS, active.className)}
      >
        {@render active.snippet?.()}
      </div>
    {/if}
    {@render children?.()}
  </div>
</div>
