<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Force inline-flyout rendering even when the root viewport is enabled.
     * Defaults to following the root `viewport` prop.
     */
    forceMount?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getNavigationMenuItemContext, getNavigationMenuRootContext } from './NavigationMenuContext'
  import { navigationMenuContentVariants } from './navigation-menu-content.variants'

  let {
    class: className,
    forceMount = false,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: NavigationMenuContentProps = $props()

  const root = getNavigationMenuRootContext()
  const item = getNavigationMenuItemContext()

  // Viewport mode: register the children snippet with the root — the shared
  // NavigationMenuViewport renders the active item's snippet (a snippet
  // hand-off, since Svelte has no portal). Otherwise render inline.
  const useViewport = $derived((root?.isViewportEnabled() ?? true) && !forceMount)

  $effect(() => {
    if (useViewport && item && root) {
      const v = item.value
      // Read className inside the effect so consumer class changes re-register.
      const payload = { snippet: children, contentId: item.contentId, triggerId: item.triggerId, className }
      return root.registerContent(v, payload)
    }
  })

  let el: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = el
    // Inline mode owns the content element for ArrowDown focus jumps.
    if (!useViewport && item && root && root.getValue() === item.value) root.setContentEl(el)
  })

  const isOpen = $derived(item?.isOpen() ?? false)
  const motion = $derived(item && root ? root.getMotion(item.value) : undefined)

  const panelClass = $derived(
    cn(
      navigationMenuContentVariants(),
      'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
      className,
    ),
  )
</script>

{#if !useViewport && isOpen && item}
  <div
    bind:this={el}
    id={item.contentId}
    aria-labelledby={item.triggerId}
    data-uipkge=""
    data-slot="navigation-menu-content"
    data-state="open"
    data-motion={motion}
    class={panelClass}
    onkeydown={(e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        root?.setValue(undefined, true)
      }
      onkeydown?.(e)
    }}
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}
